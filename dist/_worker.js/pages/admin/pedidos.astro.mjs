globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B9-CKBo4.mjs';
import { c as createSignal, s as ssr, e as escape, a as createComponent, b as ssrHydrationKey, F as For, d as ssrAttribute, S as Show } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { f as formatPrice, a as formatDate } from '../../chunks/utils_Deu6xdoM.mjs';
import { c as clock_default } from '../../chunks/clock_faK9JQK8.mjs';
import { e as eye_default } from '../../chunks/eye_jcENxV4o.mjs';

var _tmpl$ = ["<div", ' class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50 border-b border-gray-200"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead><tbody class="bg-white divide-y divide-gray-200">', "</tbody></table></div>"], _tmpl$2 = ["<div", ' class="bg-white rounded-xl shadow-card overflow-hidden">', "</div>"], _tmpl$3 = ["<div", ' class="p-12 text-center"><p class="text-gray-600">Nenhum pedido encontrado</p></div>'], _tmpl$4 = ["<tr", ' class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm font-medium text-gray-900">#<!--$-->', '<!--/--></span></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">', '</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-600"><div>', "</div><div>", '</div></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm font-medium text-gray-900">', '</span></td><td class="px-6 py-4 whitespace-nowrap"><select', "", ' class="', '"><option value="pending">Aguardando</option><option value="processing">Em Produção</option><option value="shipped">Em Transporte</option><option value="delivered">Entregue</option><option value="cancelled">Cancelado</option></select></td><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm text-gray-500 flex items-center gap-1"><!--$-->', "<!--/--><!--$-->", '<!--/--></span></td><td class="px-6 py-4 whitespace-nowrap"><a href="', '" target="_blank" class="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"><!--$-->', "<!--/-->Ver</a></td></tr>"];
function AdminOrdersList(props) {
  const [orders] = createSignal(props.orders);
  const [updating] = createSignal(null);
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return orders().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$3, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return orders();
        },
        children: (order) => ssr(_tmpl$4, ssrHydrationKey(), escape(order.order_number), escape(order.customer_name), escape(order.customer_email), escape(order.customer_phone), escape(formatPrice(order.total_amount)), ssrAttribute("value", escape(order.status, true), false), ssrAttribute("disabled", updating() === order.id, true), `px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${escape(getStatusColor(order.status), true)} disabled:opacity-50`, escape(createComponent(clock_default, {
          size: 14
        })), escape(formatDate(order.created_at)), `/pedido/${escape(order.order_number, true)}`, escape(createComponent(eye_default, {
          size: 16
        })))
      })));
    }
  })));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$Pedidos = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pedidos;
  const ordersUrl = new URL("/api/orders?limit=100", Astro2.url.origin);
  let orders = [];
  try {
    const ordersResponse = await fetch(ordersUrl.toString());
    if (ordersResponse.ok) {
      const data = await ordersResponse.json();
      orders = data.orders || [];
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Pedidos - Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
Pedidos
</h1> <p class="text-gray-600">
Gerencie todos os pedidos do e-commerce
</p> </div>  ${renderComponent($$result2, "AdminOrdersList", AdminOrdersList, { "client:load": true, "orders": orders, "client:component-hydration": "load", "client:component-path": "@/components/AdminOrdersList", "client:component-export": "default" })} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/admin/pedidos.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/admin/pedidos.astro";
const $$url = "/admin/pedidos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pedidos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
