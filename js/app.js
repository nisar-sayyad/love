/**
 * ============================================================
 * MAIN APPLICATION LOGIC — NISAR × LAHARI
 * Component mounting, interactions, video controls, modals,
 * and cinematic scroll observers.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.STORY_CONFIG;
  if (!config) {
    console.error('STORY_CONFIG not found.');
    return;
  }

  // 0. Passcode Security Gate
  const passcodeGate = document.getElementById('passcode-gate');
  const passcodeCard = document.getElementById('passcode-card');
  const passcodeForm = document.getElementById('passcode-form');
  const passcodeInput = document.getElementById('passcode-input');
  const passcodeError = document.getElementById('passcode-error');
  const pinBoxes = Array.from(document.querySelectorAll('.pin-digit-box'));
  const unlockBtn = document.getElementById('btn-unlock-world');

  const gateConfig = config.passcodeGate || {
    enabled: true,
    validCodes: ["2909", "29/09/2007", "lahari", "29092007", "29-09-2007"]
  };

  if (passcodeGate && gateConfig.enabled) {
    const isAlreadyUnlocked = sessionStorage.getItem('lahari_world_unlocked') === 'true';

    if (isAlreadyUnlocked) {
      document.documentElement.setAttribute('data-auth', 'unlocked');
      document.documentElement.setAttribute('data-auth-state', 'authenticated');
      document.documentElement.classList.remove('auth-locked');
      document.documentElement.classList.add('auth-unlocked');
      if (passcodeGate) passcodeGate.remove();
      document.body.classList.remove('passcode-locked');
      document.body.classList.add('sanctuary-entered');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (typeof window.mountAndInitProtectedSanctuary === 'function') {
          window.mountAndInitProtectedSanctuary();
        }
      }, 0);
    } else {
      document.documentElement.setAttribute('data-auth', 'locked');
      document.documentElement.setAttribute('data-auth-state', 'locked');
      document.documentElement.classList.add('auth-locked');
      document.documentElement.classList.remove('auth-unlocked');
      document.body.classList.add('passcode-locked');
      document.body.classList.remove('sanctuary-entered');
    }

    function syncPinBoxesToMaster() {
      if (pinBoxes.length > 0) {
        const val = pinBoxes.map(b => b.value).join('');
        if (passcodeInput) passcodeInput.value = val;
        return val;
      }
      return passcodeInput ? passcodeInput.value : '';
    }

    function updateBoxWatermarks() {
      pinBoxes.forEach(box => {
        const wrapper = box.closest('.pin-box-wrapper');
        if (wrapper) {
          if (box.value.length > 0) {
            wrapper.classList.add('has-val');
          } else {
            wrapper.classList.remove('has-val');
          }
        }
      });
    }

    pinBoxes.forEach((box, idx) => {
      box.addEventListener('input', () => {
        updateBoxWatermarks();
        if (box.value.length === 1 && idx < pinBoxes.length - 1) {
          pinBoxes[idx + 1].focus();
        }
        const combined = syncPinBoxesToMaster();
        if (combined.length === 4) {
          checkPasscode();
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (box.value === '' && idx > 0) {
            pinBoxes[idx - 1].focus();
            pinBoxes[idx - 1].value = '';
            updateBoxWatermarks();
            syncPinBoxesToMaster();
          } else {
            box.value = '';
            updateBoxWatermarks();
            syncPinBoxesToMaster();
          }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          pinBoxes[idx - 1].focus();
        } else if (e.key === 'ArrowRight' && idx < pinBoxes.length - 1) {
          pinBoxes[idx + 1].focus();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          checkPasscode();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (text) {
          if (passcodeInput) passcodeInput.value = text;
          const chars = text.split('');
          pinBoxes.forEach((b, i) => {
            b.value = chars[i] || '';
          });
          updateBoxWatermarks();
          checkPasscode();
        }
      });
    });

    function checkPasscode() {
      const enteredFromBoxes = syncPinBoxesToMaster();
      const rawEntered = (enteredFromBoxes || (passcodeInput ? passcodeInput.value : '')).trim().toLowerCase();
      const cleanEntered = rawEntered.replace(/[\/\-\s]/g, '');

      const validCodes = (gateConfig.validCodes || []).map(c => String(c).toLowerCase());
      const cleanValidCodes = validCodes.map(c => c.replace(/[\/\-\s]/g, ''));

      const isMatch = validCodes.includes(rawEntered) || cleanValidCodes.includes(cleanEntered);

      if (isMatch) {
        sessionStorage.setItem('lahari_world_unlocked', 'true');
        sessionStorage.setItem('lahari_heart_opened', 'true');
        window.__AUTH_STATE__ = 'authenticated';
        document.documentElement.setAttribute('data-auth', 'unlocked');
        document.documentElement.setAttribute('data-auth-state', 'authenticated');
        document.documentElement.classList.remove('auth-locked');
        document.documentElement.classList.add('auth-unlocked');

        if (typeof window.mountAndInitProtectedSanctuary === 'function') {
          window.mountAndInitProtectedSanctuary();
        }

        if (passcodeGate) {
          passcodeGate.classList.add('is-unlocked');
          setTimeout(() => {
            if (passcodeGate.parentNode) {
              passcodeGate.remove();
            }
          }, 850);
        }
        document.body.classList.remove('passcode-locked');
        document.body.classList.add('sanctuary-entered');
        document.body.style.overflow = '';
        if (passcodeError) passcodeError.textContent = '';

        // Trigger cinematic birthday celebration sequence (1.5s after Home appears)
        if (typeof window.triggerBirthdayCelebration === 'function') {
          window.triggerBirthdayCelebration();
        }
        window.dispatchEvent(new CustomEvent('sanctuary:unlocked'));
      } else {
        if (passcodeCard) {
          passcodeCard.classList.remove('shake');
          void passcodeCard.offsetWidth; // Reflow
          passcodeCard.classList.add('shake');
        }
        if (passcodeError) {
          passcodeError.textContent = gateConfig.errorMessage || "Only the one who holds Nisar's heart knows the key... Try again ♡";
        }
        pinBoxes.forEach(b => b.value = '');
        updateBoxWatermarks();
        if (passcodeInput) passcodeInput.value = '';
        if (pinBoxes.length > 0) pinBoxes[0].focus();
        else if (passcodeInput) passcodeInput.focus();
      }
    }

    if (passcodeForm) {
      passcodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkPasscode();
      });
    }

    if (unlockBtn) {
      unlockBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkPasscode();
      });
    }
  }

  function mountSanctuaryFromTemplate() {
    const root = document.getElementById('sanctuary-app-root');
    const tpl = document.getElementById('sanctuary-experience-template');
    if (root && tpl && root.children.length === 0) {
      const fragment = tpl.content.cloneNode ? tpl.content.cloneNode(true) : tpl.content;
      const ROUTE_MAP = {
        '': 'page-home',
        '#': 'page-home',
        '#/': 'page-home',
        '#/home': 'page-home',
        '#/sanctuary': 'page-chapter-1',
        '#/universe': 'page-chapter-2',
        '#/museum': 'page-chapter-3',
        '#/words': 'page-chapter-4',
        '#/about-you': 'page-chapter-5',
        '#/future': 'page-chapter-6'
      };
      const rawHash = window.location.hash || '#/home';
      const cleanHash = rawHash.split('?')[0].toLowerCase();
      const targetPageId = ROUTE_MAP[cleanHash] || 'page-home';

      const views = fragment.querySelectorAll('.sanctuary-view');
      views.forEach(v => {
        if (v.id === targetPageId) {
          v.classList.add('is-active');
          v.removeAttribute('hidden');
        } else {
          v.classList.remove('is-active');
          v.setAttribute('hidden', '');
        }
      });
      root.appendChild(fragment);
      const isHome = targetPageId === 'page-home';
      if (document.documentElement) {
        document.documentElement.setAttribute('data-is-home', isHome ? 'true' : 'false');
        document.documentElement.setAttribute('data-target-page', targetPageId);
        document.documentElement.classList.toggle('boot-home-view', isHome);
        document.documentElement.classList.toggle('boot-chapter-view', !isHome);
        if (isHome) {
          document.documentElement.style.overflow = 'hidden';
        } else {
          document.documentElement.style.removeProperty('overflow');
          document.documentElement.style.overflowY = 'auto';
          document.documentElement.style.overflowX = 'hidden';
        }
      }
      if (document.body) {
        document.body.classList.toggle('home-active-view', isHome);
        if (isHome) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.removeProperty('overflow');
          document.body.style.overflowY = 'auto';
          document.body.style.overflowX = 'hidden';
          document.body.style.height = 'auto';
        }
      }
    }
    if (document.documentElement) {
      document.documentElement.classList.remove('app-booting');
    }
  }

  function initHomeDashboard() {
    // 1. Home Countdown to 29 September
    function updateHomeCountdown() {
      const daysEl = document.getElementById('home-count-days');
      const hoursEl = document.getElementById('home-count-hours');
      const minutesEl = document.getElementById('home-count-minutes');
      const secondsEl = document.getElementById('home-count-seconds');
      if (!daysEl) return;

      const now = new Date();
      const currentYear = now.getFullYear();

      // Check if today is her actual birthday (29 September all day)
      const isBirthdayToday = (now.getMonth() === 8 && now.getDate() === 29);

      if (isBirthdayToday) {
        // On Birthday Day: stay locked at 00 00 00 00 celebration state
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      // Next day (30 Sept) onwards: target next year's 29 Sept.
      // Before 29 Sept (Jan to 28 Sept): target this year's 29 Sept.
      let targetYear = currentYear;
      if (now.getMonth() > 8 || (now.getMonth() === 8 && now.getDate() > 29)) {
        targetYear = currentYear + 1;
      }
      const target = new Date(targetYear, 8, 29, 0, 0, 0).getTime();

      const diff = Math.max(0, target - now.getTime());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }
    updateHomeCountdown();
    setInterval(updateHomeCountdown, 1000);

    // 2. Home Voice Note Player
    const voiceBtn = document.getElementById('home-voice-toggle-btn');
    const voiceIcon = document.getElementById('home-voice-icon');
    const waveformCanvas = document.getElementById('home-waveform-canvas');
    if (waveformCanvas) {
      const ctx = waveformCanvas.getContext('2d');
      const w = waveformCanvas.width;
      const h = waveformCanvas.height;
      function drawWaveform(isPlaying) {
        ctx.clearRect(0, 0, w, h);
        const bars = 28;
        const barWidth = 3;
        const gap = (w - (bars * barWidth)) / (bars - 1);
        for (let i = 0; i < bars; i++) {
          let barHeight = isPlaying 
            ? (Math.sin(Date.now() * 0.008 + i * 0.4) * 0.5 + 0.5) * (h * 0.8) + 4
            : (Math.sin(i * 0.5) * 0.3 + 0.4) * (h * 0.5) + 3;
          ctx.fillStyle = '#e2b86b';
          const x = i * (barWidth + gap);
          const y = (h - barHeight) / 2;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x, y, barWidth, barHeight, 2);
          else ctx.rect(x, y, barWidth, barHeight);
          ctx.fill();
        }
      }
      let waveAnim = null;
      let isVoicePlaying = false;
      function loopWave() {
        if (!isVoicePlaying) return;
        drawWaveform(true);
        waveAnim = requestAnimationFrame(loopWave);
      }
      drawWaveform(false);

      let homeVoiceAudio = null;
      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          isVoicePlaying = !isVoicePlaying;
          if (voiceIcon) voiceIcon.textContent = isVoicePlaying ? '❚❚' : '▶';
          if (isVoicePlaying) {
            loopWave();
            if (!homeVoiceAudio) {
              homeVoiceAudio = new Audio('assets/audio/happy-birthday-lahari.mp4');
              homeVoiceAudio.addEventListener('loadedmetadata', () => {
                const _tEl = document.getElementById('home-voice-time');
                if (_tEl && homeVoiceAudio.duration) {
                  const _dM = Math.floor(homeVoiceAudio.duration / 60);
                  const _dS = Math.floor(homeVoiceAudio.duration % 60);
                  _tEl.textContent = '00:00 / ' + String(_dM).padStart(2,'0') + ':' + String(_dS).padStart(2,'0');
                }
              });
              homeVoiceAudio.addEventListener('ended', () => {
                isVoicePlaying = false;
                if (voiceIcon) voiceIcon.textContent = '▶';
                cancelAnimationFrame(waveAnim);
                drawWaveform(false);
              });
              homeVoiceAudio.addEventListener('timeupdate', () => {
                const timeEl = document.getElementById('home-voice-time');
                if (timeEl && homeVoiceAudio.duration) {
                  const curM = Math.floor(homeVoiceAudio.currentTime / 60);
                  const curS = Math.floor(homeVoiceAudio.currentTime % 60);
                  const durM = Math.floor(homeVoiceAudio.duration / 60);
                  const durS = Math.floor(homeVoiceAudio.duration % 60);
                  timeEl.textContent = `${String(curM).padStart(2, '0')}:${String(curS).padStart(2, '0')} / ${String(durM).padStart(2, '0')}:${String(durS).padStart(2, '0')}`;
                }
              });
            }
            homeVoiceAudio.play().catch(() => {});
          } else {
            cancelAnimationFrame(waveAnim);
            drawWaveform(false);
            if (homeVoiceAudio) homeVoiceAudio.pause();
          }
        });
      }
    }

    // 3. Navigation Links Active State
    const navLinks = document.querySelectorAll('.home-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    });
  }

  function initSanctuaryCore() {
    if (window.__sanctuaryCoreInitialized) return;
    window.__sanctuaryCoreInitialized = true;
    initHomeDashboard();

  // 1. Initialize Lightbox
  if (window.RomanticLightbox) {
    window.RomanticLightbox.init();
    // Build combined gallery item list for lightbox
    const galleryItems = (config.gallery || []).map(item => ({
      type: 'image',
      src: item.src,
      caption: item.caption
    }));
    window.RomanticLightbox.registerItems(galleryItems);
  }

  // 3. Multi-Track Music Player Controls
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicPrevBtn = document.getElementById('music-prev-btn');
  const musicNextBtn = document.getElementById('music-next-btn');

  if (musicToggleBtn && window.RomanticAudio) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.RomanticAudio.toggle();
    });
  }

  if (musicPrevBtn && window.RomanticAudio) {
    musicPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.RomanticAudio.prevTrack();
    });
  }

  if (musicNextBtn && window.RomanticAudio) {
    musicNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.RomanticAudio.nextTrack();
    });
  }

  // 4. Mount Cinematic Photo Story Chapters
  const chaptersContainer = document.getElementById('story-chapters-container');
  if (chaptersContainer && config.chapters) {
    chaptersContainer.innerHTML = config.chapters.map((ch, idx) => `
      <div class="story-chapter reveal-on-scroll" id="chapter-${idx + 1}">
        <div class="chapter-grid ${ch.reverse ? 'reverse' : ''}">
          <div class="chapter-media-wrap">
            <div class="chapter-frame" onclick="window.RomanticLightbox && window.RomanticLightbox.open(${idx % (config.gallery?.length || 1)})">
              <img src="${ch.image}" alt="${ch.title} — Lahari" loading="lazy">
              <div class="chapter-overlay-btn">View Moment</div>
            </div>
          </div>
          <div class="chapter-content">
            <span class="chapter-number">${ch.number}</span>
            <h3 class="chapter-title">${ch.title}</h3>
            <blockquote class="chapter-quote">“${ch.quote}”</blockquote>
            <div class="chapter-compliment-box">
              <p>${ch.compliment}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 4b. Initialize Floating Story Journey Rail (Milestones Tracker)
  const journeyRail = document.getElementById('story-journey-rail');
  const journeyDotsContainer = document.getElementById('journey-rail-dots');
  const journeyProgress = document.getElementById('journey-rail-progress');
  const chaptersSection = document.getElementById('cinematic-photo-story');

  if (journeyRail && journeyDotsContainer && config.chapters) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    journeyDotsContainer.innerHTML = config.chapters.map((ch, idx) => `
      <button class="journey-dot-btn ${idx === 0 ? 'is-active' : ''}" 
              data-chapter-index="${idx + 1}"
              aria-label="${ch.number}: ${ch.title}">
        <span>${romanNumerals[idx] || (idx + 1)}</span>
      </button>
    `).join('');

    journeyDotsContainer.querySelectorAll('.journey-dot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chNum = btn.getAttribute('data-chapter-index');
        const targetCh = document.getElementById(`chapter-${chNum}`);
        if (targetCh) {
          targetCh.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    function updateJourneyRail() {
      if (!chaptersSection) return;
      const rect = chaptersSection.getBoundingClientRect();
      const windowH = window.innerHeight;

      if (rect.top <= windowH * 0.7 && rect.bottom >= windowH * 0.25) {
        journeyRail.classList.add('is-visible');
      } else {
        journeyRail.classList.remove('is-visible');
      }

      let activeIdx = 0;
      const chapterElems = document.querySelectorAll('.story-chapter');
      chapterElems.forEach((elem, i) => {
        const cRect = elem.getBoundingClientRect();
        if (cRect.top <= windowH * 0.55) {
          activeIdx = i;
        }
      });

      const dotButtons = journeyDotsContainer.querySelectorAll('.journey-dot-btn');
      dotButtons.forEach((btn, i) => {
        if (i === activeIdx) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });

      if (journeyProgress && dotButtons.length > 1) {
        const pct = (activeIdx / (dotButtons.length - 1)) * 100;
        journeyProgress.style.height = `${pct}%`;
      }
    }

    let journeyTicking = false;
    window.addEventListener('scroll', () => {
      if (!journeyTicking) {
        journeyTicking = true;
        requestAnimationFrame(() => {
          updateJourneyRail();
          journeyTicking = false;
        });
      }
    }, { passive: true });
    updateJourneyRail();
  }

  // 4c. Initialize Floating Sanctum Realm Rail (Right-Side Full-Sanctuary Quick Jump)
  const sanctumRealms = [
    {
      id: 'eternity-clock-section',
      icon: '⏳',
      name: 'Eternity Clock & Sanctum',
      tag: '01 • Beginnings'
    },
    {
      id: 'chapters-of-you',
      icon: '📖',
      name: 'Chapters & Film Reel',
      tag: '02 • Visual Poetry'
    },
    {
      id: 'love-compass-section',
      icon: '🧭',
      name: 'The Love Compass & Reasons',
      tag: '03 • Eternal Direction'
    },
    {
      id: 'intimate-connection',
      icon: '💓',
      name: 'Heartbeat & Warm Hug',
      tag: '04 • Pulse of Love'
    },
    {
      id: 'love-lock-section',
      icon: '🔒',
      name: 'Sacred Love Lock & Vinyl',
      tag: '05 • Eternal Keepsakes'
    },
    {
      id: 'love-beacon-page',
      icon: '🌌',
      name: 'Midnight Vault & Love Beacon',
      tag: '06 • Celestial Beacon'
    },
    {
      id: 'living-museum-wall',
      icon: '🖼️',
      name: 'Museum Wall & Memories',
      tag: '07 • Curated Gallery'
    },
    {
      id: 'letter-from-nisar',
      icon: '✒️',
      name: 'Letter From Nisar & Vault',
      tag: '08 • Personal Vows'
    }
  ];

  const realmRail = document.getElementById('sanctum-realm-rail');
  const realmDotsContainer = document.getElementById('realm-rail-dots');
  const realmProgress = document.getElementById('realm-rail-progress');

  if (realmRail && realmDotsContainer) {
    realmDotsContainer.innerHTML = sanctumRealms.map((realm, idx) => `
      <button class="realm-dot-btn ${idx === 0 ? 'is-active' : ''}"
              data-realm-id="${realm.id}"
              data-realm-index="${idx}"
              aria-label="${realm.name}">
        <span>${realm.icon}</span>
      </button>
    `).join('');

    realmDotsContainer.querySelectorAll('.realm-dot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-realm-id');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          playGentleBell();
          if ('vibrate' in navigator) navigator.vibrate(25);
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    function updateRealmRail() {
      const windowH = window.innerHeight;
      const firstSection = document.getElementById('eternity-clock-section');

      // Show rail once scrolled past Hero / Whisper
      if (firstSection) {
        const firstRect = firstSection.getBoundingClientRect();
        if (firstRect.top <= windowH * 0.75) {
          realmRail.classList.add('is-visible');
        } else {
          realmRail.classList.remove('is-visible');
        }
      }

      // Find current active realm
      let activeIdx = 0;
      sanctumRealms.forEach((realm, i) => {
        const elem = document.getElementById(realm.id);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          if (rect.top <= windowH * 0.45) {
            activeIdx = i;
          }
        }
      });

      const dotBtns = realmDotsContainer.querySelectorAll('.realm-dot-btn');
      dotBtns.forEach((btn, i) => {
        if (i === activeIdx) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });

      if (realmProgress && dotBtns.length > 1) {
        const pct = (activeIdx / (dotBtns.length - 1)) * 100;
        realmProgress.style.height = `${pct}%`;
      }
    }

    let realmTicking = false;
    window.addEventListener('scroll', () => {
      if (!realmTicking) {
        realmTicking = true;
        requestAnimationFrame(() => {
          updateRealmRail();
          realmTicking = false;
        });
      }
    }, { passive: true });
    updateRealmRail();
  }

  // 5. Mount "Things I Love About You" (Interactive 3D Flip Cards)
  const loveCardsContainer = document.getElementById('love-cards-container');
  if (loveCardsContainer && config.loveCards) {
    loveCardsContainer.innerHTML = config.loveCards.map((card, idx) => `
      <div class="love-card reveal-on-scroll" onclick="this.classList.toggle('flipped')" tabindex="0" role="button" aria-label="${card.title}">
        <div class="love-card-inner">
          <div class="love-card-front">
            <div class="love-card-icon">${card.icon}</div>
            <h3>${card.title}</h3>
            <span class="love-card-hint">${card.hint}</span>
          </div>
          <div class="love-card-back">
            <p>“${card.backText}”</p>
          </div>
        </div>
      </div>
    `).join('');
  }
  // 6. Mount "It's The Little Things"
  const littleThingsContainer = document.getElementById('little-things-container');
  if (littleThingsContainer && config.littleThings) {
    littleThingsContainer.innerHTML = config.littleThings.items.map(item => `
      <div class="little-thing-item reveal-on-scroll">
        <span class="little-thing-num">${item.id}</span>
        <p class="little-thing-text">${item.text}</p>
      </div>
    `).join('');
  }

  // 7. Mount "You Probably Don't Know This..."
  const confessionsContainer = document.getElementById('confessions-container');
  if (confessionsContainer && config.confessions) {
    confessionsContainer.innerHTML = config.confessions.items.map(item => `
      <div class="confession-card reveal-on-scroll">
        <h4>${item.title}</h4>
        <p>${item.text}</p>
      </div>
    `).join('');
  }

  // 8. Mount Memory Timeline ("Moments Worth Keeping")
  const timelineContainer = document.getElementById('timeline-container');
  if (timelineContainer && config.timeline) {
    timelineContainer.innerHTML = config.timeline.events.map(ev => `
      <div class="timeline-item ${ev.side} reveal-on-scroll">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-date">${ev.date}</div>
          <h4 class="timeline-title">${ev.title}</h4>
          <p>${ev.text}</p>
        </div>
      </div>
    `).join('');
  }

  // 9 & 10. Mount Artistic Wall Collage Showcase ("A Tapestry of Moments")
  // Inspired by custom multi-photo family frames with focal portraits
  const collageShowcaseContainer = document.getElementById('collage-showcase-container');
  if (collageShowcaseContainer) {
    const gal = config.gallery || [];
    const vids = config.videos || [];

    // FRAME 1: The Core Memories Frame (5 Photos - Centerpiece tall + 4 candids)
    // Matches the user's uploaded reference image architecture perfectly!
    const frame1 = `
      <div class="collage-art-board reveal-on-scroll">
        <div class="collage-badge-tag">Collector’s Frame • Set I</div>
        <div class="collage-frame-5">
          <!-- Top Left -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[1]?.src}', '${(gal[1]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[1]?.caption || ''}">
            <img src="${gal[1]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[1]?.caption || ''}”</p></div>
          </div>
          <!-- Centerpiece (Tall, spans 2 rows) -->
          <div class="collage-cell is-centerpiece" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[0]?.src}', '${(gal[0]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[0]?.caption || ''}">
            <img src="${gal[0]?.src}" alt="Lahari centerpiece" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[0]?.caption || ''}”</p></div>
          </div>
          <!-- Top Right -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[2]?.src}', '${(gal[2]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[2]?.caption || ''}">
            <img src="${gal[2]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[2]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Left -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[3]?.src}', '${(gal[3]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[3]?.caption || ''}">
            <img src="${gal[3]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[3]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Right -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[4]?.src}', '${(gal[4]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[4]?.caption || ''}">
            <img src="${gal[4]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[4]?.caption || ''}”</p></div>
          </div>
        </div>
        <div class="collage-frame-signature">
          <h3 class="collage-signature-title">Our Favorite Beginning</h3>
          <p class="collage-signature-sub">— Nisar × Lahari • Treasured Memories</p>
        </div>
      </div>
    `;

    // FRAME 2: Living Motion Portraits (3 Videos + 2 Candids in framed collage)
    const frame2 = `
      <div class="collage-art-board reveal-on-scroll">
        <div class="collage-badge-tag">Living Motion Frame • Set II</div>
        <div class="collage-frame-5">
          <!-- Top Left Video -->
          <div class="collage-cell collage-video-cell" id="collage-vid-card-1">
            <video src="${vids[1]?.src}" playsinline muted loop preload="metadata" id="collage-vid-elem-1"></video>
            <span class="collage-video-badge">Motion</span>
            <div class="collage-play-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
            <div class="collage-cell-caption"><p>${vids[1]?.title || ''} — “${vids[1]?.caption || ''}”</p></div>
          </div>
          <!-- Centerpiece Main Video (Tall, spans 2 rows) -->
          <div class="collage-cell is-centerpiece collage-video-cell" id="collage-vid-card-0">
            <video src="${vids[0]?.src}" playsinline muted loop preload="metadata" id="collage-vid-elem-0"></video>
            <span class="collage-video-badge">Motion Feature</span>
            <div class="collage-play-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
            <div class="collage-cell-caption"><p>${vids[0]?.title || ''} — “${vids[0]?.caption || ''}”</p></div>
          </div>
          <!-- Top Right Video -->
          <div class="collage-cell collage-video-cell" id="collage-vid-card-2">
            <video src="${vids[2]?.src}" playsinline muted loop preload="metadata" id="collage-vid-elem-2"></video>
            <span class="collage-video-badge">Motion</span>
            <div class="collage-play-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
            <div class="collage-cell-caption"><p>${vids[2]?.title || ''} — “${vids[2]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Left Photo -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[5]?.src}', '${(gal[5]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[5]?.caption || ''}">
            <img src="${gal[5]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[5]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Right Photo -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[6]?.src}', '${(gal[6]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[6]?.caption || ''}">
            <img src="${gal[6]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[6]?.caption || ''}”</p></div>
          </div>
        </div>
        <div class="collage-frame-signature">
          <h3 class="collage-signature-title">Moments in Motion</h3>
          <p class="collage-signature-sub">“Some memories are so full of life, they refuse to sit still.”</p>
        </div>
      </div>
    `;

    // FRAME 3: Extended Gallery Art Board (Photos 7 to 11)
    const frame3 = `
      <div class="collage-art-board reveal-on-scroll">
        <div class="collage-badge-tag">The Poetry Collection • Set III</div>
        <div class="collage-frame-5">
          <!-- Top Left -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[7]?.src}', '${(gal[7]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[7]?.caption || ''}">
            <img src="${gal[7]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[7]?.caption || ''}”</p></div>
          </div>
          <!-- Centerpiece (Tall, spans 2 rows) -->
          <div class="collage-cell is-centerpiece" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[8]?.src}', '${(gal[8]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[8]?.caption || ''}">
            <img src="${gal[8]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[8]?.caption || ''}”</p></div>
          </div>
          <!-- Top Right -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[9]?.src}', '${(gal[9]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[9]?.caption || ''}">
            <img src="${gal[9]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[9]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Left -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[10]?.src}', '${(gal[10]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[10]?.caption || ''}">
            <img src="${gal[10]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[10]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Right -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[11]?.src}', '${(gal[11]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[11]?.caption || ''}">
            <img src="${gal[11]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[11]?.caption || ''}”</p></div>
          </div>
        </div>
        <div class="collage-frame-signature">
          <h3 class="collage-signature-title">A Thousand Unspoken Words</h3>
          <p class="collage-signature-sub">— Etched Forever in My Soul</p>
        </div>
      </div>
    `;

    // FRAME 4: The Stolen Glances Board (Photos 12 to 17)
    const frame4 = `
      <div class="collage-art-board reveal-on-scroll">
        <div class="collage-badge-tag">Forever Sanctuary • Set IV</div>
        <div class="collage-frame-5">
          <!-- Top Left -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[12]?.src}', '${(gal[12]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[12]?.caption || ''}">
            <img src="${gal[12]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[12]?.caption || ''}”</p></div>
          </div>
          <!-- Centerpiece (Tall, spans 2 rows) -->
          <div class="collage-cell is-centerpiece" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[13]?.src}', '${(gal[13]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[13]?.caption || ''}">
            <img src="${gal[13]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[13]?.caption || ''}”</p></div>
          </div>
          <!-- Top Right -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[14]?.src}', '${(gal[14]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[14]?.caption || ''}">
            <img src="${gal[14]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[14]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Left -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[15]?.src}', '${(gal[15]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[15]?.caption || ''}">
            <img src="${gal[15]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[15]?.caption || ''}”</p></div>
          </div>
          <!-- Bottom Right -->
          <div class="collage-cell" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${gal[16]?.src}', '${(gal[16]?.caption || '').replace(/'/g, "\\'")}')" title="${gal[16]?.caption || ''}">
            <img src="${gal[16]?.src}" alt="Lahari" loading="lazy">
            <div class="collage-cell-caption"><p>“${gal[16]?.caption || ''}”</p></div>
          </div>
        </div>
        <div class="collage-frame-signature">
          <h3 class="collage-signature-title">Forever My Favorite View</h3>
          <p class="collage-signature-sub">“Always you, in every lifetime, Lahari.”</p>
        </div>
      </div>
    `;

    collageShowcaseContainer.innerHTML = frame1 + frame2 + frame3 + frame4;

    // Video Play/Pause setup in Frame 2
    vids.forEach((vid, idx) => {
      const card = document.getElementById(`collage-vid-card-${idx}`);
      const video = document.getElementById(`collage-vid-elem-${idx}`);
      if (video && card) {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          if (video.paused) {
            document.querySelectorAll('.collage-video-cell video').forEach(v => {
              if (v !== video) {
                v.pause();
                v.closest('.collage-video-cell')?.classList.remove('is-playing');
              }
            });
            video.play();
            card.classList.add('is-playing');
          } else {
            video.pause();
            card.classList.remove('is-playing');
          }
        });
      }
    });
  }

  // 11. "One More Thing..." Modal Logic
  const oneMoreBtn = document.getElementById('one-more-btn');
  const oneMoreModal = document.getElementById('one-more-modal');
  const oneMoreClose = document.getElementById('one-more-close');

  if (oneMoreBtn && oneMoreModal) {
    oneMoreBtn.addEventListener('click', () => {
      oneMoreModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (oneMoreClose && oneMoreModal) {
    oneMoreClose.addEventListener('click', () => {
      oneMoreModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    oneMoreModal.addEventListener('click', (e) => {
      if (e.target === oneMoreModal) {
        oneMoreModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // 12. Secret Easter Egg Logic
  const easterEggBtn = document.getElementById('secret-easter-egg');
  const easterEggModal = document.getElementById('easter-egg-modal');
  const easterEggClose = document.getElementById('easter-egg-close');

  if (easterEggBtn && easterEggModal) {
    easterEggBtn.addEventListener('click', () => {
      easterEggModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (easterEggClose && easterEggModal) {
    easterEggClose.addEventListener('click', () => {
      easterEggModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    easterEggModal.addEventListener('click', (e) => {
      if (e.target === easterEggModal) {
        easterEggModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // 13. Cinematic Intersection Observer for Scroll Reveals
  let scrollObserver = null;
  if ('IntersectionObserver' in window) {
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once revealed, keep it visible
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    window._scrollObserver = scrollObserver;
    document.querySelectorAll('.reveal-on-scroll').forEach(el => scrollObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
  }

  // 14. Birthday Countdown & Annual Suite (29 September 2007)
  const bdayConfig = config.birthday || {};
  const bdayDaysEl = document.getElementById('bday-days');
  const bdayHoursEl = document.getElementById('bday-hours');
  const bdayMinsEl = document.getElementById('bday-mins');
  const bdaySecsEl = document.getElementById('bday-secs');
  const lifeDaysEl = document.getElementById('life-days-count');
  const bdayLockedStatusWrap = document.getElementById('bday-locked-status-wrap');
  const bdaySurpriseTriggerWrap = document.getElementById('bday-surprise-trigger-wrap');
  const openBdaySurpriseBtn = document.getElementById('open-bday-surprise-btn');
  const bdayModal = document.getElementById('bday-modal');
  const bdayModalClose = document.getElementById('bday-modal-close');
  const bdayModalBadge = document.getElementById('bday-modal-badge');
  const bdayModalTitle = document.getElementById('bday-modal-title');
  const bdayModalLetter = document.getElementById('bday-modal-letter');
  const candleBox = document.getElementById('candle-box');
  const candleFlame = document.getElementById('candle-flame');
  const candleWishNotice = document.getElementById('candle-wish-notice');

  // Support secret preview query for Nisar (?preview=bday or ?bday=1)
  const isSecretPreview = window.location.search.includes('preview=bday') || window.location.search.includes('bday=1');

  function getNextBirthdayDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // September is month index 8 (29 September)
    let targetYear = currentYear;
    if (now.getMonth() > 8 || (now.getMonth() === 8 && now.getDate() > 29)) {
      targetYear = currentYear + 1;
    }
    return new Date(targetYear, 8, 29, 0, 0, 0);
  }

  // Dynamic Yearly Surprise Generator (changes automatically every single year)
  function applyYearlyBirthdayWish(year) {
    const birthYear = bdayConfig.birthYear || 2007;
    const age = year - birthYear;
    const yearlyWish = (bdayConfig.yearlyWishes && bdayConfig.yearlyWishes[year]) || {
      age: age,
      badge: `Milestone Celebration • ${age}th Birthday • 29 September ${year}`,
      title: `Happy ${age}th Birthday, My Beloved Lahari! 🎂✨`,
      letter: `Today we celebrate ${age} beautiful years of you bringing kindness, grace, and light into this world. On this day in 2007, someone truly extraordinary was born, and I thank my lucky stars every single day that I get to love you. Happy Birthday, my favorite person in the whole universe.`
    };

    if (bdayModalBadge) bdayModalBadge.textContent = yearlyWish.badge;
    if (bdayModalTitle) bdayModalTitle.textContent = yearlyWish.title;
    if (bdayModalLetter) bdayModalLetter.textContent = yearlyWish.letter;
  }

  function updateBirthdayCountdown() {
    const now = new Date();
    const nextBday = getNextBirthdayDate();

    // Strictly check if today is her actual birthday (29 September)
    const isTodayBirthday = (now.getMonth() === 8 && now.getDate() === 29) || isSecretPreview;

    // Only on 29 September: show the unwrap surprise button & lock countdown to 00 00 00 00!
    // On all other days: show sealed gift lock notice & countdown to upcoming 29 September
    if (isTodayBirthday) {
      if (bdaySurpriseTriggerWrap) bdaySurpriseTriggerWrap.style.display = 'block';
      if (bdayLockedStatusWrap) bdayLockedStatusWrap.style.display = 'none';
      applyYearlyBirthdayWish(now.getFullYear());

      if (bdayDaysEl) bdayDaysEl.textContent = "00";
      if (bdayHoursEl) bdayHoursEl.textContent = "00";
      if (bdayMinsEl) bdayMinsEl.textContent = "00";
      if (bdaySecsEl) bdaySecsEl.textContent = "00";
    } else {
      if (bdaySurpriseTriggerWrap) bdaySurpriseTriggerWrap.style.display = 'none';
      if (bdayLockedStatusWrap) bdayLockedStatusWrap.style.display = 'block';

      const diff = Math.max(0, nextBday.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      if (bdayDaysEl) bdayDaysEl.textContent = String(days).padStart(2, '0');
      if (bdayHoursEl) bdayHoursEl.textContent = String(hours).padStart(2, '0');
      if (bdayMinsEl) bdayMinsEl.textContent = String(mins).padStart(2, '0');
      if (bdaySecsEl) bdaySecsEl.textContent = String(secs).padStart(2, '0');
    }

    // Calculate total days since 29 September 2007
    const birthOrigin = new Date(2007, 8, 29, 0, 0, 0);
    const lifeDiff = now - birthOrigin;
    const totalLifeDays = Math.floor(lifeDiff / (1000 * 60 * 60 * 24));
    if (lifeDaysEl) lifeDaysEl.textContent = totalLifeDays.toLocaleString();
  }

  if (bdayDaysEl || lifeDaysEl) {
    setInterval(updateBirthdayCountdown, 1000);
    updateBirthdayCountdown();
  }

  // Clicking the glowing surprise button opens the Birthday Modal!
  if (openBdaySurpriseBtn && bdayModal) {
    openBdaySurpriseBtn.addEventListener('click', () => {
      applyYearlyBirthdayWish(new Date().getFullYear());
      bdayModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      if (candleFlame) candleFlame.classList.remove('is-blown');
    });
  }

  // Close Birthday Modal
  if (bdayModalClose && bdayModal) {
    bdayModalClose.addEventListener('click', () => {
      bdayModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    bdayModal.addEventListener('click', (e) => {
      if (e.target === bdayModal) {
        bdayModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // Candle Wish Tap Interaction
  if (candleBox && candleFlame) {
    candleBox.addEventListener('click', () => {
      candleFlame.classList.add('is-blown');
      if (candleWishNotice) {
        candleWishNotice.textContent = bdayConfig.candleWishGranted || "Your wish is carried to the stars with love ❤️";
      }
    });
  }

  // 15. Nisar's Personal Voice Note Player
  const voiceTrigger = document.getElementById('voice-play-trigger');
  const voiceCard = document.getElementById('voice-note-card');
  const voiceStatus = document.getElementById('voice-status-text');
  let voiceAudio = null;

  if (voiceTrigger && voiceCard) {
    voiceAudio = new Audio('assets/audio/voice-note.mp3');
    let musicBoxInterval = null;

    function playFallbackMelody() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const melody = [523.25, 659.25, 587.33, 783.99, 659.25, 523.25, 440.00, 523.25];
        let step = 0;
        voiceCard.classList.add('is-playing');
        if (voiceStatus) {
          voiceStatus.textContent = "A gentle melody from Nisar's heart ❤️";
          voiceStatus.style.color = "var(--color-gold-light)";
        }
        voiceTrigger.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

        if (musicBoxInterval) clearInterval(musicBoxInterval);
        musicBoxInterval = setInterval(() => {
          if (!voiceCard.classList.contains('is-playing')) {
            clearInterval(musicBoxInterval);
            return;
          }
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(melody[step % melody.length], now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.1);
          step++;
          if (step >= 24) {
            clearInterval(musicBoxInterval);
            voiceCard.classList.remove('is-playing');
            if (voiceStatus) voiceStatus.textContent = "Tap play to hear the melody again ❤️";
            voiceTrigger.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
          }
        }, 480);
      } catch (e) {}
    }

    voiceTrigger.addEventListener('click', () => {
      if (voiceCard.classList.contains('is-playing')) {
        if (voiceAudio) voiceAudio.pause();
        if (musicBoxInterval) clearInterval(musicBoxInterval);
        voiceCard.classList.remove('is-playing');
        if (voiceStatus) voiceStatus.textContent = "Tap play to resume";
        voiceTrigger.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        return;
      }

      if (voiceAudio) {
        const playPromise = voiceAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            voiceCard.classList.add('is-playing');
            if (voiceStatus) voiceStatus.textContent = "Listening to Nisar's voice ❤️";
            voiceTrigger.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
          }).catch(() => {
            // Audio file not added yet — automatically play romantic synthesized music box!
            playFallbackMelody();
          });
        } else {
          playFallbackMelody();
        }
      } else {
        playFallbackMelody();
      }
    });

    voiceAudio.addEventListener('ended', () => {
      voiceCard.classList.remove('is-playing');
      if (voiceStatus) voiceStatus.textContent = "Tap play to hear Nisar's voice again ❤️";
      voiceTrigger.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    });
  }

  // 16. "Open When..." Envelopes (DYNAMIC RANDOM LETTERS)
  const openWhenContainer = document.getElementById('open-when-container');
  const envelopeModal = document.getElementById('envelope-modal');
  const envelopeTitle = document.getElementById('envelope-modal-title');
  const envelopeBody = document.getElementById('envelope-modal-body');
  const envelopeClose = document.getElementById('envelope-modal-close');
  const envelopeAnotherBtn = document.getElementById('envelope-another-btn');
  let currentOpenWhenEnv = null;
  let lastLetterIdx = -1;

  function displayEnvelopeLetter(envData) {
    if (!envData || !envelopeModal) return;
    currentOpenWhenEnv = envData;
    const letterPool = envData.letters && envData.letters.length > 0 ? envData.letters : [envData.letter];
    let randIdx = 0;
    if (letterPool.length > 1) {
      do {
        randIdx = Math.floor(Math.random() * letterPool.length);
      } while (randIdx === lastLetterIdx);
    }
    lastLetterIdx = randIdx;

    if (envelopeTitle) envelopeTitle.textContent = envData.title;
    if (envelopeBody) {
      envelopeBody.style.opacity = '0';
      setTimeout(() => {
        envelopeBody.textContent = letterPool[randIdx];
        envelopeBody.style.opacity = '1';
      }, 150);
    }
    envelopeModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  if (openWhenContainer && config.openWhen) {
    openWhenContainer.innerHTML = config.openWhen.map(env => `
      <div class="open-envelope-card reveal-on-scroll" data-id="${env.id}">
        <span class="envelope-seal-icon">${env.seal}</span>
        <span class="envelope-tag">${env.tag}</span>
        <h3>${env.title}</h3>
      </div>
    `).join('');

    openWhenContainer.querySelectorAll('.open-envelope-card').forEach(card => {
      if (window._scrollObserver) {
        window._scrollObserver.observe(card);
      } else {
        card.classList.add('is-visible');
      }

      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const envData = config.openWhen.find(e => e.id === id);
        displayEnvelopeLetter(envData);
      });
    });
  }

  if (envelopeAnotherBtn) {
    envelopeAnotherBtn.addEventListener('click', () => {
      if (currentOpenWhenEnv) {
        displayEnvelopeLetter(currentOpenWhenEnv);
        if ('vibrate' in navigator) navigator.vibrate(30);
      }
    });
  }

  if (envelopeClose && envelopeModal) {
    envelopeClose.addEventListener('click', () => {
      envelopeModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    envelopeModal.addEventListener('click', (e) => {
      if (e.target === envelopeModal) {
        envelopeModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // 17. "The Reason Jar" (Expanded to 45+ Personalized Compliments)
  const jarBtn = document.getElementById('jar-btn');
  const reasonText = document.getElementById('reason-text');
  let lastReasonIdx = -1;

  if (jarBtn && reasonText && config.reasonJar) {
    jarBtn.addEventListener('click', () => {
      let randIdx;
      do {
        randIdx = Math.floor(Math.random() * config.reasonJar.length);
      } while (randIdx === lastReasonIdx && config.reasonJar.length > 1);

      lastReasonIdx = randIdx;
      reasonText.style.opacity = '0';
      if ('vibrate' in navigator) navigator.vibrate(35);
      setTimeout(() => {
        reasonText.textContent = `“${config.reasonJar[randIdx]}”`;
        reasonText.style.opacity = '1';
      }, 200);
    });
  }

  // 18. "Hold For a Virtual Hug" (Side-by-Side Dual Pod Enhanced)
  const hugBtn = document.getElementById('hug-trigger-btn');
  const hugStatus = document.getElementById('hug-status-text');
  const embraceWaves = document.getElementById('embrace-waves-container');
  const hugsCountEl = document.getElementById('hugs-shared-count');
  let hugTimer = null;
  let lastHugIdx = -1;

  // Initialize Hugs count from localStorage
  let savedHugs = parseInt(localStorage.getItem('lahari_warm_hugs_count') || '28', 10);
  if (isNaN(savedHugs) || savedHugs < 28) savedHugs = 28;
  if (hugsCountEl) hugsCountEl.textContent = savedHugs;

  const romanticHugPool = [
    "Wrapping you tight in my arms... feeling every breath with you, my love. ❤️",
    "Sending you the warmest hug. Nisar is always right here with you, Lahari 💕",
    "Close your eyes and breathe... you are protected and deeply cherished always. 🫂",
    "No distance can ever keep my embrace from reaching your soul. ✨",
    "You are my peaceful home, Lahari. Resting my head beside yours right now. 🌹",
    "Holding you so close that our heartbeats echo as one rhythm. 💓",
    "A tight, gentle bear hug for my most precious princess. You are safe. 🤍",
    "Wrapped in warmth and endless love... I never want to let you go. 🌸",
    "Take this warmth with you throughout the day — Nisar loves you endlessly. 💫",
    "Whenever the world feels heavy, just remember you have my whole heart. 💎",
    "Holding your soft hands, pulling you into my chest, and whispering: I love you. 🕊️",
    "Feel my fingers softly brushing your hair while holding you tight. 🌙",
    "Every hug I give you is a silent promise to stand by you for eternity. 💍",
    "You are my universe's softest miracle. Never forget how loved you are. ✨",
    "Resting together in quiet peace, safe in our own little world. 🕯️",
    "Holding you through the screen until I can wrap my actual arms around you forever. 💖"
  ];

  if (hugBtn && hugStatus) {
    function startHug() {
      hugBtn.classList.add('is-holding');
      if (embraceWaves) embraceWaves.classList.add('is-active');
      hugStatus.textContent = config.virtualHug?.holdingText || "Wrapping my arms around you tightly...";

      if ('vibrate' in navigator) {
        navigator.vibrate([40, 60, 40]);
      }

      hugTimer = setTimeout(() => {
        hugBtn.classList.remove('is-holding');
        if (embraceWaves) embraceWaves.classList.remove('is-active');

        let randHugIdx = 0;
        if (romanticHugPool.length > 1) {
          do {
            randHugIdx = Math.floor(Math.random() * romanticHugPool.length);
          } while (randHugIdx === lastHugIdx);
        }
        lastHugIdx = randHugIdx;

        hugStatus.style.opacity = '0';
        setTimeout(() => {
          hugStatus.textContent = romanticHugPool[randHugIdx];
          hugStatus.style.opacity = '1';
        }, 150);

        // Update Hug Count
        savedHugs++;
        localStorage.setItem('lahari_warm_hugs_count', savedHugs);
        if (hugsCountEl) {
          hugsCountEl.textContent = savedHugs;
          hugsCountEl.style.transform = 'scale(1.35)';
          setTimeout(() => { hugsCountEl.style.transform = 'scale(1)'; }, 350);
        }

        // Screen Warmth Glow Flash
        const warmthFlash = document.createElement('div');
        warmthFlash.className = 'hug-warmth-screen-flash';
        document.body.appendChild(warmthFlash);
        setTimeout(() => warmthFlash.remove(), 1200);

        // Acoustic warm chime
        if (typeof playWarmEmbraceChime === 'function') {
          playWarmEmbraceChime();
        }

        if ('vibrate' in navigator) {
          navigator.vibrate([100, 80, 150]);
        }
        /* emoji popup disabled */
      }, 3000);
    }

    function cancelHug() {
      if (hugTimer) {
        clearTimeout(hugTimer);
        hugTimer = null;
      }
      hugBtn.classList.remove('is-holding');
      if (embraceWaves) embraceWaves.classList.remove('is-active');
      if (!hugStatus.textContent.includes('Wrapping') && !hugStatus.textContent.includes('arms') && !hugStatus.textContent.includes('Nisar')) {
        hugStatus.textContent = config.virtualHug?.subtitle || "Press and hold the heart below for 3 seconds to feel a warm embrace.";
      }
    }

    hugBtn.addEventListener('mousedown', startHug);
    hugBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHug(); }, { passive: false });
    window.addEventListener('mouseup', cancelHug);
    window.addEventListener('touchend', cancelHug);
  }

  // 19. PRESTIGE UNIFIED SANCTUM ATELIER (THEMES & PETALS)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const petalToggleBtn = document.getElementById('petal-toggle-pill');
  const atelierDrawer = document.getElementById('sanctum-atelier-drawer');
  const atelierPanel = document.getElementById('atelier-panel');
  const atelierDrawerClose = document.getElementById('atelier-drawer-close');
  const atelierTabThemes = document.getElementById('atelier-tab-themes');
  const atelierTabPetals = document.getElementById('atelier-tab-petals');
  const atelierPanelThemes = document.getElementById('atelier-panel-themes');
  const atelierPanelPetals = document.getElementById('atelier-panel-petals');
  const atelierTabIndicator = document.getElementById('atelier-tab-indicator');
  const themeGrid = document.getElementById('theme-grid');

  const themes = config.themes || [];
  const savedTheme = localStorage.getItem('lahari_selected_theme') || 'velvet-wine';

  function triggerCardFeedback(card) {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (window.CelestialCursor && typeof window.CelestialCursor.burst === 'function') {
      window.CelestialCursor.burst(cx, cy, 9);
    }
    if (atelierPanel) {
      atelierPanel.classList.remove('swatch-glow');
      void atelierPanel.offsetWidth;
      atelierPanel.classList.add('swatch-glow');
    }
  }

  function switchAtelierTab(tab) {
    if (tab === 'themes') {
      atelierTabThemes?.classList.add('is-active');
      atelierTabThemes?.setAttribute('aria-selected', 'true');
      atelierTabPetals?.classList.remove('is-active');
      atelierTabPetals?.setAttribute('aria-selected', 'false');

      atelierPanelThemes?.classList.add('is-active');
      atelierPanelPetals?.classList.remove('is-active');

      if (atelierTabIndicator) {
        atelierTabIndicator.style.transform = 'translateX(0%)';
      }
    } else {
      atelierTabPetals?.classList.add('is-active');
      atelierTabPetals?.setAttribute('aria-selected', 'true');
      atelierTabThemes?.classList.remove('is-active');
      atelierTabThemes?.setAttribute('aria-selected', 'false');

      atelierPanelPetals?.classList.add('is-active');
      atelierPanelThemes?.classList.remove('is-active');

      if (atelierTabIndicator) {
        atelierTabIndicator.style.transform = 'translateX(100%)';
      }
    }
  }

  function openAtelier(tab = 'themes') {
    if (!atelierDrawer) return;
    switchAtelierTab(tab);
    atelierDrawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeAtelier() {
    if (!atelierDrawer) return;
    atelierDrawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (atelierTabThemes) {
    atelierTabThemes.addEventListener('click', () => switchAtelierTab('themes'));
  }
  if (atelierTabPetals) {
    atelierTabPetals.addEventListener('click', () => switchAtelierTab('petals'));
  }
  if (atelierDrawerClose) {
    atelierDrawerClose.addEventListener('click', closeAtelier);
  }
  if (atelierDrawer) {
    atelierDrawer.addEventListener('click', (e) => {
      if (e.target === atelierDrawer) closeAtelier();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && atelierDrawer?.classList.contains('is-open')) {
      closeAtelier();
    }
  });

  function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('lahari_selected_theme', themeId);
    if (themeGrid) {
      themeGrid.querySelectorAll('.theme-card').forEach(card => {
        if (card.getAttribute('data-theme-id') === themeId) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }
  }

  // Apply saved or default theme
  applyTheme(savedTheme);

  if (themeGrid && themes.length > 0) {
    themeGrid.innerHTML = themes.map(t => `
      <div class="theme-card ${t.id === savedTheme ? 'is-active' : ''}" data-theme-id="${t.id}" tabindex="0" role="button" aria-label="${t.id}">
        <div class="theme-swatch" style="background: ${t.swatch};"></div>
        <div class="theme-active-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    `).join('');

    themeGrid.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-theme-id');
        if (id) {
          applyTheme(id);
          triggerCardFeedback(card);
          if ('vibrate' in navigator) navigator.vibrate(35);
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = card.getAttribute('data-theme-id');
          if (id) {
            applyTheme(id);
            triggerCardFeedback(card);
          }
        }
      });
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = atelierDrawer?.classList.contains('is-open');
      const isThemesActive = atelierTabThemes?.classList.contains('is-active');
      if (isOpen && isThemesActive) {
        closeAtelier();
      } else {
        openAtelier('themes');
      }
    });
  }

  // 20. 10-STYLE ROMANTIC PETAL & CELESTIAL DRIFT ENGINE
  const petalsCanvas = document.getElementById('petals-canvas');
  const petalToggleStatus = document.getElementById('petal-toggle-status');
  const petalCurrentIcon = document.getElementById('petal-current-icon');
  const petalsGrid = document.getElementById('petals-grid');
  const petalsPowerToggle = document.getElementById('petals-power-toggle');
  const petalsPowerText = document.getElementById('petals-power-text');
  const petalsStatusDesc = document.getElementById('petals-active-status-desc');

  const petalStyles = config.petalStyles || [];
  let currentPetalStyleId = localStorage.getItem('lahari_petal_style') || 'crimson-rose';
  let petalsRunning = false;
  let petalsAnimationId = null;
  const petals = [];
  const TOTAL_PETALS = 36;

  function getCurrentPetalStyle() {
    return petalStyles.find(s => s.id === currentPetalStyleId) || petalStyles[0] || {
      id: "crimson-rose",
      name: "Crimson Rose Petals",
      icon: "🌹",
      type: "rose",
      colors: [{ r: 219, g: 39, b: 79 }, { r: 168, g: 21, b: 56 }]
    };
  }

  if (petalsCanvas) {
    const ctx = petalsCanvas.getContext('2d');

    function resizePetalsCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      petalsCanvas.width = window.innerWidth * dpr;
      petalsCanvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function createParticle(initial = false) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const style = getCurrentPetalStyle();
      const colors = style.colors || [{ r: 219, g: 39, b: 79 }];
      const color = colors[Math.floor(Math.random() * colors.length)];

      let speedY = 0.9 + Math.random() * 1.5;
      let size = 11 + Math.random() * 13;
      if (style.type === 'diamond' || style.type === 'gold') {
        size = 6 + Math.random() * 10;
        speedY = 0.7 + Math.random() * 1.2;
      } else if (style.type === 'heart') {
        size = 10 + Math.random() * 12;
      }

      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -30 - Math.random() * 50,
        size: size,
        speedY: speedY,
        speedX: -0.5 + Math.random() * 1.0,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.025,
        flutterAngle: Math.random() * Math.PI,
        flutterSpeed: 0.02 + Math.random() * 0.03,
        color: color,
        opacity: 0.55 + Math.random() * 0.4,
        type: style.type
      };
    }

    function initPetals() {
      petals.length = 0;
      for (let i = 0; i < TOTAL_PETALS; i++) {
        petals.push(createParticle(true));
      }
    }

    function drawParticle(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      const r = p.size;
      const scaleX = Math.cos(p.flutterAngle);

      if (p.type === 'heart') {
        // Glowing Floating Heart
        ctx.scale(scaleX * 0.8, 0.8);
        ctx.beginPath();
        const topCurveHeight = r * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -r / 2, 0, -r / 2, topCurveHeight);
        ctx.bezierCurveTo(-r / 2, (r + topCurveHeight) / 2, 0, (r + topCurveHeight) / 2, 0, r);
        ctx.bezierCurveTo(0, (r + topCurveHeight) / 2, r / 2, (r + topCurveHeight) / 2, r / 2, topCurveHeight);
        ctx.bezierCurveTo(r / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.5)`;
        ctx.shadowBlur = 6;
        ctx.fill();
      } else if (p.type === 'diamond' || p.type === 'gold') {
        // 4-Point Starlight / Gold Foil Flake
        ctx.scale(scaleX, 1);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.35, -r * 0.35);
        ctx.lineTo(r, 0);
        ctx.lineTo(r * 0.35, r * 0.35);
        ctx.lineTo(0, r);
        ctx.lineTo(-r * 0.35, r * 0.35);
        ctx.lineTo(-r, 0);
        ctx.lineTo(-r * 0.35, -r * 0.35);
        ctx.closePath();
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
      } else if (p.type === 'leaf') {
        // Autumn Leaf Shape
        ctx.scale(scaleX, 1);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.bezierCurveTo(r, -r * 0.4, r * 0.8, r * 0.6, 0, r * 1.2);
        ctx.bezierCurveTo(-r * 0.8, r * 0.6, -r, -r * 0.4, 0, -r);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
        ctx.fill();
        // Central vein
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.8);
        ctx.lineTo(0, r * 1.1);
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (p.type === 'jasmine' || p.type === 'orchid' || p.type === 'lotus') {
        // Slender Graceful Blossom Petal
        ctx.scale(scaleX, 1);
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.2);
        ctx.bezierCurveTo(r * 0.6, -r * 0.4, r * 0.6, r * 0.6, 0, r * 1.1);
        ctx.bezierCurveTo(-r * 0.6, r * 0.6, -r * 0.6, -r * 0.4, 0, -r * 1.2);
        const grad = ctx.createLinearGradient(0, -r * 1.2, 0, r * 1.1);
        grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`);
        grad.addColorStop(1, `rgba(${Math.max(0, p.color.r - 35)}, ${Math.max(0, p.color.g - 35)}, ${Math.max(0, p.color.b - 35)}, ${p.opacity * 0.8})`);
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        // Classic Rose & Sakura Curving Petal
        ctx.scale(scaleX, 1);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.bezierCurveTo(r * 0.75, -r * 0.8, r * 0.85, r * 0.4, 0, r);
        ctx.bezierCurveTo(-r * 0.85, r * 0.4, -r * 0.75, -r * 0.8, 0, -r);
        const grad = ctx.createLinearGradient(0, -r, 0, r);
        grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`);
        grad.addColorStop(1, `rgba(${Math.max(0, p.color.r - 40)}, ${Math.max(0, p.color.g - 30)}, ${Math.max(0, p.color.b - 30)}, ${p.opacity * 0.85})`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.7);
        ctx.lineTo(0, r * 0.6);
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.35})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      ctx.restore();
    }

    function updatePetals() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.flutterAngle) * 0.8;
        p.angle += p.angleSpeed;
        p.flutterAngle += p.flutterSpeed;

        drawParticle(p);

        if (p.y > h + 40 || p.x < -40 || p.x > w + 40) {
          petals[i] = createParticle(false);
        }
      }

      if (petalsRunning) {
        petalsAnimationId = requestAnimationFrame(updatePetals);
      }
    }

    function startPetals() {
      if (petalsRunning) return;
      petalsRunning = true;
      resizePetalsCanvas();
      initPetals();
      petalsCanvas.classList.add('is-active');
      if (petalToggleBtn) petalToggleBtn.classList.add('is-active');
      updatePetalButtonUI();
      petalsAnimationId = requestAnimationFrame(updatePetals);
    }

    function stopPetals() {
      petalsRunning = false;
      if (petalsAnimationId) {
        cancelAnimationFrame(petalsAnimationId);
        petalsAnimationId = null;
      }
      petalsCanvas.classList.remove('is-active');
      if (petalToggleBtn) petalToggleBtn.classList.remove('is-active');
      updatePetalButtonUI();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function updatePetalButtonUI() {
      const style = getCurrentPetalStyle();
      if (petalCurrentIcon) petalCurrentIcon.textContent = style.icon || "🌸";
      if (petalToggleBtn) {
        petalToggleBtn.title = petalsRunning ? "Petals: Active" : "Petals: OFF";
        petalToggleBtn.setAttribute('aria-label', "Petals");
      }
      if (petalToggleStatus) {
        petalToggleStatus.textContent = petalsRunning ? "Active" : "OFF";
      }
      if (petalsPowerToggle) {
        if (petalsRunning) {
          petalsPowerToggle.classList.add('is-active');
          petalsPowerToggle.setAttribute('aria-checked', 'true');
        } else {
          petalsPowerToggle.classList.remove('is-active');
          petalsPowerToggle.setAttribute('aria-checked', 'false');
        }
      }
      if (petalsPowerText) {
        petalsPowerText.textContent = petalsRunning ? "Turn Drift OFF" : "Turn Drift ON";
      }
      if (petalsStatusDesc) {
        petalsStatusDesc.textContent = petalsRunning ? "Falling Drift" : "Drift Paused";
      }
    }

    function applyPetalStyle(styleId) {
      currentPetalStyleId = styleId;
      localStorage.setItem('lahari_petal_style', styleId);

      if (petalsGrid) {
        petalsGrid.querySelectorAll('.theme-card').forEach(card => {
          if (card.getAttribute('data-petal-id') === styleId) {
            card.classList.add('is-active');
          } else {
            card.classList.remove('is-active');
          }
        });
      }

      if (!petalsRunning) {
        startPetals();
      } else {
        initPetals();
      }
      updatePetalButtonUI();
      if ('vibrate' in navigator) navigator.vibrate(30);
    }

    // Render 10 Petal style cards into #petals-grid
    if (petalsGrid && petalStyles.length > 0) {
      petalsGrid.innerHTML = petalStyles.map(s => `
        <div class="theme-card ${s.id === currentPetalStyleId ? 'is-active' : ''}" data-petal-id="${s.id}" tabindex="0" role="button" aria-label="${s.id}">
          <div class="theme-swatch" style="background: ${s.swatch}; font-size: 1.25rem; display: flex; align-items: center; justify-content: center;">
            ${s.icon}
          </div>
          <div class="theme-active-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      `).join('');

      petalsGrid.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-petal-id');
          if (id) {
            applyPetalStyle(id);
            triggerCardFeedback(card);
          }
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const id = card.getAttribute('data-petal-id');
            if (id) {
              applyPetalStyle(id);
              triggerCardFeedback(card);
            }
          }
        });
      });
    }

    // Toggle drawer open/close via Petal Jewel button in Top Atmosphere Bar
    if (petalToggleBtn) {
      petalToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = atelierDrawer?.classList.contains('is-open');
        const isPetalsActive = atelierTabPetals?.classList.contains('is-active');
        if (isOpen && isPetalsActive) {
          closeAtelier();
        } else {
          openAtelier('petals');
        }
      });
    }

    // Precision Hardware-style Toggle Switch for Drift
    if (petalsPowerToggle) {
      petalsPowerToggle.addEventListener('click', () => {
        if (petalsRunning) {
          stopPetals();
          localStorage.setItem('lahari_petals_state', 'off');
        } else {
          startPetals();
          localStorage.setItem('lahari_petals_state', 'on');
        }
        updatePetalButtonUI();
        if ('vibrate' in navigator) navigator.vibrate(25);
      });
    }

    window.addEventListener('resize', () => {
      if (petalsRunning) resizePetalsCanvas();
    });

    // Restore saved petal state (default: ON)
    const savedPetalsState = localStorage.getItem('lahari_petals_state');
    if (savedPetalsState === 'on' || savedPetalsState === null) {
      startPetals();
    } else {
      updatePetalButtonUI();
    }
  }

  // 21. INTERACTIVE POLAROID PHOTO STACK (8 REAL CANDID MOMENTS)
  const polaroidStack = document.getElementById('polaroid-stack');
  const polaroidItems = config.polaroids || [];

  if (polaroidStack && polaroidItems.length > 0) {
    const angles = [-5, 4, -3, 6, -2, 5, -4, 3];

    polaroidStack.innerHTML = polaroidItems.map((item, idx) => {
      const rot = angles[idx % angles.length];
      const zIdx = polaroidItems.length - idx;
      return `
        <div class="polaroid-card" data-index="${idx}" style="transform: rotate(${rot}deg); z-index: ${zIdx};" role="button" tabindex="0" aria-label="Polaroid: ${item.caption}">
          <img class="polaroid-photo" src="${item.image}" alt="${item.caption}" loading="eager">
          <p class="polaroid-caption">${item.caption}</p>
        </div>
      `;
    }).join('');

    let isShuffling = false;
    function shuffleTopPolaroid() {
      if (isShuffling) return;
      const cards = Array.from(polaroidStack.querySelectorAll('.polaroid-card'));
      if (cards.length <= 1) return;

      let topCard = null;
      let maxZ = -Infinity;
      cards.forEach(card => {
        const z = parseInt(card.style.zIndex || '0', 10);
        if (z > maxZ) {
          maxZ = z;
          topCard = card;
        }
      });

      if (!topCard) return;
      isShuffling = true;

      const randomDirection = Math.random() > 0.5 ? 1 : -1;
      const throwX = randomDirection * (window.innerWidth < 600 ? 180 : 260);
      const throwRotate = randomDirection * 24;

      topCard.style.transition = 'transform 0.45s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.45s ease';
      topCard.style.transform = `translate(${throwX}px, -40px) rotate(${throwRotate}deg) scale(0.95)`;
      topCard.style.opacity = '0.7';

      setTimeout(() => {
        cards.forEach(card => {
          if (card !== topCard) {
            const currentZ = parseInt(card.style.zIndex || '0', 10);
            card.style.zIndex = currentZ + 1;
          }
        });

        topCard.style.zIndex = '1';
        const newRot = (Math.random() - 0.5) * 10;
        topCard.style.transform = `translate(0, 0) rotate(${newRot}deg) scale(1)`;
        topCard.style.opacity = '1';

        setTimeout(() => {
          isShuffling = false;
        }, 350);
      }, 350);
    }

    polaroidStack.addEventListener('click', shuffleTopPolaroid);
    polaroidStack.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        shuffleTopPolaroid();
      }
    });
  }

  // 22. 2030 TIME CAPSULE COUNTDOWN & OATH
  const capsuleDays = document.getElementById('capsule-days');
  const capsuleHours = document.getElementById('capsule-hours');
  const capsuleMins = document.getElementById('capsule-mins');
  const capsuleSecs = document.getElementById('capsule-secs');
  const capsulePeekBtn = document.getElementById('capsule-peek-btn');
  const capsuleModal = document.getElementById('capsule-modal');
  const capsuleModalClose = document.getElementById('capsule-modal-close');

  const capsuleConfig = config.timeCapsule || { targetYear: 2030, targetMonth: 8, targetDay: 29 };
  const targetDate = new Date(capsuleConfig.targetYear, capsuleConfig.targetMonth, capsuleConfig.targetDay, 0, 0, 0);

  function updateCapsuleCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (capsuleDays) capsuleDays.textContent = "0000";
      if (capsuleHours) capsuleHours.textContent = "00";
      if (capsuleMins) capsuleMins.textContent = "00";
      if (capsuleSecs) capsuleSecs.textContent = "00";
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (capsuleDays) capsuleDays.textContent = String(days).padStart(4, '0');
    if (capsuleHours) capsuleHours.textContent = String(hours).padStart(2, '0');
    if (capsuleMins) capsuleMins.textContent = String(mins).padStart(2, '0');
    if (capsuleSecs) capsuleSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCapsuleCountdown();
  setInterval(updateCapsuleCountdown, 1000);

  if (capsulePeekBtn && capsuleModal) {
    capsulePeekBtn.addEventListener('click', () => {
      capsuleModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }

  const capsuleModalCloseX = document.getElementById('capsule-modal-close-x');

  if (capsuleModalClose && capsuleModal) {
    capsuleModalClose.addEventListener('click', () => {
      capsuleModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  }

  if (capsuleModalCloseX && capsuleModal) {
    capsuleModalCloseX.addEventListener('click', () => {
      capsuleModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  }

  if (capsuleModal) {
    capsuleModal.addEventListener('click', (e) => {
      if (e.target === capsuleModal) {
        capsuleModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // 23. FLOATING SYNCHRONIZED SONG LYRICS
  const lyricBar = document.getElementById('music-lyric-bar');
  const lyricText = document.getElementById('music-lyric-text');
  const songLyrics = config.songLyrics || {};
  let lyricInterval = null;
  let lyricIndex = 0;

  function updateLyricDisplay(trackId) {
    if (!lyricText) return;
    const lyricsArray = songLyrics[trackId] || songLyrics[1] || [];
    if (lyricsArray.length === 0) return;

    lyricText.style.opacity = '0';
    setTimeout(() => {
      lyricText.textContent = `“${lyricsArray[lyricIndex % lyricsArray.length]}”`;
      lyricText.style.opacity = '1';
    }, 300);
  }

  function startLyricCycle(trackId) {
    stopLyricCycle();
    lyricIndex = 0;
    if (lyricBar) lyricBar.classList.add('is-visible');
    updateLyricDisplay(trackId);

    lyricInterval = setInterval(() => {
      lyricIndex++;
      updateLyricDisplay(trackId);
    }, 5500);
  }

  function stopLyricCycle() {
    if (lyricInterval) {
      clearInterval(lyricInterval);
      lyricInterval = null;
    }
    if (lyricBar) lyricBar.classList.remove('is-visible');
  }

  // Listen to RomanticAudio state changes
  window.addEventListener('romanticAudioStateChange', (e) => {
    const { isPlaying, currentTrackIdx } = e.detail || {};
    const trackId = (currentTrackIdx !== undefined ? currentTrackIdx : 0) + 1;

    if (isPlaying) {
      startLyricCycle(trackId);
    } else {
      stopLyricCycle();
    }
  });

  // ============================================================
  // WEB AUDIO SOUND EFFECTS SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED)
  // ============================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playMetallicLockClick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch(e) {}
  }

  function playCorkPopSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch(e) {}
  }

  function playWaxStampSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch(e) {}
  }

  function playGentleBell() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch(e) {}
  }

  function playHeartbeatThump() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // First thump
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.13);

      // Second thump
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55, ctx.currentTime + 0.16);
      osc2.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
      gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.16);
      osc2.stop(ctx.currentTime + 0.31);
    } catch(e) {}
  }

  function playWarmEmbraceChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.9);
      });
    } catch(e) {}
  }

  function playQuillScratchSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const bufferSize = Math.floor(ctx.sampleRate * 0.045);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500 + (Math.random() * 800 - 400);
      filter.Q.value = 3.2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch(e) {}
  }

  function playStarChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [528, 660, 792, 1056];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.16, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.8);
      });
    } catch(e) {}
  }

  function playCompassTick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch(e) {}
  }

  function playVaultUnlockSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(580, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.09);
      gain1.gain.setValueAtTime(0.28, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.1);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(261.63, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 1.25);
    } catch(e) {}
  }

  // ============================================================
  // FEATURE 2: "TODAY'S LOVE WHISPER" (TIME-BASED GREETING)
  // ============================================================
  const whisperTag = document.getElementById('whisper-tag');
  const whisperTitle = document.getElementById('whisper-title');
  const whisperQuote = document.getElementById('whisper-quote');
  const whisperIcon = document.getElementById('whisper-icon');
  const whisperRefreshBtn = document.getElementById('whisper-refresh-btn');
  const whispers = config.timeWhispers || {};

  function updateTimeWhisper() {
    const hour = new Date().getHours();
    let slot = 'morning';
    let icon = '☀️';

    if (hour >= 5 && hour < 12) {
      slot = 'morning';
      icon = '☀️';
    } else if (hour >= 12 && hour < 17) {
      slot = 'afternoon';
      icon = '☕';
    } else if (hour >= 17 && hour < 21) {
      slot = 'evening';
      icon = '🌆';
    } else {
      slot = 'night';
      icon = '🌙';
    }

    const data = whispers[slot] || whispers.morning;
    if (data) {
      if (whisperIcon) whisperIcon.textContent = icon;
      if (whisperTag) whisperTag.textContent = data.tag;
      if (whisperTitle) whisperTitle.textContent = data.title;
      if (whisperQuote) whisperQuote.textContent = `“${data.quote}”`;
    }
  }

  updateTimeWhisper();

  if (whisperRefreshBtn) {
    whisperRefreshBtn.addEventListener('click', () => {
      const slots = ['morning', 'afternoon', 'evening', 'night'];
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      const icons = { morning: '☀️', afternoon: '☕', evening: '🌆', night: '🌙' };
      const data = whispers[randomSlot];
      if (data) {
        if (whisperIcon) whisperIcon.textContent = icons[randomSlot] || '✨';
        if (whisperTag) whisperTag.textContent = data.tag;
        if (whisperTitle) whisperTitle.textContent = data.title;
        if (whisperQuote) whisperQuote.textContent = `“${data.quote}”`;
        if ('vibrate' in navigator) navigator.vibrate(25);
      }
    });
  }

  // ============================================================
  // FEATURE 14: "THE ETERNITY LIVE CLOCK" (MILLI-SECOND ROLLING COUNTER)
  // ============================================================
  const odoYears = document.getElementById('odo-years');
  const odoMonths = document.getElementById('odo-months');
  const odoDays = document.getElementById('odo-days');
  const odoHours = document.getElementById('odo-hours');
  const odoMins = document.getElementById('odo-mins');
  const odoSecs = document.getElementById('odo-secs');
  const odoMs = document.getElementById('odo-ms');

  // Milestone: Born 29 September 2007, 00:00:00
  const loveOriginDate = new Date(2007, 8, 29, 0, 0, 0);

  function updateEternityClock() {
    const now = new Date();
    const diff = now - loveOriginDate;
    if (diff <= 0) return;

    // Approximate breakdown
    let years = now.getFullYear() - 2007;
    let months = now.getMonth() - 8;
    if (months < 0) {
      years--;
      months += 12;
    }
    let days = now.getDate() - 29;
    if (days < 0) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    const hours = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const ms = now.getMilliseconds();

    if (odoYears) odoYears.textContent = String(Math.max(0, years)).padStart(2, '0');
    if (odoMonths) odoMonths.textContent = String(Math.max(0, months)).padStart(2, '0');
    if (odoDays) odoDays.textContent = String(Math.max(0, days)).padStart(2, '0');
    if (odoHours) odoHours.textContent = String(hours).padStart(2, '0');
    if (odoMins) odoMins.textContent = String(mins).padStart(2, '0');
    if (odoSecs) odoSecs.textContent = String(secs).padStart(2, '0');
    if (odoMs) odoMs.textContent = String(ms).padStart(3, '0');
  }

  setInterval(updateEternityClock, 35);
  updateEternityClock();

  // ============================================================
  // FEATURE 10: CIRCULAR SONG PROGRESS RING
  // ============================================================
  const musicProgressCircle = document.getElementById('music-progress-circle');
  if (musicProgressCircle) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius; // ~113.097
    musicProgressCircle.style.strokeDasharray = `${circumference}`;
    musicProgressCircle.style.strokeDashoffset = `${circumference}`;

    // Periodically inspect active audio element from RomanticAudio
    setInterval(() => {
      if (window.RomanticAudio && window.RomanticAudio.getCurrentTime && window.RomanticAudio.getDuration) {
        const cur = window.RomanticAudio.getCurrentTime() || 0;
        const dur = window.RomanticAudio.getDuration() || 1;
        if (dur > 0) {
          const progress = Math.min(1, Math.max(0, cur / dur));
          const offset = circumference - (progress * circumference);
          musicProgressCircle.style.strokeDashoffset = `${offset}`;
        }
      }
    }, 250);
  }

  // ============================================================
  // FEATURE 15: 35MM VINTAGE FILM REEL
  // ============================================================
  const filmReelStrip = document.getElementById('film-reel-strip');
  if (filmReelStrip) {
    const filmImages = config.filmReel || [
      { src: 'assets/images/film-01.jpg', caption: 'Unfiltered elegance in the quietest moments' },
      { src: 'assets/images/film-02.jpg', caption: 'That effortless charm that stops time' },
      { src: 'assets/images/film-03.jpg', caption: 'A candid frame of pure innocence & grace' },
      { src: 'assets/images/film-04.jpg', caption: 'The way sunlight finds its favorite muse' },
      { src: 'assets/images/film-05.jpg', caption: 'Unscripted, genuine, and impossibly beautiful' },
      { src: 'assets/images/film-06.jpg', caption: 'Every candid angle reveals another reason to fall' },
      { src: 'assets/images/film-07.jpg', caption: 'A quiet laugh caught between breaths' },
      { src: 'assets/images/film-08.jpg', caption: 'Sweetest soul, timeless in 35mm grain' },
      { src: 'assets/images/film-09.jpg', caption: 'The softness in your eyes speaking volumes' },
      { src: 'assets/images/film-10.jpg', caption: 'A stolen glance worth a million verses' },
      { src: 'assets/images/film-11.jpg', caption: 'Natural, radiant, and utterly unforgettable' },
      { src: 'assets/images/film-12.jpg', caption: 'Capturing the magic in your simplest smile' },
      { src: 'assets/images/film-13.jpg', caption: 'A precious memory frozen in eternal warmth' },
      { src: 'assets/images/film-14.jpg', caption: 'The rare beauty of your authentic self' },
      { src: 'assets/images/film-15.jpg', caption: 'Every picture tells our unspoken love story' },
      { src: 'assets/images/film-16.jpg', caption: 'Forever my favorite piece of art, Lahari' }
    ];

    // Duplicate frames to create a truly seamless, infinite cinema loop
    const infiniteFilm = [...filmImages, ...filmImages];

    filmReelStrip.innerHTML = infiniteFilm.map((img, idx) => {
      const origIdx = idx % filmImages.length;
      return `
      <div class="film-frame" onclick="window.RomanticLightbox && window.RomanticLightbox.openDirect('${img.src}', '${img.caption.replace(/'/g, "\\'")}')" title="${img.caption}">
        <img src="${img.src}" alt="${img.caption}" loading="lazy">
        <span class="film-frame-number">#${String(origIdx + 1).padStart(2, '0')} • 35mm</span>
      </div>
    `;
    }).join('');

    const filmContainer = document.getElementById('film-reel-container');
    if (filmContainer) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isPaused = false;
      let resumeTimer = null;
      const autoSpeed = 0.75; // Cinematic, gentle auto-motion

      const triggerPause = () => {
        isPaused = true;
        if (resumeTimer) clearTimeout(resumeTimer);
      };

      const scheduleResume = (delay = 1200) => {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          if (!isDown) {
            isPaused = false;
          }
        }, delay);
      };

      filmContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        triggerPause();
        filmContainer.style.cursor = 'grabbing';
        startX = e.pageX - filmContainer.offsetLeft;
        scrollLeft = filmContainer.scrollLeft;
      });

      const stopDrag = () => {
        if (isDown) {
          isDown = false;
          filmContainer.style.cursor = 'grab';
          scheduleResume(1400);
        }
      };

      filmContainer.addEventListener('mouseleave', () => {
        stopDrag();
        scheduleResume(800);
      });
      filmContainer.addEventListener('mouseup', stopDrag);

      filmContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - filmContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        filmContainer.scrollLeft = scrollLeft - walk;
      });

      // Hover to pause so she can look closely at any frame
      filmContainer.addEventListener('mouseenter', triggerPause);

      // Mobile touch gestures
      filmContainer.addEventListener('touchstart', triggerPause, { passive: true });
      filmContainer.addEventListener('touchend', () => scheduleResume(1500), { passive: true });

      // Seamless Auto-Scrolling Animation Loop
      function autoScrollReel() {
        const modal = document.getElementById('lightbox-modal');
        const isLightboxActive = modal && modal.classList.contains('is-active');

        if (!isPaused && !isDown && !isLightboxActive) {
          filmContainer.scrollLeft += autoSpeed;
          const halfWidth = filmReelStrip.scrollWidth / 2;
          if (halfWidth > 0 && filmContainer.scrollLeft >= halfWidth) {
            filmContainer.scrollLeft -= halfWidth;
          } else if (filmContainer.scrollLeft <= 0 && halfWidth > 0) {
            filmContainer.scrollLeft += halfWidth;
          }
        }
        requestAnimationFrame(autoScrollReel);
      }
      requestAnimationFrame(autoScrollReel);
    }
  }

  // ============================================================
  // FEATURE 3: LUXURY GOLD "SCRATCH TO REVEAL" LOVE NOTE
  // ============================================================
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchSecretTitle = document.getElementById('scratch-secret-title');
  const scratchSecretNote = document.getElementById('scratch-secret-note');
  const scratchSecretSign = document.getElementById('scratch-secret-sign');
  const scratchAnotherBtn = document.getElementById('scratch-another-btn');
  const scratchNotes = config.scratchNotes || [];
  let currentScratchIdx = 0;
  let isScratching = false;
  let isScratchCleared = false;

  function initScratchCard(idx) {
    if (!scratchCanvas) return;
    const note = scratchNotes[idx % scratchNotes.length] || {
      title: "Secret Vow #01",
      note: "“I will never stop looking at you like you are my greatest miracle.”",
      sign: "— Forever Nisar"
    };

    if (scratchSecretTitle) scratchSecretTitle.textContent = note.title;
    if (scratchSecretNote) scratchSecretNote.textContent = note.note;
    if (scratchSecretSign) scratchSecretSign.textContent = note.sign;

    isScratchCleared = false;
    scratchCanvas.classList.remove('is-cleared');
    const ctx = scratchCanvas.getContext('2d');
    const w = scratchCanvas.width;
    const h = scratchCanvas.height;

    // Rich metallic gold foil coating
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#fcedb8');
    grad.addColorStop(0.3, '#dfb76c');
    grad.addColorStop(0.6, '#b88d44');
    grad.addColorStop(0.85, '#dfb76c');
    grad.addColorStop(1, '#fcedb8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Add subtle gold foil grain/texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 300; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    // Elegant gold border text
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#3a2307';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.fillText('✨ RUB TO REVEAL SECRET VOW ✨', w / 2, h / 2);
  }

  function getCanvasCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function scratchAt(x, y) {
    if (!scratchCanvas || isScratchCleared) return;
    const ctx = scratchCanvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch progress occasionally
    if (Math.random() > 0.6) {
      checkScratchCompletion();
    }
  }

  function checkScratchCompletion() {
    if (!scratchCanvas || isScratchCleared) return;
    const ctx = scratchCanvas.getContext('2d');
    const w = scratchCanvas.width;
    const h = scratchCanvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentPixels = 0;
    const step = 32; // sampling step
    const totalSampled = (w * h) / step;

    for (let i = 3; i < data.length; i += step * 4) {
      if (data[i] === 0) transparentPixels++;
    }

    if (transparentPixels / totalSampled > 0.4) {
      isScratchCleared = true;
      scratchCanvas.classList.add('is-cleared');
      playGentleBell();
      if ('vibrate' in navigator) navigator.vibrate([40, 60, 40]);
      /* emoji popup disabled */
    }
  }

  if (scratchCanvas) {
    initScratchCard(currentScratchIdx);

    const startScratch = (e) => {
      isScratching = true;
      const coords = getCanvasCoords(e, scratchCanvas);
      scratchAt(coords.x, coords.y);
    };

    const moveScratch = (e) => {
      if (!isScratching) return;
      e.preventDefault();
      const coords = getCanvasCoords(e, scratchCanvas);
      scratchAt(coords.x, coords.y);
    };

    const stopScratch = () => {
      isScratching = false;
    };

    scratchCanvas.addEventListener('mousedown', startScratch);
    window.addEventListener('mousemove', moveScratch);
    window.addEventListener('mouseup', stopScratch);

    scratchCanvas.addEventListener('touchstart', startScratch, { passive: false });
    window.addEventListener('touchmove', moveScratch, { passive: false });
    window.addEventListener('touchend', stopScratch);

    if (scratchAnotherBtn) {
      scratchAnotherBtn.addEventListener('click', () => {
        currentScratchIdx++;
        initScratchCard(currentScratchIdx);
        if ('vibrate' in navigator) navigator.vibrate(25);
      });
    }
  }

  // ============================================================
  // FEATURE 4: "OUR SACRED LOVE LOCK" (PONT DES ARTS)
  // ============================================================
  const loveLockBox = document.getElementById('love-lock-box');
  const loveLockBtn = document.getElementById('love-lock-btn');
  const loveLockBtnText = document.getElementById('love-lock-btn-text');
  const lockTimestamp = document.getElementById('lock-timestamp');

  const savedLockTimestamp = localStorage.getItem('lahari_love_locked_timestamp');

  function applyLockState(ts) {
    if (loveLockBox) {
      loveLockBox.classList.remove('is-unlocked');
      loveLockBox.classList.add('is-locked');
    }
    if (loveLockBtn) {
      loveLockBtn.style.opacity = '0.8';
      loveLockBtn.style.pointerEvents = 'none';
      if (loveLockBtnText) loveLockBtnText.textContent = "LOCKED IN ETERNITY 🔒❤️";
    }
    if (lockTimestamp) {
      lockTimestamp.textContent = `Sealed forever on ${ts} • Key cast into the river of time ✨`;
    }
  }

  if (savedLockTimestamp) {
    applyLockState(savedLockTimestamp);
  }

  function lockOurLove() {
    if (loveLockBox && loveLockBox.classList.contains('is-locked')) return;
    playMetallicLockClick();
    if ('vibrate' in navigator) navigator.vibrate([60, 80, 120]);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    localStorage.setItem('lahari_love_locked_timestamp', formattedDate);
    applyLockState(formattedDate);

    if (loveLockBox) {
      const rect = loveLockBox.getBoundingClientRect();
      /* emoji popup disabled */
    }
  }

  if (loveLockBtn) loveLockBtn.addEventListener('click', lockOurLove);
  if (loveLockBox) loveLockBox.addEventListener('click', lockOurLove);

  // ============================================================
  // EMOJI POPUPS PERMANENTLY DISABLED
  // ============================================================
  window.spawnHeartBloomAt = function() {
    // Disabled permanently across entire website
    return;
  };


  // ============================================================
  // FEATURE 1: "WATCH NISAR WRITE THIS" (QUILL CALLIGRAPHY)
  // ============================================================
  const quillWriteBtn = document.getElementById('quill-write-btn');
  const quillBtnText = document.getElementById('quill-btn-text');
  const quillLiveBanner = document.getElementById('quill-live-banner');
  const quillSkipBtn = document.getElementById('quill-skip-btn');
  const letterBodyContent = document.getElementById('letter-body-content');
  const letterParchment = document.getElementById('main-letter-parchment');

  const letterParagraphs = [
    "I wanted to create something that would stand still in time—a private little sanctuary where words don't rush, where memories are treasured, and where you are reminded of how deeply and sincerely you are loved.",
    "From the moment you came into my life, you brought a gentle clarity that I cherish more than words could ever convey. You have this extraordinary way of making the world feel softer, safer, and infinitely more meaningful. Whether in moments of shared laughter or quiet contemplation, knowing you are with me makes every day an absolute privilege.",
    "Thank you for being who you are—for your warmth, your compassion, your patient heart, and the effortless beauty you bring into my existence. I love you for all that you are, all that you have been, and all that you will ever be.",
    "No matter where life takes us, this little corner of our world will always belong to you."
  ];

  let isQuillWriting = false;
  let quillTimeoutId = null;

  function finishQuillWriting() {
    if (quillTimeoutId) clearTimeout(quillTimeoutId);
    isQuillWriting = false;
    if (letterBodyContent) {
      letterBodyContent.innerHTML = letterParagraphs.map(p => `<p>${p}</p>`).join('\n');
    }
    if (quillLiveBanner) quillLiveBanner.style.display = 'none';
    if (quillBtnText) quillBtnText.textContent = "Replay Writing ✒️";
    if (quillWriteBtn) quillWriteBtn.classList.remove('is-active');

    // Glow the wax seal with celebration
    const waxSeal = letterParchment ? letterParchment.querySelector('.letter-wax-seal') : null;
    if (waxSeal) {
      waxSeal.style.boxShadow = '0 0 35px rgba(223, 183, 108, 0.95), 0 0 60px rgba(184, 43, 70, 0.85)';
      playWaxStampSound();
      const rect = waxSeal.getBoundingClientRect();
      /* emoji popup disabled */
      setTimeout(() => {
        if (waxSeal) waxSeal.style.boxShadow = '';
      }, 3500);
    }
  }

  function startQuillWriting() {
    if (!letterBodyContent) return;
    isQuillWriting = true;
    if (quillTimeoutId) clearTimeout(quillTimeoutId);

    // Scroll gently to letter
    if (letterParchment) {
      letterParchment.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }


    if (quillWriteBtn) quillWriteBtn.classList.add('is-active');
    if (quillBtnText) quillBtnText.textContent = "Writing Live... ✒️";
    if (quillLiveBanner) quillLiveBanner.style.display = 'flex';

    letterBodyContent.innerHTML = '';

    let pIndex = 0;
    let charIndex = 0;
    let currentP = document.createElement('p');
    letterBodyContent.appendChild(currentP);

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'quill-cursor';
    cursorSpan.textContent = ' ✒️';
    currentP.appendChild(cursorSpan);

    function typeNextChar() {
      if (!isQuillWriting) return;

      if (pIndex >= letterParagraphs.length) {
        finishQuillWriting();
        return;
      }

      const text = letterParagraphs[pIndex];
      if (charIndex < text.length) {
        const char = text.charAt(charIndex);
        currentP.insertBefore(document.createTextNode(char), cursorSpan);
        charIndex++;

        // Sound effect on every few strokes or punctuation
        if (charIndex % 5 === 0 || char === ',' || char === '.' || char === '—') {
          playQuillScratchSound();
        }

        let delay = 22;
        if (char === '.' || char === '!') delay = 220;
        else if (char === ',' || char === '—') delay = 100;
        else if (char === ' ') delay = 28;

        quillTimeoutId = setTimeout(typeNextChar, delay);
      } else {
        // Finished current paragraph
        pIndex++;
        charIndex = 0;
        if (pIndex < letterParagraphs.length) {
          cursorSpan.remove();
          currentP = document.createElement('p');
          letterBodyContent.appendChild(currentP);
          currentP.appendChild(cursorSpan);
          quillTimeoutId = setTimeout(typeNextChar, 320);
        } else {
          finishQuillWriting();
        }
      }
    }

    quillTimeoutId = setTimeout(typeNextChar, 350);
  }

  if (quillWriteBtn) {
    quillWriteBtn.addEventListener('click', () => {
      if (isQuillWriting) {
        finishQuillWriting();
      } else {
        startQuillWriting();
      }
    });
  }

  if (quillSkipBtn) {
    quillSkipBtn.addEventListener('click', finishQuillWriting);
  }

  // ============================================================
  // FEATURE 7 & FEATURE 5: "THE NIGHT SKY ON 29 SEPTEMBER" & "CONNECT OUR CONSTELLATION"
  // ============================================================
  const starmapCanvas = document.getElementById('starmap-canvas');
  const connectConstellationBtn = document.getElementById('connect-constellation-btn');
  const constellationBtnText = document.getElementById('constellation-btn-text');
  const constellationStatusHint = document.getElementById('constellation-status-hint');

  if (starmapCanvas) {
    const ctx = starmapCanvas.getContext('2d');
    const w = 600;
    const h = 600;
    starmapCanvas.width = w;
    starmapCanvas.height = h;

    const cx = w / 2;
    const cy = h / 2;
    const domeRadius = 294;

    // Background Stars (inside dome)
    const bgStars = [];
    for (let i = 0; i < 140; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * (domeRadius - 15);
      bgStars.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.012,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Constellation: Virgo mapped gracefully within celestial dome
    const virgoStars = [
      { x: 275, y: 245, name: 'Porrima' },
      { x: 345, y: 320, name: 'Star Lahari (Spica)' }, // Jewel
      { x: 395, y: 235, name: 'Vindemiatrix' },
      { x: 235, y: 340, name: 'Zaniah' },
      { x: 175, y: 395, name: 'Zavijava' },
      { x: 420, y: 390, name: 'Heze' }
    ];

    // Companion Star: Arcturus (Star Nisar)
    const starNisar = { x: 200, y: 220, name: 'Star Nisar (Arcturus)' };

    let constellationConnected = false;
    let connectProgress = 0;
    let stardustParticles = [];
    let interactiveMouse = { x: -100, y: -100, active: false };

    function triggerConstellationConnect() {
      constellationConnected = true;
      if (typeof playStarChime === 'function') playStarChime();
      if ('vibrate' in navigator) navigator.vibrate([50, 90, 140]);

      if (constellationBtnText) {
        constellationBtnText.textContent = "Constellation United In Love ✨";
      }
      if (constellationStatusHint) {
        constellationStatusHint.textContent = "“Two stars locked in an eternal celestial embrace across the universe.”";
        constellationStatusHint.style.color = "#dfb76c";
      }

      // Burst radiant stardust
      for (let i = 0; i < 45; i++) {
        const t = Math.random();
        stardustParticles.push({
          x: starNisar.x + (virgoStars[1].x - starNisar.x) * t + (Math.random() * 30 - 15),
          y: starNisar.y + (virgoStars[1].y - starNisar.y) * t + (Math.random() * 30 - 15),
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8 - 0.5,
          alpha: 1,
          size: Math.random() * 2.5 + 0.8
        });
      }

      /* emoji popup disabled */
    }

    if (connectConstellationBtn) {
      connectConstellationBtn.addEventListener('click', triggerConstellationConnect);
    }

    starmapCanvas.addEventListener('click', (e) => {
      const rect = starmapCanvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * w;
      const clickY = ((e.clientY - rect.top) / rect.height) * h;

      const dNisar = Math.hypot(clickX - starNisar.x, clickY - starNisar.y);
      const dLahari = Math.hypot(clickX - virgoStars[1].x, clickY - virgoStars[1].y);

      if (dNisar < 55 || dLahari < 55 || !constellationConnected) {
        triggerConstellationConnect();
      }
    });

    starmapCanvas.addEventListener('mousemove', (e) => {
      const rect = starmapCanvas.getBoundingClientRect();
      interactiveMouse.x = ((e.clientX - rect.left) / rect.width) * w;
      interactiveMouse.y = ((e.clientY - rect.top) / rect.height) * h;
      interactiveMouse.active = true;
    });

    starmapCanvas.addEventListener('mouseleave', () => {
      interactiveMouse.active = false;
    });

    function drawDiamondSpikes(x, y, radius, color, spikeLen) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      // Horizontal flare
      ctx.moveTo(x - spikeLen, y);
      ctx.lineTo(x + spikeLen, y);
      // Vertical flare
      ctx.moveTo(x, y - spikeLen);
      ctx.lineTo(x, y + spikeLen);
      ctx.stroke();

      // Subtle diagonal faint flare
      ctx.strokeStyle = color.replace(/[\d\.]+\)$/, '0.35)');
      ctx.lineWidth = 0.8;
      const diag = spikeLen * 0.45;
      ctx.beginPath();
      ctx.moveTo(x - diag, y - diag);
      ctx.lineTo(x + diag, y + diag);
      ctx.moveTo(x + diag, y - diag);
      ctx.lineTo(x - diag, y + diag);
      ctx.stroke();
      ctx.restore();
    }

    let frameCount = 0;
    function drawStarmap() {
      frameCount++;
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      // Circular Planetarium Mask
      ctx.beginPath();
      ctx.arc(cx, cy, domeRadius, 0, Math.PI * 2);
      ctx.clip();

      // Deep Midnight Cosmos Gradient
      const skyGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, domeRadius);
      skyGrad.addColorStop(0, '#1a0624');
      skyGrad.addColorStop(0.5, '#0d0216');
      skyGrad.addColorStop(1, '#020005');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Ethereal Nebula Clouds
      const nebula1 = ctx.createRadialGradient(320, 290, 10, 320, 290, 190);
      nebula1.addColorStop(0, 'rgba(160, 45, 110, 0.22)');
      nebula1.addColorStop(0.55, 'rgba(65, 20, 95, 0.14)');
      nebula1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, w, h);

      const nebula2 = ctx.createRadialGradient(210, 240, 15, 210, 240, 170);
      nebula2.addColorStop(0, 'rgba(215, 160, 70, 0.16)');
      nebula2.addColorStop(0.6, 'rgba(120, 70, 30, 0.08)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);

      // Astrolabe Grid Rings (Delicate celestial circles)
      ctx.strokeStyle = 'rgba(223, 183, 108, 0.12)';
      ctx.lineWidth = 1;
      [90, 185, 275].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Background Twinkling Stars
      bgStars.forEach(s => {
        s.phase += s.pulseSpeed;
        const curAlpha = s.alpha + Math.sin(s.phase) * 0.28;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, curAlpha)})`;
        ctx.fill();
      });

      // Virgo Constellation Boundary Lines
      ctx.strokeStyle = 'rgba(223, 183, 108, 0.38)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(virgoStars[4].x, virgoStars[4].y); // Zavijava
      ctx.lineTo(virgoStars[3].x, virgoStars[3].y); // Zaniah
      ctx.lineTo(virgoStars[0].x, virgoStars[0].y); // Porrima
      ctx.lineTo(virgoStars[1].x, virgoStars[1].y); // Spica
      ctx.lineTo(virgoStars[2].x, virgoStars[2].y); // Vindemiatrix
      ctx.moveTo(virgoStars[1].x, virgoStars[1].y);
      ctx.lineTo(virgoStars[5].x, virgoStars[5].y); // Heze
      ctx.stroke();
      ctx.setLineDash([]);

      // Connection between Star Nisar & Star Lahari
      if (constellationConnected) {
        if (connectProgress < 1) connectProgress += 0.025;

        const x1 = starNisar.x;
        const y1 = starNisar.y;
        const x2 = virgoStars[1].x;
        const y2 = virgoStars[1].y;
        const curX = x1 + (x2 - x1) * Math.min(1, connectProgress);
        const curY = y1 + (y2 - y1) * Math.min(1, connectProgress);

        // Radiant golden starlight connecting beam
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = '#ffeaa7';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#dfb76c';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();

        // Pulsating celestial aura around both stars
        const pulseRing = Math.sin(frameCount * 0.05) * 6;
        ctx.save();
        ctx.strokeStyle = 'rgba(223, 183, 108, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(x1, y1, 22 + pulseRing, 0, Math.PI * 2);
        ctx.arc(x2, y2, 26 + pulseRing, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Golden celestial inscription between stars
        if (connectProgress >= 0.7) {
          const alpha = Math.min(1, (connectProgress - 0.7) / 0.3);
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - 18;

          ctx.save();
          ctx.font = 'bold 13px "Cormorant Garamond", Georgia, serif';
          ctx.fillStyle = `rgba(252, 237, 184, ${alpha})`;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 8;
          ctx.fillText('Nisar  ♡  Lahari', midX, midY);
          ctx.font = 'italic 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = `rgba(223, 183, 108, ${alpha * 0.9})`;
          ctx.fillText('Written in the Stars • 29.09.2007', midX, midY + 14);
          ctx.restore();
        }

        // Stardust Particles along connection
        for (let i = stardustParticles.length - 1; i >= 0; i--) {
          const p = stardustParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.012;
          if (p.alpha <= 0) {
            stardustParticles.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252, 237, 184, ${p.alpha})`;
          ctx.shadowColor = '#dfb76c';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Companion Star Nisar (Arcturus)
      const nisarPulse = Math.sin(frameCount * 0.04) * 2;
      ctx.beginPath();
      ctx.arc(starNisar.x, starNisar.y, constellationConnected ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffeaa7';
      ctx.shadowColor = '#f5cd79';
      ctx.shadowBlur = constellationConnected ? 24 : 14;
      ctx.fill();
      ctx.shadowBlur = 0;
      drawDiamondSpikes(starNisar.x, starNisar.y, 5, 'rgba(255, 234, 167, 0.85)', 18 + nisarPulse);

      ctx.font = 'bold 12px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 6;
      ctx.fillText(starNisar.name, starNisar.x - 35, starNisar.y - 12);
      ctx.shadowBlur = 0;

      // Draw Virgo Stars
      virgoStars.forEach((star, idx) => {
        const isSpica = idx === 1; // Star Lahari (Spica)
        ctx.beginPath();
        const starR = isSpica ? (constellationConnected ? 7.5 : 5.5) : 3.2;
        ctx.arc(star.x, star.y, starR, 0, Math.PI * 2);
        ctx.fillStyle = isSpica ? '#ffffff' : '#f5e6ca';
        ctx.shadowColor = isSpica ? '#dfb76c' : 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = isSpica ? 28 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isSpica) {
          const spicaPulse = Math.sin(frameCount * 0.05 + 1) * 3;
          drawDiamondSpikes(star.x, star.y, starR, 'rgba(255, 245, 205, 0.95)', 24 + spicaPulse);
          ctx.font = 'bold 13px "Cormorant Garamond", Georgia, serif';
          ctx.fillStyle = '#ffe89e';
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 8;
          ctx.fillText(star.name, star.x + 10, star.y + 4);
          ctx.shadowBlur = 0;
        } else {
          ctx.font = '10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.fillText(star.name, star.x + 8, star.y + 3);
        }
      });

      // Interactive Mouse Stardust trail
      if (interactiveMouse.active) {
        ctx.beginPath();
        ctx.arc(interactiveMouse.x, interactiveMouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 235, 170, 0.8)';
        ctx.shadowColor = '#dfb76c';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      requestAnimationFrame(drawStarmap);
    }

    drawStarmap();
  }

  // ============================================================
  // FEATURE 8: "TWO HEARTS, ONE RHYTHM" (HEARTBEAT SYNC & ECG MONITOR)
  // ============================================================
  const heartbeatBox = document.getElementById('heartbeat-box');
  const heartbeatToggleBtn = document.getElementById('heartbeat-toggle-btn');
  const heartbeatBtnText = document.getElementById('heartbeat-btn-text');
  const heartbeatsCountEl = document.getElementById('heartbeats-today-count');
  const livePulseBadge = document.getElementById('live-pulse-badge');
  const ecgBpmReadout = document.getElementById('ecg-bpm-readout');
  let heartbeatInterval = null;
  let isHeartbeatActive = false;

  function updateHeartbeatsCount() {
    if (!heartbeatsCountEl) return;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const secsToday = Math.floor((now - startOfDay) / 1000);
    // 72 beats per minute = 1.2 beats per sec
    const beats = Math.floor(secsToday * 1.2);
    heartbeatsCountEl.textContent = beats.toLocaleString();
  }

  updateHeartbeatsCount();
  setInterval(updateHeartbeatsCount, 2000);

  // REAL-TIME ECG CARDIOGRAM OSCILLOSCOPE MONITOR
  function initECGMonitor() {
    const canvas = document.getElementById('ecg-pulse-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth || 340;
    let height = canvas.offsetHeight || 80;
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      width = canvas.offsetWidth || 340;
      height = canvas.offsetHeight || 80;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    let scanX = 0;
    const speed = 2.4; // sweep speed in px/frame
    const sweepClearWidth = 28; // erasing head width
    const midY = height / 2;
    const cycleLength = 115; // wavelength matching ~72 BPM

    const buffer = new Float32Array(Math.ceil(width) + 30);
    for (let i = 0; i < buffer.length; i++) buffer[i] = midY;

    function getECGOffset(phase) {
      if (phase < 0.14) {
        return 0; // baseline
      } else if (phase < 0.24) {
        // P-wave
        const p = (phase - 0.14) / 0.10;
        return -Math.sin(p * Math.PI) * 4.5;
      } else if (phase < 0.32) {
        return 0; // PR segment
      } else if (phase < 0.35) {
        // Q-dip
        const q = (phase - 0.32) / 0.03;
        return Math.sin(q * Math.PI) * 3.5;
      } else if (phase < 0.42) {
        // R-peak
        const r = (phase - 0.35) / 0.07;
        const amp = isHeartbeatActive ? height * 0.38 : height * 0.30;
        return -Math.sin(r * Math.PI) * amp;
      } else if (phase < 0.48) {
        // S-dip
        const s = (phase - 0.42) / 0.06;
        return Math.sin(s * Math.PI) * 10;
      } else if (phase < 0.58) {
        return 0; // ST segment
      } else if (phase < 0.74) {
        // T-wave
        const t = (phase - 0.58) / 0.16;
        return -Math.sin(t * Math.PI) * 8.5;
      } else {
        return 0; // TP baseline
      }
    }

    let lastTime = performance.now();

    function render(currentTime) {
      requestAnimationFrame(render);
      if (!ctx || width <= 0) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const step = speed * (dt * 60);
      const prevX = scanX;
      scanX = (scanX + step) % width;

      const startI = Math.floor(prevX);
      const endI = Math.floor(scanX);

      if (endI >= startI) {
        for (let i = startI; i <= endI; i++) {
          const phase = ((i % cycleLength) / cycleLength);
          buffer[i] = midY + getECGOffset(phase);
        }
      } else {
        for (let i = startI; i < width; i++) {
          const phase = ((i % cycleLength) / cycleLength);
          buffer[i] = midY + getECGOffset(phase);
        }
        for (let i = 0; i <= endI; i++) {
          const phase = ((i % cycleLength) / cycleLength);
          buffer[i] = midY + getECGOffset(phase);
        }
      }

      ctx.save();
      ctx.fillStyle = '#0b0207';
      ctx.fillRect(0, 0, width, height);

      // Faint medical ECG grid
      ctx.strokeStyle = 'rgba(223, 183, 108, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // ECG wave line
      ctx.shadowBlur = isHeartbeatActive ? 14 : 6;
      ctx.shadowColor = isHeartbeatActive ? '#ff3366' : '#dfb76c';
      ctx.strokeStyle = isHeartbeatActive ? '#ff5277' : '#dfb76c';
      ctx.lineWidth = isHeartbeatActive ? 2.2 : 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      let drawing = false;

      for (let x = 0; x < width; x++) {
        const distFromScan = (x - scanX + width) % width;
        if (distFromScan < sweepClearWidth) {
          drawing = false;
          continue;
        }

        const y = buffer[x] || midY;
        if (!drawing) {
          ctx.moveTo(x, y);
          drawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Leading blip
      const currentY = buffer[Math.floor(scanX)] || midY;
      ctx.shadowBlur = isHeartbeatActive ? 18 : 10;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(scanX, currentY, isHeartbeatActive ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  initECGMonitor();

  function toggleHeartbeatSync() {
    isHeartbeatActive = !isHeartbeatActive;
    if (heartbeatBox) heartbeatBox.classList.toggle('is-beating', isHeartbeatActive);
    if (heartbeatBtnText) {
      heartbeatBtnText.textContent = isHeartbeatActive ? "Pause Heartbeat Sync 💓" : "Sync Heartbeat Pulse 💓";
    }
    if (livePulseBadge) {
      if (isHeartbeatActive) {
        livePulseBadge.style.borderColor = 'rgba(255, 82, 119, 0.8)';
        livePulseBadge.style.boxShadow = '0 0 12px rgba(255, 82, 119, 0.4)';
      } else {
        livePulseBadge.style.borderColor = 'rgba(255, 82, 119, 0.3)';
        livePulseBadge.style.boxShadow = 'none';
      }
    }

    if (isHeartbeatActive) {
      playHeartbeatThump();
      if ('vibrate' in navigator) navigator.vibrate([60, 40, 90]);
      heartbeatInterval = setInterval(() => {
        playHeartbeatThump();
        if ('vibrate' in navigator) navigator.vibrate([60, 40, 90]);
      }, 830);
    } else {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    }
  }

  if (heartbeatToggleBtn) heartbeatToggleBtn.addEventListener('click', toggleHeartbeatSync);
  if (heartbeatBox) heartbeatBox.addEventListener('click', toggleHeartbeatSync);

  // ============================================================
  // FEATURE 9: "DOWNLOAD LETTER AS KEEPSAKE"
  // ============================================================
  const letterDownloadBtn = document.getElementById('letter-download-btn');
  if (letterDownloadBtn) {
    letterDownloadBtn.addEventListener('click', () => {
      playGentleBell();
      window.print();
    });
  }

  // ============================================================
  // FEATURE 11: "RETRO VINYL RECORD PLAYER"
  // ============================================================
  const turntableDeck = document.getElementById('turntable-deck');
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylToggleBtn = document.getElementById('vinyl-toggle-btn');
  const vinylNextBtn = document.getElementById('vinyl-next-btn');
  const vinylTrackTitle = document.getElementById('vinyl-track-title');

  function updateVinylUI(isPlaying, trackIdx) {
    const idx = trackIdx !== undefined ? trackIdx : 0;
    if (vinylDisc) vinylDisc.classList.toggle('is-spinning', isPlaying);
    if (turntableDeck) turntableDeck.classList.toggle('is-playing', isPlaying);
    if (vinylTrackTitle) {
      const titles = [
        "Playing: Track 1 • A Melody For Lahari",
        "Playing: Track 2 • Moonlight In Seoul",
        "Playing: Track 3 • Treat You Better"
      ];
      vinylTrackTitle.textContent = `“${titles[idx % titles.length]}”`;
    }
  }

  if (vinylToggleBtn && window.RomanticAudio) {
    vinylToggleBtn.addEventListener('click', () => {
      window.RomanticAudio.toggle();
    });
  }

  if (vinylNextBtn && window.RomanticAudio) {
    vinylNextBtn.addEventListener('click', () => {
      window.RomanticAudio.nextTrack();
    });
  }

  window.addEventListener('romanticAudioStateChange', (e) => {
    const { isPlaying, currentTrackIdx } = e.detail || {};
    updateVinylUI(isPlaying, currentTrackIdx);
  });

  // ============================================================
  // FEATURE 12: "OUR FUTURE DREAMS BUCKET LIST"
  // ============================================================
  const bucketListContainer = document.getElementById('bucket-list-container');
  const savedStamps = JSON.parse(localStorage.getItem('lahari_bucket_stamps') || '[]');

  if (bucketListContainer && config.futureBucketList) {
    bucketListContainer.innerHTML = config.futureBucketList.map(item => {
      const isStamped = savedStamps.includes(item.id);
      return `
        <div class="bucket-item ${isStamped ? 'is-stamped' : ''}" data-bucket-id="${item.id}" tabindex="0" role="button" aria-label="${item.title}">
          <div class="bucket-icon">${item.icon}</div>
          <div class="bucket-info">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            <span class="bucket-stamp-badge">💖 Sealed in my heart</span>
          </div>
        </div>
      `;
    }).join('');

    bucketListContainer.querySelectorAll('.bucket-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-bucket-id');
        item.classList.toggle('is-stamped');
        const stampedNow = item.classList.contains('is-stamped');
        let currentStamps = JSON.parse(localStorage.getItem('lahari_bucket_stamps') || '[]');

        if (stampedNow) {
          if (!currentStamps.includes(id)) currentStamps.push(id);
          playGentleBell();
          if ('vibrate' in navigator) navigator.vibrate(35);
          const rect = item.getBoundingClientRect();
          /* emoji popup disabled */
        } else {
          currentStamps = currentStamps.filter(s => s !== id);
        }
        localStorage.setItem('lahari_bucket_stamps', JSON.stringify(currentStamps));
      });
    });
  }

  // ============================================================
  // FEATURE 13: "MESSAGE IN A BOTTLE"
  // ============================================================
  const bottleVisualBox = document.getElementById('bottle-visual-box');
  const popBottleBtn = document.getElementById('pop-bottle-btn');
  const bottleModal = document.getElementById('bottle-modal');
  const bottleModalText = document.getElementById('bottle-modal-text');
  const bottleModalClose = document.getElementById('bottle-modal-close');
  const bottleAnotherBtn = document.getElementById('bottle-another-btn');
  const bottleLetters = config.messageInBottle || [];
  let lastBottleIdx = -1;

  function openBottleModal() {
    if (!bottleModal) return;
    playCorkPopSound();
    if ('vibrate' in navigator) navigator.vibrate([40, 60]);

    let randIdx = 0;
    if (bottleLetters.length > 1) {
      do {
        randIdx = Math.floor(Math.random() * bottleLetters.length);
      } while (randIdx === lastBottleIdx);
    }
    lastBottleIdx = randIdx;

    if (bottleModalText) bottleModalText.textContent = bottleLetters[randIdx];
    bottleModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  if (bottleVisualBox) bottleVisualBox.addEventListener('click', openBottleModal);
  if (popBottleBtn) popBottleBtn.addEventListener('click', openBottleModal);

  if (bottleAnotherBtn) {
    bottleAnotherBtn.addEventListener('click', () => {
      let randIdx;
      do {
        randIdx = Math.floor(Math.random() * bottleLetters.length);
      } while (randIdx === lastBottleIdx && bottleLetters.length > 1);
      lastBottleIdx = randIdx;
      if (bottleModalText) {
        bottleModalText.style.opacity = '0';
        setTimeout(() => {
          bottleModalText.textContent = bottleLetters[randIdx];
          bottleModalText.style.opacity = '1';
        }, 150);
      }
      playCorkPopSound();
    });
  }

  if (bottleModalClose && bottleModal) {
    bottleModalClose.addEventListener('click', () => {
      bottleModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    bottleModal.addEventListener('click', (e) => {
      if (e.target === bottleModal) {
        bottleModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // FEATURE 16: "VIRTUAL WAX SEAL REPLY"
  // ============================================================
  const waxReplyInput = document.getElementById('wax-reply-input');
  const waxStampBtn = document.getElementById('wax-stamp-btn');
  const waxSealSuccess = document.getElementById('wax-seal-success');

  const savedWaxReply = localStorage.getItem('lahari_wax_reply');
  if (savedWaxReply && waxReplyInput) {
    waxReplyInput.value = savedWaxReply;
  }

  if (waxStampBtn && waxReplyInput) {
    waxStampBtn.addEventListener('click', () => {
      const val = waxReplyInput.value.trim();
      if (!val) {
        waxReplyInput.focus();
        return;
      }
      playWaxStampSound();
      if ('vibrate' in navigator) navigator.vibrate([80, 100, 140]);
      localStorage.setItem('lahari_wax_reply', val);

      if (waxSealSuccess) {
        waxSealSuccess.style.display = 'block';
      }

      const rect = waxStampBtn.getBoundingClientRect();
      /* emoji popup disabled */
    });
  }

  // ============================================================
  // FEATURE 17: "OFFICIAL STAR NAMING CERTIFICATE"
  // ============================================================
  const openStarCertBtn = document.getElementById('open-star-cert-btn');
  const starCertModal = document.getElementById('star-cert-modal');
  const starCertClose = document.getElementById('star-cert-close');

  if (openStarCertBtn && starCertModal) {
    openStarCertBtn.addEventListener('click', () => {
      starCertModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      playGentleBell();
    });
  }

  if (starCertClose && starCertModal) {
    starCertClose.addEventListener('click', () => {
      starCertModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    starCertModal.addEventListener('click', (e) => {
      if (e.target === starCertModal) {
        starCertModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // FEATURE 18: "HOW WELL DO YOU KNOW MY HEART?" MINI-QUIZ
  // ============================================================
  const quizQuestions = config.coupleQuiz || [];
  const quizCard = document.getElementById('quiz-card');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  let currentQuizIdx = 0;

  function renderQuizQuestion(qIdx) {
    if (!quizQuestionText || !quizOptionsContainer) return;
    const qData = quizQuestions[qIdx];
    if (!qData) {
      // Quiz finished
      if (quizProgressText) quizProgressText.textContent = "Celebration • 100% Soulmates";
      quizQuestionText.textContent = "Nisar Loves Lahari To Infinity & Beyond! 💖✨";
      quizOptionsContainer.innerHTML = `
        <div style="background: rgba(223, 183, 108, 0.15); border: 1px solid var(--color-gold); border-radius: var(--radius-md); padding: 1.5rem; text-align: center;">
          <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-cream); line-height: 1.6;">
            There was never a doubt—your hearts beat to the exact same melody. Every answer points directly to one undeniable truth: Lahari is Nisar's absolute favorite person in the whole universe.
          </p>
          <button class="btn-primary" onclick="renderQuizQuestion(0)" style="margin-top: 1.2rem; padding: 0.6rem 1.8rem;">
            <span>Retake Quiz With Love 🌸</span>
          </button>
        </div>
      `;
      if (quizFeedbackBox) quizFeedbackBox.style.display = 'none';
      /* emoji popup disabled */
      return;
    }

    if (quizProgressText) quizProgressText.textContent = `Question ${qIdx + 1} of ${quizQuestions.length}`;
    quizQuestionText.textContent = qData.q;
    if (quizFeedbackBox) quizFeedbackBox.style.display = 'none';

    quizOptionsContainer.innerHTML = qData.options.map((opt, oIdx) => `
      <button class="quiz-opt-btn" data-opt-idx="${oIdx}">
        <span>${['A', 'B', 'C', 'D'][oIdx]}.</span> ${opt}
      </button>
    `).join('');

    quizOptionsContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const oIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
        handleQuizAnswer(qIdx, oIdx);
      });
    });
  }

  function handleQuizAnswer(qIdx, optIdx) {
    const qData = quizQuestions[qIdx];
    playGentleBell();
    if ('vibrate' in navigator) navigator.vibrate(35);

    if (quizFeedbackBox) {
      quizFeedbackBox.style.display = 'block';
      quizFeedbackBox.style.background = 'rgba(223, 183, 108, 0.15)';
      quizFeedbackBox.style.border = '1px solid var(--color-gold)';
      quizFeedbackBox.style.color = 'var(--color-gold-light)';
      quizFeedbackBox.innerHTML = `
        <p>${qData.comment || "Spot on! You know Nisar's heart better than anyone."}</p>
        <button class="btn-secondary" id="quiz-next-q-btn" style="margin-top: 0.8rem; padding: 0.45rem 1.2rem; font-size: 0.82rem;">
          <span>${qIdx + 1 < quizQuestions.length ? "Next Question ✨" : "See Final Score 🏆"}</span>
        </button>
      `;

      const nextBtn = document.getElementById('quiz-next-q-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          renderQuizQuestion(qIdx + 1);
        });
      }
    }
  }

  if (quizQuestions.length > 0) {
    renderQuizQuestion(0);
  }

  // ============================================================
  // FEATURE 19: "OUR SKY LANTERN FESTIVAL" (REALISTIC KONGMING LANTERNS)
  // ============================================================
  const lanternCanvas = document.getElementById('sky-lantern-canvas');
  const lanternForm = document.getElementById('lantern-form');
  const lanternWishInput = document.getElementById('lantern-wish-input');
  const skyLanterns = [];

  if (lanternCanvas) {
    const ctx = lanternCanvas.getContext('2d');
    let w = lanternCanvas.width = 600;
    let h = lanternCanvas.height = 340;

    // Background starlight particles
    const nightStars = [];
    for (let s = 0; s < 38; s++) {
      nightStars.push({
        x: Math.random() * w,
        y: Math.random() * (h * 0.75),
        radius: Math.random() * 1.1 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    const defaultWishes = [
      "Nisar × Lahari",
      "Forever & Always",
      "Tera Chehra ✨",
      "My Whole Heart",
      "Under The Same Sky",
      "Seven Sacred Vows",
      "Infinite Love",
      "Hamesha Tumhari",
      "My Soulmate 💖"
    ];

    // Seed authentic floating lanterns
    for (let i = 0; i < 9; i++) {
      const depth = 0.35 + (i / 9) * 0.65;
      skyLanterns.push({
        x: 30 + Math.random() * (w - 60),
        y: 20 + Math.random() * (h - 40),
        size: Math.round(18 + depth * 14),
        speed: 0.22 + depth * 0.35,
        swaySpeed: 0.02 + Math.random() * 0.015,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.05 + Math.random() * 0.04,
        driftSpeed: 0.012 + Math.random() * 0.01,
        driftPhase: Math.random() * Math.PI * 2,
        flickerPhase: Math.random() * Math.PI * 2,
        wish: defaultWishes[i % defaultWishes.length],
        alpha: 0.6 + depth * 0.4,
        depth: depth
      });
    }

    function drawRealisticSkyLantern(ctx, l, flicker, time) {
      ctx.save();
      const swayAngle = Math.sin(l.swayPhase) * l.swayAmp;
      ctx.translate(l.x, l.y);
      ctx.rotate(swayAngle);
      ctx.globalAlpha = Math.min(1, l.alpha);

      const sz = l.size;
      const lh = sz * 1.34;
      const halfW = sz * 0.52;
      const topHalf = sz * 0.42;
      const rimHalf = sz * 0.28;

      // 1. Atmospheric Ambient Heat Bloom
      const glowRad = sz * 1.5;
      const haloGrad = ctx.createRadialGradient(0, lh * 0.45, sz * 0.15, 0, lh * 0.45, glowRad);
      haloGrad.addColorStop(0, `rgba(255, 185, 65, ${0.42 * flicker})`);
      haloGrad.addColorStop(0.45, `rgba(255, 115, 30, ${0.16 * flicker})`);
      haloGrad.addColorStop(1, 'rgba(255, 60, 10, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, lh * 0.45, glowRad, 0, Math.PI * 2);
      ctx.fill();

      // 2. Traditional Rice-Paper Canopy (Curved Bell Kongming Silhouette)
      ctx.beginPath();
      ctx.moveTo(-rimHalf, lh);
      // Left waist curve expanding out to shoulder then dome
      ctx.bezierCurveTo(-halfW * 1.08, lh * 0.72, -halfW * 1.08, lh * 0.26, -topHalf, lh * 0.06);
      // Crown dome curve
      ctx.bezierCurveTo(-topHalf * 0.4, -lh * 0.08, topHalf * 0.4, -lh * 0.08, topHalf, lh * 0.06);
      // Right waist curving down to rim
      ctx.bezierCurveTo(halfW * 1.08, lh * 0.26, halfW * 1.08, lh * 0.72, rimHalf, lh);
      // Bottom collar opening curve
      ctx.bezierCurveTo(rimHalf * 0.5, lh + sz * 0.05, -rimHalf * 0.5, lh + sz * 0.05, -rimHalf, lh);
      ctx.closePath();

      // Radiant Oiled Paper Internal Light Gradient
      const paperGrad = ctx.createRadialGradient(0, lh * 0.76, sz * 0.06, 0, lh * 0.48, sz * 0.96);
      paperGrad.addColorStop(0, '#ffffff');
      paperGrad.addColorStop(0.15, '#ffea85');
      paperGrad.addColorStop(0.45, '#ff9a2e');
      paperGrad.addColorStop(0.8, '#de4314');
      paperGrad.addColorStop(1, '#691204');
      ctx.fillStyle = paperGrad;
      ctx.fill();

      // Paper vertical ribs / structural seams (Perspective Curvature)
      ctx.strokeStyle = `rgba(130, 30, 8, ${0.28 * l.alpha})`;
      ctx.lineWidth = Math.max(0.7, sz * 0.022);
      // Center vertical seam
      ctx.beginPath();
      ctx.moveTo(0, -lh * 0.02);
      ctx.quadraticCurveTo(sz * 0.015, lh * 0.5, 0, lh + sz * 0.03);
      ctx.stroke();
      // Left vertical seam
      ctx.beginPath();
      ctx.moveTo(-topHalf * 0.48, lh * 0.02);
      ctx.bezierCurveTo(-halfW * 0.58, lh * 0.35, -halfW * 0.52, lh * 0.7, -rimHalf * 0.5, lh + sz * 0.02);
      ctx.stroke();
      // Right vertical seam
      ctx.beginPath();
      ctx.moveTo(topHalf * 0.48, lh * 0.02);
      ctx.bezierCurveTo(halfW * 0.58, lh * 0.35, halfW * 0.52, lh * 0.7, rimHalf * 0.5, lh + sz * 0.02);
      ctx.stroke();

      // 3. Bamboo Collar Ring (Base opening)
      ctx.strokeStyle = '#361908';
      ctx.lineWidth = Math.max(1.1, sz * 0.042);
      ctx.beginPath();
      ctx.ellipse(0, lh + sz * 0.01, rimHalf, sz * 0.06, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Metal Cross-Brace Wire
      ctx.strokeStyle = 'rgba(70, 35, 15, 0.7)';
      ctx.lineWidth = Math.max(0.6, sz * 0.018);
      ctx.beginPath();
      ctx.moveTo(-rimHalf * 0.85, lh + sz * 0.01);
      ctx.lineTo(rimHalf * 0.85, lh + sz * 0.01);
      ctx.stroke();

      // 4. Living Candle / Fuel Block Flame at the base
      const flameH = sz * 0.18 * flicker;
      const flameW = sz * 0.09 * flicker;
      const flameY = lh - sz * 0.02;

      ctx.beginPath();
      ctx.moveTo(0, flameY - flameH);
      ctx.bezierCurveTo(flameW, flameY - flameH * 0.35, flameW, flameY, 0, flameY);
      ctx.bezierCurveTo(-flameW, flameY, -flameW, flameY - flameH * 0.35, 0, flameY - flameH);
      ctx.closePath();
      const flameGrad = ctx.createLinearGradient(0, flameY, 0, flameY - flameH);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.35, '#fff7a8');
      flameGrad.addColorStop(0.75, '#ff8014');
      flameGrad.addColorStop(1, 'rgba(255, 70, 0, 0.1)');
      ctx.fillStyle = flameGrad;
      ctx.shadowColor = '#ffe066';
      ctx.shadowBlur = 10 * flicker;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Handwritten Wish Calligraphy on the Paper
      if (l.wish && sz >= 20) {
        ctx.save();
        ctx.font = `italic 600 ${Math.max(8.5, sz * 0.22)}px "Playfair Display", "Caveat", "Georgia", serif`;
        ctx.fillStyle = 'rgba(45, 14, 4, 0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayWish = l.wish.length > 15 ? l.wish.slice(0, 14) + '…' : l.wish;
        ctx.fillText(displayWish, 0, lh * 0.44);
        ctx.restore();
      }

      ctx.restore();
    }

    let lanternTime = 0;

    function drawLanterns() {
      lanternTime += 0.02;
      ctx.clearRect(0, 0, w, h);

      // Deep Midnight Velvet Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#040008');
      skyGrad.addColorStop(0.65, '#0c0213');
      skyGrad.addColorStop(1, '#1b0622');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Twinkling Background Stars
      nightStars.forEach(st => {
        st.twinklePhase += st.twinkleSpeed;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(st.twinklePhase));
        ctx.fillStyle = `rgba(255, 245, 220, ${st.alpha * tw})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sort lanterns by depth
      skyLanterns.sort((a, b) => (a.depth || 0.5) - (b.depth || 0.5));

      skyLanterns.forEach(l => {
        l.swayPhase += l.swaySpeed;
        l.driftPhase += l.driftSpeed;
        l.flickerPhase += 0.18;

        l.y -= l.speed;
        l.x += Math.sin(l.driftPhase) * 0.4;

        // Reset lantern if drifted off top
        if (l.y < -l.size * 1.6) {
          l.y = h + l.size * 1.5;
          l.x = 25 + Math.random() * (w - 50);
        }

        const flicker = 0.88 + 0.12 * Math.sin(l.flickerPhase) + (Math.random() - 0.5) * 0.04;
        drawRealisticSkyLantern(ctx, l, flicker, lanternTime);
      });

      requestAnimationFrame(drawLanterns);
    }

    drawLanterns();

    if (lanternForm && lanternWishInput) {
      lanternForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wish = lanternWishInput.value.trim();
        if (!wish) return;

        // Launch a glorious foreground lantern!
        skyLanterns.push({
          x: w / 2 + (Math.random() - 0.5) * 60,
          y: h + 20,
          size: 34,
          speed: 0.58,
          swaySpeed: 0.022,
          swayPhase: 0,
          swayAmp: 0.065,
          driftSpeed: 0.015,
          driftPhase: Math.random() * Math.PI,
          flickerPhase: Math.random() * Math.PI,
          wish: wish,
          alpha: 1.0,
          depth: 1.2
        });

        playGentleBell();
        if ('vibrate' in navigator) navigator.vibrate([50, 70]);
        lanternWishInput.value = '';

        /* emoji popup disabled */
      });
    }
  }

  // ============================================================
  // FEATURE 20: "HOW ARE YOU FEELING RIGHT NOW?" (MOOD CARE)
  // ============================================================
  const moodChipsContainer = document.getElementById('mood-chips-container');
  const moodPrescriptionCard = document.getElementById('mood-prescription-card');
  const moodPrescTitle = document.getElementById('mood-presc-title');
  const moodPrescText = document.getElementById('mood-presc-text');
  const moodPrescHug = document.getElementById('mood-presc-hug');
  const moodData = config.moodCare || {};

  if (moodChipsContainer) {
    moodChipsContainer.querySelectorAll('.mood-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        moodChipsContainer.querySelectorAll('.mood-chip-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const moodKey = btn.getAttribute('data-mood');
        const care = moodData[moodKey];
        if (care && moodPrescriptionCard) {
          if (moodPrescTitle) moodPrescTitle.textContent = care.title;
          if (moodPrescText) moodPrescText.textContent = care.prescription;
          if (moodPrescHug) moodPrescHug.textContent = care.hugType;
          moodPrescriptionCard.style.display = 'block';

          playGentleBell();
          if ('vibrate' in navigator) navigator.vibrate(25);
        }
      });
    });
  }

  // Lightbox helper for direct image open & film reel support
  if (window.RomanticLightbox) {
    const defaultGalleryItems = (config.gallery || []).map(item => ({
      type: 'image',
      src: item.src,
      caption: item.caption
    }));

    const origOpen = window.RomanticLightbox.open;
    window.RomanticLightbox.open = function(idx) {
      if (!window.RomanticLightbox._isCustomGroup) {
        window.RomanticLightbox.registerItems(defaultGalleryItems);
      }
      window.RomanticLightbox._isCustomGroup = false;
      origOpen(idx);
    };

    window.RomanticLightbox.openDirect = function(src, caption) {
      const filmReelItems = config.filmReel || [];
      const filmIdx = filmReelItems.findIndex(f => f.src === src);
      if (filmIdx !== -1) {
        window.RomanticLightbox._isCustomGroup = true;
        window.RomanticLightbox.registerItems(filmReelItems.map((f, i) => ({
          type: 'image',
          src: f.src,
          caption: `${f.caption} • 35mm Candid #${String(i + 1).padStart(2, '0')}`
        })));
        origOpen(filmIdx);
        return;
      }
      const idx = config.gallery ? config.gallery.findIndex(g => g.src === src) : -1;
      if (idx !== -1) {
        window.RomanticLightbox._isCustomGroup = false;
        window.RomanticLightbox.registerItems(defaultGalleryItems);
        origOpen(idx);
      } else {
        window.RomanticLightbox._isCustomGroup = true;
        window.RomanticLightbox.registerItems([{ type: 'image', src, caption: caption || '' }]);
        origOpen(0);
      }
    };
  }

  // ============================================================
  // FEATURE 4: "THE LOVE COMPASS" (ALWAYS POINTS TO LAHARI'S HEART)
  // ============================================================
  const compassDialBox = document.getElementById('compass-dial-box');
  const compassNeedlePivot = document.getElementById('compass-needle-pivot');
  const compassHeadingText = document.getElementById('compass-heading-text');
  const compassWhisperBtn = document.getElementById('compass-whisper-btn');
  const compassQuoteCard = document.getElementById('compass-quote-card');

  let needleAngle = 0;
  let targetAngle = 0;
  let idleCompassOscillation = 0;
  let isCompassPointerActive = false;
  let compassPointerTimeout = null;

  function updateCompassAngle(clientX, clientY) {
    if (!compassDialBox || !compassNeedlePivot) return;
    const rect = compassDialBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    // Calculate angle: 0deg is pointing straight UP towards LAHARI (True North)
    const rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI) + 90;

    targetAngle = deg;
    isCompassPointerActive = true;
    clearTimeout(compassPointerTimeout);
    compassPointerTimeout = setTimeout(() => {
      isCompassPointerActive = false;
    }, 2800);

    if (compassHeadingText) {
      const normalized = Math.round((deg % 360 + 360) % 360);
      compassHeadingText.textContent = `${normalized}° • Pointing Towards Your Heart ❤️`;
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (compassDialBox) {
      const rect = compassDialBox.getBoundingClientRect();
      if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
        updateCompassAngle(e.clientX, e.clientY);
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (compassDialBox && e.touches && e.touches[0]) {
      const rect = compassDialBox.getBoundingClientRect();
      if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
        updateCompassAngle(e.touches[0].clientX, e.touches[0].clientY);
      }
    }
  }, { passive: true });

  function animateCompassNeedle() {
    if (!compassNeedlePivot) return;
    if (!isCompassPointerActive) {
      idleCompassOscillation += 0.035;
      // Soft breathing sway centered at True North (Lahari)
      targetAngle = Math.sin(idleCompassOscillation) * 8;
      if (compassHeadingText && Math.abs(needleAngle) < 12) {
        compassHeadingText.textContent = "0° • True North (Lahari’s Soul)";
      }
    }

    // Lerp needle rotation smoothly
    needleAngle += (targetAngle - needleAngle) * 0.12;
    if (compassNeedlePivot) {
      compassNeedlePivot.style.transform = `rotate(${needleAngle}deg)`;
    }
    requestAnimationFrame(animateCompassNeedle);
  }
  animateCompassNeedle();

  function triggerCompassQuote() {
    playCompassTick();
    if ('vibrate' in navigator) navigator.vibrate([40, 60, 40]);
    if (compassQuoteCard) {
      compassQuoteCard.style.display = 'block';
    }
    // Proud snap to True North with elastic vibration
    targetAngle = 0;
    needleAngle = 0;
    if (compassNeedlePivot) {
      compassNeedlePivot.style.transform = 'rotate(0deg) scale(1.1)';
      setTimeout(() => {
        if (compassNeedlePivot) compassNeedlePivot.style.transform = 'rotate(0deg) scale(1)';
      }, 350);
    }
    if (compassDialBox) {
      const rect = compassDialBox.getBoundingClientRect();
      /* emoji popup disabled */
    }
  }

  if (compassDialBox) {
    compassDialBox.addEventListener('click', triggerCompassQuote);
    compassDialBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerCompassQuote();
      }
    });
  }
  if (compassWhisperBtn) {
    compassWhisperBtn.addEventListener('click', triggerCompassQuote);
  }

  // ============================================================
  // FEATURE 6: "SECRET MIDNIGHT VAULT" (3:00 AM CONFIDENTIAL EASTER EGG)
  // ============================================================
  const midnightVaultModal = document.getElementById('midnight-vault-modal');
  const vaultCloseBtn = document.getElementById('vault-close-btn');
  const vaultWaxSealBtn = document.getElementById('vault-wax-seal-btn');
  const vaultSealBox = document.getElementById('vault-seal-box');
  const vaultLetterBox = document.getElementById('vault-letter-box');

  let monogramClicks = 0;
  let monogramClickTimer = null;

  function handleMonogramEasterEgg(e) {
    monogramClicks++;
    clearTimeout(monogramClickTimer);

    playCompassTick();
    if ('vibrate' in navigator) navigator.vibrate(25);

    if (monogramClicks >= 2) {
      monogramClicks = 0;
      openMidnightVault();
    } else {
      monogramClickTimer = setTimeout(() => {
        monogramClicks = 0;
      }, 600);
    }
  }

  function openMidnightVault() {
    if (!midnightVaultModal) return;
    playVaultUnlockSound();
    midnightVaultModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Reset seal & letter state
    if (vaultSealBox) {
      vaultSealBox.style.display = 'block';
      if (vaultWaxSealBtn) {
        vaultWaxSealBtn.style.transform = '';
        vaultWaxSealBtn.style.opacity = '1';
      }
    }
    if (vaultLetterBox) {
      vaultLetterBox.style.display = 'none';
    }

    const triggerEl = document.getElementById('secret-monogram-trigger');
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      /* emoji popup disabled */
    }
  }

  function closeMidnightVault() {
    if (!midnightVaultModal) return;
    midnightVaultModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Register on monogram triggers
  document.querySelectorAll('.secret-monogram-trigger, .world-symbol, .passcode-monogram').forEach(el => {
    el.addEventListener('click', handleMonogramEasterEgg);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleMonogramEasterEgg(e);
    });
  });

  if (vaultCloseBtn) {
    vaultCloseBtn.addEventListener('click', closeMidnightVault);
  }
  if (midnightVaultModal) {
    midnightVaultModal.addEventListener('click', (e) => {
      if (e.target === midnightVaultModal) closeMidnightVault();
    });
  }

  if (vaultWaxSealBtn) {
    vaultWaxSealBtn.addEventListener('click', () => {
      playWaxStampSound();
      if ('vibrate' in navigator) navigator.vibrate([70, 110, 200]);

      vaultWaxSealBtn.style.transform = 'scale(1.25) rotate(15deg)';
      vaultWaxSealBtn.style.opacity = '0';
      vaultWaxSealBtn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

      setTimeout(() => {
        if (vaultSealBox) vaultSealBox.style.display = 'none';
        if (vaultLetterBox) {
          vaultLetterBox.style.display = 'block';
          playGentleBell();
          const rect = vaultLetterBox.getBoundingClientRect();
          /* emoji popup disabled */
        }
      }, 420);
    });
  }

  // ============================================================
  // SOUND EFFECTS FOR WIDGETS (2, 4, 7, 11, 12, 18, 22)
  // ============================================================
  function playNeonSwitchSound(isTurningOn) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
      clickGain.gain.setValueAtTime(0.35, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start();
      clickOsc.stop(ctx.currentTime + 0.05);

      if (isTurningOn) {
        const humOsc = ctx.createOscillator();
        const humGain = ctx.createGain();
        humOsc.type = 'sawtooth';
        humOsc.frequency.setValueAtTime(120, ctx.currentTime + 0.03);
        humGain.gain.setValueAtTime(0.12, ctx.currentTime + 0.03);
        humGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        humOsc.connect(humGain);
        humGain.connect(ctx.destination);
        humOsc.start(ctx.currentTime + 0.03);
        humOsc.stop(ctx.currentTime + 0.36);
      }
    } catch(e) {}
  }

  function playBarometerTick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch(e) {}
  }

  function playGlassCrackSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [2400, 3800, 5200].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.02);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.02 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.02);
        osc.stop(ctx.currentTime + i * 0.02 + 0.42);
      });
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(600, ctx.currentTime);
      snapOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
      snapGain.gain.setValueAtTime(0.25, ctx.currentTime);
      snapGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start();
      snapOsc.stop(ctx.currentTime + 0.09);
    } catch(e) {}
  }

  function playLaserScanHum() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return null;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(480, ctx.currentTime + 1.8);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.7);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.9);
      return osc;
    } catch(e) { return null; }
  }

  function playBiometricMatchChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + idx * 0.12;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.95);
      });
    } catch(e) {}
  }

  function playWaterPourSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const bufferSize = Math.floor(ctx.sampleRate * 0.7);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin(i / 100);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.7);
      filter.Q.value = 4.0;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.72);
    } catch(e) {}
  }

  function playBloomChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.85);
      });
    } catch(e) {}
  }

  function playBeaconChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [264, 528];
      notes.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.7);
      });
    } catch(e) {}
  }

  function playFireflyTwinkle() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const sparkle = [1046.5, 1318.5, 1567.98, 2093.0];
      sparkle.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.09;
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    } catch(e) {}
  }

  // ============================================================
  // WIDGET 18: THE PINK NEON SIGN ("Nisar ♡ Lahari")
  // ============================================================
  const neonSwitchWrap = document.getElementById('neon-switch-wrap');
  const neonChainHandle = document.getElementById('neon-chain-handle');
  const neonSignFrame = document.getElementById('neon-sign-frame');
  const neonStatusCaption = document.getElementById('neon-status-caption');

  // Must always start OFF on every page load
  let neonIsLit = false;
  let neonFlickering = false;

  function toggleNeonSign() {
    if (neonFlickering) return;
    neonFlickering = true;

    // Realistic pull chain spring animation
    if (neonSwitchWrap) {
      neonSwitchWrap.classList.add('is-pulled');
      setTimeout(() => {
        neonSwitchWrap.classList.remove('is-pulled');
      }, 160);
    }
    if (neonChainHandle) {
      neonChainHandle.style.transform = 'translateY(22px) scaleY(1.08)';
      neonChainHandle.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.3, 1)';
      setTimeout(() => {
        neonChainHandle.style.transform = 'translateY(0) scaleY(1)';
        neonChainHandle.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }, 140);
    }

    if ('vibrate' in navigator) navigator.vibrate([25, 35, 25]);

    if (neonIsLit) {
      // Turn OFF
      neonIsLit = false;
      playNeonSwitchSound(false);
      if (neonSignFrame) {
        neonSignFrame.classList.remove('neon-is-lit');
        neonSignFrame.classList.add('neon-is-off');
      }
      if (neonStatusCaption) {
        neonStatusCaption.textContent = '🌙 Dimmed • Pull the golden chain to ignite our radiant glow';
        neonStatusCaption.style.opacity = '0.6';
      }
      neonFlickering = false;
    } else {
      // Turn ON with multi-stage cold-cathode gas ignition & flicker
      playNeonSwitchSound(true);
      if (neonStatusCaption) {
        neonStatusCaption.textContent = '⚡ Charging neon gas filaments...';
        neonStatusCaption.style.opacity = '0.85';
      }

      // Authentic vintage flicker pattern (timing in ms):
      const flickerSteps = [
        { t: 60, lit: true },
        { t: 120, lit: false },
        { t: 190, lit: true },
        { t: 250, lit: false },
        { t: 330, lit: true },
        { t: 390, lit: false },
        { t: 470, lit: true, final: true }
      ];

      flickerSteps.forEach(step => {
        setTimeout(() => {
          if (!neonSignFrame) return;
          if (step.lit) {
            neonSignFrame.classList.add('neon-is-lit');
            neonSignFrame.classList.remove('neon-is-off');
          } else {
            neonSignFrame.classList.remove('neon-is-lit');
            neonSignFrame.classList.add('neon-is-off');
          }

          if (step.final) {
            neonIsLit = true;
            neonFlickering = false;
            if (neonStatusCaption) {
              neonStatusCaption.textContent = '✨ Radiant • Glowing with eternal affection';
              neonStatusCaption.style.opacity = '1';
            }
            const rect = neonSignFrame.getBoundingClientRect();
            /* emoji popup disabled */
          }
        }, step.t);
      });
    }
  }

  if (neonSwitchWrap) {
    neonSwitchWrap.addEventListener('click', toggleNeonSign);
    neonSwitchWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNeonSign();
      }
    });
  }

  // ============================================================
  // WIDGET 7: THE LOVE BAROMETER (BEYOND MEASURABLE LIMITS)
  // ============================================================
  const barometerNeedle = document.getElementById('barometer-needle-pivot');
  const barometerCrack = document.getElementById('barometer-glass-crack');
  const barometerReadingText = document.getElementById('barometer-reading-text');
  const measureLoveBtn = document.getElementById('measure-love-btn');
  const measureLoveBtnText = document.getElementById('measure-love-btn-text');

  let barometerMeasuring = false;

  function runLoveBarometer() {
    if (barometerMeasuring) return;
    barometerMeasuring = true;

    if (measureLoveBtn) measureLoveBtn.disabled = true;
    if (measureLoveBtnText) measureLoveBtnText.textContent = 'CALCULATING CAPACITY... 🔬';

    if (barometerCrack) barometerCrack.style.display = 'none';
    if (barometerNeedle) {
      barometerNeedle.style.transition = 'transform 0.3s ease';
      barometerNeedle.style.transform = 'rotate(-120deg)';
    }
    if (barometerReadingText) {
      barometerReadingText.style.color = 'var(--color-cream)';
      barometerReadingText.textContent = '0.00% • Standard Scale';
    }

    const steps = [
      { deg: -90, text: '12.5% • Gentle Affection', delay: 260 },
      { deg: -60, text: '25.0% • Constant Thoughts of Lahari', delay: 520 },
      { deg: -30, text: '37.5% • Beautiful Laughter We Shared', delay: 780 },
      { deg: 0, text: '50.0% • Halfway to the Cosmos', delay: 1040 },
      { deg: 30, text: '62.5% • Irreplaceable In My Life', delay: 1300 },
      { deg: 60, text: '75.0% • Complete Soul Devotion', delay: 1560 },
      { deg: 90, text: '87.5% • Every Breath Belongs To You', delay: 1820 },
      { deg: 120, text: '100.0% • MAXIMUM SCALE REACHED 🚨', delay: 2080 },
      { deg: 148, text: 'PRESSURE SPIKE: OVERLOAD!! 💥', delay: 2340 }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        if (barometerNeedle) {
          barometerNeedle.style.transition = 'transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)';
          barometerNeedle.style.transform = `rotate(${step.deg}deg)`;
        }
        if (barometerReadingText) {
          barometerReadingText.textContent = step.text;
        }
        playBarometerTick();
        if ('vibrate' in navigator) navigator.vibrate(20);
      }, step.delay);
    });

    setTimeout(() => {
      if (barometerNeedle) {
        barometerNeedle.style.transition = 'transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1.4)';
        barometerNeedle.style.transform = 'rotate(168deg)';
      }

      if (barometerCrack) barometerCrack.style.display = 'block';
      playGlassCrackSound();
      if ('vibrate' in navigator) navigator.vibrate([60, 80, 150]);

      if (barometerReadingText) {
        barometerReadingText.style.color = '#ff3366';
        barometerReadingText.innerHTML = '<span style="letter-spacing: 0.05em; font-weight: 700;">ERROR: CAPACITY OVERFLOW • ∞%</span><br><small style="color: var(--color-gold-light); font-size: 0.8rem; font-weight: normal;">Instrument shattered. Nisar’s love for Lahari is mathematically infinite.</small>';
      }

      /* emoji popup disabled */

      if (measureLoveBtnText) measureLoveBtnText.textContent = 'MEASURED: INFINITE LOVE ❤️';
      if (measureLoveBtn) {
        setTimeout(() => {
          measureLoveBtn.disabled = false;
          barometerMeasuring = false;
        }, 2000);
      }
    }, 2650);
  }

  if (measureLoveBtn) {
    measureLoveBtn.addEventListener('click', runLoveBarometer);
  }

  // ============================================================
  // WIDGET 11: DUAL FINGERPRINT HEART MATCHER
  // ============================================================
  const lahariThumbPad = document.getElementById('lahari-thumb-pad');
  const fingerprintLaserLine = document.getElementById('fingerprint-laser-line');
  const fingerprintInstruction = document.getElementById('fingerprint-instruction');
  const lahariPadTag = document.getElementById('lahari-pad-tag');
  const fingerprintMergedResult = document.getElementById('fingerprint-merged-result');
  const fingerprintDualGrid = document.getElementById('fingerprint-dual-grid');

  let scanTimer = null;
  let isFingerprintMatched = false;

  function startFingerprintScan(e) {
    if (isFingerprintMatched) return;
    if (e.cancelable) e.preventDefault();

    if (lahariThumbPad) lahariThumbPad.classList.add('is-scanning');
    if (fingerprintInstruction) fingerprintInstruction.textContent = 'SCANNING... ⚡';
    if (lahariPadTag) lahariPadTag.textContent = 'Lahari’s Sensor (Scanning...)';

    playLaserScanHum();
    if ('vibrate' in navigator) navigator.vibrate(50);

    scanTimer = setTimeout(() => {
      isFingerprintMatched = true;
      if (lahariThumbPad) lahariThumbPad.classList.remove('is-scanning');
      if (fingerprintInstruction) fingerprintInstruction.textContent = 'MATCHED ✓';
      if (lahariPadTag) lahariPadTag.textContent = 'Lahari’s Touch (Verified ✓)';
      if (fingerprintMergedResult) fingerprintMergedResult.style.display = 'block';

      playBiometricMatchChime();
      if ('vibrate' in navigator) navigator.vibrate([60, 100, 200]);

      const rect = lahariThumbPad ? lahariThumbPad.getBoundingClientRect() : null;
      /* emoji popup disabled */
    }, 1800);
  }

  function cancelFingerprintScan() {
    if (isFingerprintMatched) return;
    if (scanTimer) {
      clearTimeout(scanTimer);
      scanTimer = null;
    }
    if (lahariThumbPad) lahariThumbPad.classList.remove('is-scanning');
    if (fingerprintInstruction) fingerprintInstruction.textContent = 'PRESS & HOLD';
    if (lahariPadTag) lahariPadTag.textContent = 'Lahari’s Sensor (Awaiting Touch)';
  }

  if (lahariThumbPad) {
    lahariThumbPad.addEventListener('mousedown', startFingerprintScan);
    lahariThumbPad.addEventListener('mouseup', cancelFingerprintScan);
    lahariThumbPad.addEventListener('mouseleave', cancelFingerprintScan);

    lahariThumbPad.addEventListener('touchstart', startFingerprintScan, { passive: false });
    lahariThumbPad.addEventListener('touchend', cancelFingerprintScan);
    lahariThumbPad.addEventListener('touchcancel', cancelFingerprintScan);
  }

  // ============================================================
  // WIDGET 22: THE MAGIC BLOOMING ROSE & LOVE VOUCHER MODAL
  // ============================================================
  const waterRoseBtn = document.getElementById('water-rose-btn');
  const waterRoseBtnText = document.getElementById('water-rose-btn-text');
  const rosePlant = document.getElementById('rose-plant');
  const waterDropletsBox = document.getElementById('water-droplets-box');
  const roseVoucherModal = document.getElementById('rose-voucher-modal');
  const roseModalCloseX = document.getElementById('rose-modal-close-x');
  const roseModalCloseBtn = document.getElementById('rose-modal-close-btn');
  const roseAnotherBtn = document.getElementById('rose-another-btn');
  const roseVoucherTitle = document.getElementById('rose-voucher-title');
  const roseVoucherDesc = document.getElementById('rose-voucher-desc');
  const roseVoucherList = document.getElementById('rose-voucher-list');

  const roseCoupons = [
    {
      title: "The Infinite Comfort Voucher",
      desc: "Redeemable by Lahari anytime, anywhere, with no expiration date:",
      perks: [
        "✨ Unlimited forehead kisses on difficult days",
        "✨ 1 uninterrupted hour of undivided listening",
        "✨ Warm, tight embraces until your heart feels calm",
        "✨ Midnight cravings delivery & endless pampering"
      ]
    },
    {
      title: "The Queen of My Heart Decree",
      desc: "Redeemable whenever Lahari wants the world to bend to her wish:",
      perks: [
        "✨ Full control over movie & music selection for a whole weekend",
        "✨ One unconditional 'I am sorry and you are 100% right' pass",
        "✨ Unlimited gentle head massages and peaceful quiet time",
        "✨ A handwritten love letter sealed with real devotion"
      ]
    },
    {
      title: "The Midnight Escape Pass",
      desc: "Redeemable for spontaneous magical moments together:",
      perks: [
        "✨ Late night stargazing drive with no destination",
        "✨ Your favorite sweet treat & comfort food brought right to you",
        "✨ Whispering your favorite romantic words until you smile",
        "✨ Zero judgment, 100% unconditional love forever"
      ]
    },
    {
      title: "The Rainy Day Sanctuary",
      desc: "Redeemable when the world feels heavy and you need shelter:",
      perks: [
        "✨ Cozy blankets, hot cocoa, and holding you close",
        "✨ No alarms, no stress, just you and me together",
        "✨ Listening to all your thoughts without ever interrupting",
        "✨ Reminding you 100 times how deeply you are loved"
      ]
    }
  ];

  let currentCouponIdx = 0;
  let roseBloomed = false;

  function renderCoupon(idx) {
    const c = roseCoupons[idx];
    if (!c) return;
    if (roseVoucherTitle) roseVoucherTitle.textContent = c.title;
    if (roseVoucherDesc) roseVoucherDesc.textContent = c.desc;
    if (roseVoucherList) {
      roseVoucherList.innerHTML = c.perks.map(p => '<li>' + p + '</li>').join('');
    }
  }

  function openRoseModal() {
    if (!roseVoucherModal) return;
    playBloomChime();
    if ('vibrate' in navigator) navigator.vibrate([40, 60]);
    renderCoupon(currentCouponIdx);
    roseVoucherModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeRoseModal() {
    if (!roseVoucherModal) return;
    roseVoucherModal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function waterTheRose() {
    if (roseBloomed) {
      openRoseModal();
      return;
    }
    roseBloomed = true;

    if (waterRoseBtn) {
      waterRoseBtn.disabled = true;
    }
    if (waterRoseBtnText) waterRoseBtnText.textContent = 'Watering with Love... 💧';

    playWaterPourSound();
    if ('vibrate' in navigator) navigator.vibrate([40, 80]);

    if (waterDropletsBox) {
      waterDropletsBox.style.display = 'block';
      waterDropletsBox.innerHTML = '';
      for (let i = 0; i < 6; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.left = (30 + i * 25) + 'px';
        drop.style.top = '0px';
        drop.style.width = '4px';
        drop.style.height = '10px';
        drop.style.background = '#64d2ff';
        drop.style.borderRadius = '3px';
        drop.style.opacity = '0.8';
        drop.style.animation = 'waterFall 0.6s ease-in ' + (i * 0.1) + 's forwards';
        waterDropletsBox.appendChild(drop);
      }
    }

    setTimeout(() => {
      if (rosePlant) rosePlant.classList.add('is-blooming');
      playBloomChime();

      setTimeout(() => {
        if (waterRoseBtn) {
          waterRoseBtn.disabled = false;
          waterRoseBtn.classList.add('is-bloomed');
        }
        if (waterRoseBtnText) waterRoseBtnText.textContent = 'Forever Blooming For You 🌹';
        if ('vibrate' in navigator) navigator.vibrate([50, 90, 150]);
        openRoseModal();
      }, 1000);
    }, 800);
  }

  if (waterRoseBtn) {
    waterRoseBtn.addEventListener('click', waterTheRose);
  }

  if (rosePlant) {
    rosePlant.style.cursor = 'pointer';
    rosePlant.addEventListener('click', () => {
      if (roseBloomed) {
        openRoseModal();
      } else {
        waterTheRose();
      }
    });
  }

  if (roseModalCloseX) roseModalCloseX.addEventListener('click', closeRoseModal);
  if (roseModalCloseBtn) roseModalCloseBtn.addEventListener('click', closeRoseModal);
  if (roseVoucherModal) {
    roseVoucherModal.addEventListener('click', (e) => {
      if (e.target === roseVoucherModal) closeRoseModal();
    });
  }

  if (roseAnotherBtn) {
    roseAnotherBtn.addEventListener('click', () => {
      currentCouponIdx = (currentCouponIdx + 1) % roseCoupons.length;
      playBloomChime();
      renderCoupon(currentCouponIdx);
    });
  }

  // WIDGET 2: THE LOVE BEACON (BEDSIDE LAMP)
  // ============================================================
  const beaconLampBox = document.getElementById('beacon-lamp-box');
  const beaconToggleBtn = document.getElementById('beacon-toggle-btn');
  const beaconBtnText = document.getElementById('beacon-btn-text');
  const beaconStatusPill = document.getElementById('beacon-status-pill');
  const beaconWhisperText = document.getElementById('beacon-whisper-text');

  let beaconIsLit = false;

  function toggleLoveBeacon() {
    beaconIsLit = !beaconIsLit;
    playBeaconChime();

    if ('vibrate' in navigator) navigator.vibrate([40, 70]);

    if (beaconIsLit) {
      if (beaconLampBox) beaconLampBox.classList.add('is-lit');
      if (beaconStatusPill) {
        beaconStatusPill.textContent = 'Beacon: Radiant 💡 • Connected Across The Miles';
        beaconStatusPill.classList.add('is-active');
      }
      if (beaconWhisperText) {
        beaconWhisperText.innerHTML = '“Warmth sent. Nisar just felt your love illuminate his entire soul.”';
      }
      if (beaconBtnText) beaconBtnText.textContent = 'Extinguish Gently 🌙';

      const rect = beaconLampBox ? beaconLampBox.getBoundingClientRect() : null;
      /* emoji popup disabled */

      localStorage.setItem('lahari_beacon_lit', Date.now().toString());
    } else {
      if (beaconLampBox) beaconLampBox.classList.remove('is-lit');
      if (beaconStatusPill) {
        beaconStatusPill.textContent = 'Lamp: Dormant • Tap To Light';
        beaconStatusPill.classList.remove('is-active');
      }
      if (beaconWhisperText) {
        beaconWhisperText.innerHTML = '“Tap the golden lamp above to illuminate our shared warmth across the night.”';
      }
      if (beaconBtnText) beaconBtnText.textContent = 'Light The Beacon 🏮';

      localStorage.removeItem('lahari_beacon_lit');
    }
  }

  if (beaconLampBox) {
    beaconLampBox.addEventListener('click', toggleLoveBeacon);
    beaconLampBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLoveBeacon();
      }
    });
  }
  if (beaconToggleBtn) {
    beaconToggleBtn.addEventListener('click', toggleLoveBeacon);
  }

  const savedBeacon = localStorage.getItem('lahari_beacon_lit');
  if (savedBeacon) {
    const elapsed = Date.now() - parseInt(savedBeacon, 10);
    if (elapsed < 12 * 60 * 60 * 1000) {
      toggleLoveBeacon();
    }
  }

  // ============================================================
  // WIDGET 12: THE MOONLIT LAKE (FLOAT A LOTUS DIYA / WATER LANTERN)
  // ============================================================
  const diyaCanvas = document.getElementById('lotus-diya-canvas');
  const diyaForm = document.getElementById('diya-form');
  const diyaInput = document.getElementById('diya-prayer-input');

  if (diyaCanvas) {
    const dctx = diyaCanvas.getContext('2d');
    let dw = diyaCanvas.width = 600;
    let dh = diyaCanvas.height = 340;

    const floatingDiyas = [];
    const ripples = [];

    const defaultDiyaPrayers = [
      "Eternal Peace & Love",
      "Lahari's Smile ✨",
      "Together Forever",
      "Purest Soul 💖",
      "Blessings for Us",
      "My Safe Harbor"
    ];

    for (let i = 0; i < 6; i++) {
      floatingDiyas.push({
        x: 75 + (i / 5) * (dw - 150) + (Math.random() - 0.5) * 30,
        y: 80 + Math.random() * (dh - 140),
        size: 22 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.08,
        driftPhase: Math.random() * Math.PI * 2,
        bobSpeed: 0.02 + Math.random() * 0.015,
        bobPhase: Math.random() * Math.PI * 2,
        flickerPhase: Math.random() * Math.PI * 2,
        prayer: defaultDiyaPrayers[i % defaultDiyaPrayers.length],
        petals: 8 + (i % 2) * 2,
        color: i % 2 === 0 ? 'rose' : 'ivory'
      });
    }

    function addRipple(x, y, maxR = 45) {
      ripples.push({
        x: x,
        y: y,
        radius: 3,
        maxRadius: maxR,
        alpha: 0.75,
        speed: 0.65
      });
    }

    function drawLotusDiya(ctx, d, flicker, time) {
      ctx.save();
      const bob = Math.sin(d.bobPhase) * 2.5;
      const currentY = d.y + bob;
      ctx.translate(d.x, currentY);

      const s = d.size;

      // 1. Water Ripple Ring under the Diya
      ctx.save();
      ctx.strokeStyle = `rgba(223, 183, 108, ${0.18 + 0.1 * Math.sin(time * 2 + d.bobPhase)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, s * 0.35, s * 1.3, s * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Shimmering Water Reflection beneath the Diya
      const reflH = s * 0.9 * flicker;
      const reflW = s * 0.45;
      const reflGrad = ctx.createLinearGradient(0, s * 0.3, 0, s * 0.3 + reflH);
      reflGrad.addColorStop(0, `rgba(255, 195, 75, ${0.4 * flicker})`);
      reflGrad.addColorStop(0.5, `rgba(255, 120, 40, ${0.2 * flicker})`);
      reflGrad.addColorStop(1, 'rgba(255, 80, 20, 0)');
      ctx.fillStyle = reflGrad;
      ctx.beginPath();
      ctx.ellipse(0, s * 0.35 + reflH * 0.5, reflW, reflH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Lily Pad Base (Dark emerald green leaf)
      ctx.fillStyle = '#0f291e';
      ctx.strokeStyle = 'rgba(40, 90, 60, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, s * 0.25, s * 1.25, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 4. Layer 1: Outer Lotus Petals
      const petCount = d.petals;
      for (let i = 0; i < petCount; i++) {
        const angle = (i / petCount) * Math.PI * 2;
        const px = Math.cos(angle) * (s * 0.75);
        const py = Math.sin(angle) * (s * 0.38) + s * 0.12;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        const petGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, s * 0.5);
        if (d.color === 'rose') {
          petGrad.addColorStop(0, '#fce7f3');
          petGrad.addColorStop(0.5, '#f472b6');
          petGrad.addColorStop(1, '#9d174d');
        } else {
          petGrad.addColorStop(0, '#ffffff');
          petGrad.addColorStop(0.5, '#fef08a');
          petGrad.addColorStop(1, '#ca8a04');
        }
        ctx.fillStyle = petGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.4, s * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Layer 2: Inner Lotus Petals (Cup shape around diya)
      for (let i = 0; i < petCount; i++) {
        const angle = (i / petCount) * Math.PI * 2 + (Math.PI / petCount);
        const px = Math.cos(angle) * (s * 0.45);
        const py = Math.sin(angle) * (s * 0.22) + s * 0.05;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        const inGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, s * 0.35);
        inGrad.addColorStop(0, '#ffffff');
        inGrad.addColorStop(0.6, '#fbcfe8');
        inGrad.addColorStop(1, '#db2777');
        ctx.fillStyle = inGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.28, s * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Central Brass / Clay Diya Bowl
      const bowlGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, s * 0.32);
      bowlGrad.addColorStop(0, '#ffd875');
      bowlGrad.addColorStop(0.6, '#b8860b');
      bowlGrad.addColorStop(1, '#5c3d05');
      ctx.fillStyle = bowlGrad;
      ctx.beginPath();
      ctx.ellipse(0, s * 0.05, s * 0.3, s * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // 7. Warm Atmospheric Candle Bloom
      const flameBloom = ctx.createRadialGradient(0, -s * 0.18, s * 0.05, 0, -s * 0.18, s * 0.85);
      flameBloom.addColorStop(0, `rgba(255, 230, 130, ${0.55 * flicker})`);
      flameBloom.addColorStop(0.4, `rgba(255, 140, 30, ${0.22 * flicker})`);
      flameBloom.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = flameBloom;
      ctx.beginPath();
      ctx.arc(0, -s * 0.18, s * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // 8. The Living Diya Flame (Teardrop)
      const flameH = s * 0.42 * flicker;
      const flameW = s * 0.18 * flicker;
      const flameBaseY = -s * 0.02;

      ctx.beginPath();
      ctx.moveTo(0, flameBaseY - flameH);
      ctx.bezierCurveTo(flameW, flameBaseY - flameH * 0.4, flameW, flameBaseY, 0, flameBaseY);
      ctx.bezierCurveTo(-flameW, flameBaseY, -flameW, flameBaseY - flameH * 0.4, 0, flameBaseY - flameH);
      ctx.closePath();

      const flameGrad = ctx.createLinearGradient(0, flameBaseY, 0, flameBaseY - flameH);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.3, '#fff494');
      flameGrad.addColorStop(0.75, '#ff7300');
      flameGrad.addColorStop(1, 'rgba(230, 40, 0, 0.2)');
      ctx.fillStyle = flameGrad;
      ctx.shadowColor = '#ffe066';
      ctx.shadowBlur = 12 * flicker;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 9. Prayer / Wish Inscription
      if (d.prayer) {
        ctx.save();
        ctx.font = '500 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 235, 180, 0.82)';
        ctx.textAlign = 'center';
        ctx.fillText(d.prayer, 0, s * 0.72);
        ctx.restore();
      }

      ctx.restore();
    }

    let diyaTime = 0;

    function renderMoonlitLake() {
      diyaTime += 0.02;
      dctx.clearRect(0, 0, dw, dh);

      // Deep Nocturne Lake Gradient
      const waterGrad = dctx.createLinearGradient(0, 0, 0, dh);
      waterGrad.addColorStop(0, '#02040b');
      waterGrad.addColorStop(0.4, '#060f1e');
      waterGrad.addColorStop(0.8, '#0a162b');
      waterGrad.addColorStop(1, '#050a14');
      dctx.fillStyle = waterGrad;
      dctx.fillRect(0, 0, dw, dh);

      // Subtle Water Moonlight Sheen
      dctx.save();
      const moonSheen = dctx.createRadialGradient(dw * 0.5, dh * 0.4, 10, dw * 0.5, dh * 0.4, dw * 0.6);
      moonSheen.addColorStop(0, 'rgba(120, 180, 255, 0.08)');
      moonSheen.addColorStop(0.5, 'rgba(80, 140, 220, 0.03)');
      moonSheen.addColorStop(1, 'rgba(0, 0, 0, 0)');
      dctx.fillStyle = moonSheen;
      dctx.fillRect(0, 0, dw, dh);
      dctx.restore();

      // Render & Update Expanding Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += rip.speed;
        rip.alpha -= 0.012;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        dctx.save();
        dctx.strokeStyle = `rgba(180, 220, 255, ${rip.alpha * 0.35})`;
        dctx.lineWidth = 1.2;
        dctx.beginPath();
        dctx.ellipse(rip.x, rip.y, rip.radius * 1.5, rip.radius * 0.55, 0, 0, Math.PI * 2);
        dctx.stroke();
        dctx.restore();
      }

      // Gentle ambient ripples
      if (Math.random() < 0.03 && ripples.length < 15) {
        addRipple(Math.random() * dw, Math.random() * dh, 30 + Math.random() * 20);
      }

      // Sort Diyas by Y position
      floatingDiyas.sort((a, b) => a.y - b.y);

      // Render Floating Lotus Diyas
      floatingDiyas.forEach(d => {
        d.bobPhase += d.bobSpeed;
        d.driftPhase += 0.01;
        d.flickerPhase += 0.16;

        d.x += d.vx + Math.sin(d.driftPhase) * 0.18;
        d.y += d.vy + Math.cos(d.driftPhase) * 0.09;

        if (d.x < 35) { d.x = 35; d.vx *= -1; }
        if (d.x > dw - 35) { d.x = dw - 35; d.vx *= -1; }
        if (d.y < 45) { d.y = 45; d.vy *= -1; }
        if (d.y > dh - 55) { d.y = dh - 55; d.vy *= -1; }

        const flicker = 0.88 + 0.12 * Math.sin(d.flickerPhase) + (Math.random() - 0.5) * 0.03;
        drawLotusDiya(dctx, d, flicker, diyaTime);
      });

      requestAnimationFrame(renderMoonlitLake);
    }

    renderMoonlitLake();

    // Click anywhere on water to place a diya and ripple
    function handleLakeTap(e) {
      const rect = diyaCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const clickX = (clientX - rect.left) * (dw / rect.width);
      const clickY = (clientY - rect.top) * (dh / rect.height);

      addRipple(clickX, clickY, 65);
      addRipple(clickX, clickY, 35);

      if (floatingDiyas.length < 14) {
        floatingDiyas.push({
          x: clickX,
          y: clickY,
          size: 26,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.1,
          driftPhase: Math.random() * Math.PI,
          bobSpeed: 0.024,
          bobPhase: 0,
          flickerPhase: Math.random() * Math.PI,
          prayer: "A Wish for Lahari 🪷",
          petals: 8,
          color: 'rose'
        });
        playGentleBell();
        if ('vibrate' in navigator) navigator.vibrate([40, 60]);
      }
    }

    diyaCanvas.addEventListener('click', handleLakeTap);

    // Form submit to float a dedicated Diya
    if (diyaForm && diyaInput) {
      diyaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const prayer = diyaInput.value.trim();
        if (!prayer) return;

        const newX = dw / 2 + (Math.random() - 0.5) * 100;
        const newY = dh - 70;

        addRipple(newX, newY, 70);
        floatingDiyas.push({
          x: newX,
          y: newY,
          size: 30,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.15,
          driftPhase: 0,
          bobSpeed: 0.025,
          bobPhase: 0,
          flickerPhase: 0,
          prayer: prayer,
          petals: 10,
          color: 'rose'
        });

        playGentleBell();
        if ('vibrate' in navigator) navigator.vibrate([50, 70]);
        diyaInput.value = '';

        /* emoji popup disabled */
      });
    }
  }

  /* ============================================================
     20 SECRET HIDDEN NOTES & EASTER EGGS ENGINE
     ============================================================ */
  const SECRET_NOTES_DATA = {
    1: {
      id: 1,
      icon: "🌠",
      badge: "SECRET 1 OF 20 • MAKE A WISH",
      title: "The Shooting Star & Constellation Heart",
      text: "“Ek wish maango, Lahari... I promise jab bhi tum maangogi, main poori karunga. Chahe aasmaan se taare todne padein ya duniya ki har khushi tumhare kadmon me laani ho. You are my greatest wish come true. ❤️”",
      skin: "skin-constellation",
      sound: "fanfare",
      isConstellation: true
    },
    2: {
      id: 2,
      icon: "💌",
      badge: "SECRET 2 OF 20 • FOLDED DIARY PAGE",
      title: "A Candid Memory Scribble",
      text: "“Pata hai jab ye photo li gayi thi tab mere dimaag me kya tha? Yahi ki bhagwan ne kitni fursat se banaya hai is ladki ko... You looked so effortlessly beautiful.”",
      skin: "skin-diary",
      sound: "paper"
    },
    3: {
      id: 3,
      icon: "🩹",
      badge: "SECRET 3 OF 20 • EMERGENCY COMFORT",
      title: "Emergency Healing Hug",
      text: "“Emergency Hug: Agar aaj ka din thoda thakaane wala tha ya mood off hai, toh ye yaad rakhna — main hamesha tumhare sath hoon, bas ek call ya message door. Take care of yourself, okay? ❤️”",
      skin: "skin-postit",
      sound: "pop"
    },
    4: {
      id: 4,
      icon: "📮",
      badge: "SECRET 4 OF 20 • AIRMAIL LOVE LETTER",
      title: "Special Express Airmail",
      text: "“Special Express Delivery for Lahari: Ek chhota sa secret reminder — chahe din kaisa bhi jaye, raat ko sote waqt mera sabse aakhri aur subah uthte waqt sabse pehla khayal sirf tumhara hota hai.”",
      skin: "skin-diary",
      sound: "paper"
    },
    5: {
      id: 5,
      icon: "🏷️",
      badge: "SECRET 5 OF 20 • VINYL RECORD POST-IT",
      title: "Note on the Record Player",
      text: "“Jab bhi ye song bajta hai na, mujhe sirf tumhara hasta hua chehra yaad aata hai. Kabhi bhi apni ye pyari si hasi band mat karna, promise!”",
      skin: "skin-postit",
      sound: "paper"
    },
    6: {
      id: 6,
      icon: "✨",
      badge: "SECRET 6 OF 20 • MIDNIGHT WHISPER",
      title: "The Star Beside The Moon",
      text: "“Aasmaan me hazaron taare hain, par meri nazar hamesha sirf ek par aakar rukti hai — bilkul waise hi jaise bheed me meri nazar hamesha sirf tumhein dhoondhti hai.”",
      skin: "skin-constellation",
      sound: "chime"
    },
    7: {
      id: 7,
      icon: "🥠",
      badge: "SECRET 7 OF 20 • FOOTER ORIGAMI HEART",
      title: "Today's Secret Fortune",
      text: "“Today's Secret Fortune: Tumhari ek chhoti si smile kisi ka pura bura din theek kar sakti hai... (aur wo 'kisi' main hoon! 😊)”",
      skin: "skin-diary",
      sound: "pop"
    },
    8: {
      id: 8,
      icon: "🔖",
      badge: "SECRET 8 OF 20 • SILK BOOKMARK",
      title: "Marked On My Heart",
      text: "“Maine is pal par bookmark laga ke rakha hai... kyunki tumhare sath bitaaya gaya har ek minute meri zindagi ka sabse favorite chapter hai.”",
      skin: "skin-diary",
      sound: "paper"
    },
    9: {
      id: 9,
      icon: "☕",
      badge: "SECRET 9 OF 20 • COFFEE STAIN SECRET",
      title: "Cafe Napkin Scribble",
      text: "“Late night conversations, silly lame jokes, aur tumhari aawaz — duniya ki sabse best feeling yahi hai mere liye.”",
      skin: "skin-postit",
      sound: "paper"
    },
    10: {
      id: 10,
      icon: "🧸",
      badge: "SECRET 10 OF 20 • COMPLIMENT NOTE",
      title: "A Gentle Reminder From Teddy",
      text: "“Compliment Alert: Tumhe lagta hoga ki tum aam ho, par mere liye tum is poori duniya ki sabse special aur irreplaceable insaan ho.”",
      skin: "skin-postit",
      sound: "chime"
    },
    11: {
      id: 11,
      icon: "🗝️",
      badge: "SECRET 11 OF 20 • GOLDEN LOCKBOX",
      title: "Inside The Sacred Lockbox",
      text: "“Confidential: Chahe kitni bhi ladai ho jaye ya hum kitna bhi gussa ho jayein, end of the day mera dil hamesha tumhare paas hi aake shant hota hai.”",
      skin: "skin-diary",
      sound: "chime"
    },
    12: {
      id: 12,
      icon: "🍾",
      badge: "SECRET 12 OF 20 • OCEAN DRIFT NOTE",
      title: "Washed Ashore For Lahari",
      text: "“Samandar chahe kitna bhi gehra ho, tumhare liye meri feelings usse bhi zyada gehri hain. A gentle reminder that you are deeply, truly loved.”",
      skin: "skin-diary",
      sound: "pop"
    },
    13: {
      id: 13,
      icon: "🎟️",
      badge: "SECRET 13 OF 20 • CINEMA KEEPSAKE",
      title: "Lifetime Golden Cinema Pass",
      text: "“Admit Two: Valid for infinite midnight movie dates, unlimited caramel popcorn, aur jab tum movie dekhte-dekhte so jao toh tumhein bina disturb kiye pyaar se blanket udhana.”",
      skin: "skin-postit",
      sound: "paper"
    },
    14: {
      id: 14,
      icon: "🍫",
      badge: "SECRET 14 OF 20 • CHOCOLATE WRAPPER",
      title: "Midnight Sweet Craving",
      text: "“Sweet Craving Note: Duniya ki saari chocolates ek taraf, aur tumhari ek meethi si muskurahat ek taraf. Have the sweetest day, my favorite person!”",
      skin: "skin-postit",
      sound: "pop"
    },
    15: {
      id: 15,
      icon: "☁️",
      badge: "SECRET 15 OF 20 • FLUFFY CLOUD NOTE",
      title: "Love From The Skies",
      text: "“Agar aasmaan se pyaar barasta na, toh main roz tumhare liye baadal banke barasta. Stay happy always!”",
      skin: "skin-diary",
      sound: "chime"
    },
    16: {
      id: 16,
      icon: "🪴",
      badge: "SECRET 16 OF 20 • SECRET POT NOTE",
      title: "Hidden Behind The Rose",
      text: "“Pata hai phool kitne bhi khoobsurat ho jayein, par tumhari hasi aur tumhari pyari baaton se zyada khushnuma is duniya me kuch nahi hai.”",
      skin: "skin-diary",
      sound: "paper"
    },
    17: {
      id: 17,
      icon: "🧷",
      badge: "SECRET 17 OF 20 • PINNED KEEPSAKE",
      title: "Pinned To My Soul",
      text: "“Pinned Forever: Kuch log zindagi me aate hain aur hamesha ke liye dil ke sabse khaas hisse me pin ho jaate hain. Tum bilkul wahi ho mere liye.”",
      skin: "skin-postit",
      sound: "paper"
    },
    18: {
      id: 18,
      icon: "🎧",
      badge: "SECRET 18 OF 20 • AUDIO DEDICATION",
      title: "One Shared Earphone",
      text: "“Untangled Note: Zindagi chahe kitni bhi uljhi hui ho, jab tumse 5 minute baat hoti hai na, sab kuch ekdum sorted aur shant lagne lagta hai.”",
      skin: "skin-diary",
      sound: "chime"
    },
    19: {
      id: 19,
      icon: "🪁",
      badge: "SECRET 19 OF 20 • FLYING KITE NOTE",
      title: "The Thread In Your Hands",
      text: "“Hawa chahe kisi bhi disha me chale, meri khushiyon ki dor hamesha tumhare hath me hi rehti hai. Always flying high with you.”",
      skin: "skin-diary",
      sound: "paper"
    },
    20: {
      id: 20,
      icon: "🍪",
      badge: "SECRET 20 OF 20 • BEDSIDE TREAT NOTE",
      title: "Midnight Bedside Treat",
      text: "“Midnight Snack Note: Agar kabhi bhi lage ki koi dhyan nahi de raha, toh yaad rakhna ki ek insaan aisa hai jo tumhari har choti se choti baat ko notice karta hai.”",
      skin: "skin-postit",
      sound: "crunch"
    }
  };

  // Web Audio Synthesizer for Secret Notes
  let secretSynthCtx = null;
  function playSecretTone(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!secretSynthCtx) secretSynthCtx = new AudioCtx();
      if (secretSynthCtx.state === 'suspended') secretSynthCtx.resume();

      const now = secretSynthCtx.currentTime;
      const osc = secretSynthCtx.createOscillator();
      const gain = secretSynthCtx.createGain();
      osc.connect(gain);
      gain.connect(secretSynthCtx.destination);

      if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'paper') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.16);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'crunch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(140, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const subOsc = secretSynthCtx.createOscillator();
          const subGain = secretSynthCtx.createGain();
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
          subGain.gain.setValueAtTime(0.16, now + idx * 0.09);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.75);
          subOsc.connect(subGain);
          subGain.connect(secretSynthCtx.destination);
          subOsc.start(now + idx * 0.09);
          subOsc.stop(now + idx * 0.09 + 0.75);
        });
      }
    } catch (e) {
      console.warn("Secret tone synthesis error:", e);
    }
  }

  // Discovered Secrets Tracking
  const discoveredSecrets = new Set();
  try {
    const saved = localStorage.getItem('lahari_discovered_secrets');
    if (saved) {
      JSON.parse(saved).forEach(id => discoveredSecrets.add(id));
    }
  } catch (e) {}

  // Modal Elements
  const secretModal = document.getElementById('secret-note-modal');
  const secretCard = document.getElementById('secret-note-card');
  const secretCloseBtn = document.getElementById('secret-note-close-btn');
  const secretBadge = document.getElementById('secret-modal-badge');
  const secretIcon = document.getElementById('secret-modal-icon');
  const secretTitle = document.getElementById('secret-modal-title');
  const secretText = document.getElementById('secret-modal-text');
  const secretCounter = document.getElementById('secret-footer-counter');
  const secretWishBox = document.getElementById('secret-wish-box');
  const secretWishInput = document.getElementById('constellation-wish-input');
  const secretWishWhatsapp = document.getElementById('send-wish-whatsapp-btn');

  function openSecretNote(id) {
    const item = SECRET_NOTES_DATA[id];
    if (!item) return;

    discoveredSecrets.add(id);
    try {
      localStorage.setItem('lahari_discovered_secrets', JSON.stringify(Array.from(discoveredSecrets)));
    } catch (e) {}

    playSecretTone(item.sound || 'paper');

    /* emoji popup disabled */

    if (secretCard) {
      secretCard.className = 'secret-modal-card ' + (item.skin || 'skin-diary');
    }
    if (secretBadge) secretBadge.textContent = item.badge || '✨ A SECRET LOVE NOTE';
    if (secretIcon) secretIcon.textContent = item.icon || '💌';
    if (secretTitle) secretTitle.textContent = item.title;
    if (secretText) secretText.innerHTML = item.text;
    if (secretCounter) secretCounter.textContent = 'Exclusive for Lahari • Found with Love';

    if (item.isConstellation && secretWishBox) {
      secretWishBox.style.display = 'flex';
      if (secretWishInput && secretWishWhatsapp) {
        const updateLink = () => {
          const val = secretWishInput.value.trim() || "Maine tootte taare se ek secret wish maangi hai... 🌠";
          const waMsg = `Hey Nisar! Maine website par tootta tara dekh kar ek wish maangi hai:\n\n“${val}”\n\nAb tumne promise kiya tha poori karne ka! ✨❤️`;
          secretWishWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`;
        };
        updateLink();
        secretWishInput.oninput = updateLink;
      }
    } else if (secretWishBox) {
      secretWishBox.style.display = 'none';
    }

    if (secretModal) {
      secretModal.style.display = 'flex';
      requestAnimationFrame(() => {
        secretModal.classList.add('is-open');
      });
      document.body.style.overflow = 'hidden';
    }
  }

  let onSecretModalClosedCallback = null;

  function closeSecretNote() {
    if (!secretModal) return;
    secretModal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      secretModal.style.display = 'none';
    }, 350);

    if (typeof onSecretModalClosedCallback === 'function') {
      try {
        onSecretModalClosedCallback();
      } catch(e) {}
    }
  }

  if (secretCloseBtn) secretCloseBtn.addEventListener('click', closeSecretNote);
  if (secretModal) {
    secretModal.addEventListener('click', (e) => {
      if (e.target === secretModal) closeSecretNote();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && secretModal && secretModal.classList.contains('is-open')) {
      closeSecretNote();
    }
  });

  // Autonomous Random Popup Secret Charm
  // Pops up randomly anywhere in blank space, vanishes on click/time, re-pops up elsewhere
  function initAutonomousBlankSecret() {
    const layer = document.getElementById('blank-screen-secrets-layer');
    if (!layer) return;
    layer.innerHTML = '';

    // Pool of secret IDs from 2 to 20 (Note 1 is the starry sky constellation)
    const availableIds = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    
    // Fisher-Yates shuffle to randomize secret order on each visit
    for (let i = availableIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIds[i], availableIds[j]] = [availableIds[j], availableIds[i]];
    }

    let currentIndex = 0;
    let activeSecretId = availableIds[0];
    let isModalOpen = false;
    let autoVanishTimer = null;
    let popupTimer = null;
    let lastSide = null;

    // Create the single popup charm button
    const charmBtn = document.createElement('button');
    charmBtn.className = 'roaming-secret-charm';
    charmBtn.setAttribute('aria-label', 'Secret Surprise');
    charmBtn.innerHTML = `
      <div class="secret-token-circle">
        <div class="secret-token-aura"></div>
        <span class="secret-token-icon">💌</span>
      </div>
    `;
    layer.appendChild(charmBtn);

    const iconSpan = charmBtn.querySelector('.secret-token-icon');

    function getRandomBlankSpaceCoords() {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const tokenSize = winW < 600 ? 42 : 52;

      // Find centered content width from current containers
      const container = document.querySelector('.container') || document.querySelector('main');
      let cLeft = 0;
      let cRight = winW;

      if (container) {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.width < winW) {
          cLeft = Math.max(0, rect.left);
          cRight = Math.min(winW, rect.right);
        }
      }

      const leftSpace = cLeft;
      const rightSpace = winW - cRight;

      let x = 18;
      // Vary the height dynamically between 15% and 82%
      let y = Math.floor(winH * (0.15 + Math.random() * 0.67));

      if (leftSpace >= 65 || rightSpace >= 65) {
        // Alternate sides so it never pops up on the same side twice in a row!
        let chooseLeft = true;
        if (leftSpace >= 65 && rightSpace >= 65) {
          chooseLeft = (lastSide === 'left') ? false : ((lastSide === 'right') ? true : (Math.random() > 0.5));
        } else {
          chooseLeft = leftSpace >= 65;
        }
        lastSide = chooseLeft ? 'left' : 'right';

        if (chooseLeft) {
          const maxL = Math.max(16, leftSpace - tokenSize - 16);
          x = Math.floor(16 + Math.random() * Math.max(1, maxL - 16));
        } else {
          // Avoid the right navigation rail (leave ~65px margin from screen right)
          const minR = cRight + 14;
          const maxR = Math.max(minR + 5, winW - tokenSize - 65);
          x = Math.floor(minR + Math.random() * Math.max(1, maxR - minR));
        }
      } else {
        // Mobile / Small screens: choose alternate side edges away from central text
        const chooseLeft = (lastSide === 'left') ? false : true;
        lastSide = chooseLeft ? 'left' : 'right';
        x = chooseLeft ? 12 : (winW - tokenSize - 12);
        y = Math.floor(winH * (0.22 + Math.random() * 0.55));
      }

      return { x, y };
    }

    function popOutCharm() {
      clearTimeout(autoVanishTimer);
      charmBtn.classList.remove('is-popped');
      charmBtn.classList.add('is-popping-out');
      setTimeout(() => {
        charmBtn.classList.remove('is-popping-out');
        charmBtn.style.display = 'none';
      }, 350);
    }

    function popInCharm() {
      if (isModalOpen) return;

      activeSecretId = availableIds[currentIndex % availableIds.length];
      currentIndex++;

      const item = SECRET_NOTES_DATA[activeSecretId];
      if (item && iconSpan) {
        iconSpan.textContent = item.icon || '💌';
      }

      const coords = getRandomBlankSpaceCoords();
      charmBtn.style.left = `${coords.x}px`;
      charmBtn.style.top = `${coords.y}px`;

      charmBtn.classList.remove('is-popping-out');
      charmBtn.classList.add('is-popped');

      // Auto-vanish if ignored for 12-16 seconds, then pops up somewhere else!
      clearTimeout(autoVanishTimer);
      autoVanishTimer = setTimeout(() => {
        popOutCharm();
        // After vanishing, wait 3-5 seconds and pop up in another random blank spot
        scheduleNextPopup(3500 + Math.random() * 2500);
      }, 12000 + Math.random() * 4000);
    }

    function scheduleNextPopup(delay) {
      clearTimeout(popupTimer);
      clearTimeout(autoVanishTimer);
      popupTimer = setTimeout(() => {
        popInCharm();
      }, delay);
    }

    // When clicked: pop out / vanish immediately, and open the sweet message modal!
    charmBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(autoVanishTimer);
      clearTimeout(popupTimer);

      popOutCharm();
      isModalOpen = true;
      openSecretNote(activeSecretId);
    });

    // When the modal is closed: schedule next popup after 3.5 to 5.5 seconds at a new random location!
    onSecretModalClosedCallback = function() {
      isModalOpen = false;
      scheduleNextPopup(3500 + Math.random() * 2000);
    };

    // When window resizes or large scroll, if currently popped up, re-adjust to safe blank space
    window.addEventListener('resize', () => {
      if (charmBtn.classList.contains('is-popped')) {
        const coords = getRandomBlankSpaceCoords();
        charmBtn.style.left = `${coords.x}px`;
        charmBtn.style.top = `${coords.y}px`;
      }
    });

    // Initial popup 1.8 seconds after visit
    scheduleNextPopup(1800);
  }

  initAutonomousBlankSecret();

  // Constellation Game Logic (Trigger 1: Secret Constellation Heart & Shooting Star)
  (function initConstellationGame() {
    const stage = document.getElementById('secret-constellation-sky');
    const svg = document.getElementById('secret-constellation-svg');
    const linesGroup = document.getElementById('secret-constellation-lines');
    const activeLine = document.getElementById('secret-active-drag-line');
    if (!stage || !svg || !linesGroup) return;

    const stars = svg.querySelectorAll('.secret-c-star');
    const starCoords = [
      { x: 85, y: 110 },
      { x: 170, y: 55 },
      { x: 250, y: 125 },
      { x: 330, y: 55 },
      { x: 415, y: 110 }
    ];

    let currentStarIdx = 0;
    let isDrawing = false;
    let isCompleted = discoveredSecrets.has(1);

    function getSvgPoint(e) {
      const rect = svg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((clientX - rect.left) / rect.width) * 500;
      const y = ((clientY - rect.top) / rect.height) * 200;
      return { x, y };
    }

    function renderCompletedConstellation() {
      linesGroup.innerHTML = '';
      for (let i = 0; i < starCoords.length - 1; i++) {
        const from = starCoords[i];
        const to = starCoords[i + 1];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", from.x);
        line.setAttribute("y1", from.y);
        line.setAttribute("x2", to.x);
        line.setAttribute("y2", to.y);
        line.setAttribute("class", "secret-constellation-line");
        linesGroup.appendChild(line);
      }
      const closingLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
      closingLine.setAttribute("d", "M 85 110 Q 250 200 415 110");
      closingLine.setAttribute("fill", "none");
      closingLine.setAttribute("class", "secret-constellation-line");
      linesGroup.appendChild(closingLine);

      stars.forEach(s => s.classList.add('is-connected'));
    }

    if (isCompleted) {
      renderCompletedConstellation();
    }

    function connectToStar(nextIdx) {
      if (nextIdx === currentStarIdx + 1) {
        const from = starCoords[currentStarIdx];
        const to = starCoords[nextIdx];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", from.x);
        line.setAttribute("y1", from.y);
        line.setAttribute("x2", to.x);
        line.setAttribute("y2", to.y);
        line.setAttribute("class", "secret-constellation-line");
        linesGroup.appendChild(line);

        currentStarIdx = nextIdx;
        stars[nextIdx].classList.add('is-connected');
        if (typeof playSecretTone === 'function') playSecretTone('chime');

        if (currentStarIdx === 4 && !isCompleted) {
          isCompleted = true;
          // Draw bottom heart cradle curve
          const closingLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
          closingLine.setAttribute("d", "M 85 110 Q 250 200 415 110");
          closingLine.setAttribute("fill", "none");
          closingLine.setAttribute("class", "secret-constellation-line");
          linesGroup.appendChild(closingLine);

          if (typeof playSecretTone === 'function') playSecretTone('fanfare');
          runShootingStar();
          setTimeout(() => {
            openSecretNote(1);
          }, 1100);
        }
      }
    }

    function runShootingStar() {
      const canvas = document.getElementById('secret-shooting-star-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let sx = 10, sy = 15, len = 140;
      function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const grad = ctx.createLinearGradient(sx, sy, sx - len, sy - len * 0.35);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(255, 235, 150, 0.9)');
        grad.addColorStop(1, 'rgba(255, 180, 50, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ffeaa7';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - len, sy - len * 0.35);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Sparkle at head of shooting star
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        sx += 22;
        sy += 8;
        if (sx > canvas.width + len) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          requestAnimationFrame(step);
        }
      }
      step();
    }

    stars.forEach((star, idx) => {
      star.addEventListener('pointerdown', (e) => {
        if (isCompleted) {
          openSecretNote(1);
          return;
        }
        if (idx === 0 && currentStarIdx === 0) {
          isDrawing = true;
          star.classList.add('is-connected');
          if (activeLine) {
            activeLine.style.display = 'block';
            activeLine.setAttribute('x1', starCoords[0].x);
            activeLine.setAttribute('y1', starCoords[0].y);
          }
        } else if (idx === currentStarIdx + 1) {
          connectToStar(idx);
        }
      });

      star.addEventListener('pointerenter', () => {
        if (isDrawing && idx === currentStarIdx + 1) {
          connectToStar(idx);
        }
      });
    });

    svg.addEventListener('pointermove', (e) => {
      if (!isDrawing || isCompleted || !activeLine) return;
      const pt = getSvgPoint(e);
      const curr = starCoords[currentStarIdx];
      activeLine.setAttribute('x1', curr.x);
      activeLine.setAttribute('y1', curr.y);
      activeLine.setAttribute('x2', pt.x);
      activeLine.setAttribute('y2', pt.y);
    });

    window.addEventListener('pointerup', () => {
      isDrawing = false;
      if (activeLine) activeLine.style.display = 'none';
    });

    const moonStage = document.getElementById('moon-lunar-stage');
    if (moonStage) {
      moonStage.addEventListener('click', (e) => {
        e.stopPropagation();
        runShootingStar();
        if (typeof playStarChime === 'function') {
          playStarChime();
        } else if (typeof playGentleBell === 'function') {
          playGentleBell();
        }
        if ('vibrate' in navigator) navigator.vibrate([30, 60]);
        /* emoji popup disabled */
      });
    }

    // Ambient shooting star when celestial sanctuary is in viewport
    setInterval(() => {
      const observerCard = document.getElementById('same-sky-section');
      if (observerCard && observerCard.getBoundingClientRect().top < window.innerHeight + 100 && observerCard.getBoundingClientRect().bottom > -100) {
        runShootingStar();
      }
    }, 16000);
  })();

  // Modal / Drawer escape key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (secretModal && secretModal.classList.contains('is-open')) {
        closeSecretNote();
      }
      if (themeDrawer && themeDrawer.classList.contains('is-open')) {
        themeDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
      }
      if (petalsDrawer && petalsDrawer.classList.contains('is-open')) {
        petalsDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
      }
      if (capsuleModal && capsuleModal.classList.contains('is-active')) {
        capsuleModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
      if (bottleModal && bottleModal.classList.contains('is-active')) {
        bottleModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
      if (starCertModal && starCertModal.classList.contains('is-active')) {
        starCertModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }
      if (midnightVaultModal && midnightVaultModal.style.display === 'flex') {
        closeMidnightVault();
      }
    }
  });
  }

  window.mountAndInitProtectedSanctuary = function() {
    mountSanctuaryFromTemplate();
    initSanctuaryCore();
    if (window.initSanctuaryRouter) window.initSanctuaryRouter();
    if (window.initAllSanctuaryFeatures) window.initAllSanctuaryFeatures();
    if (window.initEternityClock) window.initEternityClock();
    if (window.initAtmosphereControls) window.initAtmosphereControls();
  };

  if (sessionStorage.getItem('lahari_world_unlocked') === 'true') {
    window.mountAndInitProtectedSanctuary();
  }
});

