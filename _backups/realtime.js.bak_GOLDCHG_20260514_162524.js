/* ============================================================
 *  CD Markets · Real-time Quote Module (v2 - Dual API)
 *  Sources:
 *    - gold-api.com: XAU/XAG/BTC/ETH (free, no key, no rate limit)
 *    - Twelve Data:  EUR/GBP/JPY/AUD/CHF (free key, 8 cr/min, 800/day)
 *  Strategy: 9 symbols staggered every 10s within a 90s cycle
 * ============================================================ */
(function () {
  'use strict';

  const TWELVE_KEY = '30b1352ef75840828b69a69a6263e6a7';

  const CONFIG = {
    intervalMs: 90 * 1000,
    staggerMs: 10 * 1000,
    flashMs: 600,
    symbols: [
      // gold-api: 貴金屬 + 加密
      { id: 'XAU/USD', src: 'gold',   tdSym: 'XAU',     dp: 2, comma: true  },
      { id: 'XAG/USD', src: 'gold',   tdSym: 'XAG',     dp: 2, comma: true  },
      { id: 'BTC/USD', src: 'gold',   tdSym: 'BTC',     dp: 2, comma: true  },
      { id: 'ETH/USD', src: 'gold',   tdSym: 'ETH',     dp: 2, comma: true  },
      // twelvedata: 主流外匯
      { id: 'EUR/USD', src: 'twelve', tdSym: 'EUR/USD', dp: 4, comma: false },
      { id: 'GBP/USD', src: 'twelve', tdSym: 'GBP/USD', dp: 4, comma: false },
      { id: 'USD/JPY', src: 'twelve', tdSym: 'USD/JPY', dp: 2, comma: true  },
      { id: 'AUD/USD', src: 'twelve', tdSym: 'AUD/USD', dp: 4, comma: false },
      { id: 'USD/CHF', src: 'twelve', tdSym: 'USD/CHF', dp: 4, comma: false },
    ],
  };

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
    el.style.transition = 'color 120ms';
    el.style.color = color;
    setTimeout(() => {
      el.style.color = origColor;
      setTimeout(() => { el.style.transition = ''; }, 200);
    }, CONFIG.flashMs);
  }

  const lastPriceMap = {};

  function updateSymbol(symCfg, price, change, pct) {
    if (isNaN(price)) return;
    const isUp = change >= 0;
    const priceStr = fmt(price, symCfg.dp, symCfg.comma);
    const changeStr = fmtChange(change, symCfg.dp);
    const pctStr = fmtPct(pct);
    const prevPrice = lastPriceMap[symCfg.id];
    const priceFlashDir = prevPrice !== undefined ? (price >= prevPrice) : isUp;
    lastPriceMap[symCfg.id] = price;

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

  async function fetchGold(symCfg) {
    const url = 'https://api.gold-api.com/price/' + symCfg.tdSym + '?_t=' + Date.now();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const price = parseFloat(data.price != null ? data.price : (data.close != null ? data.close : data.value));
      const change = parseFloat(data.ch != null ? data.ch : (data.change != null ? data.change : (data.priceChange != null ? data.priceChange : 0)));
      const pct = parseFloat(data.chp != null ? data.chp : (data.change_percent != null ? data.change_percent : (data.percent_change != null ? data.percent_change : (data.priceChangePercent != null ? data.priceChangePercent : 0))));
      if (!isNaN(price)) {
        updateSymbol(symCfg, price, change, pct);
        return true;
      }
      console.warn('[realtime] gold-api ' + symCfg.id + ' unexpected format:', data);
      return false;
    } catch (err) {
      console.warn('[realtime] gold-api ' + symCfg.id + ' failed:', err.message);
      return false;
    }
  }

  async function fetchTwelve(symCfg) {
    const url = 'https://api.twelvedata.com/quote?symbol=' + encodeURIComponent(symCfg.tdSym) + '&apikey=' + TWELVE_KEY + '&_t=' + Date.now();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.status === 'error' || data.code) {
        console.warn('[realtime] twelve ' + symCfg.id + ' error:', data.message || data);
        return false;
      }
      const price = parseFloat(data.close);
      const change = parseFloat(data.change);
      const pct = parseFloat(data.percent_change);
      if (!isNaN(price)) {
        updateSymbol(symCfg, price, change, pct);
        return true;
      }
      console.warn('[realtime] twelve ' + symCfg.id + ' no close field');
      return false;
    } catch (err) {
      console.warn('[realtime] twelve ' + symCfg.id + ' failed:', err.message);
      return false;
    }
  }

  async function fetchOne(symCfg) {
    if (symCfg.src === 'gold') return await fetchGold(symCfg);
    if (symCfg.src === 'twelve') return await fetchTwelve(symCfg);
    return false;
  }

  let roundActive = false;
  async function runRound() {
    if (roundActive) return;
    roundActive = true;
    let okCount = 0;
    for (let i = 0; i < CONFIG.symbols.length; i++) {
      const symCfg = CONFIG.symbols[i];
      const ok = await fetchOne(symCfg);
      if (ok) okCount++;
      updateStatus(okCount > 0);
      if (i < CONFIG.symbols.length - 1) {
        await new Promise(function (r) { setTimeout(r, CONFIG.staggerMs); });
      }
    }
    console.log('[realtime] Round done · ' + okCount + '/' + CONFIG.symbols.length + ' symbols updated');
    roundActive = false;
  }

  function start() {
    runRound();
    setInterval(runRound, CONFIG.intervalMs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
