/* Avira — shared behaviour: floor-plan tabs and the WhatsApp enquiry hand-off. */
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

  /* ---- Enquiry form hands off to WhatsApp ---- */
  var form = document.getElementById('enquiry');
  if (!form) { return; }
  var note = document.getElementById('f-note');
  var subject = form.getAttribute('data-subject') || 'Enquiry';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var name = val('f-name');
    var phone = val('f-phone');

    if (!name || !phone) {
      note.textContent = 'Add your name and phone number so we can call you back.';
      note.style.color = '#9A4A2B';
      var focusEl = document.getElementById(name ? 'f-phone' : 'f-name');
      if (focusEl) { focusEl.focus(); }
      return;
    }

    var lines = [subject + ' — aviraestates.com', 'Name: ' + name, 'Phone: ' + phone];
    if (val('f-email')) { lines.push('Email: ' + val('f-email')); }
    if (val('f-unit')) { lines.push('Regarding: ' + val('f-unit')); }
    if (val('f-dates')) { lines.push('Dates: ' + val('f-dates')); }
    if (val('f-msg')) { lines.push('Message: ' + val('f-msg')); }

    window.open('https://wa.me/919156356952?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    note.textContent = 'WhatsApp opened — press send to reach us.';
    note.style.color = '#2F5C34';
  });
})();
