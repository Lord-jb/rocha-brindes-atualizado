globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML } from '../chunks/astro/server_Cqv084t8.mjs';
import { $ as $$Layout } from '../chunks/Layout_ClsM8hUu.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://rochabrindes.com/#organization",
        "name": "Rocha Brindes",
        "url": "https://rochabrindes.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rochabrindes.com/favicon-light.png",
          "width": 512,
          "height": 512
        },
        "image": "https://rochabrindes.com/favicon-light.png",
        "description": "L\xEDder em brindes personalizados corporativos. Canetas, garrafas, kits executivos e tecnologia para sua empresa.",
        "telephone": "+55-89-99433-3316",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BR"
        },
        "priceRange": "$$",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+55-89-99433-3316",
          "contactType": "sales",
          "areaServed": "BR",
          "availableLanguage": "Portuguese"
        },
        "sameAs": [
          "https://instagram.com/rochabrindes",
          "https://facebook.com/rochabrindes"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://rochabrindes.com/#website",
        "url": "https://rochabrindes.com",
        "name": "Rocha Brindes - Cat\xE1logo Oficial",
        "publisher": {
          "@id": "https://rochabrindes.com/#organization"
        },
        "inLanguage": "pt-BR",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://rochabrindes.com/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", " "])), unescapeHTML(schema), renderComponent($$result2, "Home", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/user/rocha-brindes-atualizado/src/components/Home.solid", "client:component-export": "default" })) })}`;
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
