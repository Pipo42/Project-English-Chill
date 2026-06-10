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


  /* ── HEADER ── */
  const headerEl = document.querySelector('header.site-header');
  if (headerEl) {
    headerEl.innerHTML =
      '<div class="site-header-inner">' +
        '<a href="' + root + 'index.html" style="text-decoration:none;display:inline-block;"><img src="' + base + 'images/E&amp;C Logo.svg" alt="English &amp; Chill" class="site-title-logo" style="height:clamp(100px,14vw,190px);width:auto;display:block;"></a>' +
      '</div>';
  }

  /* ── FOOTER ── */
  const footerEl = document.querySelector('footer.site-footer');
  if (footerEl) {
    footerEl.innerHTML =
      '<p class="footer-copy">©' + new Date().getFullYear() + '</p>';
  }


  /* ── Custom scrollbar ── */
  (function () {
    var THUMB = 48; // px — must match CSS height/width

    var bar   = document.createElement('div');
    var thumb = document.createElement('div');
    bar.id    = 'custom-scrollbar';
    thumb.id  = 'custom-scrollbar-thumb';
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

  /* ── Scroll-to-top button (all pages) ── */
  (function () {
    // Don't inject if already in the HTML
    if (document.getElementById('scroll-top')) return;

    // Only show if page is tall enough to warrant scrolling
    function hasEnoughScroll() {
      return document.documentElement.scrollHeight > window.innerHeight * 1.5;
    }
    if (!hasEnoughScroll()) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'drops-canvas';
    document.body.appendChild(canvas);

    var btn = document.createElement('a');
    btn.href = '#top';
    btn.id = 'scroll-top';
    btn.className = 'fancy-button';
    btn.style.cssText = '--button-outline:#000000; --button-color:var(--color-accent-1);';
    btn.innerHTML = '<span class="button_top"><span class="button-text">↑</span></span>';
    document.body.appendChild(btn);

    var s = document.createElement('script');
    s.src = base + 'js/scroll-top.js';
    document.body.appendChild(s);
  })();

})();
