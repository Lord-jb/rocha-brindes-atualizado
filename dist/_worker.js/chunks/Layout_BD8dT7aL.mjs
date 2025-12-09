globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, h as addAttribute, l as renderHead, n as renderSlot, r as renderTemplate } from './astro/server_Cqv084t8.mjs';
/* empty css                         */

const $$Astro = createAstro("https://rochabrindes.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Rocha Brindes | Brindes Corporativos, Kits Executivos e Personalizados",
    description = "Fabricante e fornecedor de brindes personalizados para empresas. Or\xE7amento r\xE1pido em Canetas, Garrafas T\xE9rmicas, Agendas, Bon\xE9s e Kits Boas-Vindas. Atendemos todo o Brasil.",
    image = "/favicon-light.png"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate`<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="keywords" content="brindes corporativos, brindes personalizados, kits executivos, canetas personalizadas, garrafas térmicas, brindes para empresas, atacado, rocha brindes"><link rel="canonical"${addAttribute(canonicalURL, "href")}><link rel="icon" type="image/png" sizes="32x32" href="/favicon-light.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro2.url), "content")}><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image, Astro2.url), "content")}>${renderHead()}</head> <body class="antialiased bg-[#F8F9FA] text-[#1A1A2E] font-[Inter]"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/home/jorge/apps/rocha-brindes-atualizado/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
