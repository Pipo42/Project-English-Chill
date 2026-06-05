/* ── Custom quill cursor ── */
(function () {
  const scripts = document.querySelectorAll('script[src]');
  let base = '';
  scripts.forEach(s => {
    if (s.src.includes('cursor.js')) {
      base = s.src.replace('assets/js/cursor.js', '');
    }
  });
  const url = base + 'assets/images/quill-cursor.png';

  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      cursor: url("${url}") 4 53, auto !important;
    }
    input[type="text"], textarea {
      cursor: url("${url}") 4 53, text !important;
    }
    #custom-scrollbar-thumb,
    #custom-scrollbar-thumb:hover,
    #custom-scrollbar-thumb:active {
      cursor: url("${url}") 4 53, auto !important;
    }
    #ink-canvas {
      position: fixed; inset: 0;
      pointer-events: none;
      z-index: 99999;
    }
  `;
  document.head.appendChild(style);

  /* ── Ink splatter on click ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'ink-canvas';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(canvas));

  const ctx = canvas.getContext('2d');
  let drops = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnInk(x, y) {
    const count = 5 + Math.floor(Math.random() * 4); // 5–8 drops
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 1.1 + Math.random() * 2.2;
      drops.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r:  0.9 + Math.random() * 1.6,
        alpha: 0.82 + Math.random() * 0.15,
        decay: 0.021 + Math.random() * 0.019,
        gravity: 0.15 + Math.random() * 0.10,
      });
    }
    if (!rafRunning) raf();
  }

  document.addEventListener('mousedown',   (e) => spawnInk(e.clientX, e.clientY));
  document.addEventListener('contextmenu', (e) => spawnInk(e.clientX, e.clientY));

  let rafRunning = false;
  function raf() {
    rafRunning = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops = drops.filter(d => d.alpha > 0.01);
    drops.forEach(d => {
      d.vy += d.gravity;
      d.x  += d.vx;
      d.y  += d.vy;
      d.alpha -= d.decay;

      ctx.beginPath();
      // Elongate drop slightly in direction of travel
      const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      const stretch = Math.min(2.5, 1 + speed * 0.15);
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(Math.atan2(d.vy, d.vx));
      ctx.scale(stretch, 1);
      ctx.arc(0, 0, d.r, 0, Math.PI * 2);
      ctx.restore();
      ctx.fillStyle = `rgba(30, 20, 10, ${d.alpha})`;
      ctx.fill();
    });

    if (drops.length > 0) {
      requestAnimationFrame(raf);
    } else {
      rafRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
})();
