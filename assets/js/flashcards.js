/* ── Flashcards — English & Chill ── */
/* Reads every .flashcards-grid[data-words] and builds the card DOM.
   data-words format: "term:translation,term:translation,..."
   Each card flips on click (CSS 3D flip). */

(function () {

  function build(container) {
    var raw = container.getAttribute('data-words') || '';
    var pairs = raw.split(',');

    pairs.forEach(function (pair) {
      var idx = pair.indexOf(':');
      if (idx === -1) return;
      var front = pair.slice(0, idx).trim();
      var back  = pair.slice(idx + 1).trim();
      if (!front) return;

      var card  = document.createElement('div');
      card.className = 'flashcard';

      var inner = document.createElement('div');
      inner.className = 'flashcard-inner';

      var frontEl = document.createElement('div');
      frontEl.className = 'flashcard-front';
      frontEl.textContent = front;

      var backEl = document.createElement('div');
      backEl.className = 'flashcard-back';
      backEl.textContent = back;

      inner.appendChild(frontEl);
      inner.appendChild(backEl);
      card.appendChild(inner);

      card.addEventListener('click', function () {
        card.classList.toggle('flipped');
      });

      container.appendChild(card);
    });
  }

  function init() {
    document.querySelectorAll('.flashcards-grid').forEach(build);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
