/* Spotless template: instant estimate, room tabs and postcode checker.
   ------------------------------------------------------------------
   EDIT PRICING to match your business. Hours are per visit for one
   cleaner; the estimate shows a range either side of the midpoint. */
(function () {
  'use strict';

  var PRICING = {
    currency: '£',
    hourlyRate: 24,          // what you charge per cleaner-hour
    minimumCharge: 60,       // smallest booking you take
    rangeSpread: 0.07,       // show ±7% so the estimate reads as a range
    services: {
      // base hours + extra hours per bedroom / bathroom
      regular: { label: 'Regular clean', base: 2, perBedroom: 0.5, perBathroom: 0.5 },
      deep:    { label: 'Deep clean', base: 3.5, perBedroom: 1, perBathroom: 1 },
      tenancy: { label: 'End of tenancy clean', base: 4.5, perBedroom: 1.25, perBathroom: 1 }
    },
    frequencyDiscount: { weekly: 0.1, fortnightly: 0.05, once: 0 }, // regular cleans only
    extras: {
      oven:    { label: 'inside oven', price: 35 },
      fridge:  { label: 'inside fridge', price: 15 },
      windows: { label: 'inside windows', price: 25 },
      ironing: { label: 'ironing', price: 22 }
    }
  };

  function money(n) { return PRICING.currency + Math.round(n); }
  function hoursText(h) {
    var rounded = Math.round(h * 2) / 2;
    return (rounded % 1 === 0 ? rounded : rounded.toFixed(1)) + (rounded === 1 ? ' hour' : ' hours');
  }

  /* Estimator --------------------------------------------------------- */
  var form = document.querySelector('[data-estimator]');
  if (form) {
    var totalEl = form.querySelector('[data-total]');
    var noteEl = form.querySelector('[data-total-note]');
    var freqSet = form.querySelector('[data-frequency]');
    var bookBtn = form.querySelector('[data-book]');
    var estimateField = document.querySelector('[data-estimate-field]');
    var lastSummary = '';

    function clamp(input) {
      var min = Number(input.min) || 1, max = Number(input.max) || 9;
      var v = Math.round(Number(input.value));
      if (!isFinite(v)) v = min;
      input.value = String(Math.min(max, Math.max(min, v)));
      return Number(input.value);
    }

    function update() {
      var serviceKey = (form.querySelector('input[name="service"]:checked') || {}).value || 'regular';
      var service = PRICING.services[serviceKey];
      var beds = clamp(form.querySelector('#bedrooms'));
      var baths = clamp(form.querySelector('#bathrooms'));
      var isRegular = serviceKey === 'regular';

      freqSet.disabled = !isRegular;
      freqSet.classList.toggle('is-disabled', !isRegular);
      var freq = isRegular ? ((form.querySelector('input[name="frequency"]:checked') || {}).value || 'once') : 'once';

      var hours = service.base + service.perBedroom * (beds - 1) + service.perBathroom * (baths - 1);
      var price = hours * PRICING.hourlyRate * (1 - (PRICING.frequencyDiscount[freq] || 0));
      var extras = [];
      form.querySelectorAll('input[name="extras"]:checked').forEach(function (box) {
        var extra = PRICING.extras[box.value];
        if (extra) { price += extra.price; extras.push(extra.label); }
      });
      price = Math.max(PRICING.minimumCharge, price);

      var low = price * (1 - PRICING.rangeSpread);
      var high = price * (1 + PRICING.rangeSpread);
      totalEl.textContent = money(low) + ' – ' + money(high);
      noteEl.textContent = 'About ' + hoursText(hours) + ' with one cleaner' + (isRegular && freq !== 'once' ? ', per visit' : '');

      lastSummary = service.label + ', ' + beds + ' bed, ' + baths + ' bath' +
        (isRegular ? ', ' + freq : '') + (extras.length ? ', plus ' + extras.join(', ') : '') +
        ': ' + money(low) + '–' + money(high);
    }

    form.addEventListener('change', update);
    form.addEventListener('input', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.querySelectorAll('[data-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-target'));
        input.value = String(Number(input.value) + Number(btn.getAttribute('data-step')));
        clamp(input);
        update();
      });
    });
    if (bookBtn) {
      bookBtn.addEventListener('click', function () {
        if (estimateField) estimateField.value = lastSummary;
      });
    }
    update();
  }

  /* Room tabs (ARIA tabs pattern with arrow-key support) --------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* Postcode checker ---------------------------------------------------- */
  var pc = document.querySelector('[data-postcode]');
  var areaList = document.querySelector('[data-areas]');
  if (pc && areaList) {
    var covered = Array.prototype.map.call(areaList.querySelectorAll('li'), function (li) {
      return li.textContent.trim().toUpperCase();
    });
    var result = pc.querySelector('.postcode-result');
    pc.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = pc.querySelector('input').value.toUpperCase().replace(/\s+/g, ' ').trim();
      var outward = raw.split(' ')[0];
      // Full postcodes without a space ("SW98AB"): drop the 3-character inward code.
      if (raw.indexOf(' ') === -1 && raw.length >= 5) outward = raw.slice(0, -3);
      result.classList.remove('is-yes', 'is-no');
      if (!outward) { result.textContent = 'Type a postcode, like SW9 8AB.'; return; }
      if (covered.indexOf(outward) !== -1) {
        result.textContent = 'Good news: we cover ' + outward + '. Get your estimate above.';
        result.classList.add('is-yes');
      } else {
        result.textContent = 'We don’t usually cover ' + outward + ' yet, but call us and we’ll see what we can do.';
        result.classList.add('is-no');
      }
    });
  }
})();
