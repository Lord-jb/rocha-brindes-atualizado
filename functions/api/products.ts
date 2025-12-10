// ==========================================
// API DE PRODUTOS
// CRUD completo para produtos
// ==========================================

import type { Env, ProductFilters } from '@/types';
import { getProducts, getProductById, getProductBySlug } from '@/lib/db';

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
    // GET - Listar produtos ou obter um específico
    if (request.method === 'GET') {
      const id = url.searchParams.get('id');
      const slug = url.searchParams.get('slug');

      // Buscar por ID
      if (id) {
        const product = await getProductById(env, id);
        if (!product) {
          return new Response(
            JSON.stringify({ error: 'Product not found' }),
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(JSON.stringify(product), { status: 200, headers: corsHeaders });
      }

      // Buscar por slug
      if (slug) {
        const product = await getProductBySlug(env, slug);
        if (!product) {
          return new Response(
            JSON.stringify({ error: 'Product not found' }),
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(JSON.stringify(product), { status: 200, headers: corsHeaders });
      }

      // Listar produtos com filtros
      const filters: ProductFilters = {
        category: url.searchParams.get('category') || undefined,
        featured: url.searchParams.get('featured') === 'true' ? true : undefined,
        search: url.searchParams.get('search') || undefined,
        min_price: url.searchParams.get('min_price') ? parseFloat(url.searchParams.get('min_price')!) : undefined,
        max_price: url.searchParams.get('max_price') ? parseFloat(url.searchParams.get('max_price')!) : undefined,
        sort: (url.searchParams.get('sort') as any) || 'newest',
        page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 1,
        limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 12,
      };

      const { products, total } = await getProducts(env, filters);

      return new Response(
        JSON.stringify({
          products,
          total,
          page: filters.page,
          limit: filters.limit,
          total_pages: Math.ceil(total / (filters.limit || 12)),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // POST - Criar produto (admin)
    if (request.method === 'POST') {
      const data = await request.json();

      // Gerar ID único
      const id = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        INSERT INTO products (
          id, name, slug, description, price, featured, active,
          main_image_url, main_thumb_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.name,
        data.slug,
        data.description || null,
        data.price,
        data.featured ? 1 : 0,
        data.active ? 1 : 0,
        data.main_image_url || null,
        data.main_thumb_url || null,
        now,
        now
      ).run();

      // Adicionar categorias
      if (data.category_ids && data.category_ids.length > 0) {
        for (const categoryId of data.category_ids) {
          await env.DB.prepare(`
            INSERT INTO product_categories (product_id, category_id)
            VALUES (?, ?)
          `).bind(id, categoryId).run();
        }
      }

      // Adicionar imagens
      if (data.images && data.images.length > 0) {
        for (const image of data.images) {
          await env.DB.prepare(`
            INSERT INTO product_images (
              id, product_id, image_url, thumb_url, order_index, alt_text, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            crypto.randomUUID(),
            id,
            image.image_url,
            image.thumb_url || null,
            image.order_index,
            image.alt_text || null,
            now
          ).run();
        }
      }

      // Adicionar variações
      if (data.variations && data.variations.length > 0) {
        for (const variation of data.variations) {
          await env.DB.prepare(`
            INSERT INTO product_variations (
              id, product_id, color, size, sku, image_url, thumb_url,
              price_modifier, stock, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            crypto.randomUUID(),
            id,
            variation.color || null,
            variation.size || null,
            variation.sku || null,
            variation.image_url || null,
            variation.thumb_url || null,
            variation.price_modifier,
            variation.stock,
            now
          ).run();
        }
      }

      const product = await getProductById(env, id);

      return new Response(
        JSON.stringify({ success: true, product }),
        { status: 201, headers: corsHeaders }
      );
    }

    // PUT - Atualizar produto (admin)
    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Product ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const data = await request.json();
      const now = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        UPDATE products SET
          name = ?, slug = ?, description = ?, price = ?,
          featured = ?, active = ?, main_image_url = ?,
          main_thumb_url = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        data.name,
        data.slug,
        data.description || null,
        data.price,
        data.featured ? 1 : 0,
        data.active ? 1 : 0,
        data.main_image_url || null,
        data.main_thumb_url || null,
        now,
        id
      ).run();

      // Atualizar categorias (remover antigas e adicionar novas)
      if (data.category_ids !== undefined) {
        await env.DB.prepare('DELETE FROM product_categories WHERE product_id = ?').bind(id).run();

        if (data.category_ids.length > 0) {
          for (const categoryId of data.category_ids) {
            await env.DB.prepare(`
              INSERT INTO product_categories (product_id, category_id)
              VALUES (?, ?)
            `).bind(id, categoryId).run();
          }
        }
      }

      const product = await getProductById(env, id);

      return new Response(
        JSON.stringify({ success: true, product }),
        { status: 200, headers: corsHeaders }
      );
    }

    // DELETE - Deletar produto (admin)
    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Product ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Deletar categorias relacionadas
      await env.DB.prepare('DELETE FROM product_categories WHERE product_id = ?').bind(id).run();

      // Deletar imagens relacionadas
      await env.DB.prepare('DELETE FROM product_images WHERE product_id = ?').bind(id).run();

      // Deletar variações relacionadas
      await env.DB.prepare('DELETE FROM product_variations WHERE product_id = ?').bind(id).run();

      // Deletar produto
      await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ success: true, message: 'Product deleted successfully' }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in products API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
