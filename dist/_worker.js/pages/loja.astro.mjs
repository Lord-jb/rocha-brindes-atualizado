globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead, o as renderScript, h as addAttribute } from '../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$Layout, H as Header, F as Footer } from '../chunks/Footer_BPJeEWO3.mjs';
import { P as ProductCard } from '../chunks/ProductCard_BBeHDls_.mjs';
import { a as createComponent, m as mergeProps, c as createSignal, s as ssr, e as escape, b as ssrHydrationKey, d as ssrAttribute, F as For, S as Show } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { I as Icon_default, x as x_default } from '../chunks/x_CSnmG0sU.mjs';
/* empty css                                */

var iconNode$1 = [["polygon", {
  points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",
  key: "1yg77f"
}]];
var Filter = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Filter",
  iconNode: iconNode$1
}));
var filter_default = Filter;

var iconNode = [["circle", {
  cx: "11",
  cy: "11",
  r: "8",
  key: "4ej97u"
}], ["path", {
  d: "m21 21-4.3-4.3",
  key: "1qie3q"
}]];
var Search = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Search",
  iconNode
}));
var search_default = Search;

var _tmpl$ = ["<div", ' class="fixed inset-0 z-50 bg-black/50"></div>'], _tmpl$2 = ["<button", ' class="w-full btn border border-gray-300 hover:bg-gray-50">Limpar Filtros</button>'], _tmpl$3 = ["<div", ' class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h3 class="text-xl font-display font-bold text-gray-900">Filtros</h3><button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">', '</button></div><div class="mb-6"><form><div class="relative"><input type="text"', ' placeholder="Buscar produtos..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"><!--$-->', '<!--/--></div></form></div><div class="mb-6"><label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label><select', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">', '</select></div><div class="mb-6"><h4 class="text-sm font-medium text-gray-700 mb-3">Categorias</h4><div class="space-y-2"><button class="', '">Todas as Categorias</button><!--$-->', "<!--/--></div></div><!--$-->", "<!--/--></div>"], _tmpl$4 = ["<div", '><button class="w-full btn-primary flex items-center justify-center gap-2"><!--$-->', "<!--/-->Filtros<!--$-->", "<!--/--></button><!--$-->", "<!--/--></div>"], _tmpl$5 = ["<span", ' class="bg-white text-primary-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">!</span>'], _tmpl$6 = ["<option", ">", "</option>"], _tmpl$7 = ["<button", ' class="', '">', "</button>"], _tmpl$8 = ["<button", ' class="w-full btn border border-gray-300 hover:bg-gray-50 text-sm">Limpar Filtros</button>'], _tmpl$9 = ["<div", ' class="bg-white rounded-xl shadow-card p-6 sticky top-24"><div class="mb-6"><form><div class="relative"><input type="text"', ' placeholder="Buscar produtos..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"><!--$-->', '<!--/--></div><button type="submit" class="sr-only">Buscar</button></form></div><div class="mb-6"><label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label><select', ' class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">', '</select></div><div class="mb-6"><h4 class="text-sm font-medium text-gray-700 mb-3">Categorias</h4><div class="space-y-1"><button class="', '">Todas as Categorias</button><!--$-->', "<!--/--></div></div><!--$-->", "<!--/--></div>"];
function ProductFilters(props) {
  const [searchInput] = createSignal(props.searchQuery || "");
  const [mobileFiltersOpen] = createSignal(false);
  const sortOptions = [{
    value: "featured",
    label: "Em Destaque"
  }, {
    value: "name-asc",
    label: "Nome (A-Z)"
  }, {
    value: "name-desc",
    label: "Nome (Z-A)"
  }, {
    value: "price-asc",
    label: "Menor Preço"
  }, {
    value: "price-desc",
    label: "Maior Preço"
  }, {
    value: "newest",
    label: "Mais Recentes"
  }];
  const hasActiveFilters = () => {
    return props.currentCategory || props.searchQuery;
  };
  if (props.mobile) {
    return ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(filter_default, {
      size: 20
    })), hasActiveFilters() && _tmpl$5[0] + ssrHydrationKey() + _tmpl$5[1], escape(createComponent(Show, {
      get when() {
        return mobileFiltersOpen();
      },
      get children() {
        return [ssr(_tmpl$, ssrHydrationKey()), ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(x_default, {
          size: 24
        })), ssrAttribute("value", escape(searchInput(), true), false), escape(createComponent(search_default, {
          "class": "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
          size: 20
        })), ssrAttribute("value", escape(props.currentSort, true) || "featured", false), escape(createComponent(For, {
          each: sortOptions,
          children: (option) => ssr(_tmpl$6, ssrHydrationKey() + ssrAttribute("value", escape(option.value, true), false), escape(option.label))
        })), `w-full text-left px-4 py-2 rounded-lg transition-colors ${!props.currentCategory ? "bg-primary-500 text-white font-medium" : "hover:bg-gray-100"}`, escape(createComponent(For, {
          get each() {
            return props.categories;
          },
          children: (category) => ssr(_tmpl$7, ssrHydrationKey(), `w-full text-left px-4 py-2 rounded-lg transition-colors ${props.currentCategory === category.slug ? "bg-primary-500 text-white font-medium" : "hover:bg-gray-100"}`, escape(category.name))
        })), escape(createComponent(Show, {
          get when() {
            return hasActiveFilters();
          },
          get children() {
            return ssr(_tmpl$2, ssrHydrationKey());
          }
        })))];
      }
    })));
  }
  return ssr(_tmpl$9, ssrHydrationKey(), ssrAttribute("value", escape(searchInput(), true), false), escape(createComponent(search_default, {
    "class": "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
    size: 18
  })), ssrAttribute("value", escape(props.currentSort, true) || "featured", false), escape(createComponent(For, {
    each: sortOptions,
    children: (option) => ssr(_tmpl$6, ssrHydrationKey() + ssrAttribute("value", escape(option.value, true), false), escape(option.label))
  })), `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!props.currentCategory ? "bg-primary-500 text-white font-medium" : "hover:bg-gray-100"}`, escape(createComponent(For, {
    get each() {
      return props.categories;
    },
    children: (category) => ssr(_tmpl$7, ssrHydrationKey(), `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${props.currentCategory === category.slug ? "bg-primary-500 text-white font-medium" : "hover:bg-gray-100"}`, escape(category.name))
  })), escape(createComponent(Show, {
    get when() {
      return hasActiveFilters();
    },
    get children() {
      return ssr(_tmpl$8, ssrHydrationKey());
    }
  })));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$Loja = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Loja;
  const url = new URL(Astro2.request.url);
  const searchQuery = url.searchParams.get("search") || "";
  const categorySlug = url.searchParams.get("category") || "";
  const sortBy = url.searchParams.get("sort") || "featured";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;
  const categoriesUrl = new URL("/api/categories", Astro2.url.origin);
  const categoriesResponse = await fetch(categoriesUrl.toString());
  const categories = await categoriesResponse.json();
  const productsUrl = new URL("/api/products", Astro2.url.origin);
  if (searchQuery) productsUrl.searchParams.set("search", searchQuery);
  if (categorySlug) productsUrl.searchParams.set("category", categorySlug);
  productsUrl.searchParams.set("sort", sortBy);
  productsUrl.searchParams.set("limit", limit.toString());
  productsUrl.searchParams.set("offset", offset.toString());
  const productsResponse = await fetch(productsUrl.toString());
  const { products, total } = await productsResponse.json();
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const currentCategory = categorySlug ? categories.find((cat) => cat.slug === categorySlug) : null;
  const title = currentCategory ? `${currentCategory.name} - Rocha Brindes` : searchQuery ? `Busca: "${searchQuery}" - Rocha Brindes` : "Cat\xE1logo de Produtos - Rocha Brindes";
  const description = currentCategory ? `Explore nossa sele\xE7\xE3o de ${currentCategory.name.toLowerCase()} personalizados de alta qualidade.` : "Explore nosso cat\xE1logo completo de brindes personalizados de alta qualidade para sua empresa.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "data-astro-cid-maxg3zsa": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Header", "client:component-export": "default", "data-astro-cid-maxg3zsa": true })} ${maybeRenderHead()}<main class="flex-1 py-8 md:py-12" data-astro-cid-maxg3zsa> <div class="container mx-auto px-4" data-astro-cid-maxg3zsa> <!-- Page Header --> <div class="mb-8" data-astro-cid-maxg3zsa> <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2" data-astro-cid-maxg3zsa> ${currentCategory ? currentCategory.name : "Cat\xE1logo de Produtos"} </h1> ${searchQuery && renderTemplate`<p class="text-gray-600" data-astro-cid-maxg3zsa>
