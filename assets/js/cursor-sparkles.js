/* Two pixel sparkles pulse beside a stationary mouse pointer. */
(() => {
  'use strict';

  // Johns Hopkins Heritage Blue and Spirit Blue.
  const sparkles = [
    {
      dx: 14, dy: -12, color: '#002D72',
      rows: ['0001000', '0001000', '0011100', '1111111', '0011100', '0001000', '0001000']
    },
    {
      dx: -12, dy: 11, color: '#68ACE5',
      rows: ['00100', '00100', '11111', '00100', '00100']
    }
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(any-pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-sparkles';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  document.body.appendChild(canvas);

  let frame = 0;
  let pauseTimer = 0;
  let settledAt = null;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let pointer = { x: 0, y: 0 };

  function clear() {
    clearTimeout(pauseTimer);
    pauseTimer = 0;
    cancelAnimationFrame(frame);
    frame = 0;
    settledAt = null;
    ctx.clearRect(0, 0, width, height);
  }

  function resize() {
    clear();
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function drawSprite(sparkle) {
    const rows = sparkle.rows;
    // Snap the squares to physical pixels to keep their edges crisp.
    const unit = Math.round(pixelRatio * 1.5) / pixelRatio;
    const x = Math.round((pointer.x + sparkle.dx - rows[0].length * unit / 2) * pixelRatio) / pixelRatio;
    const y = Math.round((pointer.y + sparkle.dy - rows.length * unit / 2) * pixelRatio) / pixelRatio;
    ctx.fillStyle = sparkle.color;
    rows.forEach((row, rowIndex) => {
      for (let column = 0; column < row.length; column++) {
        if (row[column] === '1') ctx.fillRect(x + column * unit, y + rowIndex * unit, unit, unit);
      }
    });
  }

  function draw(now) {
    frame = 0;
    if (settledAt === null) return;
    ctx.clearRect(0, 0, width, height);
    const age = now - settledAt;
    const beatAge = age % 1600;
    const fadeIn = Math.min(age / 100, 1);
    const pulse = Math.exp(-Math.pow((beatAge - 250) / 80, 2))
      + .75 * Math.exp(-Math.pow((beatAge - 510) / 90, 2));
    // Pulse the brightness while keeping the shapes stationary.
    ctx.globalAlpha = Math.min(1, fadeIn * (.65 + pulse * .35));
    sparkles.forEach(drawSprite);
    frame = requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', event => {
    clear();
    if (event.pointerType === 'touch' || reducedMotion.matches || !finePointer.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    pauseTimer = setTimeout(() => {
      pauseTimer = 0;
      settledAt = performance.now();
      frame = requestAnimationFrame(draw);
    }, 220);
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', clear, { passive: true });
  window.addEventListener('pointerdown', clear, { passive: true });
  window.addEventListener('blur', clear);
  window.addEventListener('beforeprint', clear);
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) clear(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  [reducedMotion, finePointer].forEach(query => query.addEventListener('change', clear));
  resize();
})();
