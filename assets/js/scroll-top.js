/* ── Scroll-to-top: drops + fragment shatter ── */
(function () {
  const btn    = document.getElementById('scroll-top');
  const header = document.querySelector('.site-header');
  const canvas = document.getElementById('drops-canvas');
  const ctx    = canvas.getContext('2d');
  let drops     = [];
  let fragments = [];
  let rafId     = null;
  let wasVisible = false;

<<<<<<< HEAD
<<<<<<< HEAD
  /* Canvas always covers the visual viewport, anchored top-left.
     getBoundingClientRect() returns coords in visual-viewport space,
     so they map directly onto canvas coords — no offset needed. */
  function resizeCanvas() {
    /* Don't resize while effects are active — it would shift already-drawn
       particles whose coords are fixed in the old canvas space. */
    if (drops.length > 0 || fragments.length > 0 || shatter) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas.style.top  = '0';
    canvas.style.left = '0';
  }
=======
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
=======
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resizeCanvas);
  }

<<<<<<< HEAD
<<<<<<< HEAD
  /* Returns btn rect in canvas coordinates.
     getBoundingClientRect() is relative to the layout viewport, which matches
     the canvas coordinate space — no offset correction needed. */
  function btnRect() {
    return btn.getBoundingClientRect();
  }

  /* Returns the resting position the button will occupy once visible,
     in canvas (visual-viewport) coordinates — used to spawn effects at
     the correct spot even when the button still has its entry transform. */
  function btnRestRect() {
    const rem    = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const margin = rem * 4;
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;

    /* On mobile, CSS `bottom` resolves against the visual viewport height,
       but the canvas origin (top:0) is the layout viewport top. We need
       canvas coords, so: canvasTop = vv.offsetTop + (vvH - margin - bh). */
    const vv  = window.visualViewport;
    const W   = vv ? vv.width  : window.innerWidth;
    const vvH = vv ? vv.height : window.innerHeight;
    const vvOffsetTop  = vv ? vv.offsetTop  : 0;
    const vvOffsetLeft = vv ? vv.offsetLeft : 0;

    let bLeft, bTop;
    if (isMobileTablet()) {
      bLeft = vvOffsetLeft + (W - bw) / 2;
      bTop  = vvOffsetTop + vvH - margin - bh;
    } else {
      bLeft = vvOffsetLeft + W - margin - bw;
      bTop  = vvOffsetTop + vvH - margin - bh;
    }
    return { left: bLeft, top: bTop, right: bLeft + bw, bottom: bTop + bh, width: bw, height: bh };
  }

=======
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
=======
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
  /* ── Unified loop ── */
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tickShatter();
    tickDrops();
    tickFragments();
    if (drops.length > 0 || fragments.length > 0 || shatter) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }
  function startLoop() { if (!rafId) rafId = requestAnimationFrame(tick); }

  /* ── DROPS ── */
