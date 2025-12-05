// FILE: src/shared/components/Header.solid.tsx
import { ShoppingBag, ArrowLeft } from 'lucide-solid';
import { cart, cartActions } from '../../core/store/cart.solid';
import { createQuery } from '@tanstack/solid-query';
import { fetchCatalog } from '../../core/lib/api';
import { optimizeUrl } from '../../core/lib/cloudflare';
import { Show, createMemo } from 'solid-js';

interface HeaderProps {
  showBackButton?: boolean;
}

export default function Header(props: HeaderProps) {
  const catalogQuery = createQuery(() => ({
    queryKey: ['catalog', 100],
    queryFn: () => fetchCatalog(100),
    staleTime: 10 * 60 * 1000,
  }));

  const logoUrl = createMemo(() => {
    const logoId = catalogQuery.data?.layout.logo;
    return logoId ? optimizeUrl(logoId, 'thumbnail') : '';
  });

  return (
    <header class="sticky top-0 z-40 bg-black shadow-md border-b border-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16 sm:h-20">
          {/* Back Button ou Espaço vazio */}
          <div class="w-10 sm:w-12">
            <Show when={props.showBackButton}>
              <a
                href="/"
                class="flex items-center justify-center p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} class="text-white" stroke-width={2.5} />
              </a>
            </Show>
          </div>

          {/* Logo */}
          <a
            href="/"
            class={`flex items-center ${
              props.showBackButton
                ? 'absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0'
                : ''
            }`}
          >
            <Show
              when={!catalogQuery.isLoading && logoUrl()}
              fallback={<div class="h-10 sm:h-14 md:h-16 w-32 sm:w-48 md:w-64 bg-gray-200 animate-pulse rounded" />}
            >
              <img
                src={logoUrl()}
                alt="Rocha Brindes"
                class="h-5 sm:h-7 md:h-9 w-auto object-contain"
                loading="eager"
              />
            </Show>
          </a>

          {/* Cart Button */}
          <button
            onClick={cartActions.toggle}
            class="relative p-2.5 sm:p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={20} class="sm:w-6 sm:h-6" stroke-width={2.5} />
            <Show when={cart.count > 0}>
              <span class="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-accent text-dark font-bold text-[10px] sm:text-xs min-w-[20px] sm:min-w-[24px] h-[20px] sm:h-[24px] flex items-center justify-center rounded-full border-2 sm:border-3 border-white shadow-md">
                {cart.count}
              </span>
            </Show>
          </button>
        </div>
      </div>
    </header>
  );
}
