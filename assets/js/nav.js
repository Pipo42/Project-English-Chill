/* ── Nav + Back button generator ── */
(function () {

  /* Orden canónico y definición de todos los botones estándar */
  const NAV_CATALOG = [
    { key: 'vocabulary',    label: 'Vocabulary',     anchor: 'vocabulary',    exs: false },
    { key: 'vocabularyExs', label: 'Vocabulary Exam', anchor: 'vocabularyexs', exs: true  },
    { key: 'grammar',       label: 'Grammar',        anchor: 'grammar',       exs: false },
    { key: 'grammarExs',    label: 'Grammar Exam',   anchor: 'grammarexs',    exs: true  },
    { key: 'irregularVerbsExs', label: 'Irregular Verbs Exam', anchor: 'irregularverbsexs', exs: true },
    { key: 'extraPractice', label: 'LC1 Extra Practice', link: true },
    { key: 'reading',       label: 'Reading',        anchor: 'reading',       exs: false },
    { key: 'readingExs',    label: 'Reading Exam',   anchor: 'readingexs',    exs: true  },
    { key: 'listening',     label: 'Listening',      anchor: 'listening',     exs: false },
    { key: 'listeningExs',  label: 'Listening Exam', anchor: 'listeningexs',  exs: true  },
    { key: 'writing',       label: 'Writing',        anchor: 'writing',       exs: false },
    { key: 'writingExs',    label: 'Writing Exam',   anchor: 'writingexs',    exs: true  },
    { key: 'project',       label: 'Project',        anchor: 'project',       exs: false },
    { key: 'projectExs',    label: 'Project Exam',   anchor: 'projectexs',    exs: true  },
  ];

  function makeButton(def) {
    const a = document.createElement('a');
    if (def.link) {
      a.href = (typeof LC_EXTRA_PRACTICE_HREF !== 'undefined' && LC_EXTRA_PRACTICE_HREF) || 'lc1/extra-practice.html';
      a.className = 'fancy-button';
      a.style.cssText = '--button-outline: #000000; --button-color: var(--color-accent-1);';
    } else if (def.exs) {
      a.href = '#' + def.anchor;
      a.className = 'fancy-button btn-exs';
      a.style.cssText = '--button-outline: #000; --button-color: var(--color-accent-1);';
    } else {
      a.href = '#' + def.anchor;
      a.className = 'fancy-button';
      a.style.cssText = '--button-outline: #000000; --button-color: var(--color-accent-1);';
    }
    a.innerHTML = `<span class="button_top"><span class="button-text">${def.label}</span></span>`;
    return a;
  }

  /* ── Back button ──
     Por defecto, "back" es estructural: sube un nivel de carpeta en la URL
     actual y añade ".html" (quita el último segmento de path, y el
     penúltimo pasa de carpeta a archivo — ej. 2nd-eso/lc1.html → 2nd-eso.html),
     no depende del historial del navegador. Una página solo necesita
     definir LC_BACK a mano cuando su URL no sigue esa regla (ej.
     lc1/extra-practice.html, que cuelga de la carpeta de su LC padre en
     vez de estar un nivel por debajo de ella). */
  function defaultBackHref() {
    var segments = window.location.pathname.replace(/\/+$/, '').split('/');
    segments.pop(); /* quita el archivo actual */
    var parent = segments.pop(); /* carpeta contenedora (ej. "2nd-eso") */
    if (!parent) return '../index.html';
    return '../' + parent + '.html';
  }

  const backRow = document.querySelector('.back-row');
  if (backRow) {
    const backBtn = document.createElement('a');
    backBtn.href = typeof LC_BACK !== 'undefined' ? LC_BACK : defaultBackHref();
    backBtn.className = 'fancy-button';
    backBtn.style.cssText = '--button-color: var(--color-accent-1); --button-outline: #000000;';
    backBtn.innerHTML = '<span class="button_top"><span class="button-text">←</span></span>';
    backRow.appendChild(backBtn);
  }

  /* ── Nav buttons ── */
  const navContainer = document.querySelector('.nav-buttons');
  if (!navContainer || typeof LC_NAV === 'undefined') return;

  const requested = new Set(LC_NAV);
  const ordered = NAV_CATALOG.filter(def => requested.has(def.key));

  /* Keys que siempre van solas en su propia fila (nunca agrupadas ni junto a otro botón) */
  const SOLO_KEYS = new Set(['extraPractice', 'writing', 'project']);

  /* Group base + its Exs together in a .nav-group div */
  let i = 0;
  while (i < ordered.length) {
    const def = ordered[i];
    const next = ordered[i + 1];
    const hasExsPair = !def.link && next && next.exs && next.key === def.key + 'Exs';

    if (!def.exs && !def.link && hasExsPair && !SOLO_KEYS.has(def.key)) {
      const group = document.createElement('div');
      group.className = 'nav-group';
      group.appendChild(makeButton(def));
      group.appendChild(makeButton(next));
      navContainer.appendChild(group);
      i += 2;
    } else if (SOLO_KEYS.has(def.key)) {
      const solo = document.createElement('div');
      solo.className = 'nav-solo';
      solo.appendChild(makeButton(def));
      navContainer.appendChild(solo);
      i += 1;
    } else {
      navContainer.appendChild(makeButton(def));
      i += 1;
    }
  }

})();
