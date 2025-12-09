globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead, o as renderScript } from '../chunks/astro/server_DIHz_uPh.mjs';
import { c as cart, a as cartIsEmpty, b as cartItemsCount, d as cartTotal, $ as $$Layout, H as Header, F as Footer } from '../chunks/Footer_BPJeEWO3.mjs';
import { a as createComponent, m as mergeProps, s as ssr, e as escape, b as ssrHydrationKey, F as For, d as ssrAttribute, S as Show } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { f as formatPrice } from '../chunks/utils_Deu6xdoM.mjs';
import { I as Icon_default, s as shopping_cart_default } from '../chunks/x_CSnmG0sU.mjs';
import { t as trash_2_default } from '../chunks/trash-2_CXddSc6f.mjs';

var iconNode$2 = [["path", {
  d: "M5 12h14",
  key: "1ays0h"
}]];
var Minus = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Minus",
  iconNode: iconNode$2
}));
var minus_default = Minus;

var iconNode$1 = [["path", {
  d: "M5 12h14",
  key: "1ays0h"
}], ["path", {
  d: "M12 5v14",
  key: "s699le"
}]];
var Plus = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Plus",
  iconNode: iconNode$1
}));
var plus_default = Plus;

var iconNode = [["path", {
  d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
  key: "hou9p0"
}], ["path", {
  d: "M3 6h18",
  key: "d0wm0j"
}], ["path", {
  d: "M16 10a4 4 0 0 1-8 0",
  key: "1ltviw"
}]];
var ShoppingBag = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "ShoppingBag",
  iconNode
}));
var shopping_bag_default = ShoppingBag;

var _tmpl$$1 = ["<div", ' class="space-y-4">', "</div>"], _tmpl$2$1 = ["<div", ' class="cart-items-wrapper">', "</div>"], _tmpl$3$1 = ["<div", ' class="bg-white rounded-xl shadow-card p-12 text-center"><!--$-->', '<!--/--><h3 class="text-xl font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h3><p class="text-gray-600 mb-6">Adicione produtos ao seu carrinho para continuar</p><a href="/loja" class="btn-primary inline-flex">Ir para a Loja</a></div>'], _tmpl$4$1 = ["<p", ' class="text-sm text-gray-600 mt-1">Cor: <span class="font-medium">', "</span></p>"], _tmpl$5$1 = ["<div", ' class="bg-white rounded-xl shadow-card p-4 md:p-6"><div class="flex gap-4"><a href="', '" class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"><img', ' class="w-full h-full object-cover"></a><div class="flex-1 min-w-0"><div class="flex items-start justify-between gap-4 mb-2"><div class="flex-1 min-w-0"><a href="', '" class="font-semibold text-gray-900 hover:text-primary-500 transition-colors line-clamp-2">', "</a><!--$-->", '<!--/--></div><button class="hidden md:flex p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Remover item">', '</button></div><div class="flex items-center justify-between gap-4 mt-4"><div class="flex items-center gap-2"><button class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Diminuir quantidade">', '</button><input type="number" min="1"', ' class="w-16 text-center border border-gray-300 rounded-lg py-1 font-semibold text-sm"><button class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Aumentar quantidade">', '</button></div><div class="text-right"><div class="text-sm text-gray-600"><!--$-->', "<!--/--> × <!--$-->", '<!--/--></div><div class="font-bold text-gray-900">', '</div></div></div><button class="md:hidden mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><!--$-->', "<!--/-->Remover</button></div></div></div>"];
function CartItems() {
  return ssr(_tmpl$2$1, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return !cartIsEmpty();
    },
    get fallback() {
      return ssr(_tmpl$3$1, ssrHydrationKey(), escape(createComponent(shopping_bag_default, {
        size: 64,
        "class": "mx-auto text-gray-300 mb-4"
      })));
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return cart.items;
        },
        children: (item) => ssr(_tmpl$5$1, ssrHydrationKey(), `/produto/${escape(item.product_id, true)}`, ssrAttribute("src", escape(item.product_image, true) || "https://placehold.co/200x200/f3f4f6/9ca3af?text=Sem+Imagem", false) + ssrAttribute("alt", escape(item.product_name, true), false), `/produto/${escape(item.product_id, true)}`, escape(item.product_name), escape(createComponent(Show, {
          get when() {
            return item.variation_color;
          },
          get children() {
            return ssr(_tmpl$4$1, ssrHydrationKey(), escape(item.variation_color));
          }
        })), escape(createComponent(trash_2_default, {
          size: 20
        })), escape(createComponent(minus_default, {
          size: 16
        })), ssrAttribute("value", escape(item.quantity, true), false), escape(createComponent(plus_default, {
          size: 16
        })), escape(formatPrice(item.unit_price)), escape(item.quantity), escape(formatPrice(item.unit_price * item.quantity)), escape(createComponent(trash_2_default, {
          size: 16
        })))
      })));
    }
  })));
}

