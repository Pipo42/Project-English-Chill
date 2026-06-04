/* ── Copyright year ── */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const el = document.querySelector('.footer-copy');
    if (el) el.textContent = '©' + new Date().getFullYear();
  });
})();

/* ── Fill-gaps logic ── */
(function () {

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  function normalizeString(str) {
    const t = document.createElement('textarea');
    t.innerHTML = str;
    str = t.value;
    return str.trim().toLowerCase().replace(/[''‛‹›]/g, "'").replace(/[.,!?;:]$/, '');
  }

  function adjustInputWidth(input) {
    const span = document.createElement('span');
    span.style.cssText = 'visibility:hidden;position:absolute;white-space:pre;';
    span.style.font = window.getComputedStyle(input).font;
    span.textContent = input.value || input.placeholder || '?';
    document.body.appendChild(span);
    input.style.width = (span.offsetWidth + 32) + 'px';
    document.body.removeChild(span);
  }

  /* ── Init: hide btn-reload, make btn-check the single toggle ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-reload').forEach(btn => { btn.style.display = 'none'; });
    document.querySelectorAll('.btn-check').forEach(btn => { btn.dataset.state = 'check'; });
  });

  function check(button) {
    const container = button.closest('.fill_gaps');
    const inputs = container.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      if (input.classList.contains('checked')) return;
      const user = normalizeString(input.value);
      const valid = JSON.parse(input.dataset.answers).map(normalizeString);
      input.disabled = true;
      if (valid.includes(user)) {
        input.classList.add('correct');
      } else {
        input.classList.add('incorrect');
        const span = document.createElement('span');
        span.className = 'correct-answer';
        span.textContent = '(' + valid[0] + ')';
        input.parentNode.appendChild(span);
      }
      input.classList.add('checked');
    });
    const correct = container.querySelectorAll('input.correct').length;
    const fb = container.querySelector('.feedback');
    fb.textContent = correct + ' / ' + inputs.length;
    fb.classList.add('visible');
    /* Flip button to reload state — lock width first to prevent resize */
    button.style.width = button.offsetWidth + 'px';
    button.dataset.state = 'reload';
    button.querySelector('.button-text').textContent = 'Reload';
    button.classList.add('btn-inverted');
  }

  function reload(button) {
    const container = button.closest('.fill_gaps');
    const inputs = container.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      input.value = '';
      input.disabled = false;
      input.classList.remove('correct', 'incorrect', 'checked');
      adjustInputWidth(input);
      const span = input.parentNode.querySelector('.correct-answer');
      if (span) span.remove();
    });
    const fb2 = container.querySelector('.feedback');
    fb2.classList.remove('visible');
    setTimeout(() => { fb2.textContent = ''; }, 400);
    /* Flip button back to check state — release fixed width */
    button.style.width = '';
    button.dataset.state = 'check';
    button.querySelector('.button-text').textContent = 'Check Answers';
    button.classList.remove('btn-inverted');
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-check');
    if (!btn) return;
    e.preventDefault(); btn.blur();
    if (btn.dataset.state === 'reload') { reload(btn); } else { check(btn); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches('.fill_gaps input[type="text"]')) {
      e.preventDefault();
      const container = e.target.closest('.fill_gaps');
      const checkBtn = container.querySelector('.btn-check');
      if (checkBtn && checkBtn.dataset.state !== 'reload') checkBtn.click();
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target.matches('.fill_gaps input[type="text"]')) adjustInputWidth(e.target);
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('.fill_gaps input[type="text"]')) {
      requestAnimationFrame(() => adjustInputWidth(e.target));
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.fill_gaps input[type="text"]').forEach(adjustInputWidth);
  });
  document.querySelectorAll('.fill_gaps input[type="text"]').forEach(adjustInputWidth);

})();
