globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, o as renderScript } from '../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$Layout, H as Header, F as Footer } from '../chunks/Footer_BPJeEWO3.mjs';
import { P as ProductCard } from '../chunks/ProductCard_BBeHDls_.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_C0wH7-Ml.mjs';

const $$Astro = createAstro("https://rochabrindes.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let featured_products = [];
  let categories = [];
  let settings = {};
  try {
    const catalogUrl = new URL("/api/catalog?limit=8", Astro2.url.origin);
    const response = await fetch(catalogUrl.toString());
    if (response.ok) {
      const data = await response.json();
      featured_products = data.featured_products || [];
      categories = data.categories || [];
      settings = data.settings || {};
    } else {
      console.error("Failed to fetch catalog:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error fetching catalog:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": settings.meta_title || "Rocha Brindes - Brindes Personalizados", "description": settings.meta_description || settings.description }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="flex-1"> <!-- Hero Section --> <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 md:py-32"> <div class="container"> <div class="grid md:grid-cols-2 gap-12 items-center"> <div class="space-y-6 hero-text"> <h1 class="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight">
Brindes Personalizados de
<span class="text-gradient">Alta Qualidade</span> </h1> <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
Impressione seus clientes com brindes únicos e personalizados. Qualidade garantida e
              entrega rápida.
</p> <div class="flex flex-col sm:flex-row gap-4"> <a href="/loja" class="btn btn-primary btn-lg">Ver Catálogo</a> <a${addAttribute(`https://wa.me/${settings.whatsapp_number || "5596981247830"}?text=Ol\xE1! Gostaria de fazer um or\xE7amento.`, "href")} target="_blank" class="btn btn-outline btn-lg">
Falar no WhatsApp
</a> </div> </div> <div class="relative hero-image"> <div class="aspect-square rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-700 opacity-10 absolute inset-0"></div> </div> </div> </div> </section> <!-- Produtos em Destaque --> ${featured_products.length > 0 && renderTemplate`<section class="section bg-gray-50 products-section"> <div class="container"> <div class="text-center mb-12"> <h2 class="text-3xl md:text-4xl font-display font-bold text-gray-900">
Produtos em Destaque
</h2> <p class="text-gray-600 mt-4">Nossos brindes mais populares</p> </div> <div class="product-grid"> ${featured_products.map((product) => renderTemplate`<div class="product-card-wrapper"> ${renderComponent($$result2, "ProductCard", ProductCard, { "product": product, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/ProductCard", "client:component-export": "default" })} </div>`)} </div> <div class="text-center mt-12"> <a href="/loja" class="btn btn-primary btn-lg">Ver Todos os Produtos</a> </div> </div> </section>`} <!-- CTA --> <section class="section bg-gradient-to-r from-primary-500 to-secondary-700 text-white cta-section"> <div class="container text-center"> <h2 class="text-3xl md:text-5xl font-display font-bold mb-6">Pronto para Começar?</h2> <p class="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
Entre em contato e receba um orçamento personalizado.
</p> <a${addAttribute(`https://wa.me/${settings.whatsapp_number || "5596981247830"}?text=Ol\xE1! Gostaria de fazer um or\xE7amento.`, "href")} target="_blank" class="btn btn-lg bg-white text-primary-500 hover:bg-gray-100">
Solicitar Orçamento
</a> </div> </section> </main> ${renderComponent($$result2, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Footer", "client:component-export": "default" })} ${renderScript($$result2, "/home/user/rocha-brindes-atualizado/src/pages/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/index.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
