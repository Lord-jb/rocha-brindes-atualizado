globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_C0wH7-Ml.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D6Tn8Bd9.mjs';
import { manifest } from './manifest_DQQe8f8Z.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/categorias.astro.mjs');
const _page2 = () => import('./pages/admin/configuracoes.astro.mjs');
const _page3 = () => import('./pages/admin/pedidos.astro.mjs');
const _page4 = () => import('./pages/admin/produtos.astro.mjs');
const _page5 = () => import('./pages/admin.astro.mjs');
const _page6 = () => import('./pages/carrinho.astro.mjs');
const _page7 = () => import('./pages/checkout.astro.mjs');
const _page8 = () => import('./pages/loja.astro.mjs');
const _page9 = () => import('./pages/pedido/_id_.astro.mjs');
const _page10 = () => import('./pages/produto/_slug_.astro.mjs');
const _page11 = () => import('./pages/robots.txt.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/admin/categorias.astro", _page1],
    ["src/pages/admin/configuracoes.astro", _page2],
    ["src/pages/admin/pedidos.astro", _page3],
    ["src/pages/admin/produtos.astro", _page4],
    ["src/pages/admin/index.astro", _page5],
    ["src/pages/carrinho.astro", _page6],
    ["src/pages/checkout.astro", _page7],
    ["src/pages/loja.astro", _page8],
    ["src/pages/pedido/[id].astro", _page9],
    ["src/pages/produto/[slug].astro", _page10],
    ["src/pages/robots.txt.ts", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
