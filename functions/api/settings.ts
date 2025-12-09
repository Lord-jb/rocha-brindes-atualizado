// API endpoint para configurações do site
import type { EventContext } from '@cloudflare/workers-types';
import type { Env } from './types';

export const onRequestGet = async ({ env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const settings = await env.DB.prepare('SELECT * FROM settings WHERE id = ?')
      .bind('main')
      .first();

    if (!settings) {
      return new Response(JSON.stringify({ error: 'Settings not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPut = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const body = await request.json() as Record<string, any>;
    const now = Math.floor(Date.now() / 1000);

    // Construir query de UPDATE dinamicamente
    const fields = Object.keys(body).filter((key) => key !== 'id');
    const setClause = fields.map((field) => `${field} = ?`).join(', ');

    await env.DB.prepare(`
      UPDATE settings
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `).bind(...fields.map((field) => body[field]), now, 'main').run();

    const settings = await env.DB.prepare('SELECT * FROM settings WHERE id = ?')
      .bind('main')
      .first();

    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
