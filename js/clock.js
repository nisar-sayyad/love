(function () {
  'use strict';

  function initEternityClock() {
    const clockSection = document.getElementById('eternity-countdown-page') || document.getElementById('eternity-clock-section');
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    const daysLivedEl = document.getElementById('born-days-lived');
    const giftTextEl = document.getElementById('gift-sealed-text');

  if (!clockSection || !daysEl) return;

  const BORN_TIMESTAMP = new Date('2007-09-29T00:00:00+05:30').getTime();

  let timerId = null;
  let isVisible = false;

  function getTargetBirthday(nowDate) {
    const currentYear = nowDate.getFullYear();
    let targetYear = currentYear;
    // Next day (30 Sept) onwards, target is next year's 29 Sept
    if (nowDate.getMonth() > 8 || (nowDate.getMonth() === 8 && nowDate.getDate() > 29)) {
      targetYear = currentYear + 1;
    }
    return new Date(targetYear, 8, 29, 0, 0, 0).getTime();
  }

  function updateCountdown() {
    const now = new Date();
    const nowMs = now.getTime();
    const targetMs = getTargetBirthday(now);

    // Check if today is her actual birthday (29 September all day)
    const isBirthdayToday = (now.getMonth() === 8 && now.getDate() === 29);

    if (isBirthdayToday) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (giftTextEl) {
        giftTextEl.innerHTML = '🎁 <strong>Happy Birthday My Sweetheart! Your surprise is unlocked! ❤️🎂</strong>';
      }
    } else {
      const remainingMs = Math.max(0, targetMs - nowMs);
      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Lifetime days lived calculation:
    const livedDiff = Math.max(0, nowMs - BORN_TIMESTAMP);
    const totalDaysLived = Math.floor(livedDiff / (1000 * 60 * 60 * 24));
    if (daysLivedEl) {
      daysLivedEl.textContent = totalDaysLived.toLocaleString();
    }
  }

  // Interactive Gift Pill Modal Controller
  const giftPill = document.getElementById('countdown-gift-pill');
  const giftModal = document.getElementById('gift-modal');
  const giftCloseBtn = document.getElementById('gift-modal-close');
  const giftActionCloseBtn = document.getElementById('gift-close-btn');
  const giftPreviewBtn = document.getElementById('gift-preview-btn');
  const giftIcon = document.getElementById('gift-modal-icon');
  const giftTitle = document.getElementById('gift-modal-title');
  const giftDesc = document.getElementById('gift-modal-desc');

  function openGiftModal() {
    if (!giftModal) return;
    giftModal.classList.add('active');
  }

  function closeGiftModal() {
    if (!giftModal) return;
    giftModal.classList.remove('active');
  }

  if (giftPill) {
    giftPill.addEventListener('click', () => {
      openGiftModal();
    });
  }

  if (giftCloseBtn) giftCloseBtn.addEventListener('click', closeGiftModal);
  if (giftActionCloseBtn) giftActionCloseBtn.addEventListener('click', closeGiftModal);
  if (giftModal) {
    giftModal.addEventListener('click', (e) => {
      if (e.target === giftModal) closeGiftModal();
    });
  }

  if (giftPreviewBtn) {
    giftPreviewBtn.addEventListener('click', () => {
      if (giftIcon) giftIcon.textContent = '🎁';
      if (giftTitle) giftTitle.textContent = 'A Sacred Birthday Vow & Gift';
      if (giftDesc) {
        giftDesc.innerHTML = `
          <div style="text-align: left; background: rgba(255,255,255,0.03); border: 1px solid rgba(220,100,140,0.3); border-radius: 16px; padding: 18px 20px; margin-bottom: 12px;">
            <p style="margin: 0 0 10px; color: #F9D976; font-weight: 600; font-size: 0.95rem;">🎂 For the Most Precious Girl in My World, Lahari:</p>
            <p style="margin: 0 0 10px; line-height: 1.6; color: rgba(235,220,230,0.9); font-size: 0.92rem;">
              &ldquo;This is an eternal promise from Nisar: On your birthday and every single day beyond, I promise to cherish your smile, protect your peace, and fulfill every wish your sweet heart desires. You are my greatest blessing.&rdquo;
            </p>
            <p style="margin: 0; text-align: right; color: #FFFFFF; font-style: italic; font-size: 0.95rem;">&mdash; Forever Yours, Nisar &#x2764;&#xFE0F;</p>
          </div>
        `;
      }
      giftPreviewBtn.style.display = 'none';
      if (giftActionCloseBtn) giftActionCloseBtn.textContent = 'Close With Love ❤️';
    });
  }

  // Initial run
  updateCountdown();

  // Run update every second
  timerId = setInterval(updateCountdown, 1000);

  // Tab visibility management
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (timerId) clearInterval(timerId);
    } else {
      updateCountdown();
      timerId = setInterval(updateCountdown, 1000);
    }
  });
}

  /* ==========================================================================
     LAHARI LIFE-CLOCK CONTROLLER (29 Sept 2007 Eternity Ticker)
     ========================================================================== */
  let lahariLifeTimerId = null;

  function initLahariLifeClock() {
    const elY = document.getElementById('live-years');
    const elM = document.getElementById('live-months');
    const elD = document.getElementById('live-days');
    const elH = document.getElementById('live-hours');
    const elMin = document.getElementById('live-minutes');
    const elS = document.getElementById('live-seconds');

    if (!elY) return;

    const birthDate = new Date('2007-09-29T00:00:00+05:30');

    function updateLifeClock() {
      const now = new Date();
      
      let years = now.getFullYear() - birthDate.getFullYear();
      let months = now.getMonth() - birthDate.getMonth();
      let days = now.getDate() - birthDate.getDate();
      let hours = now.getHours() - birthDate.getHours();
      let minutes = now.getMinutes() - birthDate.getMinutes();
      let seconds = now.getSeconds() - birthDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      if (elY) elY.textContent = String(years).padStart(2, '0');
      if (elM) elM.textContent = String(months).padStart(2, '0');
      if (elD) elD.textContent = String(days).padStart(2, '0');
      if (elH) elH.textContent = String(hours).padStart(2, '0');
      if (elMin) elMin.textContent = String(minutes).padStart(2, '0');
      if (elS) elS.textContent = String(seconds).padStart(2, '0');
    }

    updateLifeClock();
    if (lahariLifeTimerId) clearInterval(lahariLifeTimerId);
    lahariLifeTimerId = setInterval(updateLifeClock, 1000);
  }

  function masterInitClock() {
    initEternityClock();
    initLahariLifeClock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', masterInitClock);
  } else {
    masterInitClock();
  }

  window.initEternityClock = masterInitClock;
  window.initLahariLifeClock = initLahariLifeClock;
})();
