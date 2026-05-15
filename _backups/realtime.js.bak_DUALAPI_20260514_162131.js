/* ============================================================
 *  CD Markets · Real-time Quote Module
 *  Source: Twelve Data /quote endpoint (free plan)
 *  Strategy: batch 9 symbols every 90s ≈ 6 credits/min (limit 8/min)
 *  Daily budget: 800 credits / 9 symbols = ~88 batches = ~2.2h continuous
 * ============================================================ */
(function () {
  'use strict';

  // ===== 設定 ===== //
  const CONFIG = {
    apiKey: '30b1352ef75840828b69a69a6263e6a7',
    endpoint: 'https://api.twelvedata.com/quote',
    intervalMs: 90 * 1000,           // 90 秒整批拉一次
    flashMs: 600,                    // 變動閃爍時長
    symbols: [
      // 顯示 ID → twelvedata symbol → 小數位 → 千分位
      { id: 'XAU/USD',  td: 'XAU/USD',  dp: 2, comma: true  },
      { id: 'XAG/USD',  td: 'XAG/USD',  dp: 2, comma: true  },
      { id: 'EUR/USD',  td: 'EUR/USD',  dp: 4, comma: false },
      { id: 'GBP/USD',  td: 'GBP/USD',  dp: 4, comma: false },
      { id: 'USD/JPY',  td: 'USD/JPY',  dp: 2, comma: true  },
      { id: 'AUD/USD',  td: 'AUD/USD',  dp: 4, comma: false },
      { id: 'USD/CHF',  td: 'USD/CHF',  dp: 4, comma: false },
      { id: 'BTC/USD',  td: 'BTC/USD',  dp: 2, comma: true  },
      { id: 'ETH/USD',  td: 'ETH/USD',  dp: 2, comma: true  },
    ],
  };

  // ===== 工具 ===== //
  function fmt(num, dp, comma) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    const fixed = Number(num).toFixed(dp);
    if (!comma) return fixed;
    const [int, dec] = fixed.split('.');
    const withComma = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dec !== undefined ? `${withComma}.${dec}` : withComma;
  }

  function fmtChange(num, dp) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    const sign = num >= 0 ? '+' : '';
    return sign + Number(num).toFixed(dp);
  }

  function fmtPct(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    return Math.abs(Number(num)).toFixed(2) + '%';
  }

  function flashEl(el, isUp) {
    if (!el) return;
    const color = isUp ? '#54C87D' : '#F04E4E';
    const origColor = el.style.color;
    const origTransition = el.style.transition;
    el.style.transition = 'color 120ms';
    el.style.color = color;
    setTimeout(() => {
      el.style.color = origColor;
      setTimeout(() => { el.style.transition = origTransition; }, 200);
    }, CONFIG.flashMs);
  }

  // ===== DOM 更新 ===== //
  // 上一次的價格快照，用來決定閃綠/閃紅
  const lastPriceMap = {};

  function updateSymbol(symCfg, data) {
    const id = symCfg.id;
    const price = parseFloat(data.close);
    const change = parseFloat(data.change);
    const pct = parseFloat(data.percent_change);

    if (isNaN(price)) return;

    const isUp = change >= 0;
    const priceStr = fmt(price, symCfg.dp, symCfg.comma);
    const changeStr = fmtChange(change, symCfg.dp);
    const pctStr = fmtPct(pct);
    const prevPrice = lastPriceMap[id];
    const priceFlashDir = prevPrice !== undefined ? (price >= prevPrice) : isUp;
    lastPriceMap[id] = price;

    // ---- 更新 Hero Dashboard ---- //
    const heroQuote = document.querySelector(`.quote[data-sym="${id}"]`);
    if (heroQuote) {
      const priceEl = heroQuote.querySelector('.quote-price');
      const changeEl = heroQuote.querySelector('.quote-change');
      const timeEl = heroQuote.querySelector('.quote-time');

      if (priceEl && priceEl.textContent !== priceStr) {
        priceEl.textContent = priceStr;
        flashEl(priceEl, priceFlashDir);
      }
      if (changeEl) {
        changeEl.textContent = `${changeStr} · ${pctStr}`;
        changeEl.classList.remove('up', 'down');
        changeEl.classList.add(isUp ? 'up' : 'down');
      }
      if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toTimeString().slice(0, 5);
      }
    }

    // ---- 更新 Ticker (跑馬燈，9×2 重複序列同步) ---- //
    const tickerItems = document.querySelectorAll(`.tk-item[data-sym="${id}"]`);
    tickerItems.forEach(item => {
      const pxEl = item.querySelector('.tk-px');
      const chEl = item.querySelector('.tk-ch');
      if (pxEl && pxEl.textContent !== priceStr) {
        pxEl.textContent = priceStr;
        flashEl(pxEl, priceFlashDir);
      }
      if (chEl) {
        const pctSign = isUp ? '+' : '-';
        chEl.textContent = pctSign + fmtPct(pct);
        chEl.classList.remove('up', 'down');
        chEl.classList.add(isUp ? 'up' : 'down');
      }
    });
  }

  // ---- 更新「最後更新時間」狀態列 ---- //
  function updateStatus(ok) {
    const dashTime = document.querySelector('.dash-head-r');
    if (dashTime) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      dashTime.textContent = ok
        ? `LIVE · ${hh}:${mm}:${ss}`
        : `OFFLINE · ${hh}:${mm}:${ss}`;
    }
  }

  // ===== Fetch ===== //
  // 單一 symbol 的請求
  async function fetchOne(symCfg) {
    // 用時間戳避瀏覽器快取（取代 cache: 'no-store'，避免觸發 CORS preflight）
    const cacheBust = '&_t=' + Date.now();
    const url = `${CONFIG.endpoint}?symbol=${encodeURIComponent(symCfg.td)}&apikey=${CONFIG.apiKey}${cacheBust}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      if (data.status === 'error' || data.code) {
        console.warn(`[realtime] ${symCfg.id} error:`, data.message || data);
        return false;
      }

      if (data && data.close) {
        updateSymbol(symCfg, data);
        return true;
      }
      console.warn(`[realtime] ${symCfg.id} no close field`);
      return false;
    } catch (err) {
      console.warn(`[realtime] ${symCfg.id} fetch failed:`, err.message);
      return false;
    }
  }

  // 一輪：9 個 symbol 錯開打，每 10 秒 1 個，總共 ~90 秒打完
  let successInRound = 0;
  let roundActive = false;

  async function runRound() {
    if (roundActive) return;             // 避免重疊
    roundActive = true;
    successInRound = 0;
    const stagger = Math.floor(CONFIG.intervalMs / CONFIG.symbols.length); // 10000ms = 10s

    for (let i = 0; i < CONFIG.symbols.length; i++) {
      const symCfg = CONFIG.symbols[i];
      const ok = await fetchOne(symCfg);
      if (ok) successInRound++;
      updateStatus(successInRound > 0);

      // 最後一個不用等
      if (i < CONFIG.symbols.length - 1) {
        await new Promise(r => setTimeout(r, stagger));
      }
    }

    console.log(`[realtime] Round done · ${successInRound}/${CONFIG.symbols.length} symbols updated`);
    roundActive = false;
  }

  // ===== 啟動 ===== //
  function start() {
    runRound();                                  // 立即跑一輪
    setInterval(runRound, CONFIG.intervalMs);    // 之後每 90s 一輪（一輪內 9 個 symbol 錯開 10s 打）
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
