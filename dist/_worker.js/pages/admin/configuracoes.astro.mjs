globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DIHz_uPh.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B9-CKBo4.mjs';
import { a as createComponent, m as mergeProps, c as createSignal, s as ssr, e as escape, b as ssrHydrationKey, S as Show, d as ssrAttribute } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { I as Icon_default } from '../../chunks/x_CSnmG0sU.mjs';

var iconNode = [["path", {
  d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  key: "1c8476"
}], ["path", {
  d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
  key: "1ydtos"
}], ["path", {
  d: "M7 3v4a1 1 0 0 0 1 1h7",
  key: "t51u73"
}]];
var Save = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Save",
  iconNode
}));
var save_default = Save;

var _tmpl$ = ["<span", ' class="text-green-600 font-medium">✓ Configurações salvas com sucesso!</span>'], _tmpl$2 = ["<form", ' class="bg-white rounded-xl shadow-card p-6 md:p-8"><div class="space-y-6"><div><label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label><input type="text" id="company_name"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Rocha Brindes"></div><div><label for="description" class="block text-sm font-medium text-gray-700 mb-2">Descrição da Empresa</label><textarea id="description"', ' rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Especializada em brindes personalizados de alta qualidade..."></textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" id="email"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="contato@rochabrindes.com"></div><div><label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Telefone</label><input type="tel" id="phone"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="(96) 98124-7830"></div></div><div><label for="address" class="block text-sm font-medium text-gray-700 mb-2">Endereço</label><input type="text" id="address"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Macapá, AP"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="instagram_url" class="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label><input type="url" id="instagram_url"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="https://instagram.com/rochabrindes"></div><div><label for="facebook_url" class="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label><input type="url" id="facebook_url"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="https://facebook.com/rochabrindes"></div></div><div><label for="whatsapp_number" class="block text-sm font-medium text-gray-700 mb-2">Número do WhatsApp (com DDI)</label><input type="tel" id="whatsapp_number"', ' class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="5596981247830"><p class="text-sm text-gray-500 mt-1">Formato: código do país + DDD + número (ex: 5596981247830)</p></div><div class="flex items-center gap-4 pt-6 border-t border-gray-200"><button type="submit"', ' class="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></button><!--$-->", "<!--/--></div></div></form>"];
function AdminSettings(props) {
  const [formData] = createSignal(props.settings || {});
  const [isSaving] = createSignal(false);
  const [saveSuccess] = createSignal(false);
  return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("value", escape(formData().company_name, true) || "", false), ssrAttribute("value", escape(formData().description, true) || "", false), ssrAttribute("value", escape(formData().email, true) || "", false), ssrAttribute("value", escape(formData().phone, true) || "", false), ssrAttribute("value", escape(formData().address, true) || "", false), ssrAttribute("value", escape(formData().instagram_url, true) || "", false), ssrAttribute("value", escape(formData().facebook_url, true) || "", false), ssrAttribute("value", escape(formData().whatsapp_number, true) || "", false), ssrAttribute("disabled", isSaving(), true), `btn-primary ${isSaving() ? "opacity-50 cursor-not-allowed" : ""}`, escape(createComponent(save_default, {
    size: 20
  })), isSaving() ? "Salvando..." : "Salvar Configurações", escape(createComponent(Show, {
    get when() {
      return saveSuccess();
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey());
    }
  })));
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$Configuracoes = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Configuracoes;
  const settingsUrl = new URL("/api/settings", Astro2.url.origin);
  let settings = null;
  try {
    const settingsResponse = await fetch(settingsUrl.toString());
    if (settingsResponse.ok) {
      settings = await settingsResponse.json();
    }
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Configura\xE7\xF5es - Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
Configurações
</h1> <p class="text-gray-600">
Gerencie as configurações do site
</p> </div>  ${renderComponent($$result2, "AdminSettings", AdminSettings, { "client:load": true, "settings": settings, "client:component-hydration": "load", "client:component-path": "@/components/AdminSettings", "client:component-export": "default" })} ` })}`;
}, "/home/user/rocha-brindes-atualizado/src/pages/admin/configuracoes.astro", void 0);

const $$file = "/home/user/rocha-brindes-atualizado/src/pages/admin/configuracoes.astro";
const $$url = "/admin/configuracoes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Configuracoes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
