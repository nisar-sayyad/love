/**
 * ============================================================
 * SANCTUARY MULTI-PAGE ROUTER — NISAR × LAHARI
 * Handles client-side hash routing between Home and 6 Chapters.
 * Works seamlessly on local file protocol (file://) and servers.
 * ============================================================
 */

(function() {
  'use strict';

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

  function getTargetPageId() {
    const rawHash = window.location.hash || '#/home';
    const cleanHash = rawHash.split('?')[0].toLowerCase();
    return ROUTE_MAP[cleanHash] || 'page-home';
  }

  function handleRoute() {
    const targetPageId = getTargetPageId();
    const views = document.querySelectorAll('.sanctuary-view');
    if (!views || views.length === 0) return;

    let targetView = document.getElementById(targetPageId);
    if (!targetView) {
      targetView = document.getElementById('page-home');
    }

    views.forEach(view => {
      if (view === targetView) {
        view.classList.add('is-active');
        view.removeAttribute('hidden');
      } else {
        view.classList.remove('is-active');
        view.setAttribute('hidden', '');
      }
    });

    const isHome = targetPageId === 'page-home';

    // Update documentElement attributes and classes for bulletproof state
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

    // Toggle body class and scroll permissions for Home view vs Chapter views
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

    // Atmosphere bar now resides natively on Home page (no dynamic reparenting)

    // Always scroll smoothly to top on page navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Re-observe any reveal-on-scroll elements in the newly shown page
    // (they were hidden/inert before and the observer missed them)
    setTimeout(function() {
      var obs = window._scrollObserver;
      if (obs) {
        document.querySelectorAll('.reveal-on-scroll:not(.is-visible)').forEach(function(el) {
          obs.observe(el);
        });
      } else {
        // Fallback: just make them all visible
        document.querySelectorAll('.reveal-on-scroll').forEach(function(el) {
          el.classList.add('is-visible');
        });
      }
    }, 80);

    // Trigger resize event after short delay so canvas/strip elements compute correct bounds
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);

    if (document.documentElement) {
      document.documentElement.classList.remove('app-booting');
    }

    // Notify listeners
    window.dispatchEvent(new CustomEvent('sanctuary:routechange', {
      detail: { pageId: targetPageId, hash: window.location.hash }
    }));
  }

  window.navigateToChapter = function(chapterNum) {
    const routes = {
      1: '#/sanctuary',
      2: '#/universe',
      3: '#/museum',
      4: '#/words',
      5: '#/about-you',
      6: '#/future'
    };
    const route = routes[chapterNum] || '#/home';
    window.location.hash = route;
  };

  window.navigateToHome = function() {
    window.location.hash = '#/home';
  };

  window.initSanctuaryRouter = function() {
    handleRoute();
  };

  window.addEventListener('hashchange', handleRoute);

  // Home Arch Card navigation delegation
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.home-arch-card');
    if (card) {
      const targetHash = card.getAttribute('data-href');
      if (targetHash) {
        window.location.hash = targetHash;
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = document.activeElement && document.activeElement.closest('.home-arch-card');
      if (card) {
        const targetHash = card.getAttribute('data-href');
        if (targetHash) {
          e.preventDefault();
          window.location.hash = targetHash;
        }
      }
    }
  });
})();
