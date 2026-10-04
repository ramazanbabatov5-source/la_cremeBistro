// ===================== МЕНЮ LA CRÈME =====================
// Здесь редактируются все позиции и цены. Сайт сам отрисует меню из этого списка.
// ВАЖНО: цены с пометкой "check: true" — примерные, их нужно сверить с реальным меню.
// Проверенные цены: кофе (капучино, флэт уайт, раф, американо) и витрина (250 / 330 ₽).
// Меню бистро целиком: https://foodeon.com/venue/la-creme-bistro-gznv

window.MENU_URL = 'https://foodeon.com/venue/la-creme-bistro-gznv';

window.MENU = [
  {
    id: 'desserts',
    title: 'Десерты',
    note: 'Пирожные и порционные десерты с витрины',
    items: [
      { id: 'd-tiramisu',  name: 'Тирамису',                 desc: 'Маскарпоне, савоярди, кофейная пропитка', price: 330 },
      { id: 'd-brulee',    name: 'Крем-брюле',               desc: 'Нежный ванильный крем с карамельной корочкой', price: 330, check: true },
      { id: 'd-brownie',   name: 'Брауни',                   desc: 'Плотный шоколадный, с ореховой крошкой', price: 250 },
      { id: 'd-pistachio', name: 'Пирожное фисташковое',     desc: 'Фисташковый крем и бисквит', price: 330, check: true },
      { id: 'd-almond',    name: 'Пирожное миндальное',      desc: 'Миндальный бисквит, лёгкий крем', price: 300, check: true },
      { id: 'd-kiev',      name: 'Киевский',                 desc: 'Воздушный безе с обжаренным фундуком', price: 300, check: true },
      { id: 'd-milk',      name: 'Птичье молоко',            desc: 'Суфле на сливочном креме в шоколаде', price: 300, check: true },
      { id: 'd-choux',     name: 'Шу',                       desc: 'Заварное пирожное с кремом', price: 250 },
      { id: 'd-black',     name: 'Чёрная любовь',            desc: 'Тёмный шоколад, глубокий вкус', price: 330, check: true },
      { id: 'd-eclair-c',  name: 'Эклер шоколадный',         desc: 'Заварное тесто, шоколадный крем', price: 250 },
      { id: 'd-eclair-b',  name: 'Эклер с ягодами',          desc: 'Крем и свежие ягоды', price: 280, check: true },
      { id: 'd-tart-berry',name: 'Тарталетка крем-чиз с ягодами', desc: 'Песочная корзинка, творожный крем', price: 280, check: true },
      { id: 'd-tart-cherry',name: 'Тарталетка с вишней',     desc: 'Вишня и заварной крем', price: 250, check: true },
      { id: 'd-jabot',     name: 'Тарталетка «Жабо»',        desc: 'Фирменная, с нежным кремом', price: 250, check: true }
    ]
  },
  {
    id: 'cakes',
    title: 'Торты',
    note: 'Целые торты из витрины. Под заказ — в разделе «Торты на заказ»',
    items: [
      { id: 'c-choc',      name: 'Шоколадное тирамису',      desc: 'Целый торт, ~1,5 кг', price: 2000 },
      { id: 'c-black',     name: 'Чёрная любовь',            desc: 'Целый торт, ~1,5 кг', price: 2000, check: true },
      { id: 'c-kiev',      name: 'Киевский',                 desc: 'Целый торт, ~1,5 кг', price: 1900, check: true },
      { id: 'c-raspberry', name: 'Малиновый рай',            desc: 'Целый торт с малиной', price: 2200, check: true },
      { id: 'c-banana',    name: 'Шоколадно-банановый',      desc: 'Целый торт, ~1,5 кг', price: 2000, check: true },
      { id: 'c-meringue',  name: 'Меренговый рулет',         desc: 'Хрустящее безе и нежный крем', price: 1500, check: true },
      { id: 'c-opera',     name: 'Новая опера',              desc: 'Кофейно-шоколадный, многослойный', price: 2100, check: true },
      { id: 'c-apple',     name: 'Яблочный пирог',           desc: 'Домашний, с корицей', price: 1200, check: true }
    ]
  },
  {
    id: 'bakery',
    title: 'Выпечка',
    note: 'Печём с 07:00 каждый день',
    items: [
      { id: 'b-cinnamon',  name: 'Булочка с корицей',        desc: 'Мягкая, с сливочной глазурью', price: 180, check: true },
      { id: 'b-poppy',     name: 'Булочка с маком',          desc: 'Классическая сдоба', price: 120, check: true },
      { id: 'b-buf',       name: 'Буф с клюквой',            desc: 'Слоёное тесто, ягодная начинка', price: 180, check: true },
      { id: 'b-muffin',    name: 'Маффин шоколадный',        desc: 'С шоколадной каплей внутри', price: 160, check: true },
      { id: 'b-nut-roll',  name: 'Ореховый рулет',           desc: 'Ломтик, на двоих', price: 200, check: true },
      { id: 'b-croissant', name: 'Круассан сливочный',       desc: 'Слоёный, ещё тёплый', price: 170, check: true }
    ]
  },
  {
    id: 'coffee',
    title: 'Кофе',
    note: 'Зерно обжаривается небольшими партиями',
    items: [
      { id: 'k-espresso',  name: 'Эспрессо',                 desc: '30 мл', price: 150, check: true },
      { id: 'k-americano', name: 'Американо',                desc: '200 мл', price: 200 },
      { id: 'k-cappuccino',name: 'Капучино',                 desc: 'Классический, 200 мл', price: 300 },
      { id: 'k-flat',      name: 'Флэт уайт',                desc: 'Двойной эспрессо, плотная молочная пена', price: 350 },
      { id: 'k-raf',       name: 'Раф классический',         desc: 'Сливки, ванильный сахар', price: 350 },
      { id: 'k-latte',     name: 'Латте',                    desc: 'Нежный, 300 мл', price: 320, check: true },
      { id: 'k-affogato',  name: 'Аффогато',                 desc: 'Эспрессо и шарик пломбира', price: 380, check: true }
    ]
  },
  {
    id: 'tea',
    title: 'Чай',
    note: 'Коллекция Palais des Thés',
    items: [
      { id: 't-black',     name: 'Чёрный чай',               desc: 'С бергамотом, листовой, чайник 400 мл', price: 350, check: true },
      { id: 't-green',     name: 'Зелёный чай',              desc: 'С яблоком и жасмином, чайник 400 мл', price: 350, check: true },
      { id: 't-lacreme',   name: 'Чай La Crème',             desc: 'Фирменный купаж, чайник 400 мл', price: 400, check: true },
      { id: 't-detox',     name: 'Детокс',                   desc: 'Травяной, чайник 400 мл', price: 350, check: true }
    ]
  },
  {
    id: 'bistro',
    title: 'Бистро',
    note: 'Завтраки, салаты и горячее — Акушинского, 180б',
    items: [
      { id: 'f-granola',   name: 'Йогурт с гранолой',        desc: 'Греческий йогурт, ягоды, мёд', price: 380, check: true },
      { id: 'f-roll',      name: 'Рулет с ягодным джемом',   desc: 'Тёплый, с творожным кремом', price: 320, check: true },
      { id: 'f-burrata',   name: 'Салат с бурратой',         desc: 'Авокадо, томаты, ореховая крошка', price: 790, check: true },
      { id: 'f-pan',       name: 'Курица в сливочном соусе', desc: 'Запечённая на сковороде, с лавашом', price: 650, check: true }
    ]
  }
];

// Адреса точек (для блока контактов и формы заказа)
window.BRANCHES = [
  { id: 'dzer', city: 'Махачкала', address: 'ул. Дзержинского, 12а', type: 'Кондитерская', photo: 'assets/shop-dzerzhinskogo.webp' },
  { id: 'yar',  city: 'Махачкала', address: 'ул. Ярагского, 94а',    type: 'Кондитерская', photo: 'assets/shop-yaragskogo.webp' },
  { id: 'aku',  city: 'Махачкала', address: 'ул. Акушинского, 180б', type: 'Бистро',       photo: 'assets/bistro-evening.webp' },
  { id: 'kasp', city: 'Каспийск',  address: 'ул. Халилова, 38',      type: 'Кондитерская', photo: 'assets/shop-kaspiysk.webp' }
];

window.PHONE_DISPLAY = '+7 (928) 505-44-22';
window.PHONE_TEL = '+79285054422';
window.WHATSAPP_NUMBER = '79285054422';