Resultados para: <span class="font-medium text-gray-900" data-astro-cid-maxg3zsa>"${searchQuery}"</span> </p>`} <p class="text-gray-600 mt-1" data-astro-cid-maxg3zsa> ${total} ${total === 1 ? "produto encontrado" : "produtos encontrados"} </p> </div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8" data-astro-cid-maxg3zsa> <!-- Filters Sidebar (Desktop) --> <aside class="hidden lg:block lg:col-span-1" data-astro-cid-maxg3zsa> ${renderComponent($$result2, "ProductFilters", ProductFilters, { "client:load": true, "categories": categories, "currentCategory": categorySlug, "currentSort": sortBy, "searchQuery": searchQuery, "client:component-hydration": "load", "client:component-path": "@/components/ProductFilters", "client:component-export": "default", "data-astro-cid-maxg3zsa": true })} </aside> <!-- Products Grid --> <div class="lg:col-span-3" data-astro-cid-maxg3zsa> <!-- Mobile Filters Toggle --> <div class="lg:hidden mb-6" data-astro-cid-maxg3zsa> ${renderComponent($$result2, "ProductFilters", ProductFilters, { "client:load": true, "categories": categories, "currentCategory": categorySlug, "currentSort": sortBy, "searchQuery": searchQuery, "mobile": true, "client:component-hydration": "load", "client:component-path": "@/components/ProductFilters", "client:component-export": "default", "data-astro-cid-maxg3zsa": true })} </div> <!-- Products Grid --> ${products.length > 0 ? renderTemplate`<div class="product-grid mb-8" data-astro-cid-maxg3zsa> ${products.map((product) => renderTemplate`<div class="product-item" data-astro-cid-maxg3zsa> ${renderComponent($$result2, "ProductCard", ProductCard, { "client:visible": true, "product": product, "client:component-hydration": "visible", "client:component-path": "@/components/ProductCard", "client:component-export": "default", "data-astro-cid-maxg3zsa": true })} </div>`)} </div>` : renderTemplate`<div class="text-center py-16" data-astro-cid-maxg3zsa> <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-maxg3zsa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" data-astro-cid-maxg3zsa></path> </svg> <h3 class="text-xl font-medium text-gray-900 mb-2" data-astro-cid-maxg3zsa>Nenhum produto encontrado</h3> <p class="text-gray-600 mb-6" data-astro-cid-maxg3zsa> ${searchQuery ? "Tente buscar com outros termos ou remova os filtros." : "N\xE3o encontramos produtos nesta categoria no momento."} </p> <a href="/loja" class="btn-primary" data-astro-cid-maxg3zsa>
Ver Todos os Produtos
</a> </div>`} <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="flex items-center justify-center gap-2 mt-8" data-astro-cid-maxg3zsa> ${hasPrevPage ? renderTemplate`<a${addAttribute((() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categorySlug) params.set("category", categorySlug);
    params.set("sort", sortBy);
    params.set("page", (page - 1).toString());
    return `/loja?${params.toString()}`;
  })(), "href")} class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-astro-cid-maxg3zsa>
