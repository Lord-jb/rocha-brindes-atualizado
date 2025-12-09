globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../renderers.mjs';

const GET = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  const robotsTxt = `
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${sitemapURL.href}
`.trim();
  return new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
