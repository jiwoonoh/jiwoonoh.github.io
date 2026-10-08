/* A mouse click starts pixel sparkles and circles that pulse until the cursor moves. */
(() => {
  'use strict';

  // Johns Hopkins Heritage Blue and Spirit Blue.
  const colors = ['#002D72', '#68ACE5'];
  const sprites = {
    star: ['0001000', '0001000', '0011100', '1111111', '0011100', '0001000', '0001000'],
    smallStar: ['00100', '00100', '11111', '00100', '00100'],
    ring: ['01110', '10001', '10001', '10001', '01110'],
    circle: ['01110', '11111', '11111', '11111', '01110']
  };
  // Keep the shapes small and offset so the normal cursor remains easy to see.
  const layouts = [
    [[14, -13], [-13, 12], [-19, -12], [18, 17]],
    [[-17, -13], [15, 13], [17, -16], [-15, 21]],
    [[18, -8], [-17, 7], [-7, -21], [7, 22]]
  ];
  // Decorative variations on a double beat and a softer three-beat pattern.
  const rhythms = [
    { period: 1800, beats: [[250, 1, 90], [530, .75, 100]] },
    { period: 1400, beats: [[220, 1, 80], [420, .65, 90]] },
    { period: 2200, beats: [[240, 1, 90], [490, .7, 100], [820, .5, 120]] }
  ];
  let rhythmIndex = Math.floor(Math.random() * rhythms.length);
  let sparkles = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(any-pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-sparkles';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  document.body.appendChild(canvas);

  let frame = 0;
  let startedAt = null;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let pointer = { x: 0, y: 0 };

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    startedAt = null;
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
    if (startedAt === null) return;
    ctx.clearRect(0, 0, width, height);
    const age = now - startedAt;
    const rhythm = rhythms[rhythmIndex];
    const beatAge = age % rhythm.period;
    const fadeIn = Math.min(age / 100, 1);
    const pulse = rhythm.beats.reduce((value, [time, strength, spread]) =>
      value + strength * Math.exp(-Math.pow((beatAge - time) / spread, 2)), 0);
    // Pulse the brightness while keeping the shapes stationary.
    ctx.globalAlpha = Math.min(1, fadeIn * (.55 + pulse * .45));
    sparkles.forEach(drawSprite);
    frame = requestAnimationFrame(draw);
  }

  window.addEventListener('click', event => {
    clear();
    if (event.button !== 0 || event.detail === 0 || event.pointerType === 'touch'
        || reducedMotion.matches || !finePointer.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    // Pick a different rhythm on each click.
    rhythmIndex = (rhythmIndex + 1 + Math.floor(Math.random() * (rhythms.length - 1))) % rhythms.length;
    const layout = layouts[Math.floor(Math.random() * layouts.length)];
    sparkles = ['star', 'smallStar', 'ring', 'circle'].map((shape, i) => ({
      dx: layout[i][0], dy: layout[i][1], rows: sprites[shape],
      color: colors[i % colors.length]
    }));
    startedAt = performance.now();
    frame = requestAnimationFrame(draw);
  }, { passive: true });

  window.addEventListener('pointermove', clear, { passive: true });
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
