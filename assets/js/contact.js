/* Enquiry form: prefill from URL, validate, submit via form backend or fall back to email. */
(function () {
  'use strict';
  var form = document.getElementById('enquiry-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var params = new URLSearchParams(location.search);

  // Prefill from links such as /contact/?service=alm-liquidity or ?topic=premium or ?partner=alok-gupta
  var topic = params.get('service') || params.get('topic');
  if (topic) {
    var sel = document.getElementById('f-topic');
    if (sel.querySelector('option[value="' + topic + '"]')) sel.value = topic;
    if (topic === 'premium' || topic === 'newsletter' || topic === 'partnership' || topic === 'initiative') {
      document.getElementById('rt-enquiry').checked = true;
    }
  }
  if (params.get('product')) document.getElementById('f-msg').value = 'I would like early access to ' + params.get('product') + '.';
  if (params.get('partner')) document.getElementById('f-partner').value = params.get('partner');

  function show(msg, ok) {
    status.textContent = msg;
    status.className = 'form-status ' + (ok ? 'is-ok' : 'is-err');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      var bad = form.querySelector(':invalid');
      show('Please complete the required fields.', false);
      if (bad) bad.focus();
      return;
    }
    var data = new FormData(form);
    if (data.get('_gotcha')) return;

    if (window.gtag) window.gtag('event', 'generate_lead', { request_type: data.get('request_type'), topic: data.get('topic') });

    var endpoint = form.getAttribute('action');
    if (!endpoint) {
      // No form backend configured yet: hand over to the visitor's email client.
      var body = ['request_type', 'name', 'email', 'organisation', 'phone', 'institution_type', 'topic', 'partner', 'message']
        .map(function (k) { return data.get(k) ? k.replace('_', ' ') + ': ' + data.get(k) : null; })
        .filter(Boolean).join('\n');
      location.href = 'mailto:' + form.dataset.email + '?subject=' + encodeURIComponent(data.get('request_type') + ' — website') + '&body=' + encodeURIComponent(body);
      show('Opening your email client… If nothing happens, write to us at ' + form.dataset.email + '.', true);
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        show('Thank you — your message has been received. A partner will be in touch within one business day.', true);
      })
      .catch(function () { show('Sorry, something went wrong. Please email us at ' + form.dataset.email + '.', false); })
      .then(function () { btn.disabled = false; });
  });
})();
