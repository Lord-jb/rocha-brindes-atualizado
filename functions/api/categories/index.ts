// API endpoint para categorias
import type { EventContext } from '@cloudflare/workers-types';
import type { Env, Category, CategoryFormData } from '../types';
import { generateSlug, booleanToDbBool } from '../../../src/types';

export const onRequestGet = async ({ env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const { results } = await env.DB.prepare(`
      SELECT * FROM categories
      ORDER BY order_index ASC, name ASC
    `).all();

    const categories = results.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image_url: row.image_url,
      popular: Boolean(row.popular),
      product_count: row.product_count,
      order_index: row.order_index,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return new Response(JSON.stringify(categories), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const body = await request.json() as CategoryFormData;
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    await env.DB.prepare(`
      INSERT INTO categories (id, name, slug, description, image_url, popular, order_index, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.name,
      body.slug,
      body.description || null,
      body.image_url || null,
      body.popular ? 1 : 0,
      body.order_index || 0,
      now,
      now
    ).run();

    const result = await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
