/* ── Shared header & footer ── */
(function () {
  // Determine depth by looking at our own <script src> attribute
  // Works with file:// and http:// because we read the attribute directly
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
  /* DEBUG: transitions disabled

*/ared header & footer ── */
(function () {
  // Determine depth by looking at our own <script src> attribute
  // Works with file:// and http:// because we read the attribute directly
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
  /* ── Page transitions: 3-block cascade ── */
  var blocks = [
    document.querySelector('header.site-header'),
    document.querySelector('main.site-content'),
    document.querySelector('footer.site-footer')
  ];
  blocks.forEach(function (el) { if (el) el.classList.add('reveal-block'); });

  window.addEventListener('pageshow', function () {
    document.body.classList.add('page-init');
    blocks.forEach(function (el, i) {
      if (!el) return;
      setTimeout(function () { el.classList.add('visible'); }, i * 120);
   