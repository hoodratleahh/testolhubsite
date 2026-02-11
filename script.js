(function () {
  'use strict';

  var STAGGER_MS = 140;
  var MAGNETIC_STRENGTH = 0.2;
  var MAGNETIC_RADIUS = 120;
  var LOGO_TEXT = 'Testol Hub';
  var TYPING_MS = 90;

  function initTypingLogo() {
    var container = document.getElementById('logo-typed');
    var cursor = document.getElementById('logo-cursor');
    var logoWrap = container && container.closest('.logo');
    if (!container || !logoWrap) return;
    var i = 0;
    function typeNext() {
      if (i <= LOGO_TEXT.length) {
        container.textContent = LOGO_TEXT.slice(0, i);
        i++;
        setTimeout(typeNext, TYPING_MS);
      } else {
        logoWrap.classList.add('typing-done');
      }
    }
    setTimeout(typeNext, 400);
  }

  function initDayPopup() {
    var popup = document.getElementById('day-popup');
    var buttons = popup && document.getElementById('day-popup-buttons');
    var thanksEl = popup && document.getElementById('day-popup-thanks');
    var goodBtn = popup && popup.querySelector('[data-choice="good"]');
    var badBtn = popup && popup.querySelector('[data-choice="bad"]');
    if (!popup) return;
    var key = 'testolhub_day_asked';
    try {
      if (sessionStorage.getItem(key)) return;
    } catch (e) {}
    function closePopup(choice) {
      if (thanksEl && (choice === 'good' || choice === 'bad')) {
        thanksEl.textContent = choice === 'good' ? 'Glad to hear it.' : 'Hope tomorrow\'s better.';
        thanksEl.classList.add('is-visible');
        if (buttons) buttons.style.opacity = '0';
        setTimeout(doClose, 1200);
      } else {
        doClose();
      }
      function doClose() {
        try { sessionStorage.setItem(key, '1'); } catch (e) {}
        popup.classList.remove('is-open');
        popup.classList.add('is-closing');
        setTimeout(function () {
          popup.classList.remove('is-closing');
          popup.setAttribute('aria-hidden', 'true');
          if (buttons) buttons.style.opacity = '';
          if (thanksEl) thanksEl.classList.remove('is-visible');
        }, 400);
      }
    }
    setTimeout(function () {
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
    }, 600);
    if (goodBtn) goodBtn.addEventListener('click', function () { closePopup('good'); });
    if (badBtn) badBtn.addEventListener('click', function () { closePopup('bad'); });
  }

  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    function update() {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    var backdrop = document.getElementById('nav-backdrop');
    if (!toggle || !nav) return;
    function open() {
      nav.classList.add('is-open');
      if (backdrop) {
        backdrop.classList.add('is-visible');
        backdrop.setAttribute('aria-hidden', 'false');
      }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      nav.classList.remove('is-open');
      if (backdrop) {
        backdrop.classList.remove('is-visible');
        backdrop.setAttribute('aria-hidden', 'true');
      }
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) close();
      else open();
    });
    if (backdrop) backdrop.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
  }

  function initReveals() {
    var reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;
    var hero = document.querySelector('.hero');
    var heroReveals = hero ? hero.querySelectorAll('[data-reveal]') : [];
    reveals.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay !== null && delay !== '') {
        var ms = parseInt(delay, 10) * STAGGER_MS;
        el.style.transitionDelay = ms + 'ms';
      }
    });
    heroReveals.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      var ms = delay !== null && delay !== '' ? parseInt(delay, 10) * STAGGER_MS : 0;
      el.style.transitionDelay = ms + 'ms';
    });
    setTimeout(function () {
      heroReveals.forEach(function (el) { el.classList.add('revealed'); });
    }, 200);
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
    );
    reveals.forEach(function (el) {
      if (!hero || !hero.contains(el)) observer.observe(el);
    });
  }

  function initMagneticCta() {
    var cta = document.getElementById('cta-hero');
    if (!cta) return;
    var rect = cta.getBoundingClientRect();
    var currentX = 0, currentY = 0;
    var targetX = 0, targetY = 0;
    var rafId = null;
    function onMove(e) {
      var r = cta.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAGNETIC_RADIUS) {
        var force = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
        targetX = dx * force;
        targetY = dy * force;
      } else {
        targetX = 0;
        targetY = 0;
      }
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    }
    function animate() {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      cta.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }
    function onLeave() {
      targetX = 0;
      targetY = 0;
    }
    document.addEventListener('mousemove', onMove, { passive: true });
    cta.addEventListener('mouseleave', onLeave);
  }

  function initCopyButton() {
    var scriptUrl = 'https://raw.githubusercontent.com/hoodratleahh/testolhubsite/refs/heads/main/scriptmaxxing.lua';
    var loadstringCode = 'loadstring(game:HttpGet("' + scriptUrl + '"))()';
    function bindCopy(btn) {
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(loadstringCode).then(
            function () {
              var label = btn.textContent;
              btn.textContent = 'Copied!';
              setTimeout(function () { btn.textContent = label; }, 2000);
            },
            function () { btn.textContent = 'Copy failed'; }
          );
        } else {
          btn.textContent = 'Copy: ' + scriptUrl;
          if (btn.href !== undefined) btn.href = scriptUrl;
        }
      });
    }
    bindCopy(document.getElementById('copy-script-btn'));
    bindCopy(document.getElementById('copy-script-btn-bottom'));
  }

  function initFilterPills() {
    var pills = document.querySelectorAll('.filter-pill');
    var cards = document.querySelectorAll('.feature-card[data-cat]');
    if (!pills.length || !cards.length) return;
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var filter = pill.getAttribute('data-filter');
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-cat');
          if (filter === 'all' || cat === filter) {
            card.classList.remove('filter-hidden');
          } else {
            card.classList.add('filter-hidden');
          }
        });
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  }

  function initStatCountUp() {
    var counters = document.querySelectorAll('.stat-value-count[data-count]');
    if (!counters.length) return;
    var hero = document.querySelector('.hero');

    function runCountUp(el) {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var format = el.getAttribute('data-format');
      var duration = 1800;
      var start = performance.now();
      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }
      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutQuart(progress);
        var value = Math.floor(target * eased);
        var display;
        if (format === 'short' && value >= 1000000) {
          display = (value / 1000000).toFixed(value >= 10000000 ? 0 : 1).replace(/\.0$/, '') + 'm';
        } else if (value >= 1000) {
          display = value.toLocaleString();
        } else {
          display = String(value);
        }
        el.textContent = display + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = (format === 'short' && target >= 1000000)
            ? (target / 1000000).toFixed(target >= 10000000 ? 0 : 1).replace(/\.0$/, '') + 'm' + suffix
            : target.toLocaleString() + suffix;
          el.classList.add('counted');
        }
      }
      requestAnimationFrame(tick);
    }

    // Hero stats: start count after reveal (hero stats have delay 4 = ~560ms)
    var heroStatsDelay = 700;
    counters.forEach(function (el) {
      if (hero && hero.contains(el)) {
        setTimeout(function () { runCountUp(el); }, heroStatsDelay);
      } else {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              observer.unobserve(entry.target);
              runCountUp(entry.target);
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(el);
      }
    });
  }

  function initImageFallback() {
    document.querySelectorAll('.screenshot-frame img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.background = 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))';
        img.alt = 'Screenshot placeholder. Add screenshots/1.jpg, 2.jpg, 3.jpg to show your images.';
      });
    });
    var iphoneImg = document.querySelector('.iphone-mockup-img');
    if (iphoneImg) {
      iphoneImg.addEventListener('error', function () {
        this.src = 'assets/iphone-mockup.svg';
        this.alt = 'iPhone mockup';
      });
    }
  }

  function initTestimonialCarousel() {
    var track1 = document.getElementById('testimonial-track-1');
    var track2 = document.getElementById('testimonial-track-2');
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (track1) track1.classList.add('no-animation');
      if (track2) track2.classList.add('no-animation');
      return;
    }
    function duplicateTrack(track) {
      if (!track) return;
      var cards = track.querySelectorAll('.testimonial-card');
      cards.forEach(function (card) {
        track.appendChild(card.cloneNode(true));
      });
    }
    duplicateTrack(track1);
    duplicateTrack(track2);
    function runMarquee(track, direction) {
      if (!track) return;
      var offset = 0;
      var halfWidth = track.scrollWidth / 2;
      var speed = 0.8;
      function tick() {
        offset += direction * speed;
        if (offset >= halfWidth) offset -= halfWidth;
        if (offset <= -halfWidth) offset += halfWidth;
        track.style.transform = 'translateX(' + offset + 'px)';
        requestAnimationFrame(tick);
      }
      setTimeout(function () { requestAnimationFrame(tick); }, 100);
    }
    runMarquee(track1, -1);
    runMarquee(track2, 1);
  }

  initTypingLogo();
  initDayPopup();
  initStatCountUp();
  initScrollProgress();
  initHeaderScroll();
  initNavToggle();
  initReveals();
  initMagneticCta();
  initCopyButton();
  initFilterPills();
  initSmoothScroll();
  initImageFallback();
  initTestimonialCarousel();
})();
