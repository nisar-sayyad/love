(function () {
  'use strict';

  function initAtmosphere() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let stars = [];
  const STAR_COUNT = Math.min(180, Math.floor((width * height) / 8000));
  let shootingStars = [];
  let animId = null;
  let isPaused = false;

  // Palette: Soft white, warm celestial gold, pale rose
  const STAR_COLORS = ['#FFFFFF', '#FFF8E7', '#F9D976', '#F4C2C2', '#FFE4E1'];

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.72); // Keep stars above lower mountain base
      this.radius = Math.random() * 1.5 + 0.5;
      this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      this.alpha = Math.random() * 0.7 + 0.3;
      this.twinkleSpeed = (Math.random() * 0.02 + 0.008) * (Math.random() < 0.5 ? 1 : -1);
    }

    update() {
      this.alpha += this.twinkleSpeed;
      if (this.alpha > 0.95 || this.alpha < 0.2) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.radius > 1.2 ? 6 : 0;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.x = Math.random() * (width * 0.75);
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 80 + 50;
      this.speed = Math.random() * 9 + 7;
      this.angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1);
      this.opacity = 1;
      this.fading = false;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.022;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;
      
      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.8, '#F9D976');
      grad.addColorStop(1, '#FFFFFF');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Populate stars
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  // Periodic Shooting Star trigger
  let lastShootingStarTime = Date.now();
  let nextShootingStarDelay = 5000 + Math.random() * 4000;

  function render() {
    if (isPaused) return;

    ctx.clearRect(0, 0, width, height);

    // Update & draw background stars
    for (let star of stars) {
      star.update();
      star.draw();
    }

    // Handle Shooting Stars
    const now = Date.now();
    if (now - lastShootingStarTime > nextShootingStarDelay) {
      shootingStars.push(new ShootingStar());
      lastShootingStarTime = now;
      nextShootingStarDelay = 5000 + Math.random() * 5000;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.update();
      ss.draw();
      if (ss.opacity <= 0) {
        shootingStars.splice(i, 1);
      }
    }

    animId = requestAnimationFrame(render);
  }

  render();

  // Window Resize
  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < Math.min(180, Math.floor((width * height) / 8000)); i++) {
      stars.push(new Star());
    }
  }

  window.addEventListener('resize', handleResize);

  // Tab Visibility & Reduced Motion
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPaused = true;
      if (animId) cancelAnimationFrame(animId);
    } else {
      isPaused = false;
      lastShootingStarTime = Date.now();
      render();
    }
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    isPaused = true;
    if (animId) cancelAnimationFrame(animId);
    // Draw static stars once
    ctx.clearRect(0, 0, width, height);
    for (let star of stars) star.draw();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAtmosphere);
  } else {
    initAtmosphere();
  }
})();
