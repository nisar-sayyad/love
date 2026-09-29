/**
 * ============================================================
 * MULTI-TRACK AUDIO CONTROLLER — NISAR × LAHARI
 * Ambient music player supporting multiple tracks/playlists with
 * HTML5 Audio support and multi-preset Web Audio romantic synth moods.
 * Allows switching between different songs/melodies anytime.
 * ============================================================
 */

window.RomanticAudio = (function () {
  let isPlaying = false;
  let currentTrackIdx = 0;
  let audioElem = null;
  let synthContext = null;
  let synthInterval = null;
  let masterGain = null;

  const audioConfig = window.STORY_CONFIG?.audio || {};
  const tracks = audioConfig.tracks || [
    {
      id: 1,
      title: "A Melody For Lahari",
      artist: "Nisar",
      src: "assets/audio/song1.mp3",
      preset: "starlight"
    },
    {
      id: 2,
      title: "Our Quiet Moments",
      artist: "Nisar",
      src: "assets/audio/song2.mp3",
      preset: "warmth"
    },
    {
      id: 3,
      title: "Forever Favorite",
      artist: "Nisar",
      src: "assets/audio/song3.mp3",
      preset: "heartstrings"
    }
  ];

  // 3 Distinct Romantic Synthesizer Scales
  const soundPresets = {
    starlight: [277.18, 349.23, 415.30, 523.25, 554.37, 311.13, 369.99, 466.16], // Dreamy Db major 9
    warmth: [349.23, 392.00, 440.00, 523.25, 659.25, 698.46, 523.25, 440.00],    // Gentle F major acoustic
    heartstrings: [207.65, 261.63, 311.13, 415.30, 523.25, 311.13, 261.63, 415.30] // Intimate Ab resonance
  };

  function initSynth() {
    if (synthContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      synthContext = new AudioCtx();
      masterGain = synthContext.createGain();
      masterGain.gain.setValueAtTime(0.12, synthContext.currentTime);
      masterGain.connect(synthContext.destination);
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  function playAmbientBell(freq, duration = 3.5) {
    if (!synthContext || synthContext.state !== 'running') return;
    try {
      const osc = synthContext.createOscillator();
      const noteGain = synthContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, synthContext.currentTime);

      const now = synthContext.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.15);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  function startSynthLoop(presetName = 'starlight') {
    initSynth();
    if (synthContext && synthContext.state === 'suspended') {
      synthContext.resume();
    }
    stopSynthLoop();

    const scale = soundPresets[presetName] || soundPresets.starlight;
    let step = 0;
    synthInterval = setInterval(() => {
      const note = scale[step % scale.length];
      playAmbientBell(note, 4.0);
      if (step % 2 === 0) {
        setTimeout(() => {
          const harmonyNote = scale[(step + 3) % scale.length];
          playAmbientBell(harmonyNote * 0.5, 5.0);
        }, 600);
      }
      step++;
    }, 1750);
  }

  function stopSynthLoop() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function loadTrack(index) {
    currentTrackIdx = (index + tracks.length) % tracks.length;
    const currentTrack = tracks[currentTrackIdx];

    if (audioElem) {
      audioElem.pause();
    }
    stopSynthLoop();

    audioElem = new Audio();
    audioElem.src = currentTrack.src;
    audioElem.loop = true;
    audioElem.volume = 0.5;

    audioElem.addEventListener('error', () => {
      // If MP3 file is not found, fallback to Web Audio preset
      if (isPlaying) {
        startSynthLoop(currentTrack.preset || 'starlight');
      }
    });

    if (isPlaying) {
      const playPromise = audioElem.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          startSynthLoop(currentTrack.preset || 'starlight');
        });
      }
    }

    updateUI();
  }

  function play() {
    isPlaying = true;
    const currentTrack = tracks[currentTrackIdx];

    // Synchronously unlock and resume Web Audio on user gesture to prevent browser blocking
    initSynth();
    if (synthContext && synthContext.state === 'suspended') {
      synthContext.resume();
    }

    if (audioElem && audioElem.src) {
      const playPromise = audioElem.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          startSynthLoop(currentTrack?.preset || 'starlight');
        });
      }
    } else {
      startSynthLoop(currentTrack?.preset || 'starlight');
    }

    updateUI();
  }

  function pause() {
    isPlaying = false;
    if (audioElem) {
      try {
        audioElem.pause();
        audioElem.currentTime = 0;
      } catch (e) {}
    }
    stopSynthLoop();
    if (synthContext && synthContext.state === 'running') {
      try {
        synthContext.suspend();
      } catch (e) {}
    }
    updateUI();
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function nextTrack() {
    loadTrack(currentTrackIdx + 1);
    if (!isPlaying) play();
  }

  function prevTrack() {
    loadTrack(currentTrackIdx - 1);
    if (!isPlaying) play();
  }

  function updateUI() {
    const pill = document.getElementById('music-pill');
    const label = document.getElementById('music-label');
    const playIcon = document.getElementById('music-icon-play');
    const pauseIcon = document.getElementById('music-icon-pause');
    const trackNum = document.getElementById('music-track-num');

    const currentTrack = tracks[currentTrackIdx];

    if (label && currentTrack) {
      label.textContent = currentTrack.title;
    }
    if (trackNum) {
      trackNum.textContent = `${currentTrackIdx + 1}/${tracks.length}`;
    }

    if (pill) {
      if (isPlaying) {
        pill.classList.add('is-playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
      } else {
        pill.classList.remove('is-playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    }

    try {
      window.dispatchEvent(new CustomEvent('romanticAudioStateChange', {
        detail: { isPlaying, currentTrackIdx, currentTrack }
      }));
    } catch (e) {}
  }

  // Pre-load initial track setup in strictly paused state
  loadTrack(0);
  pause();

  return {
    play,
    pause,
    stop: pause,
    toggle,
    nextTrack,
    prevTrack,
    loadTrack,
    isPlaying: () => isPlaying,
    getCurrentTrack: () => tracks[currentTrackIdx],
    getCurrentTrackIndex: () => currentTrackIdx,
    getTracks: () => tracks
  };
})();

