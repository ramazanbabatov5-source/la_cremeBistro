// ===================== LA CRÈME APP =====================
(function () {
  'use strict';

  const MENU = window.MENU || [];
  const BRANCHES = window.BRANCHES || [];
  const WA = window.WHATSAPP_NUMBER || '79285054422';

  const CAKES = [
    { img: 'assets/cake-tall.webp',     name: 'Классика с кремовым кружевом', desc: 'Многоярусный, нежные кремовые гирлянды. Для больших торжеств.' },
    { img: 'assets/cake-leaves.webp',   name: 'Белые листья',                 desc: 'Каскад из сахарных листьев по всей высоте торта.' },
    { img: 'assets/cake-swans.webp',    name: 'Лебеди и малина',              desc: 'Три яруса, свежая малина и фигурки лебедей.' },
    { img: 'assets/cake-wafer.webp',    name: 'Облако',                       desc: 'Складки из вафельной бумаги и воздушный сахарный декор.' },
    { img: 'assets/cake-feathers.webp', name: 'Перья',                        desc: 'Высокий свадебный торт, весь в нежных лепестках-перьях.' },
    { img: 'assets/cake-pink.webp',     name: 'Розовый бант',                 desc: 'Для дня рождения: бант, роза и жемчужная нить.' }
  ];

  const state = { cart: [], cartOpen: false, activeModal: null, lastFocus: null, activeTab: MENU[0] ? MENU[0].id : null };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const money = (n) => n.toLocaleString('ru-RU') + ' ₽';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Корзина хранится в браузере ----------
  function loadCart() {
    try {
      const raw = localStorage.getItem('lacreme_cart');
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return;
      // восстанавливаем только то, что ещё есть в меню (цены берём актуальные)
      list.forEach((c) => {
        const item = findItem(c.id);
        if (item && c.qty > 0) state.cart.push({ id: item.id, name: item.name, price: item.price, qty: Math.min(c.qty, 99) });
      });
    } catch (e) { /* хранилище недоступно — не страшно */ }
  }
  function saveCart() {
    try { localStorage.setItem('lacreme_cart', JSON.stringify(state.cart.map(({ id, qty }) => ({ id, qty })))); } catch (e) {}
  }
  function findItem(id) {
    for (const cat of MENU) { const it = cat.items.find((i) => i.id === id); if (it) return it; }
    return null;
  }

  // ---------- Инициализация ----------
  function init() {
    loadCart();
    renderTabs();
    renderMenu(state.activeTab, false);
    renderCakes();
    renderPlaces();
    fillBranchSelect();
    initNav();
    initCursor();
    initReveal();
    initCart();
    initModals();
    initOrderForm();
    initCakeForm();
    initSmoothAnchors();
    initPhoneMask($('#customerPhone'));
    initPhoneMask($('#cakePhone'));
    updateCartUI(false);
  }

  // ---------- Навигация ----------
  function initNav() {
    const nav = $('#nav'), burger = $('#burger'), links = $('#navlinks');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const setOpen = (open) => {
      links.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };
    burger.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    $$('a', links).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });
  }

  // ---------- Курсор ----------
  function initCursor() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || reduceMotion) return;
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    if (!dot || !ring) return;
    document.body.classList.add('has-fine-pointer');
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    // делегирование: работает и для динамически созданных элементов
    const sel = 'a, button, select, label, .place, .cake-card';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(sel)) ring.classList.add('is-active'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(sel)) ring.classList.remove('is-active'); });
  }

  // ---------- Появление блоков ----------
  let revealObserver = null;
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('in-view'));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in-view'); revealObserver.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(observeReveal);
  }
  function observeReveal(el) {
    if (revealObserver) revealObserver.observe(el); else el.classList.add('in-view');
  }

  // ---------- Меню ----------
  function renderTabs() {
    const box = $('#menuTabs');
    box.innerHTML = MENU.map((c) => `<button class="tab" role="tab" data-tab="${c.id}" aria-selected="${c.id === state.activeTab}">${esc(c.title)}</button>`).join('');
    box.addEventListener('click', (e) => {
      const t = e.target.closest('.tab'); if (!t) return;
      state.activeTab = t.dataset.tab;
      $$('.tab', box).forEach((b) => b.setAttribute('aria-selected', String(b === t)));
      renderMenu(state.activeTab, true);
    });
  }

  function renderMenu(catId, animate) {
    const cat = MENU.find((c) => c.id === catId); if (!cat) return;
    const list = $('#menuList');
    $('#menuNote').textContent = cat.note || '';
    list.innerHTML = cat.items.map((it) => `
      <div class="menu-item">
        <div class="item-info">
          <span class="name">${esc(it.name)}</span>
          <span class="desc">${esc(it.desc || '')}</span>
        </div>
        <span class="item-price">${money(it.price)}</span>
        <button class="add-btn" data-add="${it.id}" aria-label="Добавить «${esc(it.name)}» в корзину">+</button>
      </div>`).join('');
    if (animate && !reduceMotion) { list.classList.remove('swap'); void list.offsetWidth; list.classList.add('swap'); }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const item = findItem(btn.dataset.add); if (!item) return;
    addToCart(item);
    btn.classList.add('added'); btn.textContent = '✓';
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = '+'; }, 1100);
  });

  // ---------- Торты ----------
  function renderCakes() {
    $('#cakesGrid').innerHTML = CAKES.map((c) => `
      <article class="cake-card reveal">
        <div class="cake-img"><img src="${c.img}" alt="${esc(c.name)}" loading="lazy"></div>
        <div class="cake-info">
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.desc)}</p>
          <button class="btn btn-ghost" data-cake-request="${esc(c.name)}">Хочу такой</button>
        </div>
      </article>`).join('');
    $$('#cakesGrid .reveal').forEach(observeReveal);
  }

  // ---------- Адреса ----------
  function mapLink(b) {
    return 'https://yandex.ru/maps/?text=' + encodeURIComponent(`${b.city}, ${b.address}, La Crème`);
  }
  function renderPlaces() {
    $('#placesGrid').innerHTML = BRANCHES.map((b) => `
      <article class="place reveal">
        <div class="place-photo"><img src="${b.photo}" alt="La Crème, ${esc(b.address)}" loading="lazy"></div>
        <div class="place-body">
          <span class="place-type">${esc(b.type)}</span>
          <span class="place-city">${esc(b.city)}</span>
          <span class="place-addr">${esc(b.address)}</span>
          <a class="place-link" href="${mapLink(b)}" target="_blank" rel="noopener">Показать на карте</a>
        </div>
      </article>`).join('');
    $$('#placesGrid .reveal').forEach(observeReveal);
  }
  function branchLabel(b) { return `${b.city}, ${b.address} (${b.type.toLowerCase()})`; }
  function fillBranchSelect() {
    $('#branch').innerHTML = '<option value="">Выберите адрес</option>' +
      BRANCHES.map((b) => `<option value="${b.id}">${esc(branchLabel(b))}</option>`).join('');
  }

  // ---------- Корзина ----------
  const cartCount = () => state.cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = () => state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  function initCart() {
    $('#cartBtn').addEventListener('click', () => toggleCart(true));
    $('#cartClose').addEventListener('click', () => toggleCart(false));
    $('#cartOverlay').addEventListener('click', () => toggleCart(false));
    $('#checkoutBtn').addEventListener('click', openOrderModal);

    // кнопки внутри корзины — делегирование
    $('#cartItems').addEventListener('click', (e) => {
      const t = e.target.closest('button[data-act]'); if (!t) return;
      const id = t.dataset.id;
      if (t.dataset.act === 'plus') changeQty(id, 1);
      if (t.dataset.act === 'minus') changeQty(id, -1);
      if (t.dataset.act === 'remove') removeFromCart(id);
    });
  }

  function toggleCart(open) {
    const panel = $('#cartPanel');
    if (open) state.lastFocus = document.activeElement;
    state.cartOpen = open;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    $('#cartOverlay').classList.toggle('open', open);
    syncScrollLock();
    if (open) setTimeout(() => $('#cartClose').focus(), 50);
    else if (state.lastFocus && !state.activeModal) state.lastFocus.focus?.();
  }

  function syncScrollLock() {
    document.body.style.overflow = (state.cartOpen || state.activeModal) ? 'hidden' : '';
  }

  function addToCart(item) {
    const ex = state.cart.find((i) => i.id === item.id);
    if (ex) ex.qty = Math.min(ex.qty + 1, 99);
    else state.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    updateCartUI(true);
    showToast(`«${item.name}» добавлено в корзину`);
  }
  function changeQty(id, d) {
    const it = state.cart.find((i) => i.id === id); if (!it) return;
    it.qty += d;
    if (it.qty <= 0) return removeFromCart(id);
    it.qty = Math.min(it.qty, 99);
    updateCartUI(false);
  }
  function removeFromCart(id) {
    state.cart = state.cart.filter((i) => i.id !== id);
    updateCartUI(false);
  }

  function updateCartUI(bump) {
    const countEl = $('#cartCount'), itemsEl = $('#cartItems'), footer = $('#cartFooter');
    countEl.textContent = cartCount();
    if (bump) { countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }
    saveCart();

    if (!state.cart.length) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <p>Корзина пуста</p>
          <span>Добавьте что-нибудь вкусное из меню</span>
        </div>`;
      footer.hidden = true;
      return;
    }
    itemsEl.innerHTML = state.cart.map((i) => `
      <div class="cart-product">
        <div class="cart-product-info">
          <div class="cart-product-name">${esc(i.name)}</div>
          <div class="cart-product-price">${money(i.price)}</div>
        </div>
        <button class="cart-product-remove" data-act="remove" data-id="${i.id}" aria-label="Удалить «${esc(i.name)}»">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
        <div class="cart-product-qty">
          <button class="qty-btn" data-act="minus" data-id="${i.id}" aria-label="Меньше">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" data-act="plus" data-id="${i.id}" aria-label="Больше">+</button>
        </div>
        <span class="cart-line-sum">${money(i.price * i.qty)}</span>
      </div>`).join('');
    footer.hidden = false;
    $('#cartTotal').textContent = money(cartTotal());
  }

  // ---------- Модальные окна ----------
  function initModals() {
    $('#modalOverlay').addEventListener('click', closeModal);
    $$('[data-close-modal]').forEach((b) => b.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.activeModal) closeModal();
        else if (state.cartOpen) toggleCart(false);
      }
      if (e.key === 'Tab' && state.activeModal) trapFocus(e);
    });
    // кнопки «Хочу такой» / «Заказать свой торт»
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cake-request]'); if (!b) return;
      openCakeModal(b.dataset.cakeRequest);
    });
  }

  function trapFocus(e) {
    const m = $('#' + state.activeModal);
    const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea', m).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openModal(id) {
    state.lastFocus = document.activeElement;
    state.activeModal = id;
    $('#toast').classList.remove('show');
    const m = $('#' + id);
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    $('#modalOverlay').classList.add('open');
    syncScrollLock();
    setTimeout(() => { const f = $('input:not([type=radio]), select, textarea, .btn', m); f && f.focus({ preventScroll: true }); }, 120);
  }
  function closeModal() {
    if (!state.activeModal) return;
    const m = $('#' + state.activeModal);
    m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
    $('#modalOverlay').classList.remove('open');
    state.activeModal = null;
    syncScrollLock();
    state.lastFocus && state.lastFocus.focus && state.lastFocus.focus({ preventScroll: true });
  }

  // ---------- Помощники форм ----------
  function initPhoneMask(input) {
    if (!input) return;
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');
      if (!d) { input.value = ''; return; }
      if (d[0] === '7' || d[0] === '8') d = d.slice(1);
      d = d.slice(0, 10);
      let out = '+7';
      if (d.length) out += ' (' + d.slice(0, 3);
      if (d.length >= 3) out += ')';
      if (d.length > 3) out += ' ' + d.slice(3, 6);
      if (d.length > 6) out += '-' + d.slice(6, 8);
      if (d.length > 8) out += '-' + d.slice(8, 10);
      input.value = out;
    });
  }
  const phoneDigits = (v) => v.replace(/\D/g, '').replace(/^[78]/, '');

  function setError(form, name, msg) {
    const p = $(`[data-err="${name}"]`, form); if (!p) return;
    p.textContent = msg || '';
    const field = p.closest('.field'); if (field) field.classList.toggle('invalid', !!msg);
  }
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const fmtDate = (s) => { const [y, m, d] = s.split('-'); return `${d}.${m}.${y}`; };

  function openWhatsApp(text) {
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    return url;
  }

  // ---------- Оформление заказа ----------
  function openOrderModal() {
    if (!state.cart.length) return;
    toggleCart(false);
    const form = $('#orderForm');
    $('#orderDone').hidden = true; form.hidden = false;

    $('#orderSummaryItems').innerHTML = state.cart.map((i) =>
      `<div class="order-item"><span>${esc(i.name)} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join('');
    $('#orderTotal').textContent = money(cartTotal());

    const date = $('#date'); date.min = todayStr(); if (!date.value) date.value = todayStr();
    setTimeout(() => openModal('orderModal'), 200);
  }

  function initOrderForm() {
    const form = $('#orderForm');
    const addrField = $('#addressField'), branchLabelEl = $('#branchLabel');

    const syncMethod = () => {
      const delivery = form.elements.method.value === 'delivery';
      addrField.hidden = !delivery;
      branchLabelEl.textContent = delivery ? 'Из какой точки привезти' : 'Где заберёте';
      $('#address').required = delivery;
    };
    $$('input[name=method]', form).forEach((r) => r.addEventListener('change', syncMethod));
    syncMethod();

    // проверка при уходе с поля, ошибка пропадает сразу при правке
    const validators = {
      branch: () => $('#branch').value ? '' : 'Выберите адрес',
      address: () => (form.elements.method.value === 'delivery' && !$('#address').value.trim()) ? 'Укажите адрес доставки' : '',
      date: () => {
        const v = $('#date').value;
        if (!v) return 'Укажите дату';
        if (v < todayStr()) return 'Эта дата уже прошла';
        return '';
      },
      time: () => {
        const v = $('#time').value;
        if (!v) return 'Укажите время';
        if ($('#date').value === todayStr()) {
          const n = new Date(); if (v < `${pad(n.getHours())}:${pad(n.getMinutes())}`) return 'Это время уже прошло';
        }
        return '';
      },
      name: () => $('#customerName').value.trim().length >= 2 ? '' : 'Как к вам обращаться?',
      phone: () => phoneDigits($('#customerPhone').value).length === 10 ? '' : 'Введите номер полностью'
    };
    const ids = { branch: '#branch', address: '#address', date: '#date', time: '#time', name: '#customerName', phone: '#customerPhone' };
    Object.keys(ids).forEach((k) => {
      const el = $(ids[k]);
      el.addEventListener('blur', () => setError(form, k, validators[k]()));
      const clear = () => { if ($(`[data-err="${k}"]`, form).textContent) setError(form, k, validators[k]()); };
      el.addEventListener('input', clear); el.addEventListener('change', clear);
    });
    $('#date').addEventListener('change', () => { if ($('#time').value) setError(form, 'time', validators.time()); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.cart.length) return;
      let firstBad = null;
      Object.keys(validators).forEach((k) => {
        const msg = validators[k](); setError(form, k, msg);
        if (msg && !firstBad) firstBad = $(ids[k]);
      });
      if (firstBad) { firstBad.focus(); return; }

      const branch = BRANCHES.find((b) => b.id === $('#branch').value);
      const delivery = form.elements.method.value === 'delivery';
      const lines = state.cart.map((i) => `• ${i.name} × ${i.qty} — ${money(i.price * i.qty)}`).join('\n');
      const comment = $('#customerComment').value.trim();
      const text =
`Здравствуйте! Заказ с сайта La Crème

${lines}

Итого: ${money(cartTotal())}

Получение: ${delivery ? 'доставка' : 'самовывоз'}
${delivery ? 'Из точки' : 'Точка'}: ${branch.city}, ${branch.address}
${delivery ? 'Адрес доставки: ' + $('#address').value.trim() + '\n' : ''}Дата и время: ${fmtDate($('#date').value)}, ${$('#time').value}
Имя: ${$('#customerName').value.trim()}
Телефон: ${$('#customerPhone').value}${comment ? '\nКомментарий: ' + comment : ''}`;

      const url = openWhatsApp(text);
      $('#doneWa').href = url;
      $('#doneCopy').onclick = () => copyText(text);

      form.hidden = true; $('#orderDone').hidden = false;
      state.cart = []; updateCartUI(false);
      form.reset(); syncMethod();
    });
  }

  function copyText(text) {
    const done = () => showToast('Текст заказа скопирован');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => showToast('Не удалось скопировать'));
    } else {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { showToast('Не удалось скопировать'); }
      ta.remove();
    }
  }

  // ---------- Заявка на торт ----------
  function openCakeModal(cakeName) {
    const form = $('#cakeForm');
    $('#cakeDone').hidden = true; form.hidden = false;
    $('#cakePick').innerHTML = cakeName === 'Свой дизайн'
      ? '<b>Свой дизайн</b><br>Расскажите, какой торт вы хотите.'
      : `Вам понравился торт <b>«${esc(cakeName)}»</b>. Сделаем похожий или изменим под ваш повод.`;
    form.dataset.cake = cakeName;
    const d = $('#cakeDate'); d.min = todayStr();
    openModal('cakeModal');
  }

  function initCakeForm() {
    const form = $('#cakeForm');
    const validators = {
      date: () => { const v = $('#cakeDate').value; return !v ? 'Укажите дату' : (v < todayStr() ? 'Эта дата уже прошла' : ''); },
      guests: () => { const v = parseInt($('#cakeGuests').value, 10); return v >= 1 ? '' : 'Сколько человек ожидается?'; },
      name: () => $('#cakeName').value.trim().length >= 2 ? '' : 'Как к вам обращаться?',
      phone: () => phoneDigits($('#cakePhone').value).length === 10 ? '' : 'Введите номер полностью'
    };
    const ids = { date: '#cakeDate', guests: '#cakeGuests', name: '#cakeName', phone: '#cakePhone' };
    Object.keys(ids).forEach((k) => {
      const el = $(ids[k]);
      el.addEventListener('blur', () => setError(form, k, validators[k]()));
      const clear = () => { if ($(`[data-err="${k}"]`, form).textContent) setError(form, k, validators[k]()); };
      el.addEventListener('input', clear); el.addEventListener('change', clear);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstBad = null;
      Object.keys(validators).forEach((k) => {
        const msg = validators[k](); setError(form, k, msg);
        if (msg && !firstBad) firstBad = $(ids[k]);
      });
      if (firstBad) { firstBad.focus(); return; }

      const comment = $('#cakeComment').value.trim();
      const text =
`Здравствуйте! Хочу заказать торт (заявка с сайта La Crème)

Дизайн: ${form.dataset.cake || 'свой'}
Повод: ${$('#cakeEvent').value}
Дата торжества: ${fmtDate($('#cakeDate').value)}
Гостей: ${$('#cakeGuests').value}
Имя: ${$('#cakeName').value.trim()}
Телефон: ${$('#cakePhone').value}${comment ? '\nПожелания: ' + comment : ''}`;

      $('#cakeWa').href = openWhatsApp(text);
      form.hidden = true; $('#cakeDone').hidden = false;
      form.reset();
    });
  }

  // ---------- Уведомления ----------
  let toastTimer = null;
  function showToast(msg) {
    const t = $('#toast'); $('#toastMessage').textContent = msg;
    t.classList.add('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ---------- Плавные якоря ----------
  function initSmoothAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const href = a.getAttribute('href'); if (href === '#') return;
      const target = $(href); if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
