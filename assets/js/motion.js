/**
 * motion.js - Editorial reveal and subtle page depth for Amorismo.
 *
 * Progressive enhancement: content remains visible if JavaScript is disabled.
 * Syntax: ES5 strict - matches the existing browser baseline.
 */
(function () {
  'use strict';

  var motionStarted = false;
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var motionSelectors = [
    { selector: '.am-page-title', variant: 'am-motion--title', delay: 0 },
    { selector: '.am-volume-hero .am-hero__visual', variant: 'am-motion--hero-art', delay: 80 },
    { selector: '.am-volume-hero .am-hero__body', variant: 'am-motion--hero-copy', delay: 180 },
    { selector: '.am-volume-story__body', variant: 'am-motion--body', delay: 0 },
    { selector: '.am-volume-story__quote', variant: 'am-motion--quote', delay: 140 },
    { selector: '.am-cast__heading', variant: 'am-motion--label', delay: 0 },
    { selector: '.am-person', variant: 'am-motion--stagger', delay: 0, stagger: 70 },
    { selector: '.am-gallery--editorial .am-section-label', variant: 'am-motion--label', delay: 0 },
    { selector: '.am-gallery--editorial .am-gallery__thumbs', variant: 'am-motion--body', delay: 80 },
    { selector: '.am-gallery--editorial .am-gallery__main', variant: 'am-motion--body', delay: 120 },
    { selector: '.am-landing-hero__photo--vol1', variant: 'am-motion--home-photo', delay: 0 },
    { selector: '.am-landing-hero__photo--vol2', variant: 'am-motion--home-photo', delay: 140 },
    { selector: '.am-landing-hero__photo--vol3', variant: 'am-motion--home-photo', delay: 280 },
    { selector: '.am-landing-hero__logo', variant: 'am-motion--home-logo', delay: 240 },
    { selector: '.am-landing-hero__form', variant: 'am-motion--hero-copy', delay: 420 },
    { selector: '.am-statement__headline', variant: 'am-motion--slide-left', delay: 0 },
    { selector: '.am-statement__body', variant: 'am-motion--slide-right', delay: 120 },
    { selector: '.am-statement__quote--featured', variant: 'am-motion--quote', delay: 0 },
    { selector: '.am-statement__quote:not(.am-statement__quote--featured)', variant: 'am-motion--stagger', delay: 80, stagger: 90 },
    { selector: '.am-statement__heading', variant: 'am-motion--slide-left', delay: 0 },
    { selector: '.am-bios__heading', variant: 'am-motion--slide-left', delay: 0 },
    { selector: '.am-bio:not(.am-bio--reverse) .am-bio__photo-wrap', variant: 'am-motion--slide-left', delay: 0 },
    { selector: '.am-bio:not(.am-bio--reverse) .am-bio__body', variant: 'am-motion--slide-right', delay: 110 },
    { selector: '.am-bio--reverse .am-bio__photo-wrap', variant: 'am-motion--slide-right', delay: 0 },
    { selector: '.am-bio--reverse .am-bio__body', variant: 'am-motion--slide-left', delay: 110 },
    { selector: '.am-contact', variant: 'am-motion--body', delay: 0 }
  ];

  function addMotionClass(element, variant, delay) {
    function handleTransitionEnd(event) {
      if (event.target !== element) return;
      if (event.propertyName !== 'opacity' && event.propertyName !== 'transform') return;
      element.classList.add('has-motion-ended');
      element.removeEventListener('transitionend', handleTransitionEnd);
    }

    element.classList.add('am-motion');
    if (variant) element.classList.add(variant);
    element.style.setProperty('--am-motion-delay', delay + 'ms');
    if (!reduceMotion) element.addEventListener('transitionend', handleTransitionEnd);
  }

  function prepareElements() {
    var animated = [];

    motionSelectors.forEach(function (config) {
      var nodes = document.querySelectorAll(config.selector);

      Array.prototype.forEach.call(nodes, function (node, index) {
        var delay = config.delay + ((config.stagger || 0) * (index % 4));
        addMotionClass(node, config.variant, delay);
        animated.push(node);
      });
    });

    return animated;
  }

  function revealElements(elements) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      elements.forEach(function (element) {
        element.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function bindHeroParallax() {
    var hero = document.querySelector('.am-volume-hero');
    var mobileHero = window.matchMedia && window.matchMedia('(max-width: 768px)');
    var active = true;
    var ticking = false;

    if (!hero || reduceMotion) return;

    function update() {
      var rect = hero.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var progress = (viewport - rect.top) / (viewport + rect.height);
      var clamped = Math.max(0, Math.min(1, progress));
      var offset = Math.round((clamped - 0.5) * 18);
      var multiplier = mobileHero && mobileHero.matches ? -0.5 : -1;

      hero.style.setProperty('--am-hero-parallax-y', Math.round(offset * multiplier) + 'px');
      ticking = false;
    }

    function requestUpdate() {
      if (!active) return;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        active = entries[0] && entries[0].isIntersecting;
        if (active) requestUpdate();
      }, { rootMargin: '160px 0px' }).observe(hero);
    }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function bindHomeParallax() {
    var hero = document.querySelector('.am-landing-hero');
    var photos;
    var active = true;
    var ticking = false;

    if (!hero || reduceMotion) return;

    photos = [
      { node: document.querySelector('.am-landing-hero__photo--vol1'), x: -8, y: -22 },
      { node: document.querySelector('.am-landing-hero__photo--vol2'), x: 10, y: -34 },
      { node: document.querySelector('.am-landing-hero__photo--vol3'), x: 6, y: -16 }
    ];

    function update() {
      var rect = hero.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      var centered = progress - 0.5;

      photos.forEach(function (photo) {
        if (!photo.node) return;
        photo.node.style.setProperty('--am-home-parallax-x', Math.round(centered * photo.x) + 'px');
        photo.node.style.setProperty('--am-home-parallax-y', Math.round(centered * photo.y) + 'px');
      });

      hero.style.setProperty('--am-home-content-parallax', Math.round(centered * -10) + 'px');
      ticking = false;
    }

    function requestUpdate() {
      if (!active) return;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        active = entries[0] && entries[0].isIntersecting;
        if (active) requestUpdate();
      }, { rootMargin: '180px 0px' }).observe(hero);
    }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function init() {
    var elements;

    if (motionStarted || document.body.classList.contains('am-motion-ready')) return;
    motionStarted = true;

    elements = prepareElements();
    document.body.classList.add('am-motion-ready');
    revealElements(elements);
    bindHeroParallax();
    bindHomeParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
