// ==========================================
// API DE CONFIGURAÇÕES
// Obter e atualizar configurações do site
// ==========================================

import type { Env } from '@/types';
import { getSettings } from '@/lib/db';

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET - Obter configurações
    if (request.method === 'GET') {
      const settings = await getSettings(env);

      if (!settings) {
        // Se não existir, criar configuração padrão
        const now = Math.floor(Date.now() / 1000);

        await env.DB.prepare(`
          INSERT INTO settings (
            id, company_name, description, address, phone, email,
            whatsapp_number, instagram_url, facebook_url, linkedin_url,
            youtube_url, business_hours, cnpj, copyright, logo_url,
            favicon_url, primary_color, secondary_color, meta_title,
            meta_description, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          'main',
          'Rocha Brindes',
          'Brindes personalizados de alta qualidade',
          null,
          null,
          null,
          '5596981247830',
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          '#0066cc',
          '#ff6600',
          'Rocha Brindes - Brindes Personalizados',
          'Brindes personalizados de alta qualidade para empresas e eventos',
          now
        ).run();

        const newSettings = await getSettings(env);
        return new Response(JSON.stringify(newSettings), { status: 200, headers: corsHeaders });
      }

      return new Response(JSON.stringify(settings), { status: 200, headers: corsHeaders });
    }

    // PUT - Atualizar configurações (admin)
    if (request.method === 'PUT') {
      const data = await request.json();
      const now = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        UPDATE settings SET
          company_name = ?,
          description = ?,
          address = ?,
          phone = ?,
          email = ?,
          whatsapp_number = ?,
          instagram_url = ?,
          facebook_url = ?,
          linkedin_url = ?,
          youtube_url = ?,
          business_hours = ?,
          cnpj = ?,
          copyright = ?,
          logo_url = ?,
          favicon_url = ?,
          primary_color = ?,
          secondary_color = ?,
          meta_title = ?,
          meta_description = ?,
          updated_at = ?
        WHERE id = 'main'
      `).bind(
        data.company_name,
        data.description || null,
        data.address || null,
        data.phone || null,
        data.email || null,
        data.whatsapp_number || null,
        data.instagram_url || null,
        data.facebook_url || null,
        data.linkedin_url || null,
        data.youtube_url || null,
        data.business_hours || null,
        data.cnpj || null,
        data.copyright || null,
        data.logo_url || null,
        data.favicon_url || null,
        data.primary_color || '#0066cc',
        data.secondary_color || '#ff6600',
        data.meta_title || null,
        data.meta_description || null,
        now
      ).run();

      const settings = await getSettings(env);

      return new Response(
        JSON.stringify({ success: true, settings }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in settings API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
