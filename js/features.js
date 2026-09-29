/* ==========================================================================
   INTERACTIVE FEATURES MODULE — NISAR × LAHARI
   1. Hold-to-Hug Simulator with dynamic SVG progress ring & whisper reveal
   2. Dual Cardiac ECG Oscilloscope with synchronized live waveform
   3. "Our Name in Lights" interactive Neon sign with pull-chain & ignition
   4. 3D Polaroid photo deck with flick interaction
   5. Bedside Love Beacon touch lamp with ambient glow
   6. Personal Voice Note player with procedural chords & waveform canvas
   7. Private Vault with LocalStorage persistence for secret notes
   8. 35mm Vintage Film Reel Auto-Movement, Drag & Slider
   9. Floating Ambient Soundscapes Vinyl Widget (Procedural Web Audio)
   10. The Secret Midnight Vault Modal & Wax Seal Break
   11. Full-Screen 3D Photo Lightbox
   12. Keepsake Letter Button
   13. Full suite of synthesized Web Audio acoustic sound effects
   ========================================================================== */

(function () {
  'use strict';

  /* --- 1. Synthesized Web Audio Sound Effects --- */
  function playAcousticHeartbeat() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      function thump(time, freqStart, freqEnd, gainPeak, duration) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freqStart, time);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, time + duration);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(gainPeak, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      }

      const t = ctx.currentTime;
      thump(t, 68, 42, 0.14, 0.22); // 'Lub'
      thump(t + 0.15, 58, 36, 0.11, 0.18); // 'Dub'

      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = 'sine';
      harm.frequency.setValueAtTime(523.25, t + 0.16);
      harmGain.gain.setValueAtTime(0.02, t + 0.16);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
      harm.connect(harmGain);
      harmGain.connect(ctx.destination);
      harm.start(t + 0.16);
      harm.stop(t + 0.9);
    } catch (err) {}
  }

  function playNeonIgnitionSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(320, t);
      clickGain.gain.setValueAtTime(0.09, t);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(t);
      click.stop(t + 0.06);

      const buzz = ctx.createOscillator();
      const buzzGain = ctx.createGain();
      buzz.type = 'sawtooth';
      buzz.frequency.setValueAtTime(120, t + 0.02);
      buzzGain.gain.setValueAtTime(0.0001, t + 0.02);
      buzzGain.gain.exponentialRampToValueAtTime(0.04, t + 0.08);
      buzzGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      buzz.connect(buzzGain);
      buzzGain.connect(ctx.destination);
      buzz.start(t + 0.02);
      buzz.stop(t + 0.38);
    } catch (err) {}
  }

  function playCardFlickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    } catch (err) {}
  }

  function playRomanticChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.9);
      });
    } catch (err) {}
  }

  function playClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 180;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (err) {}
  }

  function playBeaconIgnitionSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, t);
      osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.25);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.07, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.9);
    } catch (err) {}
  }

  function playWaxBreakSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * 0.05);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 850;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t + 0.02);
      osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.22);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + 0.02);
      osc.stop(t + 1.2);
    } catch (err) {}
  }

  /* --- 2. Hug Simulator --- */
  function initHugSimulator() {
    const hugBtn = document.getElementById('btn-hold-hug');
    const counterEl = document.getElementById('hug-counter-number');
    const statusEl = document.getElementById('page-hug-status-text') || document.getElementById('hug-status-text');
    const progressCircle = document.getElementById('hug-progress-circle');
    const whisperBox = document.getElementById('embrace-whisper-box');
    const whisperText = document.getElementById('embrace-whisper-text');
    if (!hugBtn) return;

    let count = parseInt(localStorage.getItem('sanctum_embrace_count') || '1248', 10);
    if (counterEl) counterEl.textContent = count.toLocaleString();

    const totalCircumference = 276.46; // 2 * PI * 44
    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${totalCircumference}`;
      progressCircle.style.strokeDashoffset = `${totalCircumference}`;
    }

    const whisperQuotes = [
      "Kaash is waqt mai sach me tumhe gale laga sakta, aur saari duniya ko bhula deta.",
      "Tumhari muskaan meri sabse pyari manzil hai, Lahari.",
      "Chahe kitni bhi doori ho, mera dil hamesha tumhari dhadkan ke saath dhadakta hai.",
      "Tum meri zindagi ka wo sabse haseen hissa ho jo maine khuda se maanga tha.",
      "Jab bhi tumhari yaad aati hai, ek bepanah sukoon milta hai.",
      "Meri har subah tumhari muskaan se shuru aur har raat tumhari yaadon pe khatam hoti hai.",
      "Bas itna kehna tha... tum mere liye sabse khaas ho aur hamesha rahogi.",
      "Tumhara haath thaam kar har mushkil aasan lagti hai.",
      "Tumhari aawaz sun kar dil ka saara shor shant ho jata hai.",
      "Tum sirf mera pyaar nahi, mera sabse pyara sukoon ho.",
      "Har janam me agar mujhe jeene ka mauka mile, mai har baar sirf tumhe hi chununga.",
      "Ek pal bhi agar tum door hoti ho, to aisa lagta hai koi apna hissa chhoot gaya.",
      "Tumhare bina ye dil adhoora tha, tum aayi to zindagi poori ban gayi.",
      "Jab tak ye saansein hain, tab tak ye dil sirf tumhara hai, meri jaan.",
      "Tum meri wo dua ho jo qubool hone ke baad bhi har pal shukrane me rehti hai."
    ];

    let holdTimer = null;
    let pulseInterval = null;
    let animFrameId = null;
    let holdStartTime = 0;
    const holdDuration = 3000;

    function updateProgress() {
      const elapsed = performance.now() - holdStartTime;
      const progress = Math.min(1, elapsed / holdDuration);
      if (progressCircle) {
        const offset = totalCircumference * (1 - progress);
        progressCircle.style.strokeDashoffset = `${offset}`;
      }
      if (progress < 1) {
        animFrameId = requestAnimationFrame(updateProgress);
      }
    }

    function startHold(e) {
      if (e.type === 'touchstart') e.preventDefault();
      hugBtn.classList.add('holding');
      if (statusEl) {
        statusEl.classList.remove('hug-success');
        statusEl.textContent = 'Holding warm embrace... (keep holding)';
      }
      holdStartTime = performance.now();

      playAcousticHeartbeat();
      if (navigator.vibrate) navigator.vibrate([40, 100, 40]);
      pulseInterval = setInterval(() => {
        playAcousticHeartbeat();
        if (navigator.vibrate) navigator.vibrate([40, 100, 40]);
      }, 850);

      animFrameId = requestAnimationFrame(updateProgress);

      holdTimer = setTimeout(() => {
        completeHug();
      }, holdDuration);
    }

    function cancelHold() {
      hugBtn.classList.remove('holding');
      if (holdTimer) clearTimeout(holdTimer);
      if (pulseInterval) clearInterval(pulseInterval);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = `${totalCircumference}`;
      }
      if (statusEl && !statusEl.classList.contains('hug-success')) {
        statusEl.textContent = 'Hold for 3 seconds to send your embrace...';
      }
    }

    function completeHug() {
      cancelHold();
      count++;
      localStorage.setItem('sanctum_embrace_count', count.toString());
      if (counterEl) counterEl.textContent = count.toLocaleString();

      playRomanticChime();

      if (whisperBox && whisperText) {
        const quote = whisperQuotes[Math.floor(Math.random() * whisperQuotes.length)];
        whisperText.textContent = `“${quote}”`;
        whisperBox.style.display = 'block';
        whisperBox.classList.add('reveal');
      }

      if (statusEl) {
        statusEl.classList.add('hug-success');
        statusEl.innerHTML = '❤️ <strong>Embrace sent!</strong> Feeling your warmth right now.';
        setTimeout(() => {
          statusEl.classList.remove('hug-success');
          statusEl.textContent = 'Hold for 3 seconds to send your embrace...';
        }, 8000);
      }
    }

    hugBtn.addEventListener('mousedown', startHold);
    hugBtn.addEventListener('touchstart', startHold, { passive: false });
    window.addEventListener('mouseup', cancelHold);
    window.addEventListener('touchend', cancelHold);
  }

  /* --- 3. Dual Cardiac ECG Monitor Canvas --- */
  function initECGMonitor() {
    const canvas = document.getElementById('ecg-canvas');
    const syncBtn = document.getElementById('btn-sync-heartbeat');
    const syncStatusEl = document.getElementById('rhythm-sync-status');
    const legendSyncTag = document.getElementById('legend-sync-tag');
    const counterEl = document.getElementById('rhythm-counter-number');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 360;
    let height = 82;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (canvas.parentElement) {
        width = canvas.parentElement.clientWidth || 360;
        height = canvas.parentElement.clientHeight || 82;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    let sweepX = 0;
    const sweepSpeed = 1.75;
    let syncTarget = 0.0;
    let currentSync = 0.0;
    let syncResetTimer = null;

    function getEcgY(xPos, phaseOffset = 0, midY = height * 0.5) {
      const beatPeriod = Math.max(160, width / 2.15);
      const adjustedX = (xPos + phaseOffset + beatPeriod * 1000) % beatPeriod;
      const phase = adjustedX / beatPeriod;

      if (phase < 0.16) return midY;
      if (phase >= 0.16 && phase < 0.28) {
        const pNorm = (phase - 0.16) / 0.12;
        return midY - Math.sin(pNorm * Math.PI) * 7.5;
      }
      if (phase >= 0.28 && phase < 0.37) return midY;
      if (phase >= 0.37 && phase < 0.40) {
        const qNorm = (phase - 0.37) / 0.03;
        return midY + Math.sin(qNorm * Math.PI) * 4.5;
      }
      if (phase >= 0.40 && phase < 0.445) {
        const rNorm = (phase - 0.40) / 0.045;
        const rSharp = Math.pow(Math.sin(rNorm * Math.PI), 1.15);
        return midY - rSharp * 32;
      }
      if (phase >= 0.445 && phase < 0.485) {
        const sNorm = (phase - 0.445) / 0.040;
        return midY + Math.sin(sNorm * Math.PI) * 11;
      }
      if (phase >= 0.485 && phase < 0.57) return midY;
      if (phase >= 0.57 && phase < 0.75) {
        const tNorm = (phase - 0.57) / 0.18;
        return midY - Math.sin(tNorm * Math.PI) * 11;
      }
      return midY;
    }

    function renderOscilloscope() {
      currentSync += (syncTarget - currentSync) * 0.05;

      ctx.fillStyle = '#0a0508';
      ctx.fillRect(0, 0, width, height);

      // CRT grid lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let gx = 0; gx <= width; gx += 18) {
        ctx.moveTo(gx, 0); ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy <= height; gy += 15) {
        ctx.moveTo(0, gy); ctx.lineTo(width, gy);
      }
      ctx.stroke();

      sweepX = (sweepX + sweepSpeed) % width;

      const midY = height * 0.5;
      const nisarPhase = 0;
      const lahariBasePhase = width * 0.28;
      const lahariPhase = lahariBasePhase * (1 - currentSync);

      // Draw Lahari Wave (Pink)
      ctx.strokeStyle = '#ff3366';
      ctx.shadowColor = '#ff3366';
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y = getEcgY(x, lahariPhase, midY - 2);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Nisar Wave (Gold)
      ctx.strokeStyle = '#dfb76c';
      ctx.shadowColor = '#dfb76c';
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y = getEcgY(x, nisarPhase, midY + 2);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Sweep head beam
      ctx.fillStyle = 'rgba(255, 240, 200, 0.8)';
      ctx.beginPath();
      ctx.arc(sweepX, getEcgY(sweepX, 0, midY), 2.5, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(renderOscilloscope);
    }
    requestAnimationFrame(renderOscilloscope);

    let todayCount = parseInt(localStorage.getItem('sanctum_heartbeats_today') || '12631', 10);
    if (counterEl) counterEl.textContent = todayCount.toLocaleString();

    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        playAcousticHeartbeat();
        if (navigator.vibrate) navigator.vibrate([60, 100, 60]);

        todayCount += 2;
        localStorage.setItem('sanctum_heartbeats_today', todayCount.toString());
        if (counterEl) counterEl.textContent = todayCount.toLocaleString();

        syncTarget = 1.0;
        if (syncStatusEl) {
          syncStatusEl.classList.add('synced');
          syncStatusEl.textContent = '✨ Heartbeats synchronized in perfect rhythm!';
        }
        if (legendSyncTag) legendSyncTag.style.display = 'inline';

        if (syncResetTimer) clearTimeout(syncResetTimer);
        syncResetTimer = setTimeout(() => {
          syncTarget = 0.0;
          if (syncStatusEl) {
            syncStatusEl.classList.remove('synced');
            syncStatusEl.textContent = 'Waves independent • Tap to synchronize';
          }
          if (legendSyncTag) legendSyncTag.style.display = 'none';
        }, 12000);
      });
    }
  }

  /* --- 4. Our Name in Lights (Neon Pull Chain) --- */
  function initNeonSign() {
    const pullBtn = document.getElementById('pull-chain-btn');
    const neonBoard = document.getElementById('neon-board');
    const statusHint = document.getElementById('neon-status-hint');
    if (!pullBtn || !neonBoard) return;

    pullBtn.addEventListener('click', () => {
      const isLit = neonBoard.classList.toggle('neon-lit');
      if (isLit) {
        playNeonIgnitionSound();
        if (statusHint) {
          statusHint.innerHTML = '✨ <em>Radiant &bull; Pull the golden chain to return to starlight</em>';
        }
      } else {
        playClickSound();
        if (statusHint) {
          statusHint.innerHTML = '🌙 <em>Dimmed &bull; Pull the golden chain to ignite our radiant glow</em>';
        }
      }
    });
  }

  /* --- 5. Bedside Love Beacon --- */
  function initLoveBeacon() {
    const beaconBox = document.getElementById('love-beacon-box');
    const beaconBtn = document.getElementById('btn-light-beacon');
    const clocheLamp = document.getElementById('beacon-lamp-cloche');
    const stateLabel = document.getElementById('beacon-state-label');
    const quoteEl = document.getElementById('beacon-quote-text');
    if (!beaconBtn && !clocheLamp) return;

    function toggleBeacon() {
      if (!beaconBox) return;
      const isLit = beaconBox.classList.toggle('beacon-lit');

      if (isLit) {
        if (beaconBtn) beaconBtn.innerHTML = 'EXTINGUISH BEACON <span class="btn-beacon-icon">🌙</span>';
        if (stateLabel) stateLabel.innerHTML = 'LAMP: GLOWING • CONNECTED WITH NISAR';
        if (quoteEl) quoteEl.innerHTML = '“💛 The beacon is glowing warmly across the distance. You are never alone.”';
        playBeaconIgnitionSound();
        if (navigator.vibrate) navigator.vibrate([40, 70]);
      } else {
        if (beaconBtn) beaconBtn.innerHTML = 'LIGHT THE BEACON <span class="btn-beacon-icon">🏮</span>';
        if (stateLabel) stateLabel.innerHTML = 'LAMP: DORMANT • TAP TO LIGHT';
        if (quoteEl) quoteEl.innerHTML = '“Tap the golden lamp above to illuminate our shared warmth across the night.”';
        playClickSound();
      }
    }

    if (beaconBtn) beaconBtn.addEventListener('click', toggleBeacon);
    if (clocheLamp) clocheLamp.addEventListener('click', toggleBeacon);
  }

  /* --- 6. Personal Voice Note Player --- */
  function initVoiceNote() {
    const playBtn = document.getElementById('voice-play-btn');
    const canvas = document.getElementById('waveform-canvas');
    const currentTimeEl = document.getElementById('voice-current-time');
    const totalTimeEl = document.getElementById('voice-total-time');
    const statusBadge = document.getElementById('voice-status-badge');
    if (!playBtn || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth || 300;
    let height = canvas.height = canvas.offsetHeight || 56;

    let isPlaying = false;
    let audioContext = null;
    let synthTimer = null;
    let synthElapsed = 0;
    let animId = null;

    const audio = new Audio();
    audio.src = 'assets/audio/voice-note.mp3';
    let useFallback = true;

    audio.addEventListener('canplaythrough', () => {
      useFallback = false;
      if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
      if (statusBadge) statusBadge.textContent = 'Voice Note Active';
    });

    audio.addEventListener('timeupdate', () => {
      if (!useFallback && currentTimeEl) {
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('ended', stopPlayback);

    function formatTime(secs) {
      if (isNaN(secs)) return '00:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function startProceduralChords() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!audioContext) audioContext = new AudioCtx();
        if (audioContext.state === 'suspended') audioContext.resume();

        const chords = [
          [220, 261.63, 329.63, 392],    // Am7
          [174.61, 220, 261.63, 329.63], // Fmaj7
          [261.63, 329.63, 392, 493.88], // Cmaj7
          [196, 246.94, 293.66, 392]     // G
        ];
        let chordIdx = 0;

        function playChord(notes) {
          if (!isPlaying) return;
          notes.forEach(freq => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            gain.gain.setValueAtTime(0.001, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.8);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start();
            osc.stop(audioContext.currentTime + 3.9);
          });
        }

        playChord(chords[0]);
        synthTimer = setInterval(() => {
          synthElapsed++;
          if (currentTimeEl) currentTimeEl.textContent = formatTime(synthElapsed);
          if (synthElapsed % 4 === 0) {
            chordIdx = (chordIdx + 1) % chords.length;
            playChord(chords[chordIdx]);
          }
          if (synthElapsed >= 105) stopPlayback();
        }, 1000);
      } catch (err) {}
    }

    function drawWaveform() {
      ctx.clearRect(0, 0, width, height);
      const barCount = 38;
      const barWidth = 3;
      const gap = (width - (barCount * barWidth)) / (barCount - 1);

      for (let i = 0; i < barCount; i++) {
        let barH = 8;
        if (isPlaying) {
          const t = Date.now() * 0.005;
          barH = 8 + Math.abs(Math.sin(t + i * 0.3)) * (height * 0.7);
        } else {
          barH = 6 + Math.sin(i * 0.3) * 6;
        }

        const x = i * (barWidth + gap);
        const y = (height - barH) / 2;

        ctx.fillStyle = isPlaying ? '#dfb76c' : 'rgba(249, 217, 118, 0.3)';
        ctx.fillRect(x, y, barWidth, barH);
      }

      animId = requestAnimationFrame(drawWaveform);
    }
    drawWaveform();

    function startPlayback() {
      isPlaying = true;
      playBtn.textContent = '⏸';
      if (!useFallback) {
        audio.play().catch(() => {
          useFallback = true;
          startProceduralChords();
        });
      } else {
        startProceduralChords();
      }
    }

    function stopPlayback() {
      isPlaying = false;
      playBtn.textContent = '▶';
      if (!useFallback) {
        audio.pause();
      }
      if (synthTimer) {
        clearInterval(synthTimer);
        synthTimer = null;
      }
    }

    playBtn.addEventListener('click', () => {
      if (isPlaying) stopPlayback(); else startPlayback();
    });
  }

  /* --- 7. Private Vault - Leave a Secret Note --- */
  function initPrivateVault() {
    const input = document.getElementById('secret-note-input');
    const sealBtn = document.getElementById('btn-seal-wax');
    const msgBox = document.getElementById('vault-sealed-message');
    if (!sealBtn || !input) return;

    const saved = localStorage.getItem('sanctum_lahari_vault_note');
    if (saved && input) input.value = saved;

    sealBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        alert('Please write a few words before sealing your secret note ❤️');
        return;
      }

      localStorage.setItem('sanctum_lahari_vault_note', text);
      playWaxBreakSound();

      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.innerHTML = `
          💌 <strong>Note Sealed in Eternal Vault</strong><br>
          <span style="font-size: 0.85rem; opacity: 0.85;">Your secret note has been encrypted and saved safely for Nisar. Time: ${new Date().toLocaleTimeString()}</span>
        `;
      }
      sealBtn.textContent = 'SEALED WITH WAX 💌';
      setTimeout(() => {
        sealBtn.textContent = 'UPDATE SEALED NOTE 💌';
      }, 4000);
    });
  }

  /* --- 8. Polaroid Moments Stack (Page Edition) --- */
  function initPolaroidStack() {
    const stackWrap = document.getElementById('polaroid-stack-wrap');
    if (!stackWrap) return;

    const cards = Array.from(stackWrap.querySelectorAll('.polaroid-card'));
    if (!cards.length) return;

    let activeIndex = 0;
    let lastAdvance = 0;

    const stackPositions = [
      { x: 0, y: 0, rot: -0.5, scale: 1, op: 1, pe: 'auto' },
      { x: 7, y: 5, rot: 3.5, scale: 0.985, op: 0.96, pe: 'none' },
      { x: -9, y: 11, rot: -4.2, scale: 0.97, op: 0.91, pe: 'none' },
      { x: 11, y: 17, rot: 4.8, scale: 0.95, op: 0.84, pe: 'none' },
      { x: -6, y: 23, rot: -2.8, scale: 0.93, op: 0.74, pe: 'none' },
      { x: 6, y: 29, rot: 2.5, scale: 0.90, op: 0.60, pe: 'none' },
      { x: -5, y: 35, rot: -1.8, scale: 0.87, op: 0.44, pe: 'none' },
      { x: 3, y: 41, rot: 1.5, scale: 0.84, op: 0.22, pe: 'none' }
    ];

    function updateStack() {
      cards.forEach((card, idx) => {
        const order = (idx - activeIndex + cards.length) % cards.length;
        card.style.zIndex = (cards.length - order).toString();

        const pos = stackPositions[Math.min(order, stackPositions.length - 1)];
        card.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rot}deg) scale(${pos.scale})`;
        card.style.opacity = pos.op.toString();
        card.style.pointerEvents = pos.pe;
      });
    }

    updateStack();

    function advanceCard() {
      const now = Date.now();
      if (now - lastAdvance < 280) return;
      lastAdvance = now;

      const currentTop = cards[activeIndex];
      if (!currentTop) return;

      currentTop.style.transform = 'translate(170px, -45px) rotate(15deg) scale(0.96)';
      currentTop.style.opacity = '0';
      playCardFlickSound();

      setTimeout(() => {
        activeIndex = (activeIndex + 1) % cards.length;
        updateStack();
      }, 180);
    }

    stackWrap.addEventListener('click', advanceCard);
  }

  /* --- 9. 35mm Vintage Film Reel Auto-Movement, Drag & Slider --- */
  function initVintageFilmReel() {
    const viewport = document.getElementById('filmstrip-viewport');
    const track = document.getElementById('filmstrip-track');
    const progressBar = document.getElementById('filmstrip-progress-bar');
    const prevBtn = document.getElementById('filmstrip-prev');
    const nextBtn = document.getElementById('filmstrip-next');

    if (!viewport || !track) return;

    let isDown = false;
    let isHovered = false;
    let startX;
    let scrollLeft;
    const autoScrollSpeed = 0.8;

    function updateProgressBar() {
      if (!progressBar || !viewport) return;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (maxScroll <= 0) return;
      const ratio = viewport.scrollLeft / maxScroll;
      const trackWidth = 170;
      const barWidth = 48;
      const maxTravel = trackWidth - barWidth;
      const travel = Math.min(Math.max(0, ratio * maxTravel), maxTravel);
      progressBar.style.transform = `translateX(${travel}px)`;
    }

    function autoScrollReel() {
      if (!isHovered && !isDown && viewport) {
        viewport.scrollLeft += autoScrollSpeed;
        if (viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2) {
          viewport.scrollLeft = 0;
        }
        updateProgressBar();
      }
      requestAnimationFrame(autoScrollReel);
    }
    requestAnimationFrame(autoScrollReel);

    viewport.addEventListener('scroll', updateProgressBar, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: -315, behavior: 'smooth' });
        setTimeout(updateProgressBar, 350);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        viewport.scrollBy({ left: 315, behavior: 'smooth' });
        setTimeout(updateProgressBar, 350);
      });
    }

    viewport.addEventListener('mouseenter', () => { isHovered = true; });
    viewport.addEventListener('mouseleave', () => { isHovered = false; });
    viewport.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    viewport.addEventListener('touchend', () => {
      setTimeout(() => { isHovered = false; }, 800);
    }, { passive: true });

    viewport.addEventListener('mousedown', (e) => {
      isDown = true;
      viewport.style.cursor = 'grabbing';
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      if (viewport) viewport.style.cursor = 'grab';
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 1.8;
      viewport.scrollLeft = scrollLeft - walk;
      updateProgressBar();
    });
  }

  /* --- 10. Floating Ambient Soundscapes Vinyl Widget --- */
  function initSoundscapes() {
    const widget = document.getElementById('ambient-music-widget');
    const vinyl = document.getElementById('vinyl-disc');
    const playBtn = document.getElementById('ambient-play-btn');
    const nextBtn = document.getElementById('ambient-next-btn');
    const titleEl = document.getElementById('ambient-track-title');
    const tagEl = document.getElementById('ambient-track-tag');
    if (!widget || !vinyl) return;

    let audioCtx = null;
    let isPlaying = false;
    let currentTrackIdx = 0;
    let timerId = null;

    const tracks = [
      { title: "Midnight Serenade", tag: "Piano & Strings", tempo: 1200, scale: [261.63, 329.63, 392.00, 493.88, 523.25, 659.25], bass: 130.81 },
      { title: "Cozy Candlelight", tag: "Acoustic Warmth", tempo: 1400, scale: [293.66, 349.23, 440.00, 523.25, 587.33], bass: 146.83 },
      { title: "Starlit Rain", tag: "Dreamy Lo-Fi", tempo: 1600, scale: [329.63, 392.00, 493.88, 587.33, 659.25], bass: 164.81 }
    ];

    function getAudioContext() {
      if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioCtx();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playNote(freq, time, duration, isPad = false) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = isPad ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, time);
        const peakGain = isPad ? 0.025 : 0.04;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(peakGain, time + (isPad ? 0.8 : 0.08));
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + duration + 0.05);
      } catch (e) {}
    }

    function scheduleMeasure() {
      if (!isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const cur = tracks[currentTrackIdx];
      playNote(cur.bass, now, 2.8, true);
      const notesToPlay = 4;
      for (let i = 0; i < notesToPlay; i++) {
        const freq = cur.scale[Math.floor(Math.random() * cur.scale.length)];
        playNote(freq, now + i * (cur.tempo / 4000), 1.6, false);
      }
      timerId = setTimeout(scheduleMeasure, cur.tempo);
    }

    function stopSoundscapes() {
      isPlaying = false;
      widget.classList.remove('playing');
      if (playBtn) playBtn.innerHTML = '▶';
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      if (audioCtx && audioCtx.state === 'running') {
        try { audioCtx.suspend(); } catch(e) {}
      }
    }

    function togglePlayback() {
      isPlaying = !isPlaying;
      widget.classList.toggle('playing', isPlaying);
      if (playBtn) playBtn.innerHTML = isPlaying ? '⏸' : '▶';
      if (isPlaying) {
        if (window.RomanticAudio && typeof window.RomanticAudio.pause === 'function') {
          try { window.RomanticAudio.pause(); } catch(e) {}
        }
        getAudioContext();
        scheduleMeasure();
      } else {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        if (audioCtx && audioCtx.state === 'running') {
          try { audioCtx.suspend(); } catch(e) {}
        }
      }
    }

    window.stopAllAmbientSoundscapes = stopSoundscapes;

    function nextTrack() {
      currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
      if (titleEl) titleEl.textContent = tracks[currentTrackIdx].title;
      if (tagEl) tagEl.textContent = tracks[currentTrackIdx].tag;
      if (isPlaying) {
        if (timerId) clearTimeout(timerId);
        scheduleMeasure();
      }
    }

    vinyl.addEventListener('click', togglePlayback);
    if (playBtn) playBtn.addEventListener('click', togglePlayback);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  }

  /* --- 11. The Secret Midnight Vault Modal & Wax Seal Break --- */
  function initSecretMidnightVault() {
    const trigger = document.getElementById('secret-vault-trigger') || document.getElementById('secret-monogram-trigger');
    const modal = document.getElementById('midnight-vault-modal');
    const closeBtn = document.getElementById('midnight-vault-close') || document.getElementById('vault-close-btn');
    const waxBtn = document.getElementById('midnight-wax-seal') || document.getElementById('vault-wax-seal-btn');
    const sealedView = document.getElementById('midnight-sealed-view') || document.getElementById('vault-seal-box');
    const letterView = document.getElementById('midnight-letter-view') || document.getElementById('vault-letter-box');

    if (!trigger || !modal) return;

    function openVault() {
      modal.classList.add('active');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (sealedView && letterView) {
        sealedView.style.display = 'block';
        letterView.style.display = 'none';
      }
    }

    function closeVault() {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    trigger.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openVault();
    });

    let lastTapTime = 0;
    trigger.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 350 && tapLength > 0) {
        e.preventDefault();
        openVault();
      }
      lastTapTime = currentTime;
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openVault();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeVault();
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVault();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeVault();
    });

    if (waxBtn && sealedView && letterView) {
      waxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playWaxBreakSound();

        waxBtn.style.transform = 'scale(0.88)';
        waxBtn.style.opacity = '0.5';
        setTimeout(() => {
          sealedView.style.display = 'none';
          letterView.style.display = 'block';
          waxBtn.style.transform = '';
          waxBtn.style.opacity = '';
        }, 240);
      });
    }
  }

  /* --- 12. Full-Screen 3D Photo Lightbox --- */
  function initPhotoLightbox() {
    const modal = document.getElementById('photo-lightbox-modal');
    const card3D = document.getElementById('lightbox-card-3d');
    const frontImg = document.getElementById('lightbox-front-img');
    const backQuote = document.getElementById('lightbox-back-quote');
    const backDate = document.getElementById('lightbox-back-date');
    const flipBtn = document.getElementById('lightbox-flip-btn');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (!modal || !card3D || !frontImg) return;

    const memoryNotes = [
      { quote: "Every time I look into your eyes, I find a peace that nowhere else in this universe can give me.", date: "Sanctuary Memory ✧ 2909" },
      { quote: "Your laughter is my favorite song. Even on the stormiest days, your smile brings daylight back into my world.", date: "Treasured Chapter ✧ Always" },
      { quote: "With you, the simplest unscripted moments turn into unforgettable poetry. Thank you for being my home.", date: "Forever In My Heart ✧ N & L" },
      { quote: "You are the sweetest daydream I never want to wake up from. In all of time, my heart will always choose you.", date: "Written In Starlight ✧ Lahari" },
      { quote: "In a world full of noise, your gentle presence is my calm, my strength, and my greatest blessing.", date: "Endless Love ✧ Nisar" }
    ];

    function openLightbox(imgSrc, captionText, customDate) {
      frontImg.src = imgSrc;
      card3D.classList.remove('is-flipped');

      const randomMemory = memoryNotes[Math.floor(Math.random() * memoryNotes.length)];
      backQuote.textContent = captionText ? `“${captionText}”` : `“${randomMemory.quote}”`;
      backDate.textContent = customDate || randomMemory.date;

      modal.classList.add('active');
      document.body.classList.add('scroll-locked');
      playCardFlickSound();
    }

    function closeLightbox() {
      modal.classList.remove('active');
      document.body.classList.remove('scroll-locked');
      setTimeout(() => {
        card3D.classList.remove('is-flipped');
      }, 300);
    }

    function toggleFlip(e) {
      if (e) e.stopPropagation();
      card3D.classList.toggle('is-flipped');
      playCardFlickSound();
    }

    // Attach to collage / museum photos / filmstrip frames
    document.querySelectorAll('.collage-photo, .chapter-photo, .vintage-frame img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        openLightbox(img.src, img.alt, "The Living Museum Wall ✧ Nisar & Lahari");
      });
    });

    card3D.addEventListener('click', toggleFlip);
    if (flipBtn) flipBtn.addEventListener('click', toggleFlip);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFlip();
      }
    });
  }

  /* --- 13. Keepsake Letter Button --- */
  function initKeepsakeLetter() {
    const keepBtn = document.getElementById('btn-keep-letter');
    if (!keepBtn) return;
    keepBtn.addEventListener('click', () => {
      const originalText = keepBtn.textContent;
      keepBtn.textContent = '💌 SAVED TO KEEPSAKES';
      keepBtn.style.borderColor = 'rgba(249, 217, 118, 0.8)';
      keepBtn.style.color = '#F9D976';
      playRomanticChime();
      setTimeout(() => {
        keepBtn.textContent = originalText;
        keepBtn.style.borderColor = '';
        keepBtn.style.color = '';
      }, 3500);
    });
  }

  /* --- 14. Initialize on Load --- */
  function initAll() {
    initHugSimulator();
    initECGMonitor();
    initNeonSign();
    initLoveBeacon();
    initVoiceNote();
    initPrivateVault();
    initPolaroidStack();
    initVintageFilmReel();
    initSoundscapes();
    initSecretMidnightVault();
    initPhotoLightbox();
    initKeepsakeLetter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose sound helpers globally
  window.SanctumAudio = {
    playAcousticHeartbeat,
    playNeonIgnitionSound,
    playCardFlickSound,
    playRomanticChime,
    playClickSound,
    playBeaconIgnitionSound,
    playWaxBreakSound
  };

  window.initAllSanctuaryFeatures = initAll;
})();
