globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B9-CKBo4.mjs';
import { a as createComponent, m as mergeProps, c as createSignal, s as ssr, e as escape, b as ssrHydrationKey, F as For, d as ssrAttribute, S as Show } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { f as formatPrice } from '../../chunks/utils_Deu6xdoM.mjs';
import { I as Icon_default } from '../../chunks/x_CSnmG0sU.mjs';
import { e as eye_default } from '../../chunks/eye_jcENxV4o.mjs';
import { t as trash_2_default } from '../../chunks/trash-2_CXddSc6f.mjs';

var iconNode = [["path", {
  d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
  key: "1m0v6g"
}], ["path", {
  d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
  key: "ohrbg2"
}]];
var SquarePen = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "SquarePen",
  iconNode
}));
var square_pen_default = SquarePen;

var _tmpl$ = ["<div", ' class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50 border-b border-gray-200"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destaque</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead><tbody class="bg-white divide-y divide-gray-200">', "</tbody></table></div>"], _tmpl$2 = ["<div", ' class="bg-white rounded-xl shadow-card overflow-hidden">', "</div>"], _tmpl$3 = ["<div", ' class="p-12 text-center"><p class="text-gray-600 mb-4">Nenhum produto cadastrado</p><a href="/admin/produtos/novo" class="btn-primary inline-flex">Criar Primeiro Produto</a></div>'], _tmpl$4 = ["<tr", ' class="hover:bg-gray-50"><td class="px-6 py-4"><div class="flex items-center gap-3"><img', ' class="w-12 h-12 object-cover rounded-lg bg-gray-100"><div class="min-w-0"><div class="text-sm font-medium text-gray-900 truncate">', '</div><div class="text-sm text-gray-500 truncate">', '</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">', '</div></td><td class="px-6 py-4 whitespace-nowrap"><button class="', '">', '</button></td><td class="px-6 py-4 whitespace-nowrap"><span class="', '">', '</span></td><td class="px-6 py-4 whitespace-nowrap text-right"><div class="flex items-center justify-end gap-2"><a href="', '" target="_blank" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" title="Ver no site">', '</a><a href="', '" class="p-2 text-primary-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors" title="Editar">', "</a><button", ' class="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50" title="Excluir">', "</button></div></td></tr>"];
function AdminProductsList(props) {
  const [products] = createSignal(props.products);
  const [deleting] = createSignal(null);
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return products().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$3, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return products();
        },
        children: (product) => ssr(_tmpl$4, ssrHydrationKey(), ssrAttribute("src", escape(product.main_image_url, true) || "https://placehold.co/100x100/f3f4f6/9ca3af?text=Sem+Imagem", false) + ssrAttribute("alt", escape(product.name, true), false), escape(product.name), escape(product.slug), escape(formatPrice(product.price)), `px-2 py-1 text-xs font-medium rounded-full ${product.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, product.active ? "Ativo" : "Inativo", `px-2 py-1 text-xs font-medium rounded-full ${product.featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-500"}`, product.featured ? "Sim" : "Não", `/produto/${escape(product.slug, true)}`, escape(createComponent(eye_default, {
          size: 18
        })), `/admin/produtos/${escape(product.id, true)}/editar`, escape(createComponent(square_pen_default, {
          size: 18
        })), ssrAttribute("disabled", deleting() === product.id, true), escape(createComponent(trash_2_default, {
          size: 18
        })))
      })));
    }
  })));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$Produtos = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Produtos;
  const productsUrl = new URL("/api/products?limit=100", Astro2.url.origin);
  let products = [];
  try {
    const productsResponse = await fetch(productsUrl.toString());
    if (productsResponse.ok) {
      const data = await productsResponse.json();
      products = data.products || [];
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Produtos - Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex items-center justify-between mb-8"> <div> <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
Produtos
</h1> <p class="text-gray-600">
Gerencie o catálogo de produtos
</p> </div> <a href="/admin/produtos/novo" class="btn-primary"> <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
Novo Produto
</a> </div>  ${renderComponent($$result2, "AdminProductsList", AdminProductsList, { "client:load": true, "products": products, "client:component-hydration": "load", "client:component-path": "@/components/AdminProductsList", "client:component-export": "default" })} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/admin/produtos.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/admin/produtos.astro";
const $$url = "/admin/produtos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Produtos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
