// API endpoint para catálogo completo (produtos + categorias + layout)
import type { EventContext } from '@cloudflare/workers-types';
import { getProducts, getCategories, getLayoutConfig } from './db';
import type { Env } from './types';

export const onRequestGet = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '100');

  try {
    // Tentar pegar do cache primeiro
    const cacheKey = `catalog:${limit}`;
    const cached = await env.CACHE.get(cacheKey);

    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
      });
    }

    // Buscar dados em paralelo
    const [products, categories, layout] = await Promise.all([
      getProducts(env, limit),
      getCategories(env),
      getLayoutConfig(env),
    ]);

    const catalogData = {
      products,
      categories,
      layout,
      whatsapp: layout.whatsapp,
    };

    const response = JSON.stringify(catalogData);

    // Cachear por 5 minutos
    await env.CACHE.put(cacheKey, response, { expirationTtl: 300 });

    return new Response(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'X-Cache': 'MISS',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
