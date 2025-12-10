// ==========================================
// API DE CATÁLOGO
// Retorna produtos em destaque, categorias e configurações
// ==========================================

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);

  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    // Obter parâmetros de query
    const limit = parseInt(url.searchParams.get('limit') || '8');

    // Por enquanto, retornar dados mockados até ter o DB configurado
    const catalog = {
      featured_products: [],
      categories: [],
      settings: {
        meta_title: 'Rocha Brindes - Brindes Personalizados de Alta Qualidade',
        meta_description: 'Transforme sua marca com brindes personalizados de alta qualidade.',
        whatsapp_number: '5596981247830',
      },
    };

    // Retornar dados do catálogo
    return new Response(
      JSON.stringify(catalog),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in catalog API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
