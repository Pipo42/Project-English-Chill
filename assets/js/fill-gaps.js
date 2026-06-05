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

  /* ── Score colour: 0=red, 0.25=orange, 0.5=yellow, 0.75=yellow-green, 1=green ── */
  function scoreColor(ratio) {
    // Keyframes: [ratio, [r,g,b]]
    const stops = [
      [0,    [220,  50,  50]],
      [0.25, [230, 120,   0]],
      [0.5,  [210, 180,   0]],
      [0.75, [140, 190,  40]],
      [1,    [  0, 160,  60]],
    ];
    let lo = stops[0], hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (ratio >= stops[i][0] && ratio <= stops[i + 1][0]) { lo = stops[i]; hi = stops[i + 1]; break; }
    }
    const t = lo[0] === hi[0] ? 0 : (ratio - lo[0]) / (hi[0] - lo[0]);
    const r = Math.round(lo[1][0] + t * (hi[1][0] - lo[1][0]));
    const g = Math.round(lo[1][1] + t * (hi[1][1] - lo[1][1]));
    const b = Math.round(lo[1][2] + t * (hi[1][2] - lo[1][2]));
    return `rgb(${r},${g},${b})`;
  }

  /* ── Init: hide btn-reload, make btn-check the single toggle ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-reload').forEach(btn => { btn.style.display = 'none'; });
    document.querySelectorAll('.btn-check').forEach(btn => { btn.dataset.state = 'check'; });
  });

  function check(button) {
    const container = button.closest('.fill_gaps');
    const inputs = container.querySelectorAll('input[type="text"]');
    let delay = 0;
    let correctCount = 0;
    const unchecked = Array.from(inputs).filter(i => !i.classList.contains('checked'));
    unchecked.forEach(input => {
      const user = normalizeString(input.value);
      const valid = JSON.parse(input.dataset.answers).map(normalizeString);
      input.disabled = true;
      const isCorrect = valid.includes(user);
      if (isCorrect) correctCount++;
      setTimeout(() => {
        if (isCorrect) {
          input.classList.add('correct');
        } else {
          input.classList.add('incorrect');
          const span = document.createElement('span');
          span.className = 'correct-answer';
          span.textContent = '(' + valid[0] + ')';
          input.parentNode.appendChild(span);
          requestAnimationFrame(() => requestAnimationFrame(() => span.classList.add('visible')));
        }
      }, delay);
      input.classList.add('checked');
      delay += 60;
    });
    // Also count already-checked correct inputs
    correctCount += container.querySelectorAll('input.correct').length;
    const totalCorrect = correctCount;
    const ratio = inputs.length > 0 ? totalCorrect / inputs.length : 0;
    const color = scoreColor(ratio);
    const fb = container.querySelector('.feedback');
    const afterStagger = delay + 100;
    setTimeout(() => {
      fb.textContent = totalCorrect + ' / ' + inputs.length;
      fb.style.color = color;
      fb.classList.add('visible');
      container.classList.remove('shake');
      void container.offsetWidth; // reflow para reiniciar la animación si se repite
      container.classList.add('shake');
    }, afterStagger);
    /* Flip button to reload state — lock width first to prevent resize */
    button.style.width = button.offsetWidth + 'px';
    button.dataset.state = 'reload';
    button.querySelector('.button-text').textContent = 'Reload';
    /* Apply score colour to button and form */
    button.style.setProperty('--button-outline', color);
    button.style.background = color;
    container.style.setProperty('--score-color', color);
    container.classList.add('checked-state');
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
    setTimeout(() => { fb2.textContent = ''; fb2.style.color = ''; }, 400);
    /* Flip button back to check state — release fixed width */
    button.style.width = '';
    button.dataset.state = 'check';
    button.querySelector('.button-text').textContent = 'Check Answers';
    /* Restore scarlet */
    button.style.setProperty('--button-outline', 'var(--color-accent-3)');
    button.style.background = 'var(--color-accent-3)';
    container.style.removeProperty('--score-color');
    container.classList.remove('checked-state', 'shake');
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
