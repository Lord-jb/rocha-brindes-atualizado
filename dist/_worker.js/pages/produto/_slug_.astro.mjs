globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead, o as renderScript, p as Fragment, h as addAttribute } from '../../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$Layout, H as Header, F as Footer } from '../../chunks/Footer_BPJeEWO3.mjs';
import { P as ProductCard } from '../../chunks/ProductCard_BBeHDls_.mjs';
import { a as createComponent, m as mergeProps, s as ssr, e as escape, b as ssrHydrationKey, d as ssrAttribute, S as Show, c as createSignal, F as For } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { I as Icon_default, s as shopping_cart_default } from '../../chunks/x_CSnmG0sU.mjs';
import { f as formatPrice } from '../../chunks/utils_Deu6xdoM.mjs';
import { m as message_circle_default } from '../../chunks/message-circle_DA_Ewnke.mjs';
import { t as tag_default } from '../../chunks/tag_D4JjbELy.mjs';
import { t as truck_default } from '../../chunks/truck_BC3oi2zp.mjs';

var iconNode$4 = [["path", {
  d: "M20 6 9 17l-5-5",
  key: "1gmf2c"
}]];
var Check = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Check",
  iconNode: iconNode$4
}));
var check_default = Check;

var iconNode$3 = [["path", {
  d: "m15 18-6-6 6-6",
  key: "1wnfg3"
}]];
var ChevronLeft = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "ChevronLeft",
  iconNode: iconNode$3
}));
var chevron_left_default = ChevronLeft;

var iconNode$2 = [["path", {
  d: "m9 18 6-6-6-6",
  key: "mthhwq"
}]];
var ChevronRight = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "ChevronRight",
  iconNode: iconNode$2
}));
var chevron_right_default = ChevronRight;

var iconNode$1 = [["path", {
  d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
  key: "oel41y"
}]];
var Shield = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Shield",
  iconNode: iconNode$1
}));
var shield_default = Shield;

var iconNode = [["circle", {
  cx: "11",
  cy: "11",
  r: "8",
  key: "4ej97u"
}], ["line", {
  x1: "21",
  x2: "16.65",
  y1: "21",
  y2: "16.65",
  key: "13gj7c"
}], ["line", {
  x1: "11",
  x2: "11",
  y1: "8",
  y2: "14",
  key: "1vmskp"
}], ["line", {
  x1: "8",
  x2: "14",
  y1: "11",
  y2: "11",
  key: "durymu"
}]];
var ZoomIn = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "ZoomIn",
  iconNode
}));
var zoom_in_default = ZoomIn;

