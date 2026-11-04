/* El Zorzal: lógica de la tienda (carta, pedido y envío por WhatsApp).
   La carta y los datos de contacto se editan en catalog.js; este archivo no hace falta tocarlo. */
(function () {
  'use strict';

  var CFG = window.ZORZAL || {};
  var WA = CFG.whatsapp || '';
  var WA_SHOW = CFG.whatsappShow || '';
  var IG = CFG.instagram || '';
  var LS_KEY = 'zorzal-cart-v1';
  var CATS = [
    { id: 'pastas', label: 'Pastas' },
    { id: 'donas', label: 'Donas' },
    { id: 'pizzetas', label: 'Pizzetas' },
    { id: 'otros', label: 'Otros' }
  ];
  var UNITS = { unidad: ['unidad', 'unidades'], docena: ['docena', 'docenas'] };

  /* dibujos de reserva para los productos que todavía no tienen foto */
  var ART = {
    pastas: '<svg viewBox="0 0 130 98" aria-hidden="true"><circle class="a1" cx="38" cy="52" r="24" opacity=".7"/><circle class="a1" cx="92" cy="52" r="24" opacity=".7"/><circle class="a1" cx="65" cy="46" r="30"/><circle class="st" cx="65" cy="46" r="30" stroke-dasharray="3.5 3.5"/><circle class="st" cx="65" cy="46" r="19"/><circle class="a2" cx="65" cy="46" r="7"/></svg>',
    donas: '<svg viewBox="0 0 130 98" aria-hidden="true"><circle class="a1" cx="65" cy="49" r="40"/><circle class="a2" cx="65" cy="46" r="34"/><circle fill="var(--tint-donas)" cx="65" cy="47" r="12"/><rect class="a4" x="34" y="34" width="12" height="4.5" rx="2.2" transform="rotate(-28 40 36)"/><rect class="a3" x="80" y="26" width="12" height="4.5" rx="2.2" transform="rotate(22 86 28)"/><rect class="a4" x="92" y="52" width="12" height="4.5" rx="2.2" transform="rotate(68 98 54)"/><rect class="a3" x="46" y="66" width="12" height="4.5" rx="2.2" transform="rotate(-52 52 68)"/><rect class="a4" x="74" y="68" width="12" height="4.5" rx="2.2" transform="rotate(32 80 70)"/></svg>',
    pizzetas: '<svg viewBox="0 0 130 98" aria-hidden="true"><circle class="a1" cx="65" cy="49" r="40"/><circle class="a2" cx="65" cy="49" r="33"/><circle class="a4" cx="50" cy="40" r="7"/><circle class="a4" cx="80" cy="56" r="8"/><circle class="a4" cx="58" cy="66" r="6"/><circle class="a3" cx="70" cy="36" r="4.5"/><circle class="a3" cx="46" cy="58" r="4.5"/><circle class="a3" cx="88" cy="40" r="4"/><circle class="a3" cx="68" cy="76" r="3.6"/></svg>',
    otros: '<svg viewBox="0 0 130 98" aria-hidden="true"><ellipse class="a1" cx="65" cy="58" rx="46" ry="26"/><ellipse class="a4" cx="65" cy="54" rx="36" ry="19"/><path class="a3" d="M65 52c-4-14 2-26 14-30 3 13-2 25-14 30z"/><path class="a2" d="M65 52c-12-3-22-12-22-24 12 0 21 9 22 24z"/></svg>'
  };

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function unitLabel(u, n) { return (UNITS[u] || UNITS.unidad)[n === 1 ? 0 : 1]; }
  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }

  /* ---------- estado ---------- */
  var products = (CFG.products || []).filter(function (p) { return p && p.id && p.name && !p.hidden; }).map(function (p) {
    var units = (p.units || []).filter(function (u) { return UNITS[u]; });
    return {
      id: p.id, name: p.name, desc: p.desc || '', cat: p.cat || 'otros',
      units: units.length ? units : ['unidad'], img: p.img || '', alt: p.alt || ''
    };
  });
  var sel = {};   // unidad y cantidad elegidas en cada tarjeta
  var cart = [];  // [{id, unit, qty}]
  try { cart = JSON.parse(localStorage.getItem(LS_KEY) || '[]') || []; } catch (e) { cart = []; }
  var filter = 'todos';

  function saveCart() { try { localStorage.setItem(LS_KEY, JSON.stringify(cart)); } catch (e) {} }
  function byId(id) { for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i]; return null; }
  function cartLines() {
    return cart.map(function (l) { return { l: l, p: byId(l.id) }; }).filter(function (x) { return x.p; });
  }

  /* ---------- datos de contacto en la página ---------- */
  $$('[data-wa-show]').forEach(function (el) { el.textContent = WA_SHOW; });
  $$('[data-ig]').forEach(function (el) {
    if (!IG) { el.hidden = true; return; }
    el.href = 'https://www.instagram.com/' + IG + '/';
    el.textContent = '@' + IG;
  });
  $('#cater-btn').setAttribute('href', waLink('Hola! Quisiera consultar por catering para una reunión, cumpleaños o evento.'));

  /* ---------- carta ---------- */
  function cardHTML(p) {
    var st = sel[p.id];
    if (!st) { st = sel[p.id] = { unit: p.units[0], qty: 1 }; }
    var unitCtl = p.units.length > 1
      ? '<div class="seg" role="group" aria-label="Vender por">' + p.units.map(function (u) {
          return '<button type="button" data-act="unit" data-unit="' + u + '" aria-pressed="' + (st.unit === u) + '">' + (u === 'unidad' ? 'Unidades' : 'Docenas') + '</button>';
        }).join('') + '</div>'
      : '<p class="only">Se vende por ' + (p.units[0] === 'docena' ? 'docena' : 'unidad') + '</p>';
    var cat = ART[p.cat] ? p.cat : 'otros';
    var media = p.img
      ? '<div class="photo art-' + cat + '"><img src="' + esc(p.img) + '" width="720" height="540" loading="lazy" decoding="async" alt="' + esc(p.alt || p.name) + '"></div>'
      : '<div class="art art-' + cat + '">' + ART[cat] + '</div>';
    return '<article class="card" data-id="' + esc(p.id) + '">' + media +
      '<div class="cbody"><h3>' + esc(p.name) + '</h3>' + (p.desc ? '<p class="desc">' + esc(p.desc) + '</p>' : '') + '<div class="spacer"></div>' +
      unitCtl +
      '<div class="buyrow"><div class="step" role="group" aria-label="Cantidad"><button type="button" data-act="dec" aria-label="Menos">−</button><output class="qv">' + st.qty + '</output><button type="button" data-act="inc" aria-label="Más">+</button></div>' +
      '<button type="button" class="btn" data-act="add">Agregar</button></div>' +
      '<p class="incart" data-incart="' + esc(p.id) + '"></p></div></article>';
  }
  function renderChips() {
    var present = CATS.filter(function (c) { return products.some(function (p) { return p.cat === c.id; }); });
    var box = $('#chips');
    if (present.length < 2) { box.innerHTML = ''; filter = 'todos'; return; }
    if (filter !== 'todos' && !present.some(function (c) { return c.id === filter; })) filter = 'todos';
    box.innerHTML = '<button type="button" class="chip" data-act="filter" data-f="todos" aria-pressed="' + (filter === 'todos') + '">Todos</button>' +
      present.map(function (c) {
        return '<button type="button" class="chip" data-act="filter" data-f="' + c.id + '" aria-pressed="' + (filter === c.id) + '">' + c.label + '</button>';
      }).join('');
  }
  function renderGrid() {
    var list = products.filter(function (p) { return filter === 'todos' || p.cat === filter; });
    var g = $('#grid');
    if (!list.length) {
      g.innerHTML = '<div class="empty"><b>Estamos preparando la carta</b>Escribinos por WhatsApp al ' + esc(WA_SHOW) + ' para consultar qué tenemos disponible.</div>';
      return;
    }
    g.innerHTML = list.map(cardHTML).join('');
    updateInCart();
  }
  function updateInCart() {
    $$('[data-incart]').forEach(function (node) {
      var id = node.getAttribute('data-incart');
      var parts = cart.filter(function (l) { return l.id === id; }).map(function (l) { return l.qty + ' ' + unitLabel(l.unit, l.qty); });
      node.textContent = parts.length ? 'En tu pedido: ' + parts.join(' y ') : '';
    });
  }

  /* ---------- pedido ---------- */
  function buildMessage() {
    var ls = cartLines().map(function (x) { return '• ' + x.l.qty + ' ' + unitLabel(x.l.unit, x.l.qty) + ' de ' + x.p.name; });
    var name = $('#f-name').value.trim(), note = $('#f-note').value.trim();
    var m = 'Hola! Quisiera consultar disponibilidad y precio de lo siguiente:\n\n' + ls.join('\n');
    if (note) m += '\n\nComentarios: ' + note;
    if (name) m += '\n\nNombre: ' + name;
    return m + '\n\n¡Gracias!';
  }
  function sheetOpen() { return $('#sheet').classList.contains('open'); }
  function renderCart() {
    var ls = cartLines();
    var n = ls.length;
    $('#cart-n').textContent = n;
    $('#mbar-t').textContent = n ? 'Ver mi pedido (' + n + (n === 1 ? ' producto' : ' productos') + ')' : 'Ver mi pedido';
    $('#mbar').classList.toggle('show', n > 0 && !sheetOpen());
    var box = $('#lines');
    if (!n) {
      box.innerHTML = '<li class="empty" style="grid-column:auto"><b>Tu pedido está vacío</b>Elegí productos del menú y agregalos.</li>';
      $('#fields').hidden = true;
    } else {
      $('#fields').hidden = false;
      box.innerHTML = ls.map(function (x, i) {
        return '<li class="line" data-i="' + i + '"><div class="nm">' + esc(x.p.name) + '<small>' + unitLabel(x.l.unit, 2).replace(/^./, function (c) { return c.toUpperCase(); }) + '</small></div>' +
          '<div class="step" role="group" aria-label="Cantidad"><button type="button" data-act="c-dec" aria-label="Menos">−</button><output>' + x.l.qty + '</output><button type="button" data-act="c-inc" aria-label="Más">+</button></div>' +
          '<button type="button" class="rm" data-act="c-rm">Quitar</button></li>';
      }).join('');
    }
    var msg = n ? buildMessage() : '';
    $('#f-prev').value = msg;
    var s = $('#send');
    s.setAttribute('href', n ? waLink(msg) : '#');
    s.setAttribute('aria-disabled', n ? 'false' : 'true');
    $('#copy-msg').disabled = !n;
    updateInCart();
  }
  function renderPreview() {
    var n = cartLines().length, msg = n ? buildMessage() : '';
    $('#f-prev').value = msg;
    $('#send').setAttribute('href', n ? waLink(msg) : '#');
  }

  var lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    $('#veil').hidden = false;
    var s = $('#sheet');
    s.classList.add('open');
    s.setAttribute('aria-hidden', 'false');
    $('#mbar').classList.remove('show');
    renderCart();
    setTimeout(function () { $('#sheet-x').focus(); }, 30);
  }
  function closeCart() {
    $('#veil').hidden = true;
    var s = $('#sheet');
    s.classList.remove('open');
    s.setAttribute('aria-hidden', 'true');
    renderCart();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var toastT;
  function toast(t) {
    var el = $('#toast');
    el.textContent = t;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }
  function addToCart(id) {
    var p = byId(id), st = sel[id];
    if (!p || !st) return;
    var found = null;
    cart.forEach(function (l) { if (l.id === id && l.unit === st.unit) found = l; });
    if (found) found.qty = Math.min(99, found.qty + st.qty); else cart.push({ id: id, unit: st.unit, qty: st.qty });
    saveCart();
    renderCart();
    toast('Agregado: ' + st.qty + ' ' + unitLabel(st.unit, st.qty) + ' de ' + p.name);
    st.qty = 1;
    var q = document.querySelector('.card[data-id="' + id + '"] .qv');
    if (q) q.textContent = '1';
  }
  function copyText(t, ok, fallbackEl) {
    function fb() {
      if (fallbackEl) { fallbackEl.focus(); if (fallbackEl.select) fallbackEl.select(); }
      toast('Seleccioná el texto y copialo');
    }
    try { navigator.clipboard.writeText(t).then(function () { toast(ok); }, fb); } catch (e) { fb(); }
  }

  /* ---------- eventos ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    var card = t.closest('.card'), id = card ? card.getAttribute('data-id') : null;
    if (act === 'open-cart') return openCart();
    if (act === 'close-cart') return closeCart();
    if (act === 'filter') { filter = t.getAttribute('data-f'); renderChips(); return renderGrid(); }
    if (act === 'unit') {
      sel[id].unit = t.getAttribute('data-unit');
      $$('.seg button', card).forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); });
      return;
    }
    if (act === 'dec' || act === 'inc') {
      var s = sel[id];
      s.qty = Math.max(1, Math.min(99, s.qty + (act === 'inc' ? 1 : -1)));
      card.querySelector('.qv').textContent = s.qty;
      return;
    }
    if (act === 'add') return addToCart(id);
    if (act === 'c-dec' || act === 'c-inc' || act === 'c-rm') {
      var ls = cartLines(), line = ls[+t.closest('.line').getAttribute('data-i')], l = line && line.l;
      if (!l) return;
      if (act === 'c-rm') cart.splice(cart.indexOf(l), 1);
      else l.qty = Math.max(1, Math.min(99, l.qty + (act === 'c-inc' ? 1 : -1)));
      cart = cart.filter(function (x) { return byId(x.id); });
      saveCart();
      return renderCart();
    }
    if (act === 'copy-msg') return copyText($('#f-prev').value, 'Mensaje copiado', $('#f-prev'));
    if (act === 'copy-wa') return copyText(WA_SHOW, 'Número copiado');
  });
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'f-name' || ev.target.id === 'f-note') renderPreview();
  });
  document.addEventListener('keydown', function (ev) {
    if (!sheetOpen()) return;
    if (ev.key === 'Escape') return closeCart();
    if (ev.key === 'Tab') {   // mantiene el foco dentro del panel mientras está abierto
      var f = $$('button:not([disabled]), a[href]:not([aria-disabled="true"]), input, textarea', $('#sheet')).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });

  /* ---------- inicio ---------- */
  cart = cart.filter(function (l) { return l && byId(l.id) && UNITS[l.unit] && l.qty > 0; });
  renderChips();
  renderGrid();
  renderCart();
})();
