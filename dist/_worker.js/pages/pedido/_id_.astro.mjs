globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead, o as renderScript, h as addAttribute } from '../../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$Layout, H as Header, F as Footer } from '../../chunks/Footer_BPJeEWO3.mjs';
import { a as createComponent, m as mergeProps, s as ssr, e as escape, b as ssrHydrationKey } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { I as Icon_default } from '../../chunks/x_CSnmG0sU.mjs';
import { t as truck_default } from '../../chunks/truck_BC3oi2zp.mjs';
import { c as clock_default } from '../../chunks/clock_faK9JQK8.mjs';
import { p as package_default } from '../../chunks/package_D3TH6edF.mjs';
import { a as formatDate, f as formatPrice } from '../../chunks/utils_Deu6xdoM.mjs';

var iconNode$1 = [["path", {
  d: "M21.801 10A10 10 0 1 1 17 3.335",
  key: "yps3ct"
}], ["path", {
  d: "m9 11 3 3L22 4",
  key: "1pflzl"
}]];
var CircleCheckBig = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "CircleCheckBig",
  iconNode: iconNode$1
}));
var circle_check_big_default = CircleCheckBig;

var iconNode = [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["path", {
  d: "m15 9-6 6",
  key: "1uzhvr"
}], ["path", {
  d: "m9 9 6 6",
  key: "z0biqf"
}]];
var CircleX = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "CircleX",
  iconNode
}));
var circle_x_default = CircleX;

