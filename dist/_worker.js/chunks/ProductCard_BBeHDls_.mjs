globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as ssr, e as escape, a as createComponent, b as ssrHydrationKey, S as Show, d as ssrAttribute } from './_@astro-renderers_C0wH7-Ml.mjs';
import { f as formatPrice } from './utils_Deu6xdoM.mjs';

var _tmpl$ = ["<img", ' class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">'], _tmpl$2 = ["<span", ' class="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">Destaque</span>'], _tmpl$3 = ["<p", ' class="text-sm text-gray-600 line-clamp-2 mt-1">', "</p>"], _tmpl$4 = ["<div", ' class="mt-3"><span class="text-xl font-bold text-primary-500">', '</span><span class="text-sm text-gray-500 ml-1">/ un</span></div>'], _tmpl$5 = ["<a", ' href="', '" class="card group"><div class="relative aspect-square overflow-hidden bg-gray-100"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="card-body"><h3 class="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-500 transition-colors">', "</h3><!--$-->", "<!--/--><!--$-->", '<!--/--><button class="btn btn-primary w-full mt-4">Ver Detalhes</button></div></a>'], _tmpl$6 = ["<div", ' class="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>'];
function ProductCard(props) {
  return ssr(_tmpl$5, ssrHydrationKey(), `/produto/${escape(props.product.slug, true)}`, escape(createComponent(Show, {
    get when() {
      return props.product.main_image_url;
    },
    get fallback() {
      return ssr(_tmpl$6, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey() + ssrAttribute("src", escape(props.product.main_thumb_url, true) || escape(props.product.main_image_url, true), false) + ssrAttribute("alt", escape(props.product.name, true), false));
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.product.featured;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey());
    }
  })), escape(props.product.name), escape(createComponent(Show, {
    get when() {
      return props.product.description;
    },
    get children() {
      return ssr(_tmpl$3, ssrHydrationKey(), escape(props.product.description));
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.product.price > 0;
    },
    get children() {
      return ssr(_tmpl$4, ssrHydrationKey(), escape(formatPrice(props.product.price)));
    }
  })));
}

export { ProductCard as P };
