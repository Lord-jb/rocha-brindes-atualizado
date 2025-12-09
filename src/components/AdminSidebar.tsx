import { createSignal, For } from 'solid-js';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Home,
} from 'lucide-solid';

export default function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Produtos', href: '/admin/produtos', icon: Package },
    { label: 'Categorias', href: '/admin/categorias', icon: FolderOpen },
    { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
    { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];

  const isCurrentPage = (href: string) => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === href;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
        class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen() ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        class={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen() ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div class="flex flex-col h-full">
          {/* Logo */}
          <div class="p-6 border-b border-gray-800">
            <a href="/admin" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-700 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 class="font-display font-bold text-lg">Rocha Brindes</h1>
                <p class="text-xs text-gray-400">Painel Admin</p>
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav class="flex-1 p-4 space-y-1">
            <For each={menuItems}>
              {(item) => {
                const Icon = item.icon;
                const current = isCurrentPage(item.href);
                return (
                  <a
                    href={item.href}
                    class={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      current
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span class="font-medium">{item.label}</span>
                  </a>
                );
              }}
            </For>
          </nav>

          {/* Bottom Links */}
          <div class="p-4 border-t border-gray-800">
            <a
              href="/"
              target="_blank"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Home size={20} />
              <span class="font-medium">Ver Site</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen() && (
        <div
          class="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