var _tmpl$$1 = ["<button", ' class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Imagem anterior">', "</button>"], _tmpl$2$1 = ["<button", ' class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Próxima imagem">', "</button>"], _tmpl$3$1 = ["<div", ' class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm rounded-full"><!--$-->', "<!--/--> / <!--$-->", "<!--/--></div>"], _tmpl$4$1 = ["<div", ' class="grid grid-cols-4 gap-2">', "</div>"], _tmpl$5$1 = ["<button", ' class="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" aria-label="Imagem anterior">', "</button>"], _tmpl$6$1 = ["<button", ' class="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" aria-label="Próxima imagem">', "</button>"], _tmpl$7$1 = ["<div", ' class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"><button class="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" aria-label="Fechar"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button><img', ' class="max-w-full max-h-full object-contain"><!--$-->', "<!--/--></div>"], _tmpl$8 = ["<div", ' class="space-y-4"><div class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group"><img', ' class="w-full h-full object-cover"><button class="absolute top-4 right-4 p-2 bg-white/90 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Ampliar imagem">', "</button><!--$-->", "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$9 = ["<button", ' class="', '"><img', ' class="w-full h-full object-cover"></button>'];
function ProductGallery(props) {
  const allImages = () => {
    const imgs = [];
    if (props.mainImage) {
      imgs.push({
        id: "main",
        url: props.mainImage,
        alt: props.productName,
        order_index: 0
      });
    }
    imgs.push(...props.images);
    return imgs;
  };
  const [currentIndex] = createSignal(0);
  const [isZoomed] = createSignal(false);
  const images = allImages();
  const currentImage = () => images[currentIndex()];
  const placeholderImage = "https://placehold.co/600x600/f3f4f6/9ca3af?text=Sem+Imagem";
  return ssr(_tmpl$8, ssrHydrationKey(), ssrAttribute("src", escape(currentImage()?.url, true) || escape(placeholderImage, true), false) + ssrAttribute("alt", escape(currentImage()?.alt, true) || escape(props.productName, true), false), escape(createComponent(zoom_in_default, {
    size: 20,
    "class": "text-gray-700"
  })), escape(createComponent(Show, {
    get when() {
      return images.length > 1;
    },
    get children() {
      return [ssr(_tmpl$$1, ssrHydrationKey(), escape(createComponent(chevron_left_default, {
        size: 24,
        "class": "text-gray-700"
      }))), ssr(_tmpl$2$1, ssrHydrationKey(), escape(createComponent(chevron_right_default, {
        size: 24,
        "class": "text-gray-700"
      })))];
    }
  })), escape(createComponent(Show, {
    get when() {
      return images.length > 1;
    },
    get children() {
      return ssr(_tmpl$3$1, ssrHydrationKey(), escape(currentIndex()) + 1, escape(images.length));
    }
  })), escape(createComponent(Show, {
    get when() {
      return images.length > 1;
    },
    get children() {
      return ssr(_tmpl$4$1, ssrHydrationKey(), escape(createComponent(For, {
        each: images,
        children: (image, index) => ssr(_tmpl$9, ssrHydrationKey(), `aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${currentIndex() === index() ? "border-primary-500 ring-2 ring-primary-500/20" : "border-transparent hover:border-gray-300"}`, ssrAttribute("src", escape(image.url, true), false) + ssrAttribute("alt", escape(image.alt, true) || `${escape(props.productName, true)} - Imagem ${escape(index(), true) + 1}`, false))
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return isZoomed();
    },
    get children() {
      return ssr(_tmpl$7$1, ssrHydrationKey(), ssrAttribute("src", escape(currentImage()?.url, true) || escape(placeholderImage, true), false) + ssrAttribute("alt", escape(currentImage()?.alt, true) || escape(props.productName, true), false), escape(createComponent(Show, {
        get when() {
          return images.length > 1;
        },
        get children() {
          return [ssr(_tmpl$5$1, ssrHydrationKey(), escape(createComponent(chevron_left_default, {
            size: 32
          }))), ssr(_tmpl$6$1, ssrHydrationKey(), escape(createComponent(chevron_right_default, {
            size: 32
          })))];
        }
      })));
    }
  })));
}

var _tmpl$ = ["<div", ' class="flex flex-wrap gap-2">', "</div>"], _tmpl$2 = ["<div", '><h3 class="text-lg font-semibold text-gray-900 mb-2">Descrição</h3><p class="text-gray-600 leading-relaxed whitespace-pre-line">', "</p></div>"], _tmpl$3 = ["<div", '><h3 class="text-lg font-semibold text-gray-900 mb-3">Selecione a Cor<!--$-->', '<!--/--></h3><div class="flex flex-wrap gap-3">', "</div></div>"], _tmpl$4 = ["<div", ' class="space-y-6"><div><h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">', "</h1><!--$-->", '<!--/--></div><div class="border-t border-b border-gray-200 py-4"><div class="flex items-baseline gap-2"><span class="text-3xl font-bold text-gray-900">', '</span><span class="text-gray-600">por unidade</span></div></div><!--$-->', "<!--/--><!--$-->", '<!--/--><div><h3 class="text-lg font-semibold text-gray-900 mb-3">Quantidade</h3><div class="flex items-center gap-3"><button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold">-</button><input type="number" min="1"', ' class="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"><button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold">+</button></div></div><div class="space-y-3"><button', ' class="', '">', '</button><button class="w-full btn border-2 border-green-500 text-green-600 hover:bg-green-50 text-lg"><!--$-->', '<!--/-->Falar no WhatsApp</button></div><div class="border-t border-gray-200 pt-6 space-y-4"><div class="flex items-start gap-3"><!--$-->', '<!--/--><div><h4 class="font-semibold text-gray-900">Entrega para todo o Brasil</h4><p class="text-sm text-gray-600">Consulte prazos e valores no checkout</p></div></div><div class="flex items-start gap-3"><!--$-->', '<!--/--><div><h4 class="font-semibold text-gray-900">Produto de qualidade</h4><p class="text-sm text-gray-600">Brindes personalizados com garantia</p></div></div><div class="flex items-start gap-3"><!--$-->', '<!--/--><div><h4 class="font-semibold text-gray-900">Atendimento personalizado</h4><p class="text-sm text-gray-600">Nossa equipe está pronta para ajudar</p></div></div></div></div>'], _tmpl$5 = ["<a", ' href="', '" class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"><!--$-->', "<!--/--><!--$-->", "<!--/--></a>"], _tmpl$6 = ["<span", ' class="text-sm text-red-500 ml-2">(obrigatório)</span>'], _tmpl$7 = ["<button", ' class="', '">', "</button>"];
function ProductDetails(props) {
  const [selectedVariation] = createSignal(null);
  const [quantity] = createSignal(1);
  const [addedToCart] = createSignal(false);
  const hasVariations = () => props.product.variations && props.product.variations.length > 0;
  const canAddToCart = () => {
    if (hasVariations() && !selectedVariation()) {
      return false;
    }
    return quantity() > 0;
  };
  return ssr(_tmpl$4, ssrHydrationKey(), escape(props.product.name), escape(createComponent(Show, {
    get when() {
      return props.product.categories && props.product.categories.length > 0;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.product.categories;
        },
        children: (category) => ssr(_tmpl$5, ssrHydrationKey(), `/loja?category=${escape(category.slug, true)}`, escape(createComponent(tag_default, {
          size: 14
        })), escape(category.name))
      })));
    }
  })), escape(formatPrice(props.product.price)), escape(createComponent(Show, {
    get when() {
      return props.product.description;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(props.product.description));
    }
  })), escape(createComponent(Show, {
    get when() {
      return hasVariations();
    },
    get children() {
      return ssr(_tmpl$3, ssrHydrationKey(), !selectedVariation() && _tmpl$6[0] + ssrHydrationKey() + _tmpl$6[1], escape(createComponent(For, {
        get each() {
          return props.product.variations;
        },
        children: (variation) => ssr(_tmpl$7, ssrHydrationKey(), `px-4 py-2 border-2 rounded-lg transition-all font-medium ${selectedVariation() === variation.id ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-300 hover:border-gray-400 text-gray-700"}`, escape(variation.color))
      })));
    }
  })), ssrAttribute("value", escape(quantity(), true), false), ssrAttribute("disabled", !canAddToCart(), true), `w-full btn-primary text-lg ${!canAddToCart() ? "opacity-50 cursor-not-allowed" : ""}`, escape(createComponent(Show, {
    get when() {
      return addedToCart();
    },
    get fallback() {
      return [createComponent(shopping_cart_default, {
        size: 24
      }), "Adicionar ao Carrinho"];
    },
    get children() {
      return [createComponent(check_default, {
        size: 24
      }), "Adicionado!"];
    }
  })), escape(createComponent(message_circle_default, {
    size: 24
  })), escape(createComponent(truck_default, {
    size: 24,
    "class": "text-primary-500 flex-shrink-0 mt-0.5"
  })), escape(createComponent(shield_default, {
    size: 24,
    "class": "text-primary-500 flex-shrink-0 mt-0.5"
  })), escape(createComponent(message_circle_default, {
    size: 24,
    "class": "text-primary-500 flex-shrink-0 mt-0.5"
  })));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$slug = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/loja");
  }
  const productUrl = new URL(`/api/products/${slug}`, Astro2.url.origin);
  const productResponse = await fetch(productUrl.toString());
  if (!productResponse.ok) {
    return Astro2.redirect("/loja");
  }
  const product = await productResponse.json();
  let relatedProducts = [];
  if (product.categories && product.categories.length > 0) {
    const relatedUrl = new URL("/api/products", Astro2.url.origin);
    relatedUrl.searchParams.set("category", product.categories[0].slug);
    relatedUrl.searchParams.set("limit", "4");
    const relatedResponse = await fetch(relatedUrl.toString());
    if (relatedResponse.ok) {
      const relatedData = await relatedResponse.json();
      relatedProducts = relatedData.products.filter((p) => p.id !== product.id);
    }
  }
  const title = `${product.name} - Rocha Brindes`;
  const description = product.description || `Confira ${product.name} - brindes personalizados de alta qualidade para sua empresa.`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="flex-1 py-8 md:py-12"> <div class="container mx-auto px-4"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-gray-600 mb-6"> <a href="/" class="hover:text-primary-500 transition-colors">Início</a> <span>/</span> <a href="/loja" class="hover:text-primary-500 transition-colors">Loja</a> ${product.categories && product.categories.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span>/</span> <a${addAttribute(`/loja?category=${product.categories[0].slug}`, "href")} class="hover:text-primary-500 transition-colors"> ${product.categories[0].name} </a> ` })}`} <span>/</span> <span class="text-gray-900 font-medium">${product.name}</span> </nav> <!-- Product Section --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"> <!-- Gallery --> <div class="product-gallery-wrapper"> ${renderComponent($$result2, "ProductGallery", ProductGallery, { "client:load": true, "mainImage": product.main_image_url, "images": product.images || [], "productName": product.name, "client:component-hydration": "load", "client:component-path": "@/components/ProductGallery", "client:component-export": "default" })} </div> <!-- Details --> <div class="product-details-wrapper"> ${renderComponent($$result2, "ProductDetails", ProductDetails, { "client:load": true, "product": product, "client:component-hydration": "load", "client:component-path": "@/components/ProductDetails", "client:component-export": "default" })} </div> </div> <!-- Related Products --> ${relatedProducts.length > 0 && renderTemplate`<section class="related-products-section"> <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6">
Produtos Relacionados
</h2> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"> ${relatedProducts.map((relatedProduct) => renderTemplate`<div class="related-product-item"> ${renderComponent($$result2, "ProductCard", ProductCard, { "client:visible": true, "product": relatedProduct, "client:component-hydration": "visible", "client:component-path": "@/components/ProductCard", "client:component-export": "default" })} </div>`)} </div> </section>`} </div> </main> ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Footer", "client:component-export": "default" })} ${renderScript($$result2, "/home/user/rocha-brindes-atualizado/src/pages/produto/[slug].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/produto/[slug].astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/produto/[slug].astro";
const $$url = "/produto/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