Anterior
</a>` : renderTemplate`<span class="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed" data-astro-cid-maxg3zsa>
Anterior
</span>`} <div class="flex items-center gap-2" data-astro-cid-maxg3zsa> ${Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    let pageNum = i + 1;
    if (totalPages > 5) {
      if (page > 3) {
        if (page >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = page - 2 + i;
        }
      }
    }
    const isCurrentPage = pageNum === page;
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categorySlug) params.set("category", categorySlug);
    params.set("sort", sortBy);
    params.set("page", pageNum.toString());
    return renderTemplate`<a${addAttribute(`/loja?${params.toString()}`, "href")}${addAttribute(`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isCurrentPage ? "bg-primary-500 text-white font-medium" : "border border-gray-300 hover:bg-gray-50"}`, "class")} data-astro-cid-maxg3zsa> ${pageNum} </a>`;
  })} </div> ${hasNextPage ? renderTemplate`<a${addAttribute((() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categorySlug) params.set("category", categorySlug);
    params.set("sort", sortBy);
    params.set("page", (page + 1).toString());
    return `/loja?${params.toString()}`;
  })(), "href")} class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-astro-cid-maxg3zsa>
Próximo
</a>` : renderTemplate`<span class="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed" data-astro-cid-maxg3zsa>
Próximo
</span>`} </div>`} </div> </div> </div> </main> ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Footer", "client:component-export": "default", "data-astro-cid-maxg3zsa": true })} ${renderScript($$result2, "/home/user/rocha-brindes-atualizado/src/pages/loja.astro?astro&type=script&index=0&lang.ts")} ` })} `;
}, "/home/user/rocha-brindes-atualizado/src/pages/loja.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/loja.astro";
const $$url = "/loja";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Loja,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
