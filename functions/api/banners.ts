// ==========================================
// API DE BANNERS
// CRUD completo para banners
// ==========================================

import type { Env } from '@/types';
import { getBanners } from '@/lib/db';

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
    // GET - Listar banners
    if (request.method === 'GET') {
      const activeOnly = url.searchParams.get('active') !== 'false';
      const banners = await getBanners(env, activeOnly);

      return new Response(
        JSON.stringify({ banners }),
        { status: 200, headers: corsHeaders }
      );
    }

    // POST - Criar banner (admin)
    if (request.method === 'POST') {
      const data = await request.json();

      const id = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        INSERT INTO banners (
          id, title, subtitle, image_url, link_url,
          cta_text, order_index, active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.title || null,
        data.subtitle || null,
        data.image_url,
        data.link_url || null,
        data.cta_text || null,
        data.order_index || 0,
        data.active ? 1 : 0,
        now
      ).run();

      const banner = await env.DB.prepare('SELECT * FROM banners WHERE id = ?').bind(id).first();

      return new Response(
        JSON.stringify({ success: true, banner }),
        { status: 201, headers: corsHeaders }
      );
    }

    // PUT - Atualizar banner (admin)
    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Banner ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const data = await request.json();

      await env.DB.prepare(`
        UPDATE banners SET
          title = ?, subtitle = ?, image_url = ?, link_url = ?,
          cta_text = ?, order_index = ?, active = ?
        WHERE id = ?
      `).bind(
        data.title || null,
        data.subtitle || null,
        data.image_url,
        data.link_url || null,
        data.cta_text || null,
        data.order_index || 0,
        data.active ? 1 : 0,
        id
      ).run();

      const banner = await env.DB.prepare('SELECT * FROM banners WHERE id = ?').bind(id).first();

      return new Response(
        JSON.stringify({ success: true, banner }),
        { status: 200, headers: corsHeaders }
      );
    }

    // DELETE - Deletar banner (admin)
    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Banner ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      await env.DB.prepare('DELETE FROM banners WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ success: true, message: 'Banner deleted successfully' }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in banners API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
