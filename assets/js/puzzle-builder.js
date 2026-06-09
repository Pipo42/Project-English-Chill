/* ─────────────────────────────────────────────
   puzzle-builder.js  —  English & Chill
   Reutilizable: una instancia por llamada a PuzzleBuilder.init()
   ───────────────────────────────────────────── */

var PuzzleBuilder = (function () {

  /* ── Dimensiones base de pieza (desktop) ── */
  var W_BASE = 140, H_BASE = 110, TAB_R_BASE = 18, TAB_H_BASE = 22, CR = 18;
  var FONT_WORD_BASE = 24, FONT_LBL_BASE = 9;
  /* ── Dimensiones activas (se recalculan según viewport) ── */
  var W = W_BASE, H = H_BASE, TAB_R = TAB_R_BASE, TAB_H = TAB_H_BASE;
  var FONT_WORD = FONT_WORD_BASE, FONT_LBL = FONT_LBL_BASE;

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
    var SHADOW_DY = 6;
    svg.setAttribute('width', svgW);
    svg.setAttribute('height', H + SHADOW_DY);
    svg.setAttribute('viewBox', (-extraL) + ' 0 ' + svgW + ' ' + (H + SHADOW_DY));
    svg.style.display = 'block';
    svg.style.overflow = 'visible';

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    /* clipPath que solo deja ver la sombra por debajo del path original */
    var clipId = 'c' + fid;
    defs.innerHTML = '<clipPath id="' + clipId + '">' +
      '<rect x="' + (-extraL - 10) + '" y="' + (H / 2) + '" width="' + (svgW + 20) + '" height="' + (H / 2 + SHADOW_DY + 10) + '"/>' +
      '</clipPath>';
    svg.appendChild(defs);

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    /* capa inferior: sombra sólida negra, visible solo en la mitad inferior */
    var shadowEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadowEl.setAttribute('d', makePath(piece.lt, piece.rt));
    shadowEl.setAttribute('fill', '#222');
    shadowEl.setAttribute('stroke', '#222');
    shadowEl.setAttribute('stroke-width', '1.5');
    shadowEl.setAttribute('transform', 'translate(0,' + SHADOW_DY + ')');
    shadowEl.setAttribute('clip-path', 'url(#' + clipId + ')');
    g.appendChild(shadowEl);

    /* capa superior: fondo del color de página + borde del color de énfasis */
    var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', makePath(piece.lt, piece.rt));
    pathEl.setAttribute('fill', getComputedStyle(document.body).backgroundColor || '#99aebb');
    pathEl.setAttribute('stroke', '#222');
    pathEl.classList.add('piece-path');
    pathEl.setAttribute('stroke-width', '1.5');
    pathEl.setAttribute('stroke-linejoin', 'round');
    pathEl.setAttribute('stroke-linecap', 'round');
    g.appendChild(pathEl);

    var cx = W / 2;

    var word = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    word.setAttribute('x', cx); word.setAttribute('y', H / 2 - 8);
    word.setAttribute('text-anchor', 'middle'); word.setAttribute('dominant-baseline', 'middle');
    word.setAttribute('fill', '#111'); word.setAttribute('font-family', "'Caveat Brush', cursive");
    word.setAttribute('font-size', FONT_WORD);
    word.textContent = piece.word;
    g.appendChild(word);

    var lblY = H / 2 + 16;
    var lblText = piece.label.toUpperCase();
    var lblFontSize = FONT_LBL;
    /* estima ancho del texto para el rect de fondo */
    var lblW = lblText.length * lblFontSize * 0.62 + 16;
    var lblH = lblFontSize + 10;
    var lblRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    lblRect.setAttribute('x', cx - lblW / 2);
    lblRect.setAttribute('y', lblY - lblH / 2);
    lblRect.setAttribute('width', lblW);
    lblRect.setAttribute('height', lblH);
    lblRect.setAttribute('rx', lblH / 2);
    lblRect.setAttribute('ry', lblH / 2);
    lblRect.setAttribute('fill', piece.fill);
    g.appendChild(lblRect);

    var lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', cx); lbl.setAttribute('y', lblY);
    lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('dominant-baseline', 'middle');
    lbl.setAttribute('fill', '#111'); lbl.setAttribute('font-family', "'Manrope', sans-serif");
    lbl.setAttribute('font-size', lblFontSize); lbl.setAttribute('font-weight', '700');
    lbl.setAttribute('letter-spacing', '1.2');
    lbl.textContent = lblText;
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

  /* ── SVG de flecha simple hacia arriba ── */
  function makeArrowUp(color) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', '24'); s.setAttribute('height', '28');
    s.setAttribute('viewBox', '0 0 24 28');
    s.style.cssText = 'display:block;margin:0 auto;';
    s.innerHTML = '<line x1="12" y1="28" x2="12" y2="8" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<polyline points="5,14 12,6 19,14" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    return s;
  }

  /* ── Media flecha curva: 'right' sale de izq hacia der, 'left' al revés ── */
  function makeSwapArrowHalf(dir, color) {
    var w = 60, h = 34;
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', w); s.setAttribute('height', h);
    s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    s.style.cssText = 'display:block;overflow:visible;';
    if (dir === 'right') {
      /* arco de izq a der por arriba, punta en la derecha */
      s.innerHTML = '<path d="M 4 28 Q 30 4 56 28" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<polyline points="49,22 57,29 50,34" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    } else {
      /* arco de der a izq por arriba, punta en la izquierda */
      s.innerHTML = '<path d="M 56 28 Q 30 4 4 28" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<polyline points="11,22 3,29 10,34" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    return s;
  }

  /* ── Construye el stage DOM ── */
  function buildStage(stageEl, pieces, cfg) {
    stageEl.style.setProperty('--puzzle-overlap', '-' + TAB_R + 'px');
    stageEl.innerHTML = '';
    pieces.forEach(function (p, i) {
      var wrap = document.createElement('div');
      wrap.className = 'puzzle-piece-wrap';
      wrap.style.setProperty('--piece-color', p.fill);
      wrap.style.position = 'relative';

      wrap.appendChild(makeSVG(p));

      /* flecha hacia arriba bajo la pieza (negativo) */
      if (cfg.arrowBelow !== undefined && cfg.arrowBelow === i) {
        var extraLa = p.lt === 'out' ? TAB_R : 0;
        var visualCX = extraLa + W / 2;
        var arrowWrap = document.createElement('div');
        arrowWrap.style.cssText = 'position:absolute;bottom:-34px;left:' + visualCX + 'px;transform:translateX(-50%);';
        arrowWrap.appendChild(makeArrowUp(p.fill));
        wrap.appendChild(arrowWrap);
      }

      /* flechas de swap (pregunta): flecha superior en pieza A, inferior en pieza B */
      if (cfg.swapArrows !== undefined) {
        var idxA = cfg.swapArrows[0], idxB = cfg.swapArrows[1];
        var extraLs = p.lt === 'out' ? TAB_R : 0;
        var vcx = extraLs + W / 2;
        if (i === idxA || i === idxB) {
          var isA = (i === idxA);
          var spanW = W - TAB_R;
          var color = isA ? pieces[idxA].fill : pieces[idxB].fill;
          var sw = spanW + 8, sh = 36, ah = 8; /* ah = longitud de la punta */
          var sv = document.createElementNS('http://www.w3.org/2000/svg','svg');
          sv.setAttribute('width', sw); sv.setAttribute('height', sh);
          sv.setAttribute('viewBox','0 0 '+sw+' '+sh);
          sv.style.cssText = 'display:block;overflow:visible;';

          /* Bézier cuadrática: P0, control, P1 */
          var x0, y0, cpx, cpy, x1, y1;
          if (isA) {
            /* arco superior: izq→der, curva hacia arriba */
            x0=4; y0=sh-4; cpx=sw/2; cpy=2; x1=sw-4; y1=sh-4;
          } else {
            /* arco inferior: der→izq, curva hacia abajo */
            x0=sw-4; y0=4; cpx=sw/2; cpy=sh-2; x1=4; y1=4;
          }

          /* tangente en P1 = P1 - control (normalizada) */
          var tx = x1 - cpx, ty = y1 - cpy;
          var tlen = Math.sqrt(tx*tx + ty*ty);
          tx = tx/tlen * ah; ty = ty/tlen * ah;

          /* puntos de la punta: P1 ± perpendicular */
          var px = -ty/ah * (ah*0.5), py = tx/ah * (ah*0.5);
          var p1x = (x1 - tx + px).toFixed(1), p1y = (y1 - ty + py).toFixed(1);
          var p2x = (x1 - tx - px).toFixed(1), p2y = (y1 - ty - py).toFixed(1);

          sv.innerHTML =
            '<path d="M '+x0+' '+y0+' Q '+cpx+' '+cpy+' '+x1+' '+y1+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round"/>' +
            '<polyline points="'+p1x+','+p1y+' '+x1+','+y1+' '+p2x+','+p2y+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';

          var ac = document.createElement('div');
          if (isA) {
            ac.style.cssText = 'position:absolute;top:-'+(sh+4)+'px;left:'+vcx+'px;transform:translateX(-4px);pointer-events:none;overflow:visible;';
          } else {
            ac.style.cssText = 'position:absolute;bottom:-'+(sh+4)+'px;left:'+(vcx-sw+4)+'px;pointer-events:none;overflow:visible;';
          }
          ac.appendChild(sv);
          wrap.appendChild(ac);
        }
      }

      stageEl.appendChild(wrap);
    });

  }

  /* ── Posiciona las flechas swap una vez las piezas están en su sitio ── */

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

    /* ── Calcula dimensiones según viewport ── */
    function calcDimensions() {
      var container = sectionEl || stageEl.parentElement;
      var available = container.clientWidth - 12;
      var n = cfg.pieces.length;
      var naturalW = (W_BASE - TAB_R_BASE) * n + TAB_R_BASE * 2;
      if (naturalW > available) {
        var ratio = available / naturalW;
        W     = Math.floor(W_BASE     * ratio);
        H     = Math.floor(H_BASE     * ratio);
        TAB_R = Math.floor(TAB_R_BASE * ratio);
        TAB_H = Math.floor(TAB_H_BASE * ratio);
        FONT_WORD = Math.floor(FONT_WORD_BASE * ratio);
        FONT_LBL  = Math.max(6, Math.floor(FONT_LBL_BASE * ratio));
      } else {
        W = W_BASE; H = H_BASE; TAB_R = TAB_R_BASE; TAB_H = TAB_H_BASE;
        FONT_WORD = FONT_WORD_BASE; FONT_LBL = FONT_LBL_BASE;
      }
    }

    /* ── Reconstruye y si ya se animó, muestra piezas en estado final ── */
    function rebuild() {
      calcDimensions();
      buildStage(stageEl, cfg.pieces, cfg);
      if (played) {
        var wraps = stageEl.querySelectorAll('.puzzle-piece-wrap');
        wraps.forEach(function (w) {
          w.style.opacity = '1';
          w.style.transform = 'translateX(0) scale(1,1)';
          w.classList.add('landed');
        });
      }
    }

    var played = false;

    rebuild();
    window.addEventListener('resize', function () { rebuild(); });
    var trigger = sectionEl || stageEl;

    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !played) {
        played = true;
        playPuzzle(stageEl, exampleEl, exTextEl, cfg.pieces, cfg.example || '');
        obs.disconnect();
      }
    }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });

    obs.observe(trigger);
  }

  return { init: init };

})();
