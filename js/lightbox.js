/**
 * ============================================================
 * LIGHTBOX CONTROLLER — NISAR × LAHARI
 * Accessible, touch-friendly, responsive fullscreen media viewer.
 * Supports keyboard navigation (ESC, Arrows) and mobile swipe.
 * ============================================================
 */

window.RomanticLightbox = (function () {
  let items = [];
  let currentIndex = 0;
  let modal, mediaContainer, captionElem, counterElem;
  let touchStartX = 0;
  let touchEndX = 0;

  function init() {
    modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    mediaContainer = document.getElementById('lightbox-media-container');
    captionElem = document.getElementById('lightbox-caption');
    counterElem = document.getElementById('lightbox-counter');

    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // Touch swipe gestures
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next(); // Swiped left -> next
      } else {
        prev(); // Swiped right -> prev
      }
    }
  }

  function registerItems(newItems) {
    items = newItems;
  }

  function open(index = 0) {
    if (!modal || items.length === 0) return;
    currentIndex = index;
    renderCurrentItem();
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (mediaContainer) {
      mediaContainer.innerHTML = '';
    }
  }

  function next() {
    if (items.length <= 1) return;
    currentIndex = (currentIndex + 1) % items.length;
    renderCurrentItem();
  }

  function prev() {
    if (items.length <= 1) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderCurrentItem();
  }

  function renderCurrentItem() {
    const item = items[currentIndex];
    if (!item || !mediaContainer) return;

    mediaContainer.innerHTML = '';

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.className = 'lightbox-media';
      mediaContainer.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || 'Lahari';
      img.className = 'lightbox-media';
      mediaContainer.appendChild(img);
    }

    if (captionElem) {
      captionElem.textContent = item.caption || '';
    }
    if (counterElem) {
      counterElem.textContent = `${currentIndex + 1} of ${items.length}`;
    }
  }

  return {
    init,
    registerItems,
    open,
    close,
    next,
    prev
  };
})();