var _tmpl$ = ["<div", ' class="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"];
function OrderStatus(props) {
  const statusConfig = {
    pending: {
      label: "Aguardando",
      icon: clock_default,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    processing: {
      label: "Em Produção",
      icon: package_default,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    shipped: {
      label: "Em Transporte",
      icon: truck_default,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    delivered: {
      label: "Entregue",
      icon: circle_check_big_default,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    cancelled: {
      label: "Cancelado",
      icon: circle_x_default,
      color: "bg-red-100 text-red-800 border-red-200"
    }
  };
  const config = statusConfig[props.status];
  const Icon = config.icon;
  return ssr(_tmpl$, ssrHydrationKey(), `inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${escape(config.color, true)}`, escape(createComponent(Icon, {
    size: 20
  })), escape(config.label));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$id = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/");
  }
  const orderUrl = new URL(`/api/orders/${id}`, Astro2.url.origin);
  const orderResponse = await fetch(orderUrl.toString());
  let order = null;
  let error = null;
  if (orderResponse.ok) {
    order = await orderResponse.json();
  } else {
    error = "Pedido n\xE3o encontrado";
  }
  const title = order ? `Pedido ${order.order_number} - Rocha Brindes` : "Pedido n\xE3o encontrado - Rocha Brindes";
  const description = order ? `Acompanhe o status do seu pedido ${order.order_number}` : "Pedido n\xE3o encontrado";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "noIndex": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="flex-1 py-8 md:py-12 bg-gray-50"> <div class="container mx-auto px-4"> ${error ? renderTemplate`<!-- Error State -->
        <div class="max-w-2xl mx-auto text-center py-16"> <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
Pedido não encontrado
</h1> <p class="text-gray-600 mb-8">
Não foi possível encontrar o pedido informado. Verifique o número do pedido e tente novamente.
</p> <a href="/" class="btn-primary inline-flex">
Voltar para Início
</a> </div>` : order && renderTemplate`<!-- Order Details -->
        <div> <!-- Page Header --> <div class="mb-8 order-header"> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> <div> <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
Pedido #${order.order_number} </h1> <p class="text-gray-600">
Realizado em ${formatDate(order.created_at, true)} </p> </div> ${renderComponent($$result2, "OrderStatus", OrderStatus, { "client:load": true, "status": order.status, "client:component-hydration": "load", "client:component-path": "@/components/OrderStatus", "client:component-export": "default" })} </div> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"> <!-- Order Items and Details --> <div class="lg:col-span-2 space-y-6"> <!-- Order Items --> <div class="order-items bg-white rounded-xl shadow-card p-6"> <h2 class="text-xl font-display font-bold text-gray-900 mb-4">
Itens do Pedido
</h2> <div class="space-y-4"> ${order.items.map((item) => renderTemplate`<div class="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"> <img${addAttribute(item.product_image || "https://placehold.co/100x100/f3f4f6/9ca3af?text=Sem+Imagem", "src")}${addAttribute(item.product_name, "alt")} class="w-20 h-20 object-cover rounded-lg bg-gray-100"> <div class="flex-1 min-w-0"> <h3 class="font-semibold text-gray-900 mb-1"> ${item.product_name} </h3> ${item.variation_color && renderTemplate`<p class="text-sm text-gray-600 mb-2">
Cor: ${item.variation_color} </p>`} <div class="flex items-center justify-between"> <span class="text-sm text-gray-600"> ${formatPrice(item.unit_price)} × ${item.quantity} </span> <span class="font-semibold text-gray-900"> ${formatPrice(item.unit_price * item.quantity)} </span> </div> </div> </div>`)} </div>  <div class="mt-6 pt-6 border-t border-gray-200 space-y-2"> <div class="flex items-center justify-between text-gray-600"> <span>Subtotal</span> <span>${formatPrice(order.total_amount)}</span> </div> <div class="flex items-center justify-between text-xl font-bold text-gray-900"> <span>Total</span> <span>${formatPrice(order.total_amount)}</span> </div> </div> </div> <!-- Customer Information --> <div class="order-customer bg-white rounded-xl shadow-card p-6"> <h2 class="text-xl font-display font-bold text-gray-900 mb-4">
Informações de Contato
</h2> <div class="space-y-3"> <div> <span class="text-sm text-gray-600 block">Nome</span> <span class="font-medium text-gray-900">${order.customer_name}</span> </div> <div> <span class="text-sm text-gray-600 block">Email</span> <a${addAttribute(`mailto:${order.customer_email}`, "href")} class="font-medium text-primary-500 hover:text-primary-600"> ${order.customer_email} </a> </div> <div> <span class="text-sm text-gray-600 block">Telefone</span> <a${addAttribute(`tel:${order.customer_phone}`, "href")} class="font-medium text-primary-500 hover:text-primary-600"> ${order.customer_phone} </a> </div> <div> <span class="text-sm text-gray-600 block">Endereço</span> <span class="font-medium text-gray-900"> ${order.customer_address}<br> ${order.customer_city} - ${order.customer_state}<br>
CEP: ${order.customer_zip} </span> </div> ${order.customer_notes && renderTemplate`<div> <span class="text-sm text-gray-600 block">Observações</span> <span class="font-medium text-gray-900 whitespace-pre-line"> ${order.customer_notes} </span> </div>`} </div> </div> </div> <!-- Order Timeline --> <div class="lg:col-span-1"> <div class="order-timeline bg-white rounded-xl shadow-card p-6 sticky top-24"> <h2 class="text-xl font-display font-bold text-gray-900 mb-6">
Status do Pedido
</h2> <div class="space-y-6"> <!-- Timeline Items --> <div class="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0"> <div${addAttribute(`absolute -left-2 top-0 w-4 h-4 rounded-full ${["pending", "processing", "shipped", "delivered"].includes(order.status) ? "bg-green-500" : order.status === "cancelled" ? "bg-red-500" : "bg-gray-300"}`, "class")}></div> <h3 class="font-semibold text-gray-900">Pedido Recebido</h3> <p class="text-sm text-gray-600">${formatDate(order.created_at, true)}</p> </div> <div class="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0"> <div${addAttribute(`absolute -left-2 top-0 w-4 h-4 rounded-full ${["processing", "shipped", "delivered"].includes(order.status) ? "bg-green-500" : order.status === "cancelled" ? "bg-red-500" : "bg-gray-300"}`, "class")}></div> <h3 class="font-semibold text-gray-900">Em Produção</h3> <p class="text-sm text-gray-600"> ${["processing", "shipped", "delivered"].includes(order.status) ? "Em andamento" : "Aguardando"} </p> </div> <div class="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0"> <div${addAttribute(`absolute -left-2 top-0 w-4 h-4 rounded-full ${["shipped", "delivered"].includes(order.status) ? "bg-green-500" : order.status === "cancelled" ? "bg-red-500" : "bg-gray-300"}`, "class")}></div> <h3 class="font-semibold text-gray-900">Em Transporte</h3> <p class="text-sm text-gray-600"> ${["shipped", "delivered"].includes(order.status) ? "A caminho" : "Aguardando"} </p> </div> <div class="relative pl-8"> <div${addAttribute(`absolute -left-2 top-0 w-4 h-4 rounded-full ${order.status === "delivered" ? "bg-green-500" : order.status === "cancelled" ? "bg-red-500" : "bg-gray-300"}`, "class")}></div> <h3 class="font-semibold text-gray-900"> ${order.status === "cancelled" ? "Cancelado" : "Entregue"} </h3> <p class="text-sm text-gray-600"> ${order.status === "delivered" ? "Pedido conclu\xEDdo" : order.status === "cancelled" ? "Pedido cancelado" : "Aguardando"} </p> </div> </div>  <div class="mt-6 pt-6 border-t border-gray-200"> <a${addAttribute(`https://wa.me/5596981247830?text=Ol\xE1! Gostaria de informa\xE7\xF5es sobre o pedido ${order.order_number}`, "href")} target="_blank" rel="noopener noreferrer" class="w-full btn border-2 border-green-500 text-green-600 hover:bg-green-50"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg>
Falar no WhatsApp
</a> </div> </div> </div> </div> </div>`} </div> </main> ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Footer", "client:component-export": "default" })} ${renderScript($$result2, "/home/user/rocha-brindes-atualizado/src/pages/pedido/[id].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/pedido/[id].astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/pedido/[id].astro";
const $$url = "/pedido/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
