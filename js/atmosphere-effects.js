/**
 * ==========================================================================
 * LUXURY ATMOSPHERE EFFECTS ENGINE
 * - Celestial Meteor Shower (Toot-te Taare — Pure Cinematic Starlight)
 * - Celestial Golden Sparklers & Fireworks (Celebrating Nisar & Lahari)
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- 1. LUXURY TOAST NOTIFICATION ---
  let toastTimer = null;
  function showAtmosToast(msg) {
    const toast = document.getElementById('atmos-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  // --- 2. CELESTIAL METEOR SHOWER ENGINE ---
  const meteorCanvas = document.getElementById('atmosphere-meteors-canvas');
  let meteorCtx = null;
  let meteors = [];
  let meteorEmbers = [];
  let meteorAnimId = null;

  class ShootingMeteor {
    constructor(w, h, isGrand = false) {
      this.w = w;
      this.h = h;
      this.isGrand = isGrand;
      this.reset();
    }

    reset() {
      this.x = Math.random() * (this.w * 0.95);
      this.y = -50 - Math.random() * 60;
      this.length = this.isGrand ? (Math.random() * 80 + 190) : (Math.random() * 60 + 110);
      this.speed = this.isGrand ? (Math.random() * 6 + 22) : (Math.random() * 8 + 18);
      this.angle = (Math.PI / 4) + (Math.random() * 0.18 - 0.09); // ~45 deg diagonal
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.opacity = 1;
      this.lineWidth = this.isGrand ? 2.8 : 1.8;
      this.alive = true;
      this.traveled = 0;
      this.maxDistance = Math.min(this.w, this.h) * (Math.random() * 0.45 + 0.85);

      // Color scheme: Brilliant starlight white to warm champagne gold
      const hues = [
        { head: '#FFFFFF', mid: '#F9D976', tail: 'rgba(249, 217, 118, 0)' },
        { head: '#FFFFFF', mid: '#FFE4E6', tail: 'rgba(255, 182, 193, 0)' },
        { head: '#FFFDE7', mid: '#FFD700', tail: 'rgba(255, 215, 0, 0)' }
      ];
      this.palette = hues[Math.floor(Math.random() * hues.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.traveled += this.speed;

      // Spawn drifting stardust embers along the path
      if (Math.random() < (this.isGrand ? 0.75 : 0.45)) {
        meteorEmbers.push(new MeteorEmber(
          this.x - Math.cos(this.angle) * (Math.random() * 30),
          this.y - Math.sin(this.angle) * (Math.random() * 30),
          this.palette.mid
        ));
      }

      // Smooth fade out as it nears end of flight
      if (this.traveled > this.maxDistance * 0.65) {
        this.opacity -= 0.038;
      }

      if (this.opacity <= 0 || this.x > this.w + 100 || this.y > this.h + 100) {
        this.alive = false;
      }
    }

    draw(ctx) {
      if (!this.alive || this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, this.palette.tail);
      grad.addColorStop(0.7, this.palette.mid);
      grad.addColorStop(1, this.palette.head);

      ctx.strokeStyle = grad;
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Glowing star head halo
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = this.palette.mid;
      ctx.shadowBlur = this.isGrand ? 16 : 9;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.lineWidth * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  class MeteorEmber {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = Math.random() * 1.2 + 0.4;
      this.size = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.6;
      this.decay = Math.random() * 0.025 + 0.02;
      this.alive = true;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      if (this.alpha <= 0) {
        this.alive = false;
      }
    }

    draw(ctx) {
      if (!this.alive || this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function resizeMeteorCanvas() {
    if (!meteorCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    meteorCanvas.width = window.innerWidth * dpr;
    meteorCanvas.height = window.innerHeight * dpr;
    if (meteorCtx) meteorCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function animateMeteors() {
    if (!meteorCtx) return;
    meteorCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;

    // Update & draw meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      if (m.alive) {
        m.update();
        m.draw(meteorCtx);
        activeCount++;
      } else {
        meteors.splice(i, 1);
      }
    }

    // Update & draw embers
    for (let i = meteorEmbers.length - 1; i >= 0; i--) {
      const e = meteorEmbers[i];
      if (e.alive) {
        e.update();
        e.draw(meteorCtx);
        activeCount++;
      } else {
        meteorEmbers.splice(i, 1);
      }
    }

    if (activeCount > 0) {
      meteorAnimId = requestAnimationFrame(animateMeteors);
    } else {
      meteorAnimId = null;
      meteors = [];
      meteorEmbers = [];
      meteorCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function launchMeteorShower() {
    if (!meteorCanvas) return;
    if (!meteorCtx) {
      meteorCtx = meteorCanvas.getContext('2d');
    }
    resizeMeteorCanvas();

    const w = window.innerWidth;
    const h = window.innerHeight;
    const totalMeteors = 12; // A magnificent wave of 12 shooting stars

    // Stagger meteors over ~3.0 seconds for cinematic cosmic realism
    for (let i = 0; i < totalMeteors; i++) {
      const isGrand = (i === 3 || i === 7 || i === 11); // 3 brilliant prominent meteors
      setTimeout(() => {
        meteors.push(new ShootingMeteor(w, h, isGrand));
        if (!meteorAnimId) {
          meteorAnimId = requestAnimationFrame(animateMeteors);
        }
      }, i * 220 + Math.random() * 90);
    }

    showAtmosToast('🌠 Celestial Meteor Shower');
  }


  // --- 3. CELESTIAL GOLDEN SPARKLERS & FIREWORKS ENGINE ---
  const sparklerCanvas = document.getElementById('atmosphere-sparklers-canvas');
  let sparklerCtx = null;
  let sparklerRockets = [];
  let sparklerParticles = [];
  let sparklerAnimId = null;

  const SPARKLER_PALETTES = [
    // 1. Royal Celestial Gold
    ['#FFFFFF', '#FFF6D6', '#FFD700', '#FFB830', '#FFA000'],
    // 2. Romantic Rose Gold & Champagne
    ['#FFFFFF', '#FFE4E6', '#FFB6C1', '#F4978E', '#FFDF73'],
    // 3. Stardust Diamond Shimmer
    ['#FFFFFF', '#E0F2FE', '#BAE6FD', '#FDE047', '#FFFBEB']
  ];

  class SparklerRocket {
    constructor(w, h, config = {}) {
      this.w = w;
      this.h = h;
      let startX, targetY, angleOffset, speed, palette;
      if (typeof config === 'object' && config !== null) {
        startX = config.startX;
        targetY = config.targetY;
        angleOffset = config.angleOffset;
        speed = config.speed;
        palette = config.palette;
      } else {
        startX = config;
        targetY = arguments[3];
        palette = arguments[4];
      }

      this.x = typeof startX === 'number' ? startX : (Math.random() * (w * 0.7) + w * 0.15);
      this.y = h + 15;
      this.targetY = typeof targetY === 'number' ? targetY : (Math.random() * (h * 0.26) + h * 0.16);

      // Trajectory angle: (-Math.PI / 2) is straight up.
      // angleOffset tilts it: negative = left slant, positive = right slant
      const offset = typeof angleOffset === 'number'
        ? angleOffset
        : ((Math.random() - 0.5) * 0.5); // ~ +/- 15 degrees natural variance
      const angle = (-Math.PI / 2) + offset;

      const launchSpeed = speed || (Math.random() * 3.5 + 14.5);
      this.vx = Math.cos(angle) * launchSpeed;
      this.vy = Math.sin(angle) * launchSpeed;

      this.palette = palette || SPARKLER_PALETTES[Math.floor(Math.random() * SPARKLER_PALETTES.length)];
      this.trail = [];
      this.alive = true;
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.95, size: Math.random() * 2.2 + 1.2 });
      if (this.trail.length > 14) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.21; // gravity slows ascent

      // Decay trail alpha
      for (let i = 0; i < this.trail.length; i++) {
        this.trail[i].alpha *= 0.86;
      }

      // Reached peak or passed target height
      if (this.vy >= -1.0 || this.y <= this.targetY) {
        this.alive = false;
        this.explode();
      }
    }

    explode() {
      const count = Math.floor(Math.random() * 25) + 60; // 60-85 golden sparks
      for (let i = 0; i < count; i++) {
        sparklerParticles.push(new SparklerParticle(this.x, this.y, this.palette));
      }
    }

    draw(ctx) {
      if (!this.alive) return;
      ctx.save();
      // Draw shimmering rocket tail
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        ctx.fillStyle = this.palette[2];
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rocket head glow
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = this.palette[1] || '#FFD700';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class SparklerParticle {
    constructor(x, y, palette) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 1.2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.palette = palette;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.size = Math.random() * 2.2 + 1.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.012;
      this.gravity = 0.085;
      this.drag = 0.965;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.alive = true;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.drag;
      this.vy = this.vy * this.drag + this.gravity;
      this.alpha -= this.decay;
      this.twinklePhase += 0.25;

      if (this.alpha <= 0) {
        this.alive = false;
      }
    }

    draw(ctx) {
      if (!this.alive || this.alpha <= 0) return;
      ctx.save();
      const twinkle = Math.sin(this.twinklePhase) * 0.35 + 0.65;
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha * twinkle));
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size > 2 ? 8 : 4;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function resizeSparklerCanvas() {
    if (!sparklerCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sparklerCanvas.width = window.innerWidth * dpr;
    sparklerCanvas.height = window.innerHeight * dpr;
    if (sparklerCtx) sparklerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function animateSparklers() {
    if (!sparklerCtx) return;
    sparklerCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;

    // Update & draw rockets
    for (let i = sparklerRockets.length - 1; i >= 0; i--) {
      const r = sparklerRockets[i];
      if (r.alive) {
        r.update();
        r.draw(sparklerCtx);
        activeCount++;
      } else {
        sparklerRockets.splice(i, 1);
      }
    }

    // Update & draw particles
    for (let i = sparklerParticles.length - 1; i >= 0; i--) {
      const p = sparklerParticles[i];
      if (p.alive) {
        p.update();
        p.draw(sparklerCtx);
        activeCount++;
      } else {
        sparklerParticles.splice(i, 1);
      }
    }

    if (activeCount > 0) {
      sparklerAnimId = requestAnimationFrame(animateSparklers);
    } else {
      sparklerAnimId = null;
      sparklerRockets = [];
      sparklerParticles = [];
      sparklerCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function launchGoldenSparklers() {
    if (!sparklerCanvas) return;
    if (!sparklerCtx) {
      sparklerCtx = sparklerCanvas.getContext('2d');
    }
    resizeSparklerCanvas();

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 8 Fireworks rockets with dynamic, randomized angles & launch sites on EVERY click
    // Angle offset: negative = slants left, positive = slants right
    const rocketConfigs = [
      // 1. Left launch, angled inward towards center-right
      {
        startX: w * (0.12 + Math.random() * 0.10),
        targetY: h * (0.18 + Math.random() * 0.10),
        angleOffset: (Math.random() * 0.18 + 0.14), // +8° to +18° right slant
        delay: 0
      },
      // 2. Right launch, angled inward towards center-left
      {
        startX: w * (0.78 + Math.random() * 0.10),
        targetY: h * (0.16 + Math.random() * 0.10),
        angleOffset: -(Math.random() * 0.18 + 0.14), // -8° to -18° left slant
        delay: 260
      },
      // 3. Center-left launch, sweeping high right
      {
        startX: w * (0.32 + Math.random() * 0.10),
        targetY: h * (0.22 + Math.random() * 0.08),
        angleOffset: (Math.random() * 0.18 + 0.06),
        delay: 580
      },
      // 4. Center-right launch, sweeping high left (crossing in sky)
      {
        startX: w * (0.58 + Math.random() * 0.10),
        targetY: h * (0.20 + Math.random() * 0.09),
        angleOffset: -(Math.random() * 0.18 + 0.06),
        delay: 900
      },
      // 5. Deep high center rocket (powerful vertical burst)
      {
        startX: w * (0.45 + Math.random() * 0.10),
        targetY: h * (0.12 + Math.random() * 0.07),
        angleOffset: (Math.random() - 0.5) * 0.10, // near straight up
        delay: 1260
      },
      // 6. Wide angled fan shot
      {
        startX: w * (0.20 + Math.random() * 0.12),
        targetY: h * (0.25 + Math.random() * 0.08),
        angleOffset: (Math.random() * 0.22 + 0.10),
        delay: 1620
      },
      // 7. Grand finale twin rocket A (angled inward from left)
      {
        startX: w * (0.35 + Math.random() * 0.10),
        targetY: h * (0.15 + Math.random() * 0.08),
        angleOffset: -(Math.random() * 0.16 + 0.08),
        delay: 2000
      },
      // 8. Grand finale twin rocket B (angled inward from right)
      {
        startX: w * (0.65 + Math.random() * 0.10),
        targetY: h * (0.14 + Math.random() * 0.08),
        angleOffset: (Math.random() * 0.16 + 0.08),
        delay: 2200
      }
    ];

    rocketConfigs.forEach((cfg) => {
      setTimeout(() => {
        sparklerRockets.push(new SparklerRocket(w, h, cfg));
        if (!sparklerAnimId) {
          sparklerAnimId = requestAnimationFrame(animateSparklers);
        }
      }, cfg.delay);
    });

    showAtmosToast('🎆 Celestial Golden Fireworks');
  }


  // ==========================================================================
  // 4. CELESTIAL STARDUST CURSOR TRAIL & TWINKLE ENGINE
  // Ultra-luxurious, silky smooth golden stardust & diamond micro-sparkles
  // Auto-pauses at 0% idle CPU when stationary.
  // ==========================================================================
  const cursorCanvas = document.getElementById('celestial-cursor-canvas');
  let cursorCtx = null;
  let cursorParticles = [];
  let cursorAnimId = null;
  let cursorIsRunning = false;
  let lastCursorX = -100;
  let lastCursorY = -100;
  let lastCursorTime = 0;

  // Luxury Starlight Palettes: Champagne Gold, Diamond White, Imperial Gold, Velvet Rose
  const CURSOR_PALETTES = [
    { core: '#FFFFFF', glow: '#F9D976', r: 249, g: 217, b: 118 },
    { core: '#FFFDF0', glow: '#FFD700', r: 255, g: 215, b: 0 },
    { core: '#FFFFFF', glow: '#FFE4E6', r: 255, g: 228, b: 230 },
    { core: '#FFF8E7', glow: '#E8BD70', r: 232, g: 189, b: 112 },
    { core: '#FFFFFF', glow: '#FFB3BA', r: 255, g: 179, b: 186 }
  ];

  class CelestialCursorParticle {
    constructor(x, y, vx, vy, isStar = false, customPalette = null) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.isStar = isStar;
      this.life = 1.0;
      this.decay = 0.024 + Math.random() * 0.026; // ~35-45 frames (~0.6s - 0.75s)
      this.size = isStar ? (4.2 + Math.random() * 4.8) : (1.4 + Math.random() * 2.5);
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.14;
      this.palette = customPalette || CURSOR_PALETTES[Math.floor(Math.random() * CURSOR_PALETTES.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.032; // gentle starlight gravity
      this.vx *= 0.965; // soft air drag
      this.angle += this.rotSpeed;
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.life));
      ctx.translate(this.x, this.y);

      if (this.isStar) {
        // 4-Point Diamond Twinkle Star
        ctx.rotate(this.angle);
        const s = this.size * Math.max(0.2, this.life);

        ctx.fillStyle = this.palette.core;
        ctx.shadowColor = this.palette.glow;
        ctx.shadowBlur = 9;

        // Draw 4-point diamond star
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s * 0.24, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s * 0.24, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();

        // Diamond cross rays
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 0.24);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 0.24);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.fill();

        // Center starlight pinpoint
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      } else {
        // Radiant Stardust Ember (Soft Glowing Orb)
        const rad = this.size * Math.max(0.15, this.life);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad * 2.2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
        grad.addColorStop(0.35, `rgba(${this.palette.r}, ${this.palette.g}, ${this.palette.b}, ${this.life * 0.85})`);
        grad.addColorStop(1, `rgba(${this.palette.r}, ${this.palette.g}, ${this.palette.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, rad * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function resizeCursorCanvas() {
    if (!cursorCanvas || !cursorCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cursorCanvas.width = window.innerWidth * dpr;
    cursorCanvas.height = window.innerHeight * dpr;
    cursorCtx.setTransform(1, 0, 0, 1, 0, 0);
    cursorCtx.scale(dpr, dpr);
  }

  function startCursorLoop() {
    if (!cursorIsRunning) {
      cursorIsRunning = true;
      cursorAnimId = requestAnimationFrame(renderCursorLoop);
    }
  }

  function renderCursorLoop() {
    if (!cursorCtx) return;
    cursorCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = cursorParticles.length - 1; i >= 0; i--) {
      const p = cursorParticles[i];
      p.update();
      p.draw(cursorCtx);
      if (p.life <= 0) {
        cursorParticles.splice(i, 1);
      }
    }

    if (cursorParticles.length > 0) {
      cursorAnimId = requestAnimationFrame(renderCursorLoop);
    } else {
      cursorIsRunning = false;
      cursorAnimId = null;
    }
  }

  function spawnCursorStardust(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      const isStar = Math.random() < 0.30;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed + 0.25;
      cursorParticles.push(new CelestialCursorParticle(x, y, vx, vy, isStar));
    }
    startCursorLoop();
  }

  function spawnCursorBurst(x, y, count = 12, customPalette = null) {
    for (let i = 0; i < count; i++) {
      const isStar = Math.random() < 0.38;
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.35 - 0.17);
      const speed = Math.random() * 2.8 + 1.2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      cursorParticles.push(new CelestialCursorParticle(x, y, vx, vy, isStar, customPalette));
    }
    startCursorLoop();
  }

  // Initialize Celestial Cursor Trail
  function initCelestialCursor() {
    if (!cursorCanvas) return;
    cursorCtx = cursorCanvas.getContext('2d');
    resizeCursorCanvas();

    // Mousemove listener with distance & time threshold
    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      const dist = Math.hypot(x - lastCursorX, y - lastCursorY);

      if (dist >= 7 || (now - lastCursorTime > 40 && dist >= 3)) {
        const count = dist > 35 ? 3 : (dist > 16 ? 2 : 1);
        spawnCursorStardust(x, y, count);
        lastCursorX = x;
        lastCursorY = y;
        lastCursorTime = now;
      }
    }, { passive: true });

    // Touchmove listener for mobile / tablets
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        const x = t.clientX;
        const y = t.clientY;
        const now = performance.now();
        const dist = Math.hypot(x - lastCursorX, y - lastCursorY);

        if (dist >= 10 || (now - lastCursorTime > 50 && dist >= 4)) {
          spawnCursorStardust(x, y, 2);
          lastCursorX = x;
          lastCursorY = y;
          lastCursorTime = now;
        }
      }
    }, { passive: true });

    // Gentle radiant burst on user click / tap anywhere
    window.addEventListener('click', (e) => {
      spawnCursorBurst(e.clientX, e.clientY, 10);
    }, { passive: true });

    // Expose global controller
    window.CelestialCursor = {
      burst: spawnCursorBurst,
      stardust: spawnCursorStardust
    };
  }


  // --- 5. INITIALIZE AND BIND ALL LISTENERS ---
  function initAtmosphereControls() {
    const meteorBtn = document.getElementById('atmos-meteor-btn');
    const sparklerBtn = document.getElementById('atmos-sparkler-btn');

    if (meteorBtn) {
      meteorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        launchMeteorShower();
      });
    }

    if (sparklerBtn) {
      sparklerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        launchGoldenSparklers();
      });
    }

    // Initialize the cursor trail engine
    initCelestialCursor();

    // Window resize handler for all atmosphere canvases
    window.addEventListener('resize', () => {
      resizeMeteorCanvas();
      resizeSparklerCanvas();
      resizeCursorCanvas();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAtmosphereControls);
  } else {
    initAtmosphereControls();
  }

  window.initAtmosphereControls = initAtmosphereControls;
})();
