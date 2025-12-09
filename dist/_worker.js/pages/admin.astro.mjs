globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_Cqv084t8.mjs';
import { $ as $$Layout } from '../chunks/Layout_BD8dT7aL.mjs';
export { renderers } from '../renderers.mjs';

const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin - Rocha Brindes" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminApp", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/jorge/apps/rocha-brindes-atualizado/src/components/Admin.solid", "client:component-export": "default" })} ` })}`;
}, "/home/jorge/apps/rocha-brindes-atualizado/src/pages/admin.astro", void 0);

const $$file = "/home/jorge/apps/rocha-brindes-atualizado/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
