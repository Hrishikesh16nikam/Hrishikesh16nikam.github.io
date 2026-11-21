/* Matrix rain based on the original portfolio animation.
   Original visual behavior retained: 14px katakana/01, 50ms cadence,
   #00ff41 glyphs, and translucent 0.05 fade trails.
   Adds visibility, resize, pause, and reduced-motion handling. */
(() => {
  const canvas = document.getElementById('matrix-rain');
  const toggle = document.getElementById('matrix-toggle');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
  const fontSize = 14;
  const interval = 50; // unchanged cadence from original version
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width, height, drops = [];
  let enabled = !reducedMotion.matches;
  let raf = 0;
  let last = 0;

  function resize() {
    // Keep visual density and terminal glyph size consistent on mobile/desktop.
    width = Math.max(1, innerWidth);
    height = Math.max(1, innerHeight);
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drops = Array(Math.floor(width / fontSize)).fill(1);
    // In the original effect every character trail begins at the top.
    // Keeping this also creates the recognizable cascading visual.
    ctx.clearRect(0, 0, width, height);
    if (!enabled) drawFrame();
  }

  function drawFrame() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const character = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(character, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  function step(timestamp) {
    raf = 0;
    if (!enabled || document.hidden) return;
    if (!last) last = timestamp;
    if (timestamp - last >= interval) {
      drawFrame();
      last = timestamp;
    }
    raf = requestAnimationFrame(step);
  }

  function syncToggle() {
    if (!toggle) return;
    toggle.textContent = enabled ? '⏸ Pause rain' : '▶ Play rain';
    toggle.setAttribute('aria-pressed', String(!enabled));
    toggle.setAttribute('aria-label', enabled ? 'Pause Matrix background animation' : 'Play Matrix background animation');
  }
  function run(next) {
    enabled = next;
    syncToggle();
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (enabled && !document.hidden) raf = requestAnimationFrame(step);
  }
  toggle?.addEventListener('click', () => run(!enabled));
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', event => run(!event.matches));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
    else if (enabled && !raf) { last = 0; raf = requestAnimationFrame(step); }
  });
  window.addEventListener('resize', () => { resize(); last = 0; }, {passive:true});
  resize();
  syncToggle();
  if (enabled) raf = requestAnimationFrame(step);
})();
