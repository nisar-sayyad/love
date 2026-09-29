/**
 * ============================================================
 * AMBIENT PARTICLES — NISAR × LAHARI
 * Delicate floating champagne and rose gold starlight sparkles.
 * Optimized for buttery 60fps performance and low battery impact.
 * ============================================================
 */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 28 : 55;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const isGold = Math.random() > 0.45;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.5,
      color: isGold ? 'rgba(223, 183, 108,' : 'rgba(244, 220, 226,',
      alpha: Math.random() * 0.6 + 0.15,
      alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.4 + 0.15),
    };
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function updateAndDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaSpeed;

      if (p.alpha <= 0.1) {
        p.alpha = 0.1;
        p.alphaSpeed = -p.alphaSpeed;
      } else if (p.alpha >= 0.75) {
        p.alpha = 0.75;
        p.alphaSpeed = -p.alphaSpeed;
      }

      // Wrap around edges
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color + ' 0.5)';
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(updateAndDraw);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      updateAndDraw();
    }
  });

  initParticles();
  updateAndDraw();
})();