<<<<<<< HEAD
  function spawnDrops(r) {
    r = r || btnRestRect();
=======
  function spawnDrops() {
    const r = btn.getBoundingClientRect();
<<<<<<< HEAD
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
=======
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
    const bx = r.left, by = r.top, bw = r.width, bh = r.height;
    const count = 28 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
      const side = Math.random();
      let ox, oy;
      if      (side < 0.35) { ox = bx + Math.random()*bw; oy = by; }
      else if (side < 0.55) { ox = bx; oy = by + Math.random()*bh; }
      else if (side < 0.75) { ox = bx + bw; oy = by + Math.random()*bh; }
      else                  { ox = bx + Math.random()*bw; oy = by + bh; }
      const cx = bx + bw/2, cy = by + bh/2;
      const base = Math.atan2(oy-cy, ox-cx);
      const angle = base*0.35 + (-Math.PI/2)*0.65 + (Math.random()-0.5)*0.8;
      const speed = 3.5 + Math.random()*4;
      drops.push({
        x: ox, y: oy,
        vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        baseR: 0.8 + Math.random()*2,
        wobblePhase: Math.random()*Math.PI*2,
        wobbleSpeed: 0.18 + Math.random()*0.22,
        wobbleAmp:   0.25 + Math.random()*0.35,
        phase: 'fly', peaked: false, restTimer: 0, fadeLife: 0,
        maxFade: 55 + Math.floor(Math.random()*35)
      });
    }
    startLoop();
  }

  function hexAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function drawDrop(d, alpha) {
    const spd = Math.sqrt(d.vx*d.vx + d.vy*d.vy);
    const N = 8;
    const rot = spd > 0.5 ? Math.atan2(d.vy, d.vx) : 0;
    const stretch = Math.min(spd*0.15, 0.8);
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const theta = (i/N)*Math.PI*2;
      const wob = d.phase === 'fly' ? Math.sin(d.wobblePhase*1.3 + i*1.1)*d.wobbleAmp : 0;
      const rx = d.baseR*(1 + stretch + (i%2===0 ? wob : -wob*0.5));
      const ry = d.baseR*(1 - stretch*0.5 + (i%2!==0 ? wob : -wob*0.4));
      const px = Math.cos(theta)*rx, py = Math.sin(theta)*ry;
      if (i === 0) { ctx.moveTo(px, py); }
      else {
        const pt = ((i-1)/N)*Math.PI*2;
        const pw = d.phase === 'fly' ? Math.sin(d.wobblePhase*1.3+(i-1)*1.1)*d.wobbleAmp : 0;
        const prx = d.baseR*(1+stretch+((i-1)%2===0?pw:-pw*0.5));
        const pry = d.baseR*(1-stretch*0.5+((i-1)%2!==0?pw:-pw*0.4));
        ctx.quadraticCurveTo(Math.cos(pt)*prx, Math.sin(pt)*pry, (Math.cos(pt)*prx+px)/2, (Math.sin(pt)*pry+py)/2);
      }
    }
    ctx.closePath();
    ctx.fillStyle = d.color ? hexAlpha(d.color, alpha) : `rgba(25,25,25,${alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function tickDrops() {
    for (const d of drops) {
      if (d.phase === 'fly') {
        d.vy += 0.38; d.vx *= 0.985;
        d.x += d.vx; d.y += d.vy;
        if (!d.peaked && d.vy > 0) d.peaked = true;
        if (d.peaked && d.vy > 1.8) { d.phase = 'rest'; d.restTimer = 0; }
        d.wobblePhase += d.wobbleSpeed;
        drawDrop(d, 1);
      } else if (d.phase === 'rest') {
        d.restTimer++;
        if (d.restTimer > 20) { d.phase = 'fade'; d.fadeLife = 0; }
        drawDrop(d, 1);
      } else {
        d.fadeLife++;
        drawDrop(d, Math.max(0, 1 - d.fadeLife/d.maxFade));
      }
    }
    drops = drops.filter(d => !(d.phase === 'fade' && d.fadeLife >= d.maxFade));
  }

  /* ── SHATTER ── */
  let shatter = null;

  function spawnShatter() {
    const r = btn.getBoundingClientRect();
    const bcx = r.left + r.width/2, bcy = r.top + r.height/2;
    const bw = r.width, bh = r.height;
    const blobPts = makeBlobPts(bcx, bcy, Math.max(bw, bh)*0.6, 12);
    shatter = { phase: 'grow', life: 0, growDur: 18, bcx, bcy, bw, bh, blobPts };
    startLoop();
  }

  function makeBlobPts(cx, cy, r, N) {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i/N)*Math.PI*2;
      const jr = r * (0.75 + Math.random()*0.5);
      pts.push([cx + Math.cos(a)*jr, cy + Math.sin(a)*jr]);
    }
    return pts;
  }

  function drawBlob(pts, alpha, scale, cx, cy) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i-1+n)%n], p1 = pts[i], p2 = pts[(i+1)%n];
      const cpx = (p1[0]+p2[0])/2, cpy = (p1[1]+p2[1])/2;
      if (i === 0) ctx.moveTo((p0[0]+p1[0])/2, (p0[1]+p1[1])/2);
      ctx.quadraticCurveTo(p1[0], p1[1], cpx, cpy);
    }
    ctx.closePath();
    ctx.fillStyle = '#191919';
    ctx.fill();
    ctx.restore();
  }

  function explodeIntoChunks(bcx, bcy, blobPts) {
    const n = blobPts.length;
    for (let i = 0; i < n; i++) {
      const next = (i+1)%n;
      const cx = (bcx + blobPts[i][0] + blobPts[next][0]) / 3;
      const cy = (bcy + blobPts[i][1] + blobPts[next][1]) / 3;
      const dx = cx - bcx, dy = cy - bcy;
      const dist = Math.sqrt(dx*dx+dy*dy)||1;
      const speed = 3 + Math.random()*4;
      const chunkR = 4 + Math.random()*8;
      const subPts = makeBlobPts(0, 0, chunkR, 7);
      fragments.push({
        pts: subPts, cx, cy, ox: 0, oy: 0,
        vx: (dx/dist)*speed, vy: (dy/dist)*speed - 1 - Math.random()*2,
        rotSpeed: (Math.random()-0.5)*0.12, angle: 0,
        wobblePhase: Math.random()*Math.PI*2,
        wobbleSpeed: 0.15 + Math.random()*0.15,
        alpha: 1, life: 0,
        maxLife: 40 + Math.floor(Math.random()*30),
        peaked: false
      });
    }
  }

  function tickShatter() {
    if (!shatter) return;
    shatter.life++;
    if (shatter.phase === 'grow') {
      const t = shatter.life / shatter.growDur;
      drawBlob(shatter.blobPts, Math.min(1, t*1.5), Math.min(1, 0.2 + t*0.8), shatter.bcx, shatter.bcy);
      if (shatter.life >= shatter.growDur) {
        shatter.phase = 'explode';
        btn.style.transition = 'none';
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
        btn.classList.remove('visible');
        explodeIntoChunks(shatter.bcx, shatter.bcy, shatter.blobPts);
        shatter = null;
      }
    }
  }

  function tickFragments() {
    for (const f of fragments) {
      f.life++;
      f.vy += 0.2; f.vx *= 0.97;
      f.ox += f.vx; f.oy += f.vy;
      f.angle += f.rotSpeed;
      f.wobblePhase += f.wobbleSpeed;
      f.alpha = Math.max(0, 1 - f.life/f.maxLife);
      const wPts = f.pts.map(([px,py], i) => {
        const w = Math.sin(f.wobblePhase + i*0.9) * 0.25;
        return [px*(1+w), py*(1+w)];
      });
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.translate(f.cx + f.ox, f.cy + f.oy);
      ctx.rotate(f.angle);
      ctx.beginPath();
      const n = wPts.length;
      for (let i = 0; i < n; i++) {
        const p1 = wPts[i], p2 = wPts[(i+1)%n];
        const cpx = (p1[0]+p2[0])/2, cpy = (p1[1]+p2[1])/2;
        if (i === 0) ctx.moveTo((wPts[(n-1)%n][0]+p1[0])/2, (wPts[(n-1)%n][1]+p1[1])/2);
        ctx.quadraticCurveTo(p1[0], p1[1], cpx, cpy);
      }
      ctx.closePath();
      ctx.fillStyle = '#191919';
      ctx.fill();
      ctx.restore();
    }
    fragments = fragments.filter(f => f.alpha > 0);
  }

<<<<<<< HEAD
<<<<<<< HEAD
  /* ── Keep btn pinned to visual viewport (bottom-right on desktop, bottom-center on mobile/tablet) ── */
  function isMobileTablet() { return window.innerWidth <= 1024; }

  function anchorBtn() {
    if (!wasVisible) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const margin = rem * 4;
    if (isMobileTablet()) {
      /* On mobile, don't recalculate bottom on every scroll event — it causes
         the button to jump when the browser chrome appears/disappears.
         Just keep it at a fixed bottom; CSS `position:fixed` already anchors
         it to the visual viewport on iOS/Android. */
      btn.style.bottom = margin + 'px';
      btn.style.top    = '';
      btn.style.right  = '';
      btn.style.left   = '50%';
    } else {
      btn.style.top    = '';
      btn.style.left   = '';
      btn.style.bottom = (window.innerHeight - vv.offsetTop - vv.height + margin) + 'px';
      btn.style.right  = (window.innerWidth - vv.offsetLeft - vv.width + margin) + 'px';
    }
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', anchorBtn);
    window.visualViewport.addEventListener('scroll', anchorBtn);
  }

=======
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
=======
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
  /* ── Observer ── */
  const observer = new IntersectionObserver(function (entries) {
    const visible = entries[0].isIntersecting;
    if (!visible) {
      btn.style.transition = '';
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
      btn.classList.add('visible');
      if (!wasVisible) spawnDrops();
      wasVisible = true;
<<<<<<< HEAD
<<<<<<< HEAD
      anchorBtn();
      /* Place btn at start position (below), then animate to visible */
      btn.style.transition = 'none';
      btn.style.opacity = '0';
      const isMobile = isMobileTablet();
      btn.style.transform = isMobile ? 'translateX(-50%) translateY(80px)' : 'translateY(80px)';
      btn.classList.remove('visible');
      void btn.getBoundingClientRect(); /* trigger reflow */
      spawnDrops(btnRestRect());
      /* Re-enable transition and animate to final position */
      requestAnimationFrame(() => {
        btn.style.transition = '';
        btn.style.opacity = '';
        btn.style.transform = '';
        btn.classList.add('visible');
      });
      btn.style.pointerEvents = 'auto';
    } else {
      if (wasVisible) {
        /* Read position before hiding */
        const rect = btnRestRect();
        btn.style.transition = 'none';
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
        btn.classList.remove('visible');
        spawnShatter(rect);
        setTimeout(() => {
          btn.style.transition = '';
          btn.style.opacity = '';
          btn.style.pointerEvents = '';
          btn.style.bottom = '';
          btn.style.right  = '';
          btn.style.left   = '';
        }, 50);
=======
    } else {
      if (wasVisible) {
        spawnShatter();
        setTimeout(() => { btn.style.transition = ''; btn.style.opacity = ''; }, 50);
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
=======
    } else {
      if (wasVisible) {
        spawnShatter();
        setTimeout(() => { btn.style.transition = ''; btn.style.opacity = ''; }, 50);
>>>>>>> parent of 9482cb9 (fix(up button in phone), perf(fill gaps))
      }
      wasVisible = false;
    }
  }, { threshold: 0 });
  observer.observe(header);

  /* expose for button drops */
  window._spawnScrollDrops = spawnDrops;
  window._scrollDropsList  = drops;
  window._scrollStartLoop  = startLoop;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
