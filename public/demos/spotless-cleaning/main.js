/* Spotless template: small, dependency-free enhancements.
   Everything here is optional; the page works without JavaScript. */
(function () {
  'use strict';

  var STORAGE_KEY = 'spotless-theme';
  var root = document.documentElement;

  /* Light / dark toggle ---------------------------------------------- */
  var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var chosen = root.getAttribute('data-theme');
    if (chosen === 'light' || chosen === 'dark') return chosen;
    return systemDark && systemDark.matches ? 'dark' : 'light';
  }

  function syncToggleLabels() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    });
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* private mode: fine */ }
      syncToggleLabels();
    });
  });
  if (systemDark && systemDark.addEventListener) systemDark.addEventListener('change', syncToggleLabels);
  syncToggleLabels();

  /* Mobile menu ------------------------------------------------------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var nav = menuBtn && document.getElementById(menuBtn.getAttribute('aria-controls'));
  if (menuBtn && nav) {
    function setOpen(open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    }
    menuBtn.addEventListener('click', function () {
      setOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setOpen(false); menuBtn.focus(); }
    });
  }

  /* Gentle reveal on scroll ------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Footer year ------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Contact form: validation + friendly submit ------------------------ */
  document.querySelectorAll('form[data-enhanced-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');

    function say(msg, isError) {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle('is-error', !!isError);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        var valid = field.checkValidity();
        field.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        say('Please check the highlighted fields.', true);
        firstInvalid.focus();
        return;
      }

      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        say('This form isn’t connected yet. Add your form address in index.html (see README).', true);
        return;
      }

      say('Sending…', false);
      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          var success = form.getAttribute('data-success') || 'thank-you.html';
          if (success.charAt(0) === '#') {
            form.reset();
            say(form.getAttribute('data-success-message') || 'Thanks, you\u2019re on the list.', false);
          } else {
            window.location.href = success;
          }
        })
        .catch(function () {
          say('Sorry, that didn’t send. Please email instead, or try again in a moment.', true);
        });
    });
  });
})();
