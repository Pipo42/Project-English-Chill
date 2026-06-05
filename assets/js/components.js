/* ── Shared header & footer ── */
(function () {
  // Determine depth by looking at our own <script src> attribute
  let depth = 0;
  const allScripts = document.querySelectorAll('script[src]');
  for (const s of allScripts) {
    const src = s.getAttribute('src');
    if (src && src.indexOf('components.js') !== -1) {
      depth = (src.match(/\.\.\//g) || []).length;
      break;
    }
  }

  const base = '../'.repeat(depth) + 'assets/';
  const root = '../'.repeat(depth);

  /* ── Page fade-in on arrival ── */
  window.addEventListener('pageshow', function () {
    var main = document.querySelector('main.site-content');
    if (main) {
      main.classList.remove('page-fadein');
      void main.offsetWidth; // reflow to restart animation
      main.classList.add('page-fadein');
    }
  });

  /* ── HEADER ── */
  const headerEl = document.querySelector('header.site-header');
  if (headerEl) {
    headerEl.innerHTML =
      '<div class="site-header-inner">' +
        '<img src="' + base + 'images/Dotted-Lines-left.svg" alt="" aria-hidden="true" class="header-dots">' +
        '<a href="' + root + 'index.html" style="text-decoration:none;color:inherit;"><span class="site-title">English &amp; Chill</span></a>' +
        '<img src="' + base + 'images/Dotted-Lines-right-1.svg" alt="" aria-hidden="true" class="header-dots">' +
      '</div>';
  }

  /* ── FOOTER ── */
  const footerEl = document.querySelector('footer.site-footer');
  if (footerEl) {
    footerEl.innerHTML =
      '<div class="smoke-container">' +
        '<div class="smoke" style="left:50%;animation-delay:-2s"></div>' +
        '<div class="smoke" style="left:40%;animation-delay:-3s"></div>' +
        '<div class="smoke" style="left:60%;animation-delay:-1s"></div>' +
        '<div class="smoke" style="left:45%;animation-delay:-4s"></div>' +
        '<div class="smoke" style="left:55%;animation-delay:-2.5s"></div>' +
      '</div>' +
      '<a href="' + root + 'index.html" style="display:inline-block;">' +
        '<img src="' + base + 'images/EC-Logo.svg" alt="English &amp; Chill" class="footer-logo" style="width:203px;height:auto;display:block;">' +
      '</a>' +
      '<p class="footer-copy">©' + new Date().getFullYear() + '</p>';
  }


  /* ── Custom scrollbar ── */
  (function () {
    var THUMB = 48; // px — must match CSS height/width

    var bar   = document.createElement('div');
    var thumb = document.createElement('div');
    bar.id    = 'custom-scrollbar';
    thumb.id  = 'custom-scrollbar-thumb';
    thumb.textContent = '[you]';
    bar.appendChild(thumb);
    document.body.appendChild(bar);

    function trackH()   { return window.innerHeight; }
    function maxScroll(){ return Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    function maxTop()   { return trackH() - THUMB; }

    function posFromScroll() {
      return (window.scrollY / maxScroll()) * maxTop();
    }

    var hideTimer = null;

    function showScrollbar() {
      bar.classList.add('scrollbar-visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        bar.classList.remove('scrollbar-visible');
      }, 1000);
    }

    function updateThumb() {
      bar.style.display = document.documentElement.scrollHeight > window.innerHeight + 2 ? '' : 'none';
      var top = Math.round(posFromScroll());
      thumb.style.top = top + 'px';
      if (top < 52) {
        thumb.classList.add('thumb-faded');
      } else {
        thumb.classList.remove('thumb-faded');
      }
    }

    window.addEventListener('scroll', function () { updateThumb(); showScrollbar(); }, { passive: true });
    window.addEventListener('resize', updateThumb);

    // Drag
    thumb.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      thumb.style.cursor = '';
      thumb.setPointerCapture(e.pointerId);
      var grabOffset = e.clientY - thumb.getBoundingClientRect().top;

      function onMove(ev) {
        var wantedTop = ev.clientY - grabOffset;
        var ratio     = Math.max(0, Math.min(1, wantedTop / maxTop()));
        window.scrollTo({ top: ratio * maxScroll(), behavior: 'instant' });
      }
      thumb.addEventListener('pointermove', onMove);
      thumb.addEventListener('pointerup', function () {
        thumb.removeEventListener('pointermove', onMove);
      }, { once: true });
    });

    updateThumb();
  })();

  // Navigate immediately — no fade-out delay
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (a.target === '_blank') return;
    // No preventDefault, no setTimeout — browser navigates instantly
  }, true);
})();
