globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B9-CKBo4.mjs';
import { c as createSignal, s as ssr, e as escape, a as createComponent, b as ssrHydrationKey, S as Show, F as For, d as ssrAttribute } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { t as tag_default } from '../../chunks/tag_D4JjbELy.mjs';
import { e as eye_default } from '../../chunks/eye_jcENxV4o.mjs';
import { t as trash_2_default } from '../../chunks/trash-2_CXddSc6f.mjs';

var _tmpl$ = ["<div", ' class="col-span-full p-12 text-center bg-white rounded-xl shadow-card"><p class="text-gray-600 mb-4">Nenhuma categoria cadastrada</p></div>'], _tmpl$2 = ["<div", ' class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$3 = ["<div", ' class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow"><div class="flex items-start justify-between mb-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">', '</div><div><h3 class="font-semibold text-gray-900">', '</h3><p class="text-sm text-gray-500">', '</p></div></div></div><div class="flex items-center gap-4 text-sm text-gray-600 mb-4"><span><!--$-->', "<!--/--> produtos</span><!--$-->", '<!--/--></div><div class="flex items-center gap-2 pt-4 border-t border-gray-200"><a href="', '" target="_blank" class="flex-1 btn border border-gray-300 hover:bg-gray-50 text-sm py-2"><!--$-->', "<!--/-->Ver</a><button", ' class="px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Excluir">', "</button></div></div>"], _tmpl$4 = ["<span", ' class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Popular</span>'];
function AdminCategoriesList(props) {
  const [categories] = createSignal(props.categories);
  const [deleting] = createSignal(null);
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return categories().length > 0;
    },
    get children() {
      return createComponent(For, {
        get each() {
          return categories();
        },
        children: (category) => ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(tag_default, {
          size: 24,
          "class": "text-primary-600"
        })), escape(category.name), escape(category.slug), escape(category.product_count) || 0, category.popular && _tmpl$4[0] + ssrHydrationKey() + _tmpl$4[1], `/loja?category=${escape(category.slug, true)}`, escape(createComponent(eye_default, {
          size: 16
        })), ssrAttribute("disabled", deleting() === category.id, true), escape(createComponent(trash_2_default, {
          size: 16
        })))
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return categories().length === 0;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey());
    }
  })));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$Categorias = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Categorias;
  const categoriesUrl = new URL("/api/categories", Astro2.url.origin);
  let categories = [];
  try {
    const categoriesResponse = await fetch(categoriesUrl.toString());
    if (categoriesResponse.ok) {
      categories = await categoriesResponse.json();
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Categorias - Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex items-center justify-between mb-8"> <div> <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
Categorias
</h1> <p class="text-gray-600">
Gerencie as categorias de produtos
</p> </div> </div>  ${renderComponent($$result2, "AdminCategoriesList", AdminCategoriesList, { "client:load": true, "categories": categories, "client:component-hydration": "load", "client:component-path": "@/components/AdminCategoriesList", "client:component-export": "default" })} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/admin/categorias.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/admin/categorias.astro";
const $$url = "/admin/categorias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categorias,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
