globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DIHz_uPh.mjs';
import { f as folder_open_default, $ as $$AdminLayout } from '../chunks/AdminLayout_B9-CKBo4.mjs';
import { a as createComponent, m as mergeProps, s as ssr, b as ssrHydrationKey, e as escape, F as For } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { f as formatPrice, a as formatDate } from '../chunks/utils_Deu6xdoM.mjs';
import { I as Icon_default, s as shopping_cart_default } from '../chunks/x_CSnmG0sU.mjs';
import { c as clock_default } from '../chunks/clock_faK9JQK8.mjs';
import { p as package_default } from '../chunks/package_D3TH6edF.mjs';

var iconNode = [["line", {
  x1: "12",
  x2: "12",
  y1: "2",
  y2: "22",
  key: "7eqyqh"
}], ["path", {
  d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  key: "1b0p4s"
}]];
var DollarSign = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "DollarSign",
  iconNode
}));
var dollar_sign_default = DollarSign;

var _tmpl$ = ["<div", ' class="space-y-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">', "</div><!--$-->", "<!--/--></div>"], _tmpl$2 = ["<div", ' class="bg-white rounded-xl shadow-card p-6"><div class="flex items-center justify-between mb-4"><div class="', '">', '</div></div><h3 class="text-2xl font-bold text-gray-900 mb-1">', '</h3><p class="text-sm font-medium text-gray-700">', '</p><p class="text-xs text-gray-500 mt-1">', "</p></div>"], _tmpl$3 = ["<div", ' class="bg-white rounded-xl shadow-card"><div class="p-6 border-b border-gray-200"><h2 class="text-xl font-display font-bold text-gray-900">Pedidos Recentes</h2></div><div class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50 border-b border-gray-200"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead><tbody class="bg-white divide-y divide-gray-200">', "</tbody></table></div></div>"], _tmpl$4 = ["<tr", ' class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm font-medium text-gray-900">#<!--$-->', '<!--/--></span></td><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm text-gray-900">', '</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm font-medium text-gray-900">', '</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="', '">', '</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm text-gray-500 flex items-center gap-1"><!--$-->', "<!--/--><!--$-->", '<!--/--></span></td><td class="px-6 py-4 whitespace-nowrap"><a href="', '" class="text-sm text-primary-500 hover:text-primary-600 font-medium">Ver detalhes</a></td></tr>'];
function AdminStats(props) {
  const statCards = [{
    label: "Total de Produtos",
    value: props.stats.total_products,
    subtext: `${props.stats.active_products} ativos`,
    icon: package_default,
    color: "bg-primary-500"
  }, {
    label: "Categorias",
    value: props.stats.total_categories,
    subtext: "cadastradas",
    icon: folder_open_default,
    color: "bg-secondary-700"
  }, {
    label: "Pedidos",
    value: props.stats.total_orders,
    subtext: `${props.stats.pending_orders} pendentes`,
    icon: shopping_cart_default,
    color: "bg-green-500"
  }, {
    label: "Receita Total",
    value: formatPrice(props.stats.total_revenue),
    subtext: "todos os pedidos",
    icon: dollar_sign_default,
    color: "bg-blue-500"
  }];
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
  const getStatusLabel = (status) => {
    const labels = {
      pending: "Aguardando",
      processing: "Em Produção",
      shipped: "Em Transporte",
      delivered: "Entregue",
      cancelled: "Cancelado"
    };
    return labels[status] || status;
  };
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(For, {
    each: statCards,
    children: (stat) => {
      const Icon = stat.icon;
      return ssr(_tmpl$2, ssrHydrationKey(), `w-12 h-12 ${escape(stat.color, true)} rounded-lg flex items-center justify-center`, escape(createComponent(Icon, {
        size: 24,
        "class": "text-white"
      })), escape(stat.value), escape(stat.label), escape(stat.subtext));
    }
  })), props.stats.recent_orders && props.stats.recent_orders.length > 0 && ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return props.stats.recent_orders;
    },
    children: (order) => ssr(_tmpl$4, ssrHydrationKey(), escape(order.order_number), escape(order.customer_name), escape(formatPrice(order.total_amount)), `px-2 py-1 text-xs font-medium rounded-full ${escape(getStatusColor(order.status), true)}`, escape(getStatusLabel(order.status)), escape(createComponent(clock_default, {
      size: 14
    })), escape(formatDate(order.created_at)), `/admin/pedidos/${escape(order.id, true)}`)
  }))));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$Index = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const statsUrl = new URL("/api/admin/stats", Astro2.url.origin);
  let stats = {
    total_products: 0,
    active_products: 0,
    total_categories: 0,
    total_orders: 0,
    pending_orders: 0,
    total_revenue: 0,
    recent_orders: []
  };
  try {
    const statsResponse = await fetch(statsUrl.toString());
    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard - Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
Dashboard
</h1> <p class="text-gray-600">
Visão geral do seu e-commerce
</p> </div>  ${renderComponent($$result2, "AdminStats", AdminStats, { "client:load": true, "stats": stats, "client:component-hydration": "load", "client:component-path": "@/components/AdminStats", "client:component-export": "default" })}  <div class="mt-8"> <h2 class="text-xl font-display font-bold text-gray-900 mb-4">
Ações Rápidas
</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> <a href="/admin/produtos/novo" class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow text-center group"> <div class="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors"> <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg> </div> <h3 class="font-semibold text-gray-900">Novo Produto</h3> </a> <a href="/admin/categorias/nova" class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow text-center group"> <div class="w-12 h-12 mx-auto mb-3 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors"> <svg class="w-6 h-6 text-secondary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg> </div> <h3 class="font-semibold text-gray-900">Nova Categoria</h3> </a> <a href="/admin/pedidos" class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow text-center group"> <div class="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors"> <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path> </svg> </div> <h3 class="font-semibold text-gray-900">Ver Pedidos</h3> </a> <a href="/admin/configuracoes" class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow text-center group"> <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors"> <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> </div> <h3 class="font-semibold text-gray-900">Configurações</h3> </a> </div> </div> ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/admin/index.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
