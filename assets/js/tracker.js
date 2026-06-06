/* ── Exercise Progress Tracker ── */
(function () {

  /* ── Build tracker DOM ── */
  function buildTracker() {
    const el = document.createElement('div');
    el.id = 'ex-tracker';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  /* ── Get exercise letter from the .ex-heading before a fill_gaps-wrapper ── */
  function getExLabel(wrapper) {
    let prev = wrapper.previousElementSibling;
    while (prev) {
      if (prev.classList.contains('ex-heading')) {
        const text = prev.textContent.trim();
        const m = text.match(/^([a-z])\./i);
        return m ? m[1].toLowerCase() : text.charAt(0).toLowerCase();
      }
      prev = prev.previousElementSibling;
    }
    return '?';
  }

  /* ── Gather fill_gaps exercises that belong to a section EXS label ── */
  function getExercises(sectionLabel) {
    const exercises = [];
    let node = sectionLabel.nextElementSibling;
    while (node) {
      if (node.classList.contains('section-label') && node !== sectionLabel) break;
      if (node.classList.contains('fill_gaps-wrapper')) {
        const fg = node.querySelector('.fill_gaps');
        if (fg) exercises.push({ wrapper: node, fillGaps: fg, label: getExLabel(node) });
      }
      node = node.nextElementSibling;
    }
    return exercises;
  }

  /* ── Wrap an EXS section in a sentinel div ── */
  function buildSentinel(sectionLabel) {
    const sentinel = document.createElement('div');
    sentinel.className = 'tracker-sentinel';
    sentinel.style.cssText = 'pointer-events:auto;';
    sectionLabel.parentNode.insertBefore(sentinel, sectionLabel);
    sentinel.appendChild(sectionLabel);
    let next = sentinel.nextElementSibling;
    while (next) {
      if (next.classList.contains('section-label')) break;
      const toMove = next;
      next = next.nextElementSibling;
      sentinel.appendChild(toMove);
    }
    return sentinel;
  }

  /* ── State ── */
  const trackerEl = buildTracker();
  let currentLabel = null;
  let currentExercises = [];
  let visible = false;
  let activeIndex = -1;
  let exerciseObserver = null;

  /* ── Highlight active circle ── */
  function setActive(idx) {
    if (idx === activeIndex) return;
    activeIndex = idx;
    trackerEl.querySelectorAll('.tracker-dot').forEach((dot, i) => {
      dot.classList.toggle('tracker-active', i === idx);
    });
  }

  /* ── Watch which exercise is in viewport ── */
  function watchActiveExercise(exercises) {
    if (exerciseObserver) exerciseObserver.disconnect();
    // Fires when the top 40% of viewport contains the wrapper
    exerciseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = exercises.findIndex(ex => ex.wrapper === entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    }, { rootMargin: '0px 0px -55% 0px', threshold: 0 });
    exercises.forEach(ex => exerciseObserver.observe(ex.wrapper));
  }

  /* ── Render circles ── */
  function renderCircles(exercises) {
    trackerEl.innerHTML = '';
    activeIndex = -1;
    exercises.forEach((ex, i) => {
      const dot = document.createElement('div');
      dot.className = 'tracker-dot';
      dot.dataset.index = i;

      const circle = document.createElement('div');
      circle.className = 'tracker-circle';
      circle.textContent = ex.label;

      const color = getScoreColor(ex.fillGaps);
      if (color) applyColor(circle, dot, color);

      dot.style.cursor = 'pointer';
      dot.style.pointerEvents = 'auto';
      dot.addEventListener('click', () => {
        let heading = ex.wrapper.previousElementSibling;
        while (heading && !heading.classList.contains('ex-heading')) {
          heading = heading.previousElementSibling;
        }
        const target = heading || ex.wrapper;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      dot.appendChild(circle);

      if (i < exercises.length - 1) {
        const line = document.createElement('div');
        line.className = 'tracker-line';
        dot.appendChild(line);
      }

      trackerEl.appendChild(dot);
    });
  }

  function getScoreColor(fg) {
    if (!fg.classList.contains('checked-state')) return null;
    return fg.style.getPropertyValue('--score-color') || null;
  }

  /* Mezcla un color rgb(...) con blanco al 45% para versión pastel */
  function pastelize(color) {
    const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!m) return color;
    const mix = (c) => Math.round(parseInt(c) * 0.55 + 255 * 0.45);
    return `rgb(${mix(m[1])},${mix(m[2])},${mix(m[3])})`;
  }

  function applyColor(circle, dot, color) {
    const pastel = pastelize(color);
    circle.style.background = pastel;
    circle.style.borderColor = '#191919';
    circle.style.color = '#191919';
    dot.classList.add('done');
  }

  /* ── Update circle when a fill_gaps is checked ── */
  function updateCircle(fg) {
    const idx = currentExercises.findIndex(ex => ex.fillGaps === fg);
    if (idx === -1) return;
    const color = getScoreColor(fg);
    if (!color) return;
    const dot = trackerEl.querySelector(`.tracker-dot[data-index="${idx}"]`);
    if (!dot) return;
    const circle = dot.querySelector('.tracker-circle');
    applyColor(circle, dot, color);
    circle.classList.add('tracker-fill-anim');
    setTimeout(() => circle.classList.remove('tracker-fill-anim'), 600);
  }

  /* ── Reset circle when a fill_gaps is reloaded ── */
  function resetCircle(fg) {
    const idx = currentExercises.findIndex(ex => ex.fillGaps === fg);
    if (idx === -1) return;
    const dot = trackerEl.querySelector(`.tracker-dot[data-index="${idx}"]`);
    if (!dot) return;
    const circle = dot.querySelector('.tracker-circle');
    circle.style.background = '';
    circle.style.borderColor = '';
    circle.style.color = '';
    dot.classList.remove('done');
  }

  /* ── Show / hide ── */
  function showTracker(sectionLabel) {
    if (currentLabel === sectionLabel && visible) return;
    currentLabel = sectionLabel;
    currentExercises = getExercises(sectionLabel);
    if (currentExercises.length === 0) return;
    renderCircles(currentExercises);
    watchActiveExercise(currentExercises);
    trackerEl.classList.add('tracker-visible');
    visible = true;
  }

  function hideTracker() {
    if (exerciseObserver) { exerciseObserver.disconnect(); exerciseObserver = null; }
    currentLabel = null;
    currentExercises = [];
    activeIndex = -1;
    trackerEl.classList.remove('tracker-visible');
    visible = false;
  }

  /* ── Build sentinels and observe ── */
  function init() {
    const exsLabels = Array.from(document.querySelectorAll('.section-label.exs'));
    if (exsLabels.length === 0) return;

    const sentinels = exsLabels.map(label => ({
      label,
      sentinel: buildSentinel(label)
    }));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const item = sentinels.find(s => s.sentinel === entry.target);
        if (!item) return;
        if (entry.isIntersecting) {
          showTracker(item.label);
        } else {
          if (currentLabel === item.label) hideTracker();
        }
      });
    }, { rootMargin: '-25% 0px -25% 0px', threshold: 0 });

    sentinels.forEach(({ sentinel }) => observer.observe(sentinel));

    /* ── Watch fill_gaps for check/reload ── */
    document.querySelectorAll('.fill_gaps').forEach(fg => {
      let wasChecked = false;
      const mo = new MutationObserver(() => {
        const isChecked = fg.classList.contains('checked-state');
        if (isChecked && !wasChecked) {
          wasChecked = true;
          setTimeout(() => updateCircle(fg), 200);
        } else if (!isChecked && wasChecked) {
          wasChecked = false;
          resetCircle(fg);
        }
      });
      mo.observe(fg, { attributes: true, attributeFilter: ['class'] });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #ex-tracker {
      position: fixed;
      z-index: 900;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }

    /* ── PC: vertical ── */
    @media (min-width: 769px) {
      #ex-tracker {
        left: calc(50% - 400px - 64px);
        top: 50%;
        transform: translateY(-50%) translateX(-16px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
      }
      #ex-tracker.tracker-visible {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
      .tracker-dot {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .tracker-line {
        width: 0.125rem;
        height: 2rem;
        background: #560319;
        border-radius: 0.125rem;
      }
    }

    /* ── Mobile: horizontal ── */
    @media (max-width: 768px) {
      #ex-tracker {
        left: 50%;
        top: clamp(60px, 12vw, 90px);
        transform: translateX(-50%) translateY(-16px);
        display: flex;
        flex-direction: row;
        align-items: center;
        background: transparent;
        border-radius: 999px;
        padding: 4px 8px;
        gap: 0;
      }
      #ex-tracker.tracker-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      .tracker-dot {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .tracker-line {
        height: 0.1875rem;
        width: 1rem;
        background: #560319;
        border-radius: 0.1875rem;
      }
    }

    .tracker-circle {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      border: 0.0625rem solid #560319;
      background: #fff0f0;
      color: #560319;
      font-family: 'Caveat Brush', cursive;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.5s ease, border-color 0.5s ease, color 0.4s ease,
                  transform 0.35s cubic-bezier(.22,.68,0,1.4);
      pointer-events: none;
      user-select: none;
    }

    @media (min-width: 769px) {
      .tracker-circle {
        width: 2.6rem;
        height: 2.6rem;
        font-size: 1.5rem;
      }
    }

    /* Active (scroll-based highlight) */
    .tracker-dot.tracker-active .tracker-circle {
      transform: scale(1.28);
    }

    /* Done (completed exercise) */
    .tracker-dot.done .tracker-circle {
      transform: scale(1.08);
    }

    /* Active + done */
    .tracker-dot.tracker-active.done .tracker-circle {
      transform: scale(1.28);
    }

    /* Hover */
    .tracker-dot:hover .tracker-circle {
      opacity: 0.8;
    }

    @keyframes tracker-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.35); }
      70%  { transform: scale(1.0); }
      100% { transform: scale(1.08); }
    }
    .tracker-circle.tracker-fill-anim {
      animation: tracker-pop 0.55s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(style);

})();
