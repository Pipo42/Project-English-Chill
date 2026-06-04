/* ── Nav + Back button generator ── */
(function () {

  /* Orden canónico y definición de todos los botones estándar */
  const NAV_CATALOG = [
    { key: 'vocabulary',    label: 'Vocabulary',     anchor: 'vocabulary',    exs: false },
    { key: 'vocabularyExs', label: 'Vocabulary EXS', anchor: 'vocabularyexs', exs: true  },
    { key: 'grammar',       label: 'Grammar',        anchor: 'grammar',       exs: false },
    { key: 'grammarExs',    label: 'Grammar EXS',    anchor: 'grammarexs',    exs: true  },
    { key: 'reading',       label: 'Reading',        anchor: 'reading',       exs: false },
    { key: 'readingExs',    label: 'Reading EXS',    anchor: 'readingexs',    exs: true  },
    { key: 'listening',     label: 'Listening',      anchor: 'listening',     exs: false },
    { key: 'listeningExs',  label: 'Listening EXS',  anchor: 'listeningexs',  exs: true  },
    { key: 'writing',       label: 'Writing',        anchor: 'writing',       exs: false },
    { key: 'writingExs',    label: 'Writing EXS',    anchor: 'writingexs',    exs: true  },
    { key: 'project',       label: 'Project',        anchor: 'project',       exs: false },
    { key: 'projectExs',    label: 'Project EXS',    anchor: 'projectexs',    exs: true  },
  ];

  function makeButton(def) {
    const a = document.createElement('a');
    if (def.exs) {
      a.href = '#' + def.anchor;
      a.className = 'fancy-button btn-exs';
      a.style.cssText = '--button-outline: var(--color-accent-3);';
    } else {
      a.href = '#' + def.anchor;
      a.className = 'fancy-button';
      a.style.cssText = '--button-outline: #000000; --button-color: var(--color-accent-1);';
    }
    a.innerHTML = `<span class="button_top"><span class="button-text">${def.label}</span></span>`;
    return a;
  }

  /* ── Back button ── */
  const backRow = document.querySelector('.back-row');
  if (backRow) {
    const backBtn = document.createElement('a');
    backBtn.href = typeof LC_BACK !== 'undefined' ? LC_BACK : '#';
    backBtn.className = 'fancy-button';
    backBtn.style.cssText = '--button-color: var(--color-accent-1); --button-outline: #000000;';
    backBtn.innerHTML = '<span class="button_top"><span class="button-text">←</span></span>';
    if (typeof LC_BACK === 'undefined') {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        history.back();
      });
    }
    backRow.appendChild(backBtn);
  }

  /* ── Nav buttons ── */
  const navContainer = document.querySelector('.nav-buttons');
  if (!navContainer || typeof LC_NAV === 'undefined') return;

  const requested = new Set(LC_NAV);
  const ordered = NAV_CATALOG.filter(def => requested.has(def.key));

  ordered.forEach(def => {
    const btn = makeButton(def);
    navContainer.appendChild(btn);
  });

})();
