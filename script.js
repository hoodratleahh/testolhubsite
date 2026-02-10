(function () {
  'use strict';

  // Scroll-triggered reveal: add .revealed when element enters viewport
  function initReveals() {
    var reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Copy script link button: copy a URL to clipboard (user can replace with real script URL)
  function initCopyButton() {
    var btn = document.getElementById('copy-script-btn');
    if (!btn) return;

    // Replace this with your actual raw script URL when you host the .lua on GitHub
    var scriptUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/mm2summerupdauto.lua';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(scriptUrl).then(
          function () {
            var label = btn.textContent;
            btn.textContent = 'Link copied!';
            setTimeout(function () {
              btn.textContent = label;
            }, 2000);
          },
          function () {
            btn.textContent = 'Copy failed—select link below';
          }
        );
      } else {
        btn.textContent = 'Copy: ' + scriptUrl;
        btn.href = scriptUrl;
      }
    });
  }

  // Smooth scroll for anchor links (backup; CSS scroll-behavior: smooth handles most cases)
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

  initReveals();
  initCopyButton();
  initSmoothScroll();
})();
