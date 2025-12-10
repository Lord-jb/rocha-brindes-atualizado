// ==========================================
// API DE CATEGORIAS
// CRUD completo para categorias
// ==========================================

import type { Env } from '@/types';
import { getCategories, getCategoryById, getCategoryBySlug } from '@/lib/db';

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET - Listar categorias ou obter uma específica
    if (request.method === 'GET') {
      const id = url.searchParams.get('id');
      const slug = url.searchParams.get('slug');
      const popularOnly = url.searchParams.get('popular') === 'true';

      // Buscar por ID
      if (id) {
        const category = await getCategoryById(env, id);
        if (!category) {
          return new Response(
            JSON.stringify({ error: 'Category not found' }),
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(JSON.stringify(category), { status: 200, headers: corsHeaders });
      }

      // Buscar por slug
      if (slug) {
        const category = await getCategoryBySlug(env, slug);
        if (!category) {
          return new Response(
            JSON.stringify({ error: 'Category not found' }),
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(JSON.stringify(category), { status: 200, headers: corsHeaders });
      }

      // Listar todas as categorias
      const categories = await getCategories(env, popularOnly);

      return new Response(
        JSON.stringify({ categories }),
        { status: 200, headers: corsHeaders }
      );
    }

    // POST - Criar categoria (admin)
    if (request.method === 'POST') {
      const data = await request.json();

      const id = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        INSERT INTO categories (
          id, name, slug, description, image_url,
          popular, product_count, order_index, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.name,
        data.slug,
        data.description || null,
        data.image_url || null,
        data.popular ? 1 : 0,
        0,
        data.order_index || 0,
        now,
        now
      ).run();

      const category = await getCategoryById(env, id);

      return new Response(
        JSON.stringify({ success: true, category }),
        { status: 201, headers: corsHeaders }
      );
    }

    // PUT - Atualizar categoria (admin)
    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Category ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const data = await request.json();
      const now = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        UPDATE categories SET
          name = ?, slug = ?, description = ?, image_url = ?,
          popular = ?, order_index = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        data.name,
        data.slug,
        data.description || null,
        data.image_url || null,
        data.popular ? 1 : 0,
        data.order_index || 0,
        now,
        id
      ).run();

      const category = await getCategoryById(env, id);

      return new Response(
        JSON.stringify({ success: true, category }),
        { status: 200, headers: corsHeaders }
      );
    }

    // DELETE - Deletar categoria (admin)
    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Category ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Remover associações com produtos
      await env.DB.prepare('DELETE FROM product_categories WHERE category_id = ?').bind(id).run();

      // Deletar categoria
      await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ success: true, message: 'Category deleted successfully' }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in categories API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
