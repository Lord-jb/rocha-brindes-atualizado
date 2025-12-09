globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent$1, h as addAttribute, l as renderHead, k as renderComponent, n as renderSlot, r as renderTemplate } from './astro/server_DIHz_uPh.mjs';
import { a as createComponent, m as mergeProps, s as ssr, c as createSignal, e as escape, b as ssrHydrationKey, d as ssrAttribute, F as For } from './_@astro-renderers_C0wH7-Ml.mjs';
import { I as Icon_default, x as x_default, m as menu_default, s as shopping_cart_default } from './x_CSnmG0sU.mjs';
import { p as package_default } from './package_D3TH6edF.mjs';

var iconNode$3 = [["path", {
  d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
  key: "usdka0"
}]];
var FolderOpen = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "FolderOpen",
  iconNode: iconNode$3
}));
var folder_open_default = FolderOpen;

var iconNode$2 = [["path", {
  d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
  key: "5wwlr5"
}], ["path", {
  d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  key: "1d0kgt"
}]];
var House = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "House",
  iconNode: iconNode$2
}));
var house_default = House;

var iconNode$1 = [["rect", {
  width: "7",
  height: "9",
  x: "3",
  y: "3",
  rx: "1",
  key: "10lvy0"
}], ["rect", {
  width: "7",
  height: "5",
  x: "14",
  y: "3",
  rx: "1",
  key: "16une8"
}], ["rect", {
  width: "7",
  height: "9",
  x: "14",
  y: "12",
  rx: "1",
  key: "1hutg5"
}], ["rect", {
  width: "7",
  height: "5",
  x: "3",
  y: "16",
  rx: "1",
  key: "ldoo1y"
}]];
var LayoutDashboard = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "LayoutDashboard",
  iconNode: iconNode$1
}));
var layout_dashboard_default = LayoutDashboard;

var iconNode = [["path", {
  d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
  key: "1qme2f"
}], ["circle", {
  cx: "12",
  cy: "12",
  r: "3",
  key: "1v7zrd"
}]];
var Settings = (props) => createComponent(Icon_default, mergeProps(props, {
  name: "Settings",
  iconNode
}));
var settings_default = Settings;

var _tmpl$ = ["<button", ' class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg">', "</button>"], _tmpl$2 = ["<aside", ' class="', '"><div class="flex flex-col h-full"><div class="p-6 border-b border-gray-800"><a href="/admin" class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-700 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xl">R</span></div><div><h1 class="font-display font-bold text-lg">Rocha Brindes</h1><p class="text-xs text-gray-400">Painel Admin</p></div></a></div><nav class="flex-1 p-4 space-y-1">', '</nav><div class="p-4 border-t border-gray-800"><a href="/" target="_blank" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"><!--$-->', '<!--/--><span class="font-medium">Ver Site</span></a></div></div></aside>'], _tmpl$3 = ["<a", ' class="', '"><!--$-->', '<!--/--><span class="font-medium">', "</span></a>"], _tmpl$4 = ["<div", ' class="lg:hidden fixed inset-0 bg-black/50 z-30"></div>'];
function AdminSidebar() {
  const [mobileMenuOpen] = createSignal(false);
  const menuItems = [{
    label: "Dashboard",
    href: "/admin",
    icon: layout_dashboard_default
  }, {
    label: "Produtos",
    href: "/admin/produtos",
    icon: package_default
  }, {
    label: "Categorias",
    href: "/admin/categorias",
    icon: folder_open_default
  }, {
    label: "Pedidos",
    href: "/admin/pedidos",
    icon: shopping_cart_default
  }, {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: settings_default
  }];
  const isCurrentPage = (href) => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === href;
  };
  return [ssr(_tmpl$, ssrHydrationKey(), mobileMenuOpen() ? escape(createComponent(x_default, {
    size: 24
  })) : escape(createComponent(menu_default, {
    size: 24
  }))), ssr(_tmpl$2, ssrHydrationKey(), `fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen() ? "translate-x-0" : "-translate-x-full"}`, escape(createComponent(For, {
    each: menuItems,
    children: (item) => {
      const Icon = item.icon;
      const current = isCurrentPage(item.href);
      return ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("href", escape(item.href, true), false), `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${current ? "bg-primary-500 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`, escape(createComponent(Icon, {
        size: 20
      })), escape(item.label));
    }
  })), escape(createComponent(house_default, {
    size: 20
  }))), mobileMenuOpen() && ssr(_tmpl$4, ssrHydrationKey())];
}

const $$Astro = createAstro("https://rochabrindes.com");
const $$AdminLayout = createComponent$1(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Admin - Rocha Brindes", description = "Painel administrativo" } = Astro2.props;
  return renderTemplate`<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="min-h-screen flex bg-gray-50"> <!-- Sidebar --> ${renderComponent($$result, "AdminSidebar", AdminSidebar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AdminSidebar", "client:component-export": "default" })} <!-- Main Content --> <div class="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64"> <main class="flex-1 p-4 md:p-8"> ${renderSlot($$result, $$slots["default"])} </main> <!-- Admin Footer --> <footer class="bg-white border-t border-gray-200 py-4 px-8"> <p class="text-sm text-gray-600 text-center">
© 2024 Rocha Brindes - Painel Administrativo
</p> </footer> </div> </body></html>`;
}, "/home/user/rocha-brindes-atualizado/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $, folder_open_default as f };
