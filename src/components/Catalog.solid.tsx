// FILE: src/components/Catalog.solid.tsx
import { createQuery } from '@tanstack/solid-query';
import { fetchCatalog } from '../core/lib/api';
import { For, Show, createSignal } from 'solid-js';
import { cart, cartActions } from '../core/store/cart.solid';

import Header from '../shared/components/Header.solid';
import WhatsAppButton from '../shared/components/WhatsAppButton.solid';
import ProductCard from '../features/catalog/components/ProductCard.solid';
import Providers from './Providers.solid';

function CatalogContent() {
  const catalogQuery = createQuery(() => ({
    queryKey: ['catalog', 1000],
    queryFn: () => fetchCatalog(1000),
    staleTime: 10 * 60 * 1000,
  }));

  const [selectedProduct, setSelectedProduct] = createSignal<any>(null);
  const whatsappNumber = () => catalogQuery.data?.whatsapp || '5589994333316';

  const filteredProducts = () => {
    if (!catalogQuery.data?.products) return [];

    let products = catalogQuery.data.products;

    // Filtrar por categoria
    if (cart.category && cart.category !== 'Todos') {
      products = products.filter(p =>
        p.categorias?.includes(cart.category)
      );
    }

    // Filtrar por busca
    if (cart.search) {
      const searchLower = cart.search.toLowerCase();
      products = products.filter(p =>
        p.nome.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower)
      );
    }

    return products;
  };

  return (
    <>
      <Header showBackButton={true} />
      <main class="min-h-screen bg-gray-50 pt-6">
        <div class="container mx-auto px-4 pb-8">
          {/* Sidebar de categorias */}
          <div class="mb-6">
            <div class="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => cartActions.setCategory('Todos')}
                class={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  cart.category === 'Todos'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              <For each={catalogQuery.data?.categories || []}>
                {(category) => (
                  <button
                    onClick={() => cartActions.setCategory(category.nome)}
                    class={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      cart.category === category.nome
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.nome}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Busca */}
          <div class="mb-6">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={cart.search}
              onInput={(e) => cartActions.setSearch(e.currentTarget.value)}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Grid de produtos */}
          <Show
            when={!catalogQuery.isLoading}
            fallback={
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map(() => (
                  <div class="aspect-square bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            }
          >
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <For each={filteredProducts()}>
                {(product) => (
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                )}
              </For>
            </div>

            <Show when={filteredProducts().length === 0}>
              <div class="text-center py-12">
                <p class="text-gray-500 text-lg">Nenhum produto encontrado</p>
              </div>
            </Show>
          </Show>
        </div>
      </main>

      <WhatsAppButton number={whatsappNumber()} />
    </>
  );
}

export default function Catalog() {
  return (
    <Providers>
      <CatalogContent />
    </Providers>
  );
}
