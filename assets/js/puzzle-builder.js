/* ─────────────────────────────────────────────
   puzzle-builder.js  —  English & Chill
   Reutilizable: una instancia por llamada a PuzzleBuilder.init()
   ───────────────────────────────────────────── */

var PuzzleBuilder = (function () {

  /* ── Dimensiones globales de pieza ── */
  var W = 140, H = 110, TAB_R = 18, TAB_H = 22, CR = 0;

  /* ── Genera el path SVG de una pieza ── */
  function makePath(lt, rt) {
    var my = H / 2;
    var d = [];
    d.push('M ' + CR + ' 0');
    d.push('L ' + (W - CR) + ' 0');
    d.push('Q ' + W + ' 0 ' + W + ' ' + CR);
    if (rt === 'out') {
      d.push('L ' + W + ' ' + (my - TAB_H));
      d.push('C ' + W + ' ' + (my - TAB_H) + ' ' + (W + TAB_R) + ' ' + (my - TAB_H) + ' ' + (W + TAB_R) + ' ' + my);
      d.push('C ' + (W + TAB_R) + ' ' + (my + TAB_H) + ' ' + W + ' ' + (my + TAB_H) + ' ' + W + ' ' + (my + TAB_H));
    } else if (rt === 'in') {
      d.push('L ' + W + ' ' + (my - TAB_H));
      d.push('C ' + W + ' ' + (my - TAB_H) + ' ' + (W - TAB_R) + ' ' + (my - TAB_H) + ' ' + (W - TAB_R) + ' ' + my);
      d.push('C ' + (W - TAB_R) + ' ' + (my + TAB_H) + ' ' + W + ' ' + (my + TAB_H) + ' ' + W + ' ' + (my + TAB_H));
    }
    d.push('L ' + W + ' ' + (H - CR));
    d.push('Q ' + W + ' ' + H + ' ' + (W - CR) + ' ' + H);
    d.push('L ' + CR + ' ' + H);
    d.push('Q 0 ' + H + ' 0 ' + (H - CR));
    if (lt === 'out') {
      d.push('L 0 ' + (my + TAB_H));
      d.push('C 0 ' + (my + TAB_H) + ' ' + (-TAB_R) + ' ' + (my + TAB_H) + ' ' + (-TAB_R) + ' ' + my);
      d.push('C ' + (-TAB_R) + ' ' + (my - TAB_H) + ' 0 ' + (my - TAB_H) + ' 0 ' + (my - TAB_H));
    } else if (lt === 'in') {
      d.push('L 0 ' + (my + TAB_H));
      d.push('C 0 ' + (my + TAB_H) + ' ' + TAB_R + ' ' + (my + TAB_H) + ' ' + TAB_R + ' ' + my);
      d.push('C ' + TAB_R + ' ' + (my - TAB_H) + ' 0 ' + (my - TAB_H) + ' 0 ' + (my - TAB_H));
    }
    d.push('L 0 ' + CR);
    d.push('Q 0 0 ' + CR + ' 0');
    d.push('Z');
    return d.join(' ');
  }

  /* ── Crea el SVG de una pieza ── */
  function makeSVG(piece) {
    var extraL = piece.lt === 'out' ? TAB_R : 0;
    var extraR = piece.rt === 'out' ? TAB_R : 0;
    var svgW = W + extraL + extraR;
    var fid = 'f' + Math.random().toString(36).slice(2, 7);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgW);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', (-extraL) + ' 0 ' + svgW + ' ' + H);
    svg.style.display = 'block';
    svg.style.overflow = 'visible';

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = '<filter id="' + fid + '" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.12)"/></filter>';
    svg.appendChild(defs);

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('filter', 'url(#' + fid + ')');

    var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', makePath(piece.lt, piece.rt));
    pathEl.setAttribute('fill', 'transparent');
    pathEl.setAttribute('stroke', '#222');
    pathEl.classList.add('piece-path');
    pathEl.setAttribute('stroke-width', '1');
    pathEl.setAttribute('stroke-linejoin', 'round');
    pathEl.setAttribute('stroke-linecap', 'round');
    g.appendChild(pathEl);

    var cx = W / 2;

    var word = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    word.setAttribute('x', cx); word.setAttribute('y', H / 2 - 8);
    word.setAttribute('text-anchor', 'middle'); word.setAttribute('dominant-baseline', 'middle');
    word.setAttribute('fill', '#111'); word.setAttribute('font-family', "'Caveat Brush', cursive");
    word.setAttribute('font-size', '24');
    word.textContent = piece.word;
    g.appendChild(word);

    var lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', cx); lbl.setAttribute('y', H / 2 + 16);
    lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('dominant-baseline', 'middle');
    lbl.setAttribute('fill', '#555'); lbl.setAttribute('font-family', "'Manrope', sans-serif");
    lbl.setAttribute('font-size', '9'); lbl.setAttribute('font-weight', '700');
    lbl.setAttribute('letter-spacing', '1.2');
    lbl.textContent = piece.label.toUpperCase();
    g.appendChild(lbl);

    svg.appendChild(g);
    return svg;
  }

  /* ── Easing ── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ── Anima una pieza individual ── */
  function animatePiece(wrap, onImpact) {
    var startX = -window.innerWidth * 1.15;
    var startScale = 2.2;
    var T_FLY = 700, T_SQUASH = 100, T_BOUNCE = 120, T_SETTLE = 80;
    var start = null, impactFired = false;

    function frame(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var sx, sy, tx;

      if (elapsed < T_FLY) {
        var t = elapsed / T_FLY;
        var e = easeOutCubic(t);
        tx = startX * (1 - e);
        var sc = startScale - (startScale - 1.25) * e;
        wrap.style.transform = 'translateX(' + tx.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ',' + sc.toFixed(3) + ')';
      } else if (elapsed < T_FLY + T_SQUASH) {
        var t2 = (elapsed - T_FLY) / T_SQUASH;
        sx = 1.25 + t2 * 0.18;
        sy = 1.25 - t2 * 0.52;
        wrap.style.transform = 'translateX(0) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
        if (!impactFired) { impactFired = true; onImpact(); }
      } else if (elapsed < T_FLY + T_SQUASH + T_BOUNCE) {
        var t3 = (elapsed - T_FLY - T_SQUASH) / T_BOUNCE;
        var e3 = easeOutCubic(t3);
        sx = 1.43 - (1.43 - 0.96) * e3;
        sy = 0.73 + (0.73 - 1.08) * e3 * -1;
        wrap.style.transform = 'translateX(0) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
      } else if (elapsed < T_FLY + T_SQUASH + T_BOUNCE + T_SETTLE) {
        var t4 = (elapsed - T_FLY - T_SQUASH - T_BOUNCE) / T_SETTLE;
        var e4 = easeInOutCubic(t4);
        sx = 0.96 + (1 - 0.96) * e4;
        sy = 1.08 - (1.08 - 1) * e4;
        wrap.style.transform = 'translateX(0) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
      } else {
        wrap.style.transform = 'translateX(0) scale(1,1)';
        wrap.style.opacity = '1';
        return;
      }
      requestAnimationFrame(frame);
    }

    wrap.style.opacity = '1';
    wrap.style.transform = 'translateX(' + startX + 'px) scale(' + startScale + ',' + startScale + ')';
    requestAnimationFrame(frame);
  }

  /* ── Sacude el vecino izquierdo al impactar ── */
  function shakeNeighbor(wrap) {
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var t = (ts - start) / 320;
      if (t >= 1) { wrap.style.translate = '0 0'; return; }
      var amp = 7 * Math.pow(1 - t, 2);
      var dy = amp * Math.sin(t * Math.PI * 4);
      wrap.style.translate = '0 ' + dy.toFixed(2) + 'px';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── Construye el stage DOM ── */
  function buildStage(stageEl, pieces) {
    stageEl.innerHTML = '';
    pieces.forEach(function (p) {
      var wrap = document.createElement('div');
      wrap.className = 'puzzle-piece-wrap';
      wrap.style.setProperty('--piece-color', p.fill);
      wrap.appendChild(makeSVG(p));
      stageEl.appendChild(wrap);
    });
  }

  /* ── Lanza la animación completa ── */
  function playPuzzle(stageEl, exampleEl, exTextEl, pieces, example) {
    var wraps = Array.prototype.slice.call(stageEl.querySelectorAll('.puzzle-piece-wrap'));
    var gap = 420;

    wraps.forEach(function (w, i) {
      setTimeout(function () {
        var leftNeighbor = i > 0 ? wraps[i - 1] : null;
        animatePiece(w, function () {
          w.classList.add('landed');
          if (leftNeighbor) shakeNeighbor(leftNeighbor);
        });
      }, i * gap);
    });

    setTimeout(function () {
      if (exTextEl) exTextEl.textContent = example;
      if (exampleEl) exampleEl.classList.add('show');
    }, wraps.length * gap + 1200);
  }

  /* ────────────────────────────────────────────
     API pública
     PuzzleBuilder.init({
       sectionId : 'puzzle-affirmative',   ← el .puzzle-section que actúa de trigger
       stageId   : 'stage-affirmative',    ← el .puzzle-stage-inner
       exampleId : 'ex-affirmative',       ← el .puzzle-example (opcional)
       exTextId  : 'exText-affirmative',   ← el span del texto (opcional)
       pieces    : [...],
       example   : 'She has visited Paris twice.'
     });
  ──────────────────────────────────────────── */
  function init(cfg) {
    var sectionEl = document.getElementById(cfg.sectionId);
    var stageEl   = document.getElementById(cfg.stageId);
    var exampleEl = cfg.exampleId ? document.getElementById(cfg.exampleId) : null;
    var exTextEl  = cfg.exTextId  ? document.getElementById(cfg.exTextId)  : null;

    if (!stageEl) { console.warn('PuzzleBuilder: stageId "' + cfg.stageId + '" not found'); return; }

    buildStage(stageEl, cfg.pieces);

    var played = false;
    var trigger = sectionEl || stageEl;

    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !played) {
        played = true;
        playPuzzle(stageEl, exampleEl, exTextEl, cfg.pieces, cfg.example || '');
        obs.disconnect();
      }
    }, { threshold: 0.6 });

    obs.observe(trigger);
  }

  return { init: init };

})();
