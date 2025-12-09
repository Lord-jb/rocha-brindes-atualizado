globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_Cqv084t8.mjs';
import { $ as $$Layout } from '../chunks/Layout_BD8dT7aL.mjs';
export { renderers } from '../renderers.mjs';

const $$Catalogo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cat\xE1logo - Rocha Brindes" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Catalog", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/jorge/apps/rocha-brindes-atualizado/src/components/Catalog.solid", "client:component-export": "default" })} ` })}`;
}, "/home/jorge/apps/rocha-brindes-atualizado/src/pages/catalogo.astro", void 0);

const $$file = "/home/jorge/apps/rocha-brindes-atualizado/src/pages/catalogo.astro";
const $$url = "/catalogo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Catalogo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
