/* ============================================================
 *  CD Markets · Real-time Quote Module (v3 - CryptoCompare)
 *  Source: min-api.cryptocompare.com /data/pricemultifull
 *    - 一次 fetch 拿 9 個 symbol 全部資料 (秒開)
 *    - 無 API key、無額度限制
 *    - 自帶 24h 漲跌 (CHANGEPCT24HOUR)
 *  Refresh: 60 秒一次
 * ============================================================ */
(function () {
  'use strict';

  // 顯示 ID → CryptoCompare symbol / 是否 invert / 小數位 / 千分位
  // XAUT = Tether Gold (錨定 XAU)、XAGT 暫試 (若無就 fallback)
  // USD/JPY、USD/CHF 因 CC 給的是 1 JPY/CHF = X USD,需 invert
  const SYMBOLS = [
    { id: 'XAU/USD', cc: 'XAUT', invert: false, dp: 2, comma: true  },
    { id: 'XAG/USD', cc: 'XAGT', invert: false, dp: 2, comma: true  },
    { id: 'EUR/USD', cc: 'EUR',  invert: false, dp: 4, comma: false },
    { id: 'GBP/USD', cc: 'GBP',  invert: false, dp: 4, comma: false },
    { id: 'USD/JPY', cc: 'JPY',  invert: true,  dp: 2, comma: true  },
    { id: 'AUD/USD', cc: 'AUD',  invert: false, dp: 4, comma: false },
    { id: 'USD/CHF', cc: 'CHF',  invert: true,  dp: 4, comma: false },
    { id: 'BTC/USD', cc: 'BTC',  invert: false, dp: 2, comma: true  },
    { id: 'ETH/USD', cc: 'ETH',  invert: false, dp: 2, comma: true  },
  ];

  const REFRESH_MS = 60 * 1000;
  const FLASH_MS = 600;

  // ===== 格式化工具 ===== //
  function fmt(num, dp, comma) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    const fixed = Number(num).toFixed(dp);
    if (!comma) return fixed;
    const [intPart, decPart] = fixed.split('.');
    const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart !== undefined ? withComma + '.' + decPart : withComma;
  }

  function fmtChange(num, dp) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    return (num >= 0 ? '+' : '') + Number(num).toFixed(dp);
  }

  function fmtPct(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    return Math.abs(Number(num)).toFixed(2) + '%';
  }

  function flashEl(el, isUp) {
    if (!el) return;
    const color = isUp ? '#54C87D' : '#F04E4E';
    const origColor = el.style.color;
    el.style.transition = 'color 120ms';
    el.style.color = color;
    setTimeout(function () {
      el.style.color = origColor;
      setTimeout(function () { el.style.transition = ''; }, 200);
    }, FLASH_MS);
  }

  // ===== DOM 更新 ===== //
  const lastPriceMap = {};

  function updateSymbol(symCfg, price, pct) {
    if (isNaN(price)) return;

    // pct 是 24h 漲跌百分比, change 反推 = price * pct / 100
    const change = price * pct / 100;
    const isUp = pct >= 0;
    const priceStr = fmt(price, symCfg.dp, symCfg.comma);
    const changeStr = fmtChange(change, symCfg.dp);
    const pctStr = fmtPct(pct);

    const prevPrice = lastPriceMap[symCfg.id];
    const priceFlashDir = prevPrice !== undefined ? (price >= prevPrice) : isUp;
    lastPriceMap[symCfg.id] = price;

    // Hero Dashboard
    const heroQuote = document.querySelector('.quote[data-sym="' + symCfg.id + '"]');
    if (heroQuote) {
      const priceEl = heroQuote.querySelector('.quote-price');
      const changeEl = heroQuote.querySelector('.quote-change');
      const timeEl = heroQuote.querySelector('.quote-time');
      if (priceEl && priceEl.textContent !== priceStr) {
        priceEl.textContent = priceStr;
        flashEl(priceEl, priceFlashDir);
      }
      if (changeEl) {
        changeEl.textContent = changeStr + ' · ' + pctStr;
        changeEl.classList.remove('up', 'down');
        changeEl.classList.add(isUp ? 'up' : 'down');
      }
      if (timeEl) {
        const now = new Date();
        timeEl.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      }
    }

    // Ticker 跑馬燈 (9×2 同步)
    document.querySelectorAll('.tk-item[data-sym="' + symCfg.id + '"]').forEach(function (item) {
      const pxEl = item.querySelector('.tk-px');
      const chEl = item.querySelector('.tk-ch');
      if (pxEl && pxEl.textContent !== priceStr) {
        pxEl.textContent = priceStr;
        flashEl(pxEl, priceFlashDir);
      }
      if (chEl) {
        chEl.textContent = (isUp ? '+' : '-') + fmtPct(pct);
        chEl.classList.remove('up', 'down');
        chEl.classList.add(isUp ? 'up' : 'down');
      }
    });
  }

  function updateStatus(ok) {
    const dashTime = document.querySelector('.dash-head-r');
    if (!dashTime) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    dashTime.textContent = ok ? ('LIVE · ' + hh + ':' + mm + ':' + ss) : ('OFFLINE · ' + hh + ':' + mm + ':' + ss);
  }

  // ===== Fetch ===== //
  async function fetchAll() {
    // 一次拉所有 symbol (批次)
    const fsyms = SYMBOLS.map(function (s) { return s.cc; }).join(',');
    const url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + fsyms + '&tsyms=USD';

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const raw = (data && data.RAW) || {};

      let okCount = 0;
      SYMBOLS.forEach(function (symCfg) {
        const u = raw[symCfg.cc] && raw[symCfg.cc].USD;
        if (u && typeof u.PRICE === 'number') {
          let price = u.PRICE;
          let pct = typeof u.CHANGEPCT24HOUR === 'number' ? u.CHANGEPCT24HOUR : 0;
          // invert: CC 給 1 JPY = X USD, 需倒數變 1 USD = X JPY,且 pct 反向
          if (symCfg.invert) {
            price = 1 / price;
            pct = -pct;
          }
          updateSymbol(symCfg, price, pct);
          okCount++;
        } else {
          console.warn('[realtime] ' + symCfg.id + ' (' + symCfg.cc + ') not in response');
        }
      });

      updateStatus(okCount > 0);
      console.log('[realtime] Batch done · ' + okCount + '/' + SYMBOLS.length + ' symbols');
    } catch (err) {
      console.warn('[realtime] Fetch failed:', err.message);
      updateStatus(false);
    }
  }

  // ===== 啟動 ===== //
  function start() {
    fetchAll();                          // 立即拉 → 秒開
    setInterval(fetchAll, REFRESH_MS);   // 每 60s 重抓
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
