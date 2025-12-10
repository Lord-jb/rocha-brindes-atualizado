// ==========================================
// API DE CATÁLOGO
// Retorna produtos em destaque, categorias e configurações
// ==========================================

import type { Env } from '@/types';
import { getProducts, getCategories, getSettings } from '@/lib/db';

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Apenas GET é permitido
  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Obter parâmetros de query
    const limit = parseInt(url.searchParams.get('limit') || '8');
    const popularOnly = url.searchParams.get('popular') === 'true';

    // Buscar produtos em destaque
    const { products: featured_products } = await getProducts(env, {
      featured: true,
      limit,
      page: 1,
    });

    // Buscar categorias
    const categories = await getCategories(env, popularOnly);

    // Buscar configurações
    const settings = await getSettings(env);

    // Retornar dados do catálogo
    return new Response(
      JSON.stringify({
        featured_products,
        categories,
        settings,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in catalog API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
