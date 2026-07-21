/* ==========================================================================
   AssistIndependence — Main JavaScript
   Mobile nav, search, sticky header, scroll animations, FAQ accordion,
   filter/sort, form validation, back-to-top
   ========================================================================== */

(function () {
  'use strict';

  /* --- Mobile Nav --- */
  var menuBtn = document.querySelector('.mobile-menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
      mobileNav.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Sticky Header --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Search Overlay --- */
  var searchToggle = document.querySelector('.search-toggle');
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', function () {
      searchOverlay.classList.add('is-open');
      if (searchInput) searchInput.focus();
    });
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) searchOverlay.classList.remove('is-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
        searchOverlay.classList.remove('is-open');
        searchToggle.focus();
      }
    });
  }

  /* --- Scroll Animations (IntersectionObserver) --- */
  var fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el) { obs.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- Smooth Scroll for Anchors --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(this.getAttribute('aria-controls'));
      if (!answer) {
        answer = (this.parentElement && this.parentElement.querySelector('.faq-answer'))
          || this.nextElementSibling;
      }
      if (!answer) return;
      this.setAttribute('aria-expanded', String(!expanded));
      answer.classList.toggle('is-open', !expanded);
    });
  });

  /* --- Filter / Sort (product listing pages) --- */
  var filterBar = document.getElementById('filter-bar');
  if (filterBar) {
    var cards = Array.from(document.querySelectorAll('.product-card[data-rating]'));
    var container = document.getElementById('product-list');
    var sortSelect = document.getElementById('sort-select');
    var chips = document.querySelectorAll('.filter-chip');

    var activeFeatures = new Set();

    function applyFilters() {
      var sort = sortSelect ? sortSelect.value : 'rating-desc';

      var filtered = cards.filter(function (c) {
        if (activeFeatures.size > 0) {
          var feats = (c.dataset.features || '').split(',');
          var match = false;
          activeFeatures.forEach(function (f) { if (feats.indexOf(f) !== -1) match = true; });
          if (!match) return false;
        }
        return true;
      });

      filtered.sort(function (a, b) {
        if (sort === 'rating-desc') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (sort === 'reviews-desc') return parseInt(b.dataset.reviews) - parseInt(a.dataset.reviews);
        return 0;
      });

      if (container) {
        cards.forEach(function (c) { c.style.display = 'none'; });
        filtered.forEach(function (c) { c.style.display = ''; container.appendChild(c); });
      }
    }

    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var feat = this.dataset.feature;
        if (activeFeatures.has(feat)) { activeFeatures.delete(feat); this.classList.remove('active'); }
        else { activeFeatures.add(feat); this.classList.add('active'); }
        applyFilters();
      });
    });
  }

  /* --- Back to Top --- */
  var backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      backBtn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
