import { Show } from 'solid-js';
import { ShoppingCart, Menu, X } from 'lucide-solid';
import { cart, cartItemsCount } from '@/stores/cart';
import { createSignal } from 'solid-js';

export default function Header() {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" class="flex items-center space-x-2">
            <div class="text-2xl md:text-3xl font-display font-bold text-gradient">
              Rocha Brindes
            </div>
          </a>

          {/* Desktop Nav */}
          <nav class="hidden md:flex items-center space-x-8">
            <a href="/" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Início
            </a>
            <a href="/loja" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Loja
            </a>
            <a href="/sobre" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Sobre
            </a>
            <a href="/contato" class="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Contato
            </a>
          </nav>

          {/* Carrinho */}
          <div class="flex items-center space-x-4">
            <a
              href="/carrinho"
              class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart class="w-6 h-6 text-gray-700" />
              <Show when={cartItemsCount() > 0}>
                <span class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount()}
                </span>
              </Show>
            </a>

            {/* Mobile Menu Button */}
            <button
              class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen())}
              aria-label="Menu"
            >
              <Show when={!menuOpen()} fallback={<X class="w-6 h-6" />}>
                <Menu class="w-6 h-6" />
              </Show>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Show when={menuOpen()}>
          <nav class="md:hidden py-4 space-y-2 border-t animate-slide-in-up">
            <a
              href="/"
              class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Início
            </a>
            <a
              href="/loja"
              class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Loja
            </a>
            <a
              href="/sobre"
              class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </a>
            <a
              href="/contato"
              class="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </a>
          </nav>
        </Show>
      </div>
    </header>
  );
}
