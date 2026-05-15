/* ============================================================
 *  CD Markets · Real-time Quote Module (v4)
 *  Source: min-api.cryptocompare.com (single API, no key, batch fetch)
 *
 *  9 symbols: XAU(XAUT) / XPT / EUR / GBP / JPY / AUD / CHF / BTC / ETH
 *    - XAU/USD via XAUT (Tether Gold)
 *    - XPT/USD via XPT  (Platinum, replacement for XAG which CC doesn't have)
 *    - USD/JPY and USD/CHF inverted (CC gives 1 JPY/CHF = X USD)
 *
 *  Features:
 *    1. Price + 24h % change (秒開, batch)
 *    2. Sparkline: real 24h hourly closes (histohour endpoint)
 *
 *  Refresh strategy:
 *    - Prices: every 60s (pricemultifull, 1 batch call)
 *    - Sparklines: every 5min (histohour, 9 calls, but cheap and rarely needed)
 * ============================================================ */
(function () {
  'use strict';

  const SYMBOLS = [
    { id: 'XAU/USD', cc: 'XAUT', invert: false, dp: 2, comma: true,  hasHistory: true  },
    { id: 'XPT/USD', cc: 'XPT',  invert: false, dp: 2, comma: true,  hasHistory: false }, // CCCAGG 無歷史
    { id: 'EUR/USD', cc: 'EUR',  invert: false, dp: 4, comma: false, hasHistory: true  },
    { id: 'GBP/USD', cc: 'GBP',  invert: false, dp: 4, comma: false, hasHistory: true  },
    { id: 'USD/JPY', cc: 'JPY',  invert: true,  dp: 2, comma: true,  hasHistory: true  },
    { id: 'AUD/USD', cc: 'AUD',  invert: false, dp: 4, comma: false, hasHistory: true  },
    { id: 'USD/CHF', cc: 'CHF',  invert: true,  dp: 4, comma: false, hasHistory: true  },
    { id: 'BTC/USD', cc: 'BTC',  invert: false, dp: 2, comma: true,  hasHistory: true  },
    { id: 'ETH/USD', cc: 'ETH',  invert: false, dp: 2, comma: true,  hasHistory: true  },
  ];

  const PRICE_REFRESH_MS = 60 * 1000;
  const SPARK_REFRESH_MS = 5 * 60 * 1000;
  const FLASH_MS = 600;
  const SPARK_POINTS = 24;  // 24 小時, 每小時 1 點

  // ===== 格式化 ===== //
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

  // ===== DOM 更新: 價格 + 漲跌 ===== //
  const lastPriceMap = {};

  function updateSymbol(symCfg, price, pct) {
    if (isNaN(price)) return;
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

    // Ticker
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

  // ===== 價格 Fetch ===== //
  async function fetchPrices() {
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
      console.log('[realtime] Prices · ' + okCount + '/' + SYMBOLS.length);
    } catch (err) {
      console.warn('[realtime] Price fetch failed:', err.message);
      updateStatus(false);
    }
  }

  // ===== Sparkline 繪製 ===== //
  // 在 .quote[data-sym] 內找 .quote-spark <svg>,重畫 polyline
  function drawSparkline(symCfg, closes) {
    if (!closes || closes.length < 2) return;

    const heroQuote = document.querySelector('.quote[data-sym="' + symCfg.id + '"]');
    if (!heroQuote) return;
    const svg = heroQuote.querySelector('.quote-spark');
    if (!svg) return;

    // viewBox 80 x 28: 左右各留 0.5 邊距
    const W = 80;
    const H = 28;
    const padY = 2;

    // 如果是 invert symbol (USD/JPY、USD/CHF),要倒數每個點
    let series = closes.slice();
    if (symCfg.invert) {
      series = series.map(function (v) { return v > 0 ? 1 / v : v; });
    }

    const min = Math.min.apply(null, series);
    const max = Math.max.apply(null, series);
    const range = max - min || 1;  // 避免除零

    const step = series.length > 1 ? W / (series.length - 1) : W;
    const points = series.map(function (v, i) {
      const x = (i * step).toFixed(2);
      // y 軸反向 (SVG 上為 0)
      const y = (H - padY - ((v - min) / range) * (H - 2 * padY)).toFixed(2);
      return x + ',' + y;
    }).join(' ');

    // 漲跌色: 比較第一個和最後一個
    const isUp = series[series.length - 1] >= series[0];
    const stroke = isUp ? '#54C87D' : '#F04E4E';

    // 清空 <svg> 內容,重畫
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const NS = 'http://www.w3.org/2000/svg';
    const polyline = document.createElementNS(NS, 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', stroke);
    polyline.setAttribute('stroke-width', '1.5');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(polyline);
  }

  // ===== Sparkline Fetch (歷史 24 小時) ===== //
  async function fetchSparkline(symCfg) {
    const url = 'https://min-api.cryptocompare.com/data/v2/histohour'
      + '?fsym=' + symCfg.cc
      + '&tsym=USD'
      + '&limit=' + SPARK_POINTS;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.Response !== 'Success' || !data.Data || !data.Data.Data) {
        console.warn('[realtime] spark ' + symCfg.id + ' bad response:', data.Message || data);
        return false;
      }
      const closes = data.Data.Data.map(function (d) { return d.close; }).filter(function (v) { return typeof v === 'number' && v > 0; });
      if (closes.length < 2) {
        console.warn('[realtime] spark ' + symCfg.id + ' insufficient data');
        return false;
      }
      drawSparkline(symCfg, closes);
      return true;
    } catch (err) {
      console.warn('[realtime] spark ' + symCfg.id + ' failed:', err.message);
      return false;
    }
  }

  // 9 個 symbol 錯開拉 sparkline (避免 CryptoCompare 並行限流)
  // XPT 跳過 (CCCAGG 無歷史數據)
  const SPARK_STAGGER_MS = 1500;  // 每個 symbol 間隔 1.5 秒

  async function fetchAllSparklines() {
    const eligible = SYMBOLS.filter(function (s) { return s.hasHistory; });
    let ok = 0;
    for (let i = 0; i < eligible.length; i++) {
      const success = await fetchSparkline(eligible[i]);
      if (success) ok++;
      // 最後一個不等
      if (i < eligible.length - 1) {
        await new Promise(function (r) { setTimeout(r, SPARK_STAGGER_MS); });
      }
    }
    console.log('[realtime] Sparklines · ' + ok + '/' + eligible.length + ' (XPT skipped: no history)');
  }

  // ===== 啟動 ===== //
  function start() {
    // 立即拉 price (1 個請求,秒開)
    fetchPrices();
    // 延遲 2 秒再拉 sparkline (9 個並行請求,避免跟 price 搶頻寬)
    setTimeout(fetchAllSparklines, 2000);

    setInterval(fetchPrices, PRICE_REFRESH_MS);
    setInterval(fetchAllSparklines, SPARK_REFRESH_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