var _tmpl$ = ["<div", ' class="space-y-3 mb-6"><div class="flex items-center justify-between text-gray-600"><span>Itens (<!--$-->', "<!--/-->)</span><span>", '</span></div><div class="border-t border-gray-200"></div><div class="flex items-center justify-between text-lg font-bold text-gray-900"><span>Total</span><span>', "</span></div></div>"], _tmpl$2 = ["<a", ' href="/checkout" class="w-full btn-primary text-center text-lg mb-4"><!--$-->', "<!--/-->Finalizar Pedido</a>"], _tmpl$3 = ["<div", ' class="text-sm text-gray-600 space-y-2"><p class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><span>Produtos de alta qualidade</span></p><p class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><span>Entrega para todo o Brasil</span></p><p class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><span>Atendimento personalizado</span></p></div>'], _tmpl$4 = ["<p", ' class="text-center text-gray-600 py-8">Adicione produtos ao carrinho para ver o resumo</p>'], _tmpl$5 = ["<div", ' class="cart-summary-wrapper sticky top-24"><div class="bg-white rounded-xl shadow-card p-6"><h2 class="text-xl font-display font-bold text-gray-900 mb-4">Resumo do Pedido</h2><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"];
function CartSummary() {
  return ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return !cartIsEmpty();
    },
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey(), escape(cartItemsCount()), escape(formatPrice(cartTotal())), escape(formatPrice(cartTotal()))), ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(shopping_cart_default, {
        size: 24
      }))), ssr(_tmpl$3, ssrHydrationKey())];
    }
  })), escape(createComponent(Show, {
    get when() {
      return cartIsEmpty();
    },
    get children() {
      return ssr(_tmpl$4, ssrHydrationKey());
    }
  })));
}

const $$Carrinho = createComponent$1(($$result, $$props, $$slots) => {
  const title = "Carrinho de Compras - Rocha Brindes";
  const description = "Revise seus produtos e finalize seu pedido de brindes personalizados.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="flex-1 py-8 md:py-12"> <div class="container mx-auto px-4"> <!-- Page Header --> <div class="mb-8"> <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
Carrinho de Compras
</h1> <p class="text-gray-600">
Revise seus produtos antes de finalizar o pedido
</p> </div> <!-- Cart Content --> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Cart Items --> <div class="lg:col-span-2"> ${renderComponent($$result2, "CartItems", CartItems, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/CartItems", "client:component-export": "default" })} </div> <!-- Cart Summary --> <div class="lg:col-span-1"> ${renderComponent($$result2, "CartSummary", CartSummary, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/CartSummary", "client:component-export": "default" })} </div> </div> <!-- Continue Shopping --> <div class="mt-8 text-center"> <a href="/loja" class="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"> <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Continuar Comprando
</a> </div> </div> </main> ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Footer", "client:component-export": "default" })} ${renderScript($$result2, "/home/user/rocha-brindes-atualizado/src/pages/carrinho.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/carrinho.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/carrinho.astro";
const $$url = "/carrinho";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Carrinho,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
