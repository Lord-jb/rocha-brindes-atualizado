// API endpoint para pedido específico
import type { EventContext } from '@cloudflare/workers-types';
import type { Env } from '../types';

export const onRequestGet = async ({ env, params }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const id = params.id as string;

    // Buscar pedido (pode ser por ID ou order_number)
    let order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();

    if (!order) {
      order = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ?').bind(id).first();
    }

    if (!order) {
      return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buscar itens do pedido
    const { results: items } = await env.DB.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).bind(order.id).all();

    return new Response(JSON.stringify({
      ...order,
      items,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPut = async ({ request, env, params }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const id = params.id as string;
    const body = await request.json() as { status: string };

    const now = Math.floor(Date.now() / 1000);

    await env.DB.prepare(`
      UPDATE orders
      SET status = ?, updated_at = ?
      WHERE id = ?
    `).bind(body.status, now, id).run();

    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();

    return new Response(JSON.stringify(order), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
