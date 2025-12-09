globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, h as addAttribute, l as renderHead, n as renderSlot, o as renderScript, r as renderTemplate } from './astro/server_DIHz_uPh.mjs';
/* empty css                            */
import { a as createComponent, m as mergeProps, s as ssr, e as escape, b as ssrHydrationKey, c as createSignal, S as Show } from './_@astro-renderers_C0wH7-Ml.mjs';
import { g as getFromStorage } from './utils_Deu6xdoM.mjs';
import { I as Icon_default, m as menu_default, x as x_default, s as shopping_cart_default } from './x_CSnmG0sU.mjs';

var iconNode$4 = [["path", {
  d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  key: "1jg4f8"
}]];
var Facebook = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Facebook",
  iconNode: iconNode$4
}));
var facebook_default = Facebook;

var iconNode$3 = [["rect", {
  width: "20",
  height: "20",
  x: "2",
  y: "2",
  rx: "5",
  ry: "5",
  key: "2e1cvw"
}], ["path", {
  d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
  key: "9exkf1"
}], ["line", {
  x1: "17.5",
  x2: "17.51",
  y1: "6.5",
  y2: "6.5",
  key: "r4j83e"
}]];
var Instagram = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Instagram",
  iconNode: iconNode$3
}));
var instagram_default = Instagram;

var iconNode$2 = [["rect", {
  width: "20",
  height: "16",
  x: "2",
  y: "4",
  rx: "2",
  key: "18n3k1"
}], ["path", {
  d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
  key: "1ocrg3"
}]];
var Mail = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Mail",
  iconNode: iconNode$2
}));
var mail_default = Mail;

var iconNode$1 = [["path", {
  d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
  key: "1r0f0z"
}], ["circle", {
  cx: "12",
  cy: "10",
  r: "3",
  key: "ilqhr7"
}]];
var MapPin = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "MapPin",
  iconNode: iconNode$1
}));
var map_pin_default = MapPin;

var iconNode = [["path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  key: "foiqr5"
}]];
var Phone = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Phone",
  iconNode
}));
var phone_default = Phone;

const $$Astro = createAstro("https://rochabrindes.com");
const $$Layout = createComponent$1(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Rocha Brindes - Brindes Personalizados de Alta Qualidade",
    description = "Especialistas em brindes personalizados para empresas e eventos. Qualidade, pre\xE7o justo e entrega r\xE1pida.",
    image = "/og-image.jpg",
    noIndex = false
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate`<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="canonical"${addAttribute(canonicalURL, "href")}>${noIndex && renderTemplate`<meta name="robots" content="noindex,nofollow">`}<!-- Preconnect --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Fonts --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"><!-- SEO --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="keywords" content="brindes personalizados, brindes corporativos, brindes para empresas, brindes promocionais, rocha brindes"><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro2.site), "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image, Astro2.site), "content")}><!-- Theme Color --><meta name="theme-color" content="#F97316">${renderHead()}</head> <body class="min-h-screen flex flex-col bg-white"> ${renderSlot($$result, $$slots["default"])} <!-- GSAP --> ${renderScript($$result, "/home/user/rocha-brindes-atualizado/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "/home/user/rocha-brindes-atualizado/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts")} </body> </html>`;
}, "/home/user/rocha-brindes-atualizado/src/layouts/Layout.astro", void 0);

function isWrappable(obj) {
  return obj != null && typeof obj === "object" && (Object.getPrototypeOf(obj) === Object.prototype || Array.isArray(obj));
}
function setProperty(state, property, value, force) {
  if (state[property] === value) return;
  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
}
function mergeStoreNode(state, value, force) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
      len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
    next = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
      isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    next = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(next, traversed);
    if (value === next) return;
  }
  if (part === undefined && value == undefined) return;
  if (part === undefined || isWrappable(next) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(next, value);
  } else setProperty(current, part, value);
}
function createStore(state) {
  const isArray = Array.isArray(state);
  function setStore(...args) {
    isArray && args.length === 1 ? updateArray(state, args[0]) : updatePath(state, args);
  }
  return [state, setStore];
}

const CART_STORAGE_KEY = "rocha-brindes-cart";
const initialCart = {
  items: [],
  total_items: 0,
  total_amount: 0
};
const [cart, setCart] = createStore(initialCart);
const cartIsEmpty = () => cart.items.length === 0;
const cartItemsCount = () => cart.total_items;
const cartTotal = () => cart.total_amount;
function recalculateTotals() {
  const total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total_amount = cart.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  setCart({
    total_items,
    total_amount
  });
}
function loadCartFromStorage() {
  if (typeof window === "undefined") return;
  const savedCart = getFromStorage(CART_STORAGE_KEY, initialCart);
  if (savedCart && savedCart.items) {
    setCart(savedCart);
    recalculateTotals();
  }
}
if (typeof window !== "undefined") {
  loadCartFromStorage();
}

