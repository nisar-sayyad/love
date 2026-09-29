/**
 * ============================================================================
 * BIRTHDAY CELEBRATION — MASTER REALISTIC FIREWORKS & MUSIC ENGINE (V3 PERFECTED)
 * Nisar × Lahari — A Private Sanctuary
 *
 * PERFECTED REFINEMENTS (V3):
 * 1. Immediate Overlay Transition:
 *    - Right when passcode '2909' is entered, dark overlay appears IMMEDIATELY (0ms delay).
 *    - Screen smoothly darkens into deep starry midnight sky (rgba(6, 3, 12, 0.94)) within 0.6s.
 *    - 1.0s romantic suspense pause in the quiet dark sky before fireworks launch.
 *
 * 2. Guaranteed 100% Full Audio Playback:
 *    - MP3 track (Happy Birthday, Princess - 20.06s) is preloaded and pre-unlocked on user gesture.
 *    - Music starts at t = 1.6s and plays COMPLETELY until its natural 'ended' event.
 *    - Audio is NEVER prematurely paused, cut off, or terminated.
 *    - Outro (stardust rain & overlay fade-out) triggers ONLY after the music finishes naturally!
 *
 * 3. Balanced Golden-Ratio Fireworks Sizing (Adjusted from V2):
 *    - Reduced from oversized 1,200px / 2,200 particles to elegant, balanced proportions.
 *    - Early Rockets 1-10: 380px – 440px spread, 115 glowing embers with willow streamers.
 *    - Grand Climax Rocket 11: 720px – 760px diameter magnificent centerpiece bloom (leaves comfortable margins).
 *    - Climax particle count: 650 crisp, luminous golden embers.
 *
 * 4. Radiant Cursive Typography & Sparkler Constellation:
 *    - Line 1: H A P P Y   B I R T H D A Y (Pure 24k Gold, 40px Cinzel serif)
 *    - Line 2: Lahari (Gorgeous Sweeping Cursive Calligraphy, 78px Great Vibes with diamond glints)
 *    - Line 3: ♥ (Pulsing Ruby Red Neon Diamond Heart, 36px)
 *    - Stays fully illuminated, breathing and shining for ~8 full seconds until song ends.
 *
 * 5. Clean Restorative Outro:
 *    - As the final chord of the song rings out, words dissolve into gentle falling stardust rain.
 *    - Dark overlay smoothly fades back to daylight over 2.5s.
 *    - Canvas completely unmounts, restoring Home 100% cleanly.
 * ============================================================================
 */

