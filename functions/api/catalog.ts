// API endpoint otimizado para catálogo (landing page)
// Retorna: produtos em destaque + categorias + banners + settings
import type { EventContext } from '@cloudflare/workers-types';
import type { Env } from './types';

export const onRequestGet = async ({ env, request }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '8');

    // Tentar pegar do cache primeiro
    const cacheKey = `catalog:${limit}`;
    const cached = await env.CACHE.get(cacheKey);

    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    // Buscar em paralelo para otimizar
    const [featuredProducts, categories, banners, settings] = await Promise.all([
      // Produtos em destaque
      env.DB.prepare(`
        SELECT * FROM products
        WHERE featured = 1 AND active = 1
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(limit).all(),

      // Categorias populares
      env.DB.prepare(`
        SELECT * FROM categories
        WHERE popular = 1
        ORDER BY order_index ASC
      `).all(),

      // Banners ativos
      env.DB.prepare(`
        SELECT * FROM banners
        WHERE active = 1
        ORDER BY order_index ASC
        LIMIT 3
      `).all(),

      // Settings
      env.DB.prepare('SELECT * FROM settings WHERE id = ?').bind('main').first(),
    ]);

    const catalogData = {
      featured_products: featuredProducts.results,
      categories: categories.results,
      banners: banners.results,
      settings,
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
