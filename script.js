(function () {
  'use strict';

  var STAGGER_MS = 120;
  var MAGNETIC_STRENGTH = 0.2;
  var MAGNETIC_RADIUS = 120;

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

  function initReveals() {
    var reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;
    reveals.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay !== null && delay !== '') {
        var ms = parseInt(delay, 10) * STAGGER_MS;
        el.style.transitionDelay = ms + 'ms';
      }
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
    );
    reveals.forEach(function (el) { observer.observe(el); });
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
    var btn = document.getElementById('copy-script-btn');
    if (!btn) return;
    var scriptUrl = 'https://raw.githubusercontent.com/hoodratleahh/testolhubsite/refs/heads/main/scriptmaxxing.lua';
    var loadstringCode = 'loadstring(game:HttpGet("' + scriptUrl + '"))()';
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
        btn.href = scriptUrl;
      }
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

  function initImageFallback() {
    document.querySelectorAll('.screenshot-frame img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.background = 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))';
        img.alt = 'Screenshot placeholder. Add screenshots/1.jpg, 2.jpg, 3.jpg to show your images.';
      });
    });
  }

  initScrollProgress();
  initHeaderScroll();
  initReveals();
  initMagneticCta();
  initCopyButton();
  initSmoothScroll();
  initImageFallback();
})();
