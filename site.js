/* Avira — shared behaviour: floor-plan tabs and the enquiry form (lead sheet + WhatsApp). */
(function () {
  'use strict';

  /* ---- Tab groups (floor plans) ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) { panel.hidden = !on; }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) { return; }
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });

  /* ---- Enquiry form: logs the lead to the Avira lead sheet, then offers WhatsApp to the right desk ---- */
  var LEADS_URL = 'https://script.google.com/macros/s/AKfycbwubZDrYGBRk1K6aTnIw1tjCWG7TutoE8YILQmf9-qGDqGdChfjqgKx5kL1gCZT61fn/exec';
  var DESKS = { stays: '918208004187', estates: '919156356952' };
  var form = document.getElementById('enquiry');
  if (!form) { return; }
  var note = document.getElementById('f-note');
  var btn = form.querySelector('button[type="submit"]');
  var subject = form.getAttribute('data-subject') || 'Enquiry';
  var path = window.location.pathname;
  var page = /stays/.test(path) ? 'stays' : /estates/.test(path) ? 'estates' : 'home';

  /* Hidden field that people never see; bots fill it in and get ignored. */
  var trap = document.createElement('input');
  trap.type = 'text'; trap.name = 'website'; trap.tabIndex = -1;
  trap.setAttribute('autocomplete', 'off'); trap.setAttribute('aria-hidden', 'true');
  trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
  form.appendChild(trap);

  function say(parts, color) {
    note.textContent = '';
    parts.forEach(function (p) {
      if (typeof p === 'string') { note.appendChild(document.createTextNode(p)); return; }
      var a = document.createElement('a');
      a.href = p.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = p.text;
      note.appendChild(a);
    });
    note.style.color = color;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var name = val('f-name');
    var phone = val('f-phone');

    if (!name || !phone) {
      say(['Add your name and phone number so we can call you back.'], '#9A4A2B');
      var focusEl = document.getElementById(name ? 'f-phone' : 'f-name');
      if (focusEl) { focusEl.focus(); }
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      say(['That phone number looks short. Add the full number, with the country code if you are outside India.'], '#9A4A2B');
      document.getElementById('f-phone').focus();
      return;
    }

    var data = {
      form: page, name: name, phone: phone, email: val('f-email'),
      interest: val('f-unit'), dates: val('f-dates'), message: val('f-msg'), website: trap.value
    };
    var desk = page === 'stays' ? 'stays' : page === 'estates' ? 'estates'
      : (/stay|manag/i.test(data.interest) ? 'stays' : 'estates');

    var lines = [subject + ' — aviraestates.com', 'Name: ' + name, 'Phone: ' + phone];
    if (data.email) { lines.push('Email: ' + data.email); }
    if (data.interest) { lines.push('Regarding: ' + data.interest); }
    if (data.dates) { lines.push('Dates: ' + data.dates); }
    if (data.message) { lines.push('Message: ' + data.message); }
    var wa = 'https://wa.me/' + DESKS[desk] + '?text=' + encodeURIComponent(lines.join('\n'));
    var first = name.split(/\s+/)[0];

    if (btn) { btn.disabled = true; }
    say(['Sending…'], '#5A6670');

    fetch(LEADS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) { throw new Error('not saved'); }
        form.reset();
        say(['Thanks, ' + first + '. We have your details and will call you back soon. In a hurry? ',
             { href: wa, text: 'Message us on WhatsApp' }, '.'], '#2F5C34');
      })
      .catch(function () {
        say(['That didn’t go through. ', { href: wa, text: 'Send it to us on WhatsApp instead' },
             ', or call ' + (desk === 'stays' ? '+91 82080 04187' : '+91 91563 56952') + '.'], '#9A4A2B');
      })
      .then(function () { if (btn) { btn.disabled = false; } });
  });
})();
