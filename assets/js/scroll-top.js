/* ── Scroll-to-top: simple fade (desktop + mobile) ── */
(function () {
  const btn    = document.getElementById('scroll-top');
  const header = document.querySelector('.site-header');
  if (!btn || !header) return;

  let wasVisible = false;

  function isMobile() { return window.innerWidth <= 1024; }

  const observer = new IntersectionObserver(function (entries) {
    const headerVisible = entries[0].isIntersecting;

    if (!headerVisible) {
      /* Header fuera de pantalla → mostrar botón */
      wasVisible = true;
      btn.style.transition = 'none';
      btn.style.opacity = '0';
      btn.style.transform = isMobile()
        ? 'translateX(-50%) translateY(80px)'
        : 'translateY(80px)';
      btn.classList.remove('visible');
      void btn.getBoundingClientRect();
      requestAnimationFrame(() => {
        btn.style.transition = '';
        btn.style.opacity = '';
        btn.style.transform = '';
        btn.classList.add('visible');
      });
      btn.style.pointerEvents = 'auto';

    } else {
      /* Header visible → ocultar botón */
      if (wasVisible) {
        btn.style.pointerEvents = 'none';
        btn.classList.remove('visible');
        setTimeout(() => {
          btn.style.transition = 'none';
          btn.style.opacity = '';
          btn.style.transform = '';
          btn.style.pointerEvents = '';
        }, 550);
      }
      wasVisible = false;
    }
  }, { threshold: 0 });

  observer.observe(header);

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
