/* ============================================================
 *  CD Markets · Shared Components
 *  注入 topbar / drawer / footer 到頁面,並處理抽屜開關邏輯
 *
 *  使用方式 (各分頁):
 *    <body data-page="products">
 *      <div id="topbar-mount"></div>
 *      <div id="drawer-mount"></div>
 *      <!-- 頁面內容 -->
 *      <div id="footer-mount"></div>
 *      <script src="assets/js/components.js"></script>
 *
 *  data-page 可選值: home / products / news / account / about / support / download
 *  當前 page 的 nav-item 會自動加 .is-active 高亮
 * ============================================================ */
(function () {
  'use strict';

  // ===== 7 項菜單定義 (改一次,7 個分頁同步) ===== //
  const NAV_ITEMS = [
    { key: 'home',      label: '港金通',   href: 'index.html'    },
    { key: 'products',  label: '產品介紹', href: 'products.html' },
    { key: 'news',      label: '資訊中心', href: 'news.html'     },
    { key: 'account',   label: '開戶交易', href: 'account.html'  },
    { key: 'about',     label: '關於我們', href: 'about.html'    },
    { key: 'support',   label: '服務支持', href: 'support.html'  },
    { key: 'download',  label: '軟件下載', href: 'download.html' },
  ];

  // ===== Topbar HTML 生成 ===== //
  function buildTopbar(currentPage) {
    const navLinks = NAV_ITEMS.map(function (item) {
      const isActive = item.key === currentPage ? ' class="is-active"' : '';
      return '      <a href="' + item.href + '"' + isActive + '>' + item.label + '</a>';
    }).join('\n');

    return ''
      + '<nav class="topbar" id="top">\n'
      + '  <div class="topbar-inner">\n'
      + '    <a href="index.html" class="topbar-brand">\n'
      + '      <img src="assets/img/logo.png" alt="CD Markets">\n'
      + '      <span class="topbar-brand-name">CD Markets</span>\n'
      + '      <span class="topbar-brand-meta">HK · EST 2014</span>\n'
      + '    </a>\n'
      + '    <div class="topbar-nav">\n'
      + navLinks + '\n'
      + '    </div>\n'
      + '    <div class="topbar-right">\n'
      + '      <div class="market-status">MARKET · OPEN</div>\n'
      + '      <span class="topbar-lang">ZH</span>\n'
      + '      <a href="#" class="topbar-login">登入</a>\n'
      + '      <a href="account.html" class="topbar-signup">立即開戶</a>\n'
      + '      <button class="topbar-menu" id="open-drawer" aria-label="選單">\n'
      + '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">\n'
      + '          <line x1="3" y1="7" x2="21" y2="7"/>\n'
      + '          <line x1="3" y1="17" x2="21" y2="17"/>\n'
      + '        </svg>\n'
      + '      </button>\n'
      + '    </div>\n'
      + '  </div>\n'
      + '</nav>';
  }

  // ===== Drawer HTML 生成 ===== //
  function buildDrawer(currentPage) {
    const drawerLinks = NAV_ITEMS.map(function (item, i) {
      const isActive = item.key === currentPage ? ' class="drawer-item is-active"' : ' class="drawer-item"';
      const no = String(i + 1).padStart(2, '0');
      return '    <a' + isActive + ' href="' + item.href + '"><span>' + item.label + '</span><span class="no">' + no + '</span></a>';
    }).join('\n');

    return ''
      + '<div class="drawer-bd" id="drawer-bd"></div>\n'
      + '<aside class="drawer" id="drawer">\n'
      + '  <div class="drawer-head">\n'
      + '    <a href="index.html" class="topbar-brand">\n'
      + '      <img src="assets/img/logo.png" alt="CD Markets">\n'
      + '      <span class="topbar-brand-name">CD Markets</span>\n'
      + '    </a>\n'
      + '    <button class="drawer-close" id="close-drawer" aria-label="關閉選單">\n'
      + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">\n'
      + '        <line x1="6" y1="6" x2="18" y2="18"/>\n'
      + '        <line x1="18" y1="6" x2="6" y2="18"/>\n'
      + '      </svg>\n'
      + '    </button>\n'
      + '  </div>\n'
      + '  <div class="drawer-body">\n'
      + '    <div class="drawer-section-label">Sections · 主要章節</div>\n'
      + drawerLinks + '\n'
      + '\n'
      + '    <div class="drawer-section-label">Account · 帳戶</div>\n'
      + '    <a class="drawer-item" href="#"><span>登入</span><span class="no">→</span></a>\n'
      + '\n'
      + '    <div class="drawer-utilities">\n'
      + '      <button class="drawer-util-btn active"><span>LANG</span><strong>簡體</strong></button>\n'
      + '      <button class="drawer-util-btn"><span>LANG</span><strong>繁體</strong></button>\n'
      + '      <button class="drawer-util-btn"><span>LANG</span><strong>EN</strong></button>\n'
      + '    </div>\n'
      + '  </div>\n'
      + '  <div class="drawer-foot">\n'
      + '    <a href="account.html" class="drawer-foot-cta">立即開戶</a>\n'
      + '    <a href="tel:+85235210369" class="drawer-foot-phone">\n'
      + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n'
      + '        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>\n'
      + '      </svg>\n'
      + '      <span>客服直撥</span>\n'
      + '      <strong>+852 3521 0369</strong>\n'
      + '    </a>\n'
      + '  </div>\n'
      + '</aside>';
  }

  // ===== Footer HTML 生成 ===== //
  function buildFooter() {
    return ''
      + '<footer class="footer" id="footer">\n'
      + '  <div class="container">\n'
      + '    <div class="footer-top">\n'
      + '      <div class="footer-brand-block">\n'
      + '        <a href="index.html" class="topbar-brand">\n'
      + '          <img src="assets/img/logo.png" alt="CD Markets">\n'
      + '          <span class="topbar-brand-name">CD Markets</span>\n'
      + '        </a>\n'
      + '        <p>CloudData System Limited<br>香港持牌貴金屬交易商<br>商業登記號 63576919<br>Established 2014 · Hong Kong</p>\n'
      + '        <div class="footer-licenses">\n'
      + '          <span class="footer-license green">CGSE · 125</span>\n'
      + '          <span class="footer-license gold">HK Customs · A</span>\n'
      + '        </div>\n'
      + '      </div>\n'
      + '      <div class="footer-col">\n'
      + '        <h4>Products</h4>\n'
      + '        <ul>\n'
      + '          <li><a href="products.html">實金訂購</a></li>\n'
      + '          <li><a href="products.html">倫敦金銀現貨</a></li>\n'
      + '          <li><a href="products.html">期貨衍生品</a></li>\n'
      + '        </ul>\n'
      + '      </div>\n'
      + '      <div class="footer-col">\n'
      + '        <h4>Services</h4>\n'
      + '        <ul>\n'
      + '          <li><a href="account.html">開戶流程</a></li>\n'
      + '          <li><a href="support.html">交易規則</a></li>\n'
      + '          <li><a href="download.html">MT4 下載</a></li>\n'
      + '        </ul>\n'
      + '      </div>\n'
      + '      <div class="footer-col">\n'
      + '        <h4>About</h4>\n'
      + '        <ul>\n'
      + '          <li><a href="about.html">公司簡介</a></li>\n'
      + '          <li><a href="about.html">牌照與資質</a></li>\n'
      + '          <li><a href="about.html">客戶資金保障</a></li>\n'
      + '        </ul>\n'
      + '      </div>\n'
      + '      <div class="footer-col">\n'
      + '        <h4>Resources</h4>\n'
      + '        <ul>\n'
      + '          <li><a href="support.html">投資學堂</a></li>\n'
      + '          <li><a href="news.html">財經日曆</a></li>\n'
      + '          <li><a href="news.html">公司公告</a></li>\n'
      + '        </ul>\n'
      + '      </div>\n'
      + '    </div>\n'
      + '\n'
      + '    <div class="footer-contact">\n'
      + '      <div class="footer-contact-cell">\n'
      + '        <div class="lbl">Office</div>\n'
      + '        <div class="val">香港灣仔告士打道 128 號祥豐大廈 21 樓 E 室</div>\n'
      + '      </div>\n'
      + '      <div class="footer-contact-cell">\n'
      + '        <div class="lbl">Telephone</div>\n'
      + '        <div class="val mono">+852 3521 0369</div>\n'
      + '      </div>\n'
      + '      <div class="footer-contact-cell">\n'
      + '        <div class="lbl">Correspondence</div>\n'
      + '        <div class="val mono">info / acc / cs / ib @ cdmarkets.net</div>\n'
      + '      </div>\n'
      + '    </div>\n'
      + '\n'
      + '    <div class="footer-risk">\n'
      + '      <strong>RISK NOTICE</strong>槓桿式金融商品交易具有快速虧損的高風險，可能不適合所有投資者。請確保您完全了解相關風險。\n'
      + '      <strong style="margin-left:12px">RESTRICTED</strong>CloudData System Limited 不接受來自美國、加拿大、伊朗、北韓等地區居民的申請。\n'
      + '    </div>\n'
      + '\n'
      + '    <div class="footer-bottom">\n'
      + '      <div>© 2026 CLOUDDATA SYSTEM LIMITED · ALL RIGHTS RESERVED</div>\n'
      + '      <div class="footer-legal">\n'
      + '        <a href="#">DISCLAIMER</a>\n'
      + '        <a href="#">RISK</a>\n'
      + '        <a href="#">PRIVACY</a>\n'
      + '        <a href="#">AML</a>\n'
      + '        <a href="#">COOKIES</a>\n'
      + '      </div>\n'
      + '    </div>\n'
      + '  </div>\n'
      + '</footer>';
  }

  // ===== 抽屜開關邏輯 ===== //
  function bindDrawer() {
    const drawer = document.getElementById('drawer');
    const bd = document.getElementById('drawer-bd');
    const openBtn = document.getElementById('open-drawer');
    const closeBtn = document.getElementById('close-drawer');

    if (!drawer || !bd || !openBtn || !closeBtn) return;

    function open() {
      drawer.classList.add('open');
      bd.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function close() {
      drawer.classList.remove('open');
      bd.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    bd.addEventListener('click', close);
    document.querySelectorAll('.drawer-item').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  // ===== Scroll Reveal (進場動畫) ===== //
  function bindReveal() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  // ===== 啟動 ===== //
  function init() {
    const currentPage = document.body.getAttribute('data-page') || 'home';

    const topMount = document.getElementById('topbar-mount');
    const drawerMount = document.getElementById('drawer-mount');
    const footerMount = document.getElementById('footer-mount');

    if (topMount) topMount.outerHTML = buildTopbar(currentPage);
    if (drawerMount) drawerMount.outerHTML = buildDrawer(currentPage);
    if (footerMount) footerMount.outerHTML = buildFooter();

    bindDrawer();
    bindReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
