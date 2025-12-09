globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead, o as renderScript } from '../chunks/astro/server_DIHz_uPh.mjs';
import { d as cartTotal, b as cartItemsCount, c as cart, m as map_pin_default, p as phone_default, e as mail_default, $ as $$Layout, H as Header, F as Footer } from '../chunks/Footer_BPJeEWO3.mjs';
import { a as createComponent, m as mergeProps, s as ssr, e as escape, b as ssrHydrationKey, d as ssrAttribute, S as Show, F as For, c as createSignal } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { f as formatPrice } from '../chunks/utils_Deu6xdoM.mjs';
import { m as message_circle_default } from '../chunks/message-circle_DA_Ewnke.mjs';
import { I as Icon_default } from '../chunks/x_CSnmG0sU.mjs';

var iconNode = [["path", {
  d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
  key: "975kel"
}], ["circle", {
  cx: "12",
  cy: "7",
  r: "4",
  key: "17ys0d"
}]];
var User = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "User",
  iconNode
}));
var user_default = User;

var _tmpl$ = ["<p", ' class="text-sm text-red-500 mt-1">', "</p>"], _tmpl$2 = ["<div", ' class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2"><div class="checkout-form-wrapper bg-white rounded-xl shadow-card p-6 md:p-8"><h2 class="text-2xl font-display font-bold text-gray-900 mb-6">Informações de Contato</h2><form class="space-y-6"><div><label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label><div class="relative"><input type="text" id="name"', ' class="', '" placeholder="João Silva" required><!--$-->', "<!--/--></div><!--$-->", '<!--/--></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label><div class="relative"><input type="email" id="email"', ' class="', '" placeholder="joao@email.com" required><!--$-->', "<!--/--></div><!--$-->", '<!--/--></div><div><label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp *</label><div class="relative"><input type="tel" id="phone"', ' class="', '" placeholder="(11) 98765-4321" required><!--$-->', "<!--/--></div><!--$-->", '<!--/--></div></div><div><label for="address" class="block text-sm font-medium text-gray-700 mb-2">Endereço Completo *</label><div class="relative"><input type="text" id="address"', ' class="', '" placeholder="Rua, número, complemento" required><!--$-->', "<!--/--></div><!--$-->", '<!--/--></div><div class="grid grid-cols-2 md:grid-cols-3 gap-4"><div class="col-span-2 md:col-span-1"><label for="city" class="block text-sm font-medium text-gray-700 mb-2">Cidade *</label><input type="text" id="city"', ' class="', '" placeholder="São Paulo" required><!--$-->', '<!--/--></div><div><label for="state" class="block text-sm font-medium text-gray-700 mb-2">Estado *</label><input type="text" id="state"', ' class="', '" placeholder="SP" maxlength="2" required><!--$-->', '<!--/--></div><div><label for="zip" class="block text-sm font-medium text-gray-700 mb-2">CEP *</label><input type="text" id="zip"', ' class="', '" placeholder="00000-000" required><!--$-->', '<!--/--></div></div><div><label for="notes" class="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label><textarea id="notes"', ' rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Informações adicionais sobre o pedido..."></textarea></div><button type="submit"', ' class="', '">', '</button><p class="text-sm text-gray-600 text-center">Ao finalizar, você será redirecionado para o WhatsApp para confirmar seu pedido</p></form></div></div><div class="lg:col-span-1"><div class="checkout-summary-wrapper bg-white rounded-xl shadow-card p-6 sticky top-24"><h2 class="text-xl font-display font-bold text-gray-900 mb-4">Resumo do Pedido</h2><div class="space-y-3 mb-4 max-h-64 overflow-y-auto">', '</div><div class="border-t border-gray-200 pt-4 space-y-2"><div class="flex items-center justify-between text-gray-600"><span>Subtotal (<!--$-->', "<!--/--> itens)</span><span>", '</span></div><div class="flex items-center justify-between text-lg font-bold text-gray-900 pt-2"><span>Total</span><span>', '</span></div></div><div class="mt-4 p-3 bg-blue-50 rounded-lg"><p class="text-xs text-blue-800"><strong>Nota:</strong> O valor final e prazo de entrega serão confirmados via WhatsApp após análise do pedido.</p></div></div></div></div>'], _tmpl$3 = ["<p", ' class="text-xs text-gray-600">', "</p>"], _tmpl$4 = ["<div", ' class="flex gap-3"><img', ' class="w-16 h-16 object-cover rounded-lg bg-gray-100"><div class="flex-1 min-w-0"><h4 class="text-sm font-medium text-gray-900 line-clamp-2">', "</h4><!--$-->", '<!--/--><div class="flex items-center justify-between mt-1"><span class="text-xs text-gray-600">Qtd: <!--$-->', '<!--/--></span><span class="text-sm font-semibold text-gray-900">', "</span></div></div></div>"];
function CheckoutForm() {
  const [formData] = createSignal({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: ""
  });
  const [errors] = createSignal({});
  const [isSubmitting] = createSignal(false);
  return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("value", escape(formData().name, true), false), `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().name ? "border-red-500" : "border-gray-300"}`, escape(createComponent(user_default, {
    "class": "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
    size: 20
  })), escape(createComponent(Show, {
    get when() {
      return errors().name;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().name));
    }
  })), ssrAttribute("value", escape(formData().email, true), false), `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().email ? "border-red-500" : "border-gray-300"}`, escape(createComponent(mail_default, {
    "class": "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
    size: 20
  })), escape(createComponent(Show, {
    get when() {
      return errors().email;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().email));
    }
  })), ssrAttribute("value", escape(formData().phone, true), false), `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().phone ? "border-red-500" : "border-gray-300"}`, escape(createComponent(phone_default, {
    "class": "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
    size: 20
  })), escape(createComponent(Show, {
    get when() {
      return errors().phone;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().phone));
    }
  })), ssrAttribute("value", escape(formData().address, true), false), `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().address ? "border-red-500" : "border-gray-300"}`, escape(createComponent(map_pin_default, {
    "class": "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
    size: 20
  })), escape(createComponent(Show, {
    get when() {
      return errors().address;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().address));
    }
  })), ssrAttribute("value", escape(formData().city, true), false), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().city ? "border-red-500" : "border-gray-300"}`, escape(createComponent(Show, {
    get when() {
      return errors().city;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().city));
    }
  })), ssrAttribute("value", escape(formData().state, true), false), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().state ? "border-red-500" : "border-gray-300"}`, escape(createComponent(Show, {
    get when() {
      return errors().state;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().state));
    }
  })), ssrAttribute("value", escape(formData().zip, true), false), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors().zip ? "border-red-500" : "border-gray-300"}`, escape(createComponent(Show, {
    get when() {
      return errors().zip;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().zip));
    }
  })), ssrAttribute("value", escape(formData().notes, true), false), ssrAttribute("disabled", isSubmitting(), true), `w-full btn-primary text-lg ${isSubmitting() ? "opacity-50 cursor-not-allowed" : ""}`, escape(createComponent(Show, {
    get when() {
      return !isSubmitting();
    },
    fallback: "Processando...",
    get children() {
      return [createComponent(message_circle_default, {
        size: 24
      }), "Finalizar via WhatsApp"];
    }
  })), escape(createComponent(For, {
    get each() {
      return cart.items;
    },
    children: (item) => ssr(_tmpl$4, ssrHydrationKey(), ssrAttribute("src", escape(item.product_image, true) || "https://placehold.co/100x100/f3f4f6/9ca3af?text=Sem+Imagem", false) + ssrAttribute("alt", escape(item.product_name, true), false), escape(item.product_name), escape(createComponent(Show, {
      get when() {
        return item.variation_color;
      },
      get children() {
        return ssr(_tmpl$3, ssrHydrationKey(), escape(item.variation_color));
      }
    })), escape(item.quantity), escape(formatPrice(item.unit_price * item.quantity)))
  })), escape(cartItemsCount()), escape(formatPrice(cartTotal())), escape(formatPrice(cartTotal())));
}

const $$Checkout = createComponent$1(($$result, $$props, $$slots) => {
  const title = "Finalizar Pedido - Rocha Brindes";
  const description = "Complete suas informa\xE7\xF5es para finalizar o pedido de brindes personalizados.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="flex-1 py-8 md:py-12 bg-gray-50"> <div class="container mx-auto px-4"> <!-- Page Header --> <div class="mb-8"> <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
Finalizar Pedido
</h1> <p class="text-gray-600">
Preencha suas informações para concluir o pedido
</p> </div> <!-- Checkout Steps --> <div class="mb-8"> <div class="flex items-center justify-center gap-4 max-w-2xl mx-auto"> <div class="flex items-center gap-2"> <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
✓
</div> <span class="text-sm font-medium text-gray-900 hidden sm:inline">Carrinho</span> </div> <div class="flex-1 h-1 bg-primary-500"></div> <div class="flex items-center gap-2"> <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
2
</div> <span class="text-sm font-medium text-gray-900 hidden sm:inline">Dados</span> </div> <div class="flex-1 h-1 bg-gray-300"></div> <div class="flex items-center gap-2"> <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
3
</div> <span class="text-sm font-medium text-gray-600 hidden sm:inline">Confirmação</span> </div> </div> </div> <!-- Checkout Form --> ${renderComponent($$result2, "CheckoutForm", CheckoutForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/CheckoutForm", "client:component-export": "default" })} </div> </main> ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Footer", "client:component-export": "default" })} ${renderScript($$result2, "/home/user/rocha-brindes-atualizado/src/pages/checkout.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/checkout.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