(function () {
  'use strict';

  // Always active on passcode unlock
  window.BIRTHDAY_CELEBRATION_PREVIEW = true;

  const CELEBRATION_CONFIG = {
    previewMode: true,
    targetMonth: 8, // September (0-indexed: 8 = September)
    targetDay: 29,  // 29th of September every year
    audioSrc: 'assets/audio/happy-birthday.mp3'
  };

  function isCelebrationActive() {
    if (window.location.search.includes('no_celebration=1')) return false;
    // 1. Secret override for testing anytime (via URL hash #preview-bday or console flag)
    if (window.BIRTHDAY_CELEBRATION_PREVIEW === true) return true;
    if (window.location.hash === '#preview-bday' || window.location.search.includes('preview=birthday')) return true;
    if (CELEBRATION_CONFIG.previewMode === true) return true;

    // 2. Check local device date (September 29 every year)
    const localNow = new Date();
    if (localNow.getMonth() === CELEBRATION_CONFIG.targetMonth && localNow.getDate() === CELEBRATION_CONFIG.targetDay) {
      return true;
    }

    // 3. Check Indian Standard Time (IST - Asia/Kolkata) date (September 29 every year)
    try {
      const istString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const istDate = new Date(istString);
      if (istDate.getMonth() === CELEBRATION_CONFIG.targetMonth && istDate.getDate() === CELEBRATION_CONFIG.targetDay) {
        return true;
      }
    } catch (e) {}

    return false;
  }

  // Pre-create and preload the Happy Birthday audio element in memory
  let preloadedMusic = null;
  try {
    preloadedMusic = new Audio(CELEBRATION_CONFIG.audioSrc);
    preloadedMusic.preload = 'auto';
  } catch (e) {
    console.warn('Could not preload birthday audio:', e);
  }

  // ==========================================================================
  // 1. MULTI-LAYER REALISTIC ACOUSTIC FIREWORKS SOUND & MUSIC ENGINE
  // ==========================================================================
  class RealisticFireworksAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.musicAudio = preloadedMusic;
      this.masterGain = null;
      this.reverbNode = null;
      this.noiseBuffer = null;
      this.isPrepared = false;
      this.hasStartedMusic = false;
    }

    prepare() {
      if (this.isPrepared) return;
      this.isPrepared = true;

      // 1. Ensure HTML5 audio is ready
      try {
        if (!this.musicAudio) {
          this.musicAudio = new Audio(CELEBRATION_CONFIG.audioSrc);
        }
        this.musicAudio.preload = 'auto';
        this.musicAudio.volume = 0.98;
        this.musicAudio.load();
      } catch (e) {
        console.warn('Birthday music audio prepare error', e);
      }

      // 2. Initialize Web Audio API on direct user gesture
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          if (!this.audioCtx) {
            this.audioCtx = new AudioCtx();
          }
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
          }

          this.masterGain = this.audioCtx.createGain();
          this.masterGain.gain.setValueAtTime(0.85, this.audioCtx.currentTime);
          this.masterGain.connect(this.audioCtx.destination);

          // Atmospheric outdoor reverb for realistic sky acoustic decay
          this.reverbNode = this.createOutdoorReverb(2.2, 2.0);
          this.reverbGain = this.audioCtx.createGain();
          this.reverbGain.gain.value = 0.40;

          if (this.reverbNode) {
            this.reverbNode.connect(this.reverbGain);
            this.reverbGain.connect(this.audioCtx.destination);
          }

          // Pre-render pink/white noise buffer for gunpowder crackles and snaps
          this.noiseBuffer = this.createNoiseBuffer(2.2);
        }
      } catch (e) {
        console.warn('Web Audio init error:', e);
      }
    }

    createNoiseBuffer(duration = 2.2) {
      if (!this.audioCtx) return null;
      const bufferSize = this.audioCtx.sampleRate * duration;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.16;
      }
      return buffer;
    }

    createOutdoorReverb(duration = 2.2, decay = 2.0) {
      if (!this.audioCtx) return null;
      const rate = this.audioCtx.sampleRate;
      const length = rate * duration;
      const impulse = this.audioCtx.createBuffer(2, length, rate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const t = i / length;
        const env = Math.pow(1 - t, decay);
        left[i] = (Math.random() * 2 - 1) * env;
        right[i] = (Math.random() * 2 - 1) * env;
      }

      const convolver = this.audioCtx.createConvolver();
      convolver.buffer = impulse;
      return convolver;
    }

    playLaunchSound(isClimax = false) {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      try {
        const t = this.audioCtx.currentTime;

        // Low propellant thump
        const thumpOsc = this.audioCtx.createOscillator();
        thumpOsc.type = 'triangle';
        thumpOsc.frequency.setValueAtTime(isClimax ? 150 : 120, t);
        thumpOsc.frequency.exponentialRampToValueAtTime(30, t + (isClimax ? 0.38 : 0.24));

        const thumpGain = this.audioCtx.createGain();
        thumpGain.gain.setValueAtTime(0.001, t);
        thumpGain.gain.linearRampToValueAtTime(isClimax ? 0.55 : 0.30, t + 0.02);
        thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + (isClimax ? 0.42 : 0.28));

        thumpOsc.connect(thumpGain);
        thumpGain.connect(this.masterGain);
        thumpOsc.start(t);
        thumpOsc.stop(t + (isClimax ? 0.45 : 0.30));

        // Atmospheric whoosh / rocket hiss
        if (this.noiseBuffer) {
          const whoosh = this.audioCtx.createBufferSource();
          whoosh.buffer = this.noiseBuffer;

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.Q.value = 3.2;
          filter.frequency.setValueAtTime(420, t);
          filter.frequency.exponentialRampToValueAtTime(isClimax ? 2200 : 1600, t + (isClimax ? 1.6 : 1.0));

          const whooshGain = this.audioCtx.createGain();
          whooshGain.gain.setValueAtTime(0.001, t);
          whooshGain.gain.linearRampToValueAtTime(isClimax ? 0.22 : 0.12, t + 0.18);
          whooshGain.gain.exponentialRampToValueAtTime(0.0001, t + (isClimax ? 1.65 : 1.05));

          whoosh.connect(filter);
          filter.connect(whooshGain);
          whooshGain.connect(this.masterGain);
          whoosh.start(t);
          whoosh.stop(t + (isClimax ? 1.7 : 1.1));
        }
      } catch (e) {}
    }

    playBurstSound(isClimax = false) {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      try {
        const t = this.audioCtx.currentTime;

        // Layer 1: Sharp Gunpowder Snap
        if (this.noiseBuffer) {
          const snap = this.audioCtx.createBufferSource();
          snap.buffer = this.noiseBuffer;
          const snapFilter = this.audioCtx.createBiquadFilter();
          snapFilter.type = 'highpass';
          snapFilter.frequency.setValueAtTime(1200, t);

          const snapGain = this.audioCtx.createGain();
          snapGain.gain.setValueAtTime(0.001, t);
          snapGain.gain.linearRampToValueAtTime(isClimax ? 0.65 : 0.38, t + 0.005);
          snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

          snap.connect(snapFilter);
          snapFilter.connect(snapGain);
          snapGain.connect(this.masterGain);
          snap.start(t);
          snap.stop(t + 0.12);
        }

        // Layer 2: Deep Sub-Bass Resonant Boom
        const boomOsc = this.audioCtx.createOscillator();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(isClimax ? 75 : 95, t);
        boomOsc.frequency.exponentialRampToValueAtTime(isClimax ? 24 : 30, t + (isClimax ? 1.4 : 0.65));

        const boomGain = this.audioCtx.createGain();
        boomGain.gain.setValueAtTime(0.001, t);
        boomGain.gain.linearRampToValueAtTime(isClimax ? 0.75 : 0.42, t + 0.025);
        boomGain.gain.exponentialRampToValueAtTime(0.0001, t + (isClimax ? 1.6 : 0.8));

        boomOsc.connect(boomGain);
        boomGain.connect(this.masterGain);
        if (this.reverbNode) boomGain.connect(this.reverbNode);
        boomOsc.start(t);
        boomOsc.stop(t + (isClimax ? 1.7 : 0.85));

        // Layer 3: Golden Sparkler Sizzle & Crackle
        if (this.noiseBuffer) {
          const sizzle = this.audioCtx.createBufferSource();
          sizzle.buffer = this.noiseBuffer;
          const sFilter = this.audioCtx.createBiquadFilter();
          sFilter.type = 'bandpass';
          sFilter.Q.value = 3.8;
          sFilter.frequency.setValueAtTime(isClimax ? 3200 : 2600, t + 0.08);

          const sGain = this.audioCtx.createGain();
          sGain.gain.setValueAtTime(0.0001, t);
          sGain.gain.linearRampToValueAtTime(isClimax ? 0.18 : 0.09, t + 0.18);
          sGain.gain.exponentialRampToValueAtTime(0.0001, t + (isClimax ? 2.1 : 1.1));

          sizzle.connect(sFilter);
          sFilter.connect(sGain);
          sGain.connect(this.masterGain);
          sizzle.start(t);
          sizzle.stop(t + (isClimax ? 2.2 : 1.2));
        }

        // Climax special: Shimmering stardust chimes
        if (isClimax) {
          const chimes = [587.33, 739.99, 880.00, 1174.66, 1479.98, 1760.00];
          chimes.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + 0.04 + idx * 0.07);

            const cGain = this.audioCtx.createGain();
            cGain.gain.setValueAtTime(0.0001, t);
            cGain.gain.linearRampToValueAtTime(0.08, t + 0.06 + idx * 0.07);
            cGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8 + idx * 0.1);

            osc.connect(cGain);
            cGain.connect(this.masterGain);
            if (this.reverbNode) cGain.connect(this.reverbNode);
            osc.start(t + 0.04 + idx * 0.07);
            osc.stop(t + 2.0);
          });
        }
      } catch (e) {}
    }

    startMusic(onEndedCallback) {
      if (this.hasStartedMusic) return;
      this.hasStartedMusic = true;

      if (!this.musicAudio) {
        this.musicAudio = new Audio(CELEBRATION_CONFIG.audioSrc);
      }

      this.musicAudio.currentTime = 0;
      this.musicAudio.volume = 0.98;

      let endedFired = false;
      const handleEnded = () => {
        if (endedFired) return;
        endedFired = true;
        if (typeof onEndedCallback === 'function') {
          onEndedCallback();
        }
      };

      this.musicAudio.onended = handleEnded;

      const playPromise = this.musicAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Track exact progress
          this.musicAudio.addEventListener('timeupdate', () => {
            if (this.musicAudio && this.musicAudio.duration > 0) {
              if (this.musicAudio.currentTime >= this.musicAudio.duration - 0.25) {
                handleEnded();
              }
            }
          });
        }).catch((err) => {
          console.warn('Birthday music play blocked or deferred:', err);
          // Fallback timer if browser blocked autoplay (20.5 seconds of song duration)
          setTimeout(handleEnded, 20500);
        });
      } else {
        setTimeout(handleEnded, 20500);
      }
    }

    cleanup() {
      if (this.musicAudio) {
        try {
          this.musicAudio.pause();
          this.musicAudio.currentTime = 0;
        } catch (e) {}
        this.musicAudio = null;
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        try {
          this.audioCtx.close();
        } catch (e) {}
        this.audioCtx = null;
      }
    }
  }

  // ==========================================================================
  // 2. CELESTIAL PALETTES
  // ==========================================================================
  const CELESTIAL_PALETTES = {
    gold: ['#FFFFFF', '#FFF9E6', '#FFD700', '#FFB830', '#FFA000', '#FF8C00'],
    rose: ['#FFFFFF', '#FFE4E6', '#FF8DA1', '#FF4D6D', '#FFB3C6', '#FF2A7A'],
    diamond: ['#FFFFFF', '#F0F8FF', '#E0F7FA', '#B2EBF2', '#80DEEA'],
    champagne: ['#FFFFFF', '#FFF8DC', '#F5DEB3', '#FFE4B5', '#E6C280']
  };

  // ==========================================================================
  // 3. MASTER SPARKLER ROCKET (Balanced Realistic Comet Ascent)
  // ==========================================================================
  class MasterSparklerRocket {
    constructor(config) {
      this.startX = config.startX;
      this.startY = config.startY;
      this.x = config.startX;
      this.y = config.startY;
      this.targetY = config.targetY;
      this.palette = config.palette || CELESTIAL_PALETTES.gold;
      this.isFinal = config.isFinal || false;

      const totalDist = this.startY - this.targetY;
      const speed = this.isFinal ? 12.0 : (Math.random() * 2.8 + 11.5);
      this.totalFrames = Math.max(36, Math.floor(totalDist / speed));
      this.currentFrame = 0;

      this.angleOffset = config.angleOffset || 0;
      this.curveAmp = (Math.random() - 0.5) * (this.isFinal ? 12 : 36);

      this.exhaustParticles = [];
      this.alive = true;
      this.exploded = false;
    }

    update() {
      if (!this.alive) return;

      this.currentFrame++;
      const progress = this.currentFrame / this.totalFrames;

      // Realistic ascent physics: slight deceleration as it reaches apex
      const eased = 1 - Math.pow(1 - progress, 1.45);
      this.y = this.startY - (this.startY - this.targetY) * eased;

      const angleShift = Math.sin(progress * Math.PI) * (this.angleOffset * 160);
      const wave = Math.sin(progress * Math.PI * 2.0) * this.curveAmp;
      this.x = this.startX + angleShift + wave;

      // Exhaust spark generation: luminous streamer tail
      const count = this.isFinal ? 6 : 3;
      for (let i = 0; i < count; i++) {
        const spreadX = (Math.random() - 0.5) * (this.isFinal ? 5.0 : 3.0);
        const droopSpeed = Math.random() * 2.6 + 1.0;
        this.exhaustParticles.push({
          x: this.x + spreadX,
          y: this.y + (Math.random() * 3 + 2),
          vx: spreadX * 0.4,
          vy: droopSpeed,
          size: Math.random() * (this.isFinal ? 2.5 : 1.8) + 1.0,
          color: (Math.random() > 0.4) ? '#FFFFFF' : this.palette[Math.floor(Math.random() * this.palette.length)],
          alpha: 1.0,
          decay: Math.random() * 0.045 + 0.028
        });
      }

      // Update exhaust particles
      for (let i = this.exhaustParticles.length - 1; i >= 0; i--) {
        const p = this.exhaustParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.exhaustParticles.splice(i, 1);
        }
      }

      if (this.currentFrame >= this.totalFrames || this.y <= this.targetY) {
        this.alive = false;
        this.exploded = true;
      }
    }

    draw(ctx) {
      // 1. Draw exhaust trail
      for (let i = 0; i < this.exhaustParticles.length; i++) {
        const p = this.exhaustParticles[i];
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!this.alive) return;

      // 2. Draw Rocket Head (balanced size: 4.8px climax, 3.2px standard)
      ctx.save();
      const headRadius = this.isFinal ? 4.8 : 3.2;
      
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, headRadius * 3.2);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.35, this.isFinal ? '#FFE082' : '#FFD700');
      grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, headRadius * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // White solid core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x, this.y, headRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // ==========================================================================
  // 4. MASTER SPARKLER PARTICLE (Balanced Willow Bursts & Text Stars)
  // ==========================================================================
  class MasterSparklerParticle {
    constructor(x, y, palette, isClimax = false) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
      this.palette = palette;
      this.isClimax = isClimax;

      const angle = Math.random() * Math.PI * 2;
      // Balanced velocity distribution:
      // Early rockets: 380px - 440px diameter bloom
      // Climax rocket: 720px - 760px diameter bloom (magnificent, leaving ~25% clear margins)
      const speedNorm = Math.pow(Math.random(), 0.70);
      const maxSpeed = isClimax ? (speedNorm * 11.0 + 2.5) : (speedNorm * 7.5 + 2.0);
      this.vx = Math.cos(angle) * maxSpeed;
      this.vy = Math.sin(angle) * maxSpeed;

      this.color = palette[Math.floor(Math.random() * palette.length)];
      // Refined ember size: 1.8px - 2.8px
      this.size = isClimax ? (Math.random() * 1.5 + 2.0) : (Math.random() * 1.2 + 1.6);
      this.alpha = 1.0;
      this.decay = isClimax ? 0 : (Math.random() * 0.014 + 0.010);
      this.gravity = isClimax ? 0.032 : 0.055;
      this.drag = isClimax ? 0.972 : 0.965;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.alive = true;

      // Text convergence state
      this.targetX = null;
      this.targetY = null;
      this.isHeart = false;
      this.isLahari = false;
      this.converging = false;
      this.settled = false;
      this.offset = Math.random() * Math.PI * 2;
    }

    update(isDissolving, isSettledPhase, elapsedSec) {
      this.prevX = this.x;
      this.prevY = this.y;

      if (this.converging && this.targetX !== null) {
        if (isDissolving) {
          // Softly dissolve into falling golden stardust rain
          this.vx += (Math.random() - 0.5) * 0.35;
          this.vy += 0.10 + Math.random() * 0.14;
          this.x += this.vx;
          this.y += this.vy;
          this.alpha -= 0.016;
          this.twinklePhase += 0.22;
        } else {
          // Smooth physical steering toward letter target coordinates
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 1.8 && !this.settled) {
            const speed = Math.min(dist * 0.12, 14);
            const angle = Math.atan2(dy, dx);
            const curl = Math.sin(this.offset + elapsedSec * 3.5) * Math.min(dist * 0.02, 2.2);

            this.vx = this.vx * 0.82 + (Math.cos(angle) * speed - Math.sin(angle) * curl) * 0.18;
            this.vy = this.vy * 0.82 + (Math.sin(angle) * speed + Math.cos(angle) * curl) * 0.18;

            this.x += this.vx;
            this.y += this.vy;
          } else {
            this.settled = true;
            this.x = this.targetX;
            this.y = this.targetY;
            this.vx = 0;
            this.vy = 0;
          }
          this.twinklePhase += 0.20;
        }
      } else {
        // Natural firework sparkler flight with willow streamer droop
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.drag;
        this.vy = this.vy * this.drag + this.gravity;

        if (this.isClimax) {
          this.alpha = Math.max(0.85, this.alpha * 0.998);
        } else {
          this.alpha -= this.decay;
        }
        this.twinklePhase += 0.22;

        if (this.alpha <= 0) {
          this.alive = false;
        }
      }
    }

    draw(ctx, isSettledPhase, elapsedSec) {
      if (!this.alive || this.alpha <= 0.01) return;

      ctx.save();
      const twinkle = Math.sin(this.twinklePhase) * 0.32 + 0.68;
      let effectiveAlpha = Math.max(0, Math.min(1, this.alpha * twinkle));

      if (this.settled && isSettledPhase) {
        // Assembled text sparkler constellation: breathing shimmering diamond star
        const shimmer = Math.sin(elapsedSec * 5.5 + this.offset) * 0.20;
        effectiveAlpha = Math.min(Math.max(this.alpha + shimmer, 0.75), 1.0);

        ctx.globalAlpha = effectiveAlpha;
        ctx.fillStyle = this.color;

        const radius = this.isHeart ? 3.0 : (2.2 + Math.sin(elapsedSec * 3.5 + this.offset) * 0.4);
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // White glittering glint on prominent sparklers
        if (Math.sin(elapsedSec * 7.5 + this.offset) > 0.75) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius * 0.60, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // High visibility aerial firework spark with delicate glowing motion trail
        ctx.globalAlpha = effectiveAlpha;
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size * 0.85;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.70, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // ==========================================================================
  // 5. MASTER CELEBRATION CONTROLLER
  // ==========================================================================
  class MasterBirthdayCelebration {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = 0;
      this.height = 0;
      this.animId = null;
      this.startTime = null;

      this.rockets = [];
      this.particles = [];
      this.flashes = [];

      this.audio = new RealisticFireworksAudioEngine();
      this.isComplete = false;
      this.isDissolving = false;
      this.outroStartTime = null;
      this.dimAlpha = 0;

      this.launchQueue = [];
      this.textTargetsAssigned = false;
    }

    mount() {
      if (document.getElementById('birthday-celebration-canvas')) return;

      this.canvas = document.createElement('canvas');
      this.canvas.id = 'birthday-celebration-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.inset = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'auto'; // Shields background: prevents clicking underlying cards!
      this.canvas.style.cursor = 'default';
      this.canvas.style.zIndex = '999999';
      this.canvas.style.transition = 'opacity 0.8s ease';
      document.body.appendChild(this.canvas);
      document.body.classList.add('birthday-celebration-active');

      // Intercept and swallow all click/touch interactions while celebration plays
      this.blockHandler = (e) => {
        e.stopPropagation();
      };
      this.canvas.addEventListener('click', this.blockHandler);
      this.canvas.addEventListener('mousedown', this.blockHandler);
      this.canvas.addEventListener('mouseup', this.blockHandler);
      this.canvas.addEventListener('touchstart', this.blockHandler, { passive: true });
      this.canvas.addEventListener('touchend', this.blockHandler, { passive: true });

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', this.onResizeBound = () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.scale(this.dpr, this.dpr);
    }

    // High resolution text point sampling for particle convergence
    sampleTextPoints() {
      const off = document.createElement('canvas');
      off.width = this.width;
      off.height = this.height;
      const oCtx = off.getContext('2d');

      const cx = this.width * 0.5;
      const cy = this.height * 0.35; // Centered in golden ratio sky position

      const scale = Math.min(this.width / 1920, this.height / 1080);
      const f1 = Math.max(28, Math.min(42, Math.round(40 * Math.max(scale, 0.75))));
      const f2 = Math.max(56, Math.min(86, Math.round(82 * Math.max(scale, 0.75))));
      const fHeart = Math.max(28, Math.min(40, Math.round(38 * Math.max(scale, 0.75))));

      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillStyle = '#FFFFFF';

      // Line 1: HAPPY BIRTHDAY (Cinzel serif)
      oCtx.font = `700 ${f1}px 'Cinzel', serif`;
      oCtx.fillText('H  A  P  P  Y     B  I  R  T  H  D  A  Y', cx, cy - f1 * 1.15);

      // Line 2: Lahari (Cursive Great Vibes)
      oCtx.font = `400 ${f2}px 'Great Vibes', cursive`;
      oCtx.fillText('Lahari', cx, cy + f2 * 0.40);

      // Line 3: Ruby Heart ♥
      oCtx.font = `${fHeart}px serif`;
      oCtx.fillText('♥', cx, cy + f2 * 1.30);

      const imgData = oCtx.getImageData(0, 0, this.width, this.height);
      const data = imgData.data;
      const points = [];
      const step = this.width < 768 ? 2.8 : 3.4;

      for (let y = 0; y < this.height; y += step) {
        for (let x = 0; x < this.width; x += step) {
          const idx = (Math.floor(y) * this.width + Math.floor(x)) * 4;
          if (data[idx + 3] > 115) {
            points.push({
              x: x,
              y: y,
              isHeart: (y > cy + f2 * 1.05),
              isLahari: (y > cy - f1 * 0.4 && y <= cy + f2 * 1.05)
            });
          }
        }
      }
      return points;
    }

    createExplosion(x, y, isClimax = false, palette = CELESTIAL_PALETTES.gold) {
      // 1. Soft radial ignition flash
      this.flashes.push({
        x: x,
        y: y,
        radius: isClimax ? 280 : 160,
        alpha: isClimax ? 0.75 : 0.55,
        decay: isClimax ? 0.045 : 0.08
      });

      // 2. Realistic acoustic sound synthesis
      this.audio.playBurstSound(isClimax);

      // 3. Embers count: 120 for early rockets (380-440px spread), 650 for 11th climax (720-760px spread)
      const count = isClimax ? 650 : 120;

      for (let i = 0; i < count; i++) {
        this.particles.push(new MasterSparklerParticle(x, y, palette, isClimax));
      }
    }

    assignSparksToText() {
      const targetPoints = this.sampleTextPoints();
      if (!targetPoints || targetPoints.length === 0) return;

      const climaxParticles = this.particles.filter(p => p.isClimax);
      if (climaxParticles.length === 0) return;

      const shuffled = targetPoints.slice().sort(() => Math.random() - 0.5);

      for (let i = 0; i < shuffled.length; i++) {
        const pt = shuffled[i];
        const p = climaxParticles[i % climaxParticles.length];
        if (p) {
          p.targetX = pt.x;
          p.targetY = pt.y;
          p.isLahari = pt.isLahari;
          p.isHeart = pt.isHeart;
          p.converging = true;

          // Color palette for assembled text:
          if (pt.isHeart) {
            p.color = '#FF2A7A'; // Ruby Pink Glow
          } else if (pt.isLahari) {
            p.color = (i % 3 === 0) ? '#FFFFFF' : '#FFAEC0'; // Rose Gold with diamond tips
          } else {
            p.color = (i % 4 === 0) ? '#FFFFFF' : '#FFD700'; // Pure 24k Gold
          }
        }
      }

      this.textTargetsAssigned = true;
    }

    // Schedules 10 build-up rockets starting at t = 1.6s + Grand Finale at t = 11.4s
    setupChoreography() {
      const w = this.width;
      const h = this.height;

      this.launchQueue = [
        // 1. Rocket 1 (t = 1.8s): Left sweep
        {
          launchTime: 1.8,
          config: {
            startX: w * 0.22,
            startY: h + 15,
            targetY: h * 0.32,
            angleOffset: 0.12,
            palette: CELESTIAL_PALETTES.gold,
            isFinal: false
          },
          launched: false
        },
        // 2. Rocket 2 (t = 2.8s): Right sweep
        {
          launchTime: 2.8,
          config: {
            startX: w * 0.78,
            startY: h + 15,
            targetY: h * 0.30,
            angleOffset: -0.12,
            palette: CELESTIAL_PALETTES.rose,
            isFinal: false
          },
          launched: false
        },
        // 3. Rocket 3 (t = 3.9s): Center-left sweep
        {
          launchTime: 3.9,
          config: {
            startX: w * 0.38,
            startY: h + 15,
            targetY: h * 0.34,
            angleOffset: 0.10,
            palette: CELESTIAL_PALETTES.gold,
            isFinal: false
          },
          launched: false
        },
        // 4. Rocket 4 (t = 5.0s): Center-right crossing
        {
          launchTime: 5.0,
          config: {
            startX: w * 0.62,
            startY: h + 15,
            targetY: h * 0.31,
            angleOffset: -0.10,
            palette: CELESTIAL_PALETTES.rose,
            isFinal: false
          },
          launched: false
        },
        // 5. Rocket 5 (t = 6.1s): Deep vertical diamond bloom
        {
          launchTime: 6.1,
          config: {
            startX: w * 0.50,
            startY: h + 15,
            targetY: h * 0.25,
            angleOffset: 0.01,
            palette: CELESTIAL_PALETTES.diamond,
            isFinal: false
          },
          launched: false
        },
        // 6. Rocket 6 (t = 7.2s): Left fan burst
        {
          launchTime: 7.2,
          config: {
            startX: w * 0.26,
            startY: h + 15,
            targetY: h * 0.35,
            angleOffset: 0.15,
            palette: CELESTIAL_PALETTES.gold,
            isFinal: false
          },
          launched: false
        },
        // 7. Rocket 7 (t = 8.3s): Right fan burst
        {
          launchTime: 8.3,
          config: {
            startX: w * 0.74,
            startY: h + 15,
            targetY: h * 0.33,
            angleOffset: -0.15,
            palette: CELESTIAL_PALETTES.champagne,
            isFinal: false
          },
          launched: false
        },
        // 8. Rocket 8 (t = 9.3s): Diamond high burst
        {
          launchTime: 9.3,
          config: {
            startX: w * 0.54,
            startY: h + 15,
            targetY: h * 0.26,
            angleOffset: -0.05,
            palette: CELESTIAL_PALETTES.diamond,
            isFinal: false
          },
          launched: false
        },
        // 9. Rocket 9 (t = 10.3s): Twin finale A (left slant)
        {
          launchTime: 10.3,
          config: {
            startX: w * 0.38,
            startY: h + 15,
            targetY: h * 0.26,
            angleOffset: -0.08,
            palette: CELESTIAL_PALETTES.rose,
            isFinal: false
          },
          launched: false
        },
        // 10. Rocket 10 (t = 10.5s): Twin finale B (right slant)
        {
          launchTime: 10.5,
          config: {
            startX: w * 0.62,
            startY: h + 15,
            targetY: h * 0.26,
            angleOffset: 0.08,
            palette: CELESTIAL_PALETTES.gold,
            isFinal: false
          },
          launched: false
        },
        // 11. THE GRAND CLIMAX FINALE ROCKET (t = 11.4s – 13.2s):
        // Launches from BOTTOM-CENTER, rises to apex, detonates at t = 13.2s into 720px golden bloom!
        {
          launchTime: 11.4,
          config: {
            startX: w * 0.50,
            startY: h + 15,
            targetY: h * 0.30,
            angleOffset: 0,
            palette: CELESTIAL_PALETTES.gold,
            isFinal: true
          },
          launched: false
        }
      ];
    }

    start() {
      // 1. Mount immediately upon unlock
      this.mount();
      this.startTime = performance.now();
      this.setupChoreography();

      // 2. Prepare audio context and preload
      this.audio.prepare();

      // 3. Start render loop
      this.loop = this.loop.bind(this);
      this.animId = requestAnimationFrame(this.loop);
    }

    triggerOutro() {
      if (this.isDissolving) return;
      this.isDissolving = true;
      this.outroStartTime = performance.now();
    }

    // Draws high-definition glowing typography behind the sparkler constellation
    drawGlowingTypography(elapsedSec) {
      if (elapsedSec < 13.8) return;

      // Text alpha smoothly fades in from 13.8s to 14.8s, stays solid, then gently dissolves during outro
      let alpha = 0;
      if (elapsedSec >= 13.8 && elapsedSec < 14.8) {
        alpha = (elapsedSec - 13.8) / 1.0;
      } else if (!this.isDissolving) {
        alpha = 1.0;
      } else if (this.isDissolving && this.outroStartTime) {
        const outroElapsed = (performance.now() - this.outroStartTime) / 1000;
        alpha = Math.max(0, 1.0 - (outroElapsed / 1.8));
      }
      if (alpha <= 0.01) return;

      const cx = this.width * 0.5;
      const cy = this.height * 0.35;
      const scale = Math.min(this.width / 1920, this.height / 1080);
      const f1 = Math.max(28, Math.min(42, Math.round(40 * Math.max(scale, 0.75))));
      const f2 = Math.max(56, Math.min(86, Math.round(82 * Math.max(scale, 0.75))));
      const fHeart = Math.max(28, Math.min(40, Math.round(38 * Math.max(scale, 0.75))));

      const ctx = this.ctx;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const shimmer = Math.sin(elapsedSec * 3.5) * 0.07;
      const effectiveAlpha = Math.min(1.0, Math.max(0, alpha + shimmer));

      // Line 1: H A P P Y   B I R T H D A Y (Pure 24k Royal Gold)
      ctx.save();
      ctx.font = `700 ${f1}px 'Cinzel', serif`;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.88)';
      ctx.shadowBlur = 20;
      ctx.globalAlpha = effectiveAlpha * 0.95;

      const goldGrad = ctx.createLinearGradient(cx - 240, 0, cx + 240, 0);
      goldGrad.addColorStop(0, '#FFE082');
      goldGrad.addColorStop(0.3, '#FFF9E6');
      goldGrad.addColorStop(0.5, '#FFD700');
      goldGrad.addColorStop(0.8, '#FFB300');
      goldGrad.addColorStop(1, '#FFE082');

      ctx.fillStyle = goldGrad;
      ctx.fillText('H  A  P  P  Y     B  I  R  T  H  D  A  Y', cx, cy - f1 * 1.15);
      ctx.restore();

      // Line 2: Lahari (Grand Romantic Rose-Gold Cursive Calligraphy)
      ctx.save();
      ctx.font = `400 ${f2}px 'Great Vibes', cursive`;
      ctx.shadowColor = 'rgba(255, 105, 180, 0.90)';
      ctx.shadowBlur = 26;
      ctx.globalAlpha = effectiveAlpha;

      const roseGrad = ctx.createLinearGradient(cx - 160, 0, cx + 160, 0);
      roseGrad.addColorStop(0, '#FFFFFF');
      roseGrad.addColorStop(0.25, '#FFE4E6');
      roseGrad.addColorStop(0.6, '#FFA0B5');
      roseGrad.addColorStop(1, '#FF7597');

      ctx.fillStyle = roseGrad;
      ctx.fillText('Lahari', cx, cy + f2 * 0.40);

      // Fine golden-white shimmer glint on Lahari's flourishes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
      ctx.lineWidth = 1.0;
      ctx.strokeText('Lahari', cx, cy + f2 * 0.40);
      ctx.restore();

      // Diamond star glints on the flourish tips
      const glintPulse = Math.sin(elapsedSec * 6.0) * 0.35 + 0.65;
      const drawGlint = (gx, gy, gr) => {
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(elapsedSec * 0.7);
        ctx.fillStyle = `rgba(255, 255, 255, ${effectiveAlpha * glintPulse})`;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos(i * Math.PI / 2) * gr, Math.sin(i * Math.PI / 2) * gr);
          ctx.lineTo(Math.cos(i * Math.PI / 2 + Math.PI / 4) * (gr * 0.22), Math.sin(i * Math.PI / 2 + Math.PI / 4) * (gr * 0.22));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      drawGlint(cx - 105, cy + f2 * 0.22, 7.5);
      drawGlint(cx + 95, cy + f2 * 0.25, 6.5);

      // Line 3: Heart ♥ (Pulsing Ruby Neon Heart)
      ctx.save();
      const heartPulse = 1.0 + Math.sin(elapsedSec * 5.5) * 0.10;
      ctx.translate(cx, cy + f2 * 1.30);
      ctx.scale(heartPulse, heartPulse);

      ctx.font = `${fHeart}px serif`;
      ctx.shadowColor = 'rgba(255, 42, 122, 0.90)';
      ctx.shadowBlur = 24;
      ctx.globalAlpha = effectiveAlpha;
      ctx.fillStyle = '#FF2A7A';
      ctx.fillText('♥', 0, 0);
      ctx.restore();

      ctx.restore();
    }

    loop(now) {
      if (this.isComplete) return;

      const elapsedSec = (now - this.startTime) / 1000;

      // 1. Overlay fade management:
      // - Rapid fade-in to midnight sky in first 0.6s right upon passcode entry!
      // - Stays deep midnight until outro begins
      // - Smooth fade-out back to normal site over 2.5s during outro
      if (elapsedSec < 0.6) {
        this.dimAlpha = (elapsedSec / 0.6) * 0.94;
      } else if (!this.isDissolving) {
        this.dimAlpha = 0.94;
      } else if (this.isDissolving && this.outroStartTime) {
        const outroElapsed = (now - this.outroStartTime) / 1000;
        this.dimAlpha = Math.max(0, 0.94 * (1 - (outroElapsed / 2.5)));
      }

      this.ctx.save();
      this.ctx.clearRect(0, 0, this.width, this.height);

      if (this.dimAlpha > 0.001) {
        this.ctx.fillStyle = `rgba(6, 3, 12, ${this.dimAlpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
      this.ctx.restore();

      // 2. Start Music at t = 1.6s after 1.0s suspense in dark night sky
      if (elapsedSec >= 1.6 && !this.audio.hasStartedMusic) {
        this.audio.startMusic(() => {
          this.triggerOutro();
        });
      }

      // Safety fallback: if audio fails to play or complete within 23.5s, trigger outro
      if (elapsedSec >= 23.5 && !this.isDissolving) {
        this.triggerOutro();
      }

      // 3. Launch Rockets Choreography
      for (let i = 0; i < this.launchQueue.length; i++) {
        const item = this.launchQueue[i];
        if (!item.launched && elapsedSec >= item.launchTime) {
          item.launched = true;
          this.rockets.push(new MasterSparklerRocket(item.config));
          this.audio.playLaunchSound(item.config.isFinal);
        }
      }

      // 4. Update & Render Rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.update();
        r.draw(this.ctx);

        if (r.exploded) {
          this.createExplosion(r.x, r.y, r.isFinal, r.palette);
          this.rockets.splice(i, 1);
        } else if (!r.alive) {
          this.rockets.splice(i, 1);
        }
      }

      // 5. Radial Flashes
      for (let i = this.flashes.length - 1; i >= 0; i--) {
        const f = this.flashes[i];
        this.ctx.save();
        const flashGrad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        flashGrad.addColorStop(0, `rgba(255, 248, 220, ${f.alpha * 0.60})`);
        flashGrad.addColorStop(0.4, `rgba(255, 215, 0, ${f.alpha * 0.30})`);
        flashGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');

        this.ctx.fillStyle = flashGrad;
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        f.alpha -= f.decay;
        f.radius += 10;
        if (f.alpha <= 0) {
          this.flashes.splice(i, 1);
        }
      }

      // 6. Draw Glowing Vector Typography
      this.drawGlowingTypography(elapsedSec);

      // 7. Converge Sparks into Text at t = 13.8s
      if (elapsedSec >= 13.8 && !this.textTargetsAssigned) {
        this.assignSparksToText();
      }

      // 8. Update & Render Particles
      const isSettledPhase = elapsedSec >= 13.8 && !this.isDissolving;

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.update(this.isDissolving, isSettledPhase, elapsedSec);
        p.draw(this.ctx, isSettledPhase, elapsedSec);

        if (!p.alive || p.alpha <= 0.01) {
          this.particles.splice(i, 1);
        }
      }

      // 9. Finish celebration once outro duration (2.5s) completes
      if (this.isDissolving && this.outroStartTime) {
        const outroElapsed = (now - this.outroStartTime) / 1000;
        if (outroElapsed >= 2.5) {
          this.finish();
          return;
        }
      }

      this.animId = requestAnimationFrame(this.loop);
    }

    finish() {
      if (this.isComplete) return;
      this.isComplete = true;

      document.body.classList.remove('birthday-celebration-active');

      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }

      this.audio.cleanup();

      if (this.canvas) {
        this.canvas.style.pointerEvents = 'none';
        if (this.blockHandler) {
          this.canvas.removeEventListener('click', this.blockHandler);
          this.canvas.removeEventListener('mousedown', this.blockHandler);
          this.canvas.removeEventListener('mouseup', this.blockHandler);
          this.canvas.removeEventListener('touchstart', this.blockHandler);
          this.canvas.removeEventListener('touchend', this.blockHandler);
        }
        this.canvas.style.opacity = '0';
        setTimeout(() => {
          if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
          }
          this.canvas = null;
        }, 700);
      }

      window.removeEventListener('resize', this.onResizeBound);
    }
  }

  // ==========================================================================
  // 6. GLOBAL TRIGGER (Immediate Overlay on Passcode Unlock)
  // ==========================================================================
  let activeCelebrationInstance = null;
  let lastTriggerTime = 0;

  window.triggerBirthdayCelebration = function () {
    if (!isCelebrationActive()) return;

    const now = Date.now();
    // Guard against duplicate calls within 2.5s (e.g. from both trigger call & sanctuary:unlocked event)
    if (now - lastTriggerTime < 2500 && activeCelebrationInstance) {
      return;
    }
    lastTriggerTime = now;

    if (activeCelebrationInstance) {
      activeCelebrationInstance.finish();
      activeCelebrationInstance = null;
    }

    activeCelebrationInstance = new MasterBirthdayCelebration();
    window.__activeCelebration = activeCelebrationInstance;
    activeCelebrationInstance.start();
  };

  window.BirthdayCelebration = {
    trigger: window.triggerBirthdayCelebration,
    isActive: isCelebrationActive,
    config: CELEBRATION_CONFIG
  };

  window.addEventListener('sanctuary:unlocked', function () {
    window.triggerBirthdayCelebration();
  });
})();