var _tmpl$$1 = ["<span", ' class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">', "</span>"], _tmpl$2 = ["<nav", ' class="md:hidden py-4 space-y-2 border-t animate-slide-in-up"><a href="/" class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">Início</a><a href="/loja" class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">Loja</a><a href="/sobre" class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">Sobre</a><a href="/contato" class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">Contato</a></nav>'], _tmpl$3 = ["<header", ' class="sticky top-0 z-50 bg-white shadow-sm"><div class="container mx-auto px-4"><div class="flex items-center justify-between h-16 md:h-20"><a href="/" class="flex items-center space-x-2"><div class="text-2xl md:text-3xl font-display font-bold text-gradient">Rocha Brindes</div></a><nav class="hidden md:flex items-center space-x-8"><a href="/" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">Início</a><a href="/loja" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">Loja</a><a href="/sobre" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">Sobre</a><a href="/contato" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">Contato</a></nav><div class="flex items-center space-x-4"><a href="/carrinho" class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Carrinho"><!--$-->', "<!--/--><!--$-->", '<!--/--></a><button class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Menu">', "</button></div></div><!--$-->", "<!--/--></div></header>"];
function Header() {
  const [menuOpen] = createSignal(false);
  return ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(shopping_cart_default, {
    "class": "w-6 h-6 text-gray-700"
  })), escape(createComponent(Show, {
    get when() {
      return cartItemsCount() > 0;
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), escape(cartItemsCount()));
    }
  })), escape(createComponent(Show, {
    get when() {
      return !menuOpen();
    },
    get fallback() {
      return createComponent(x_default, {
        "class": "w-6 h-6"
      });
    },
    get children() {
      return createComponent(menu_default, {
        "class": "w-6 h-6"
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return menuOpen();
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey());
    }
  })));
}

var _tmpl$ = ["<footer", ' class="bg-gray-900 text-gray-300 mt-auto"><div class="container mx-auto px-4 py-12"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div><h3 class="text-white font-display font-bold text-xl mb-4">Rocha Brindes</h3><p class="text-sm leading-relaxed mb-4">Especialistas em brindes personalizados de alta qualidade para empresas e eventos.</p><div class="flex space-x-3"><a href="https://www.instagram.com/rochabrindesoficial" target="_blank" rel="noopener" class="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">', '</a><a href="https://www.facebook.com/profile.php?id=61576684446307" target="_blank" rel="noopener" class="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">', '</a></div></div><div><h3 class="text-white font-semibold text-lg mb-4">Links Rápidos</h3><ul class="space-y-2"><li><a href="/" class="hover:text-primary-500 transition-colors">Início</a></li><li><a href="/loja" class="hover:text-primary-500 transition-colors">Loja</a></li><li><a href="/sobre" class="hover:text-primary-500 transition-colors">Sobre Nós</a></li><li><a href="/contato" class="hover:text-primary-500 transition-colors">Contato</a></li></ul></div><div><h3 class="text-white font-semibold text-lg mb-4">Contato</h3><ul class="space-y-3 text-sm"><li class="flex items-start space-x-2"><!--$-->', '<!--/--><span>(96) 8124-7830</span></li><li class="flex items-start space-x-2"><!--$-->', '<!--/--><span>rochabrindes29@gmail.com</span></li><li class="flex items-start space-x-2"><!--$-->', '<!--/--><span>Macapá - AP</span></li></ul></div></div><div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm"><p>&copy; <!--$-->', "<!--/--> Rocha Brindes. Todos os direitos reservados.</p></div></div></footer>"];
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(instagram_default, {
    "class": "w-5 h-5"
  })), escape(createComponent(facebook_default, {
    "class": "w-5 h-5"
  })), escape(createComponent(phone_default, {
    "class": "w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
  })), escape(createComponent(mail_default, {
    "class": "w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
  })), escape(createComponent(map_pin_default, {
    "class": "w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
  })), escape(year));
}

export { $$Layout as $, Footer as F, Header as H, cartIsEmpty as a, cartItemsCount as b, cart as c, cartTotal as d, mail_default as e, map_pin_default as m, phone_default as p };
