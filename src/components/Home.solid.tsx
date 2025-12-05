// FILE: src/components/Home.solid.tsx
import { createQuery } from '@tanstack/solid-query';
import { fetchCatalog } from '../core/lib/api';
import { Show, Suspense } from 'solid-js';

import Header from '../shared/components/Header.solid';
import WhatsAppButton from '../shared/components/WhatsAppButton.solid';
import Providers from './Providers.solid';

function HomeContent() {
  const catalogQuery = createQuery(() => ({
    queryKey: ['catalog', 100],
    queryFn: () => fetchCatalog(100),
    staleTime: 10 * 60 * 1000,
  }));

  const whatsappNumber = () => catalogQuery.data?.whatsapp || '5589994333316';

  return (
    <>
      <Header />
      <main class="min-h-screen bg-gray-50 pt-6">
        <div class="container mx-auto px-4 pb-8">
          <div class="text-center py-20">
            <h1 class="text-5xl font-bold text-gray-900 mb-6">
              Rocha Brindes
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              Transformando ideias em brindes únicos
            </p>
            <a
              href="/catalogo"
              class="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Ver Catálogo Completo
            </a>
          </div>

          <Show when={!catalogQuery.isLoading && catalogQuery.data}>
            <div class="mt-12">
              <h2 class="text-3xl font-bold text-center mb-8">Nossos Produtos</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Produtos em destaque serão adicionados aqui */}
              </div>
            </div>
          </Show>
        </div>
      </main>

      <WhatsAppButton number={whatsappNumber()} />
    </>
  );
}

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}
