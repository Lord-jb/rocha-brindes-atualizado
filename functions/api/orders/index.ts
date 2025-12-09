// API endpoint para pedidos
import type { EventContext } from '@cloudflare/workers-types';
import type { Env, CheckoutFormData, CartItem } from '../types';
import { generateOrderNumber } from '../../../src/lib/utils';

export const onRequestGet = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify(results), {
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
    const body = await request.json() as {
      customer: CheckoutFormData;
      items: CartItem[];
    };

    const orderId = crypto.randomUUID();
    const orderNumber = generateOrderNumber();
    const now = Math.floor(Date.now() / 1000);

    // Calcular totais
    const totalAmount = body.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const itemsCount = body.items.reduce((sum, item) => sum + item.quantity, 0);

    // Criar pedido
    await env.DB.prepare(`
      INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_whatsapp,
        customer_address, notes, status, total_amount, items_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      orderNumber,
      body.customer.customer_name,
      body.customer.customer_email || null,
      body.customer.customer_whatsapp,
      body.customer.customer_address || null,
      body.customer.notes || null,
      'pending',
      totalAmount,
      itemsCount,
      now,
      now
    ).run();

    // Inserir itens do pedido
    for (const item of body.items) {
      const itemId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, product_name, product_image,
          variation_id, variation_color, quantity, unit_price, subtotal, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        itemId,
        orderId,
        item.product_id,
        item.product_name,
        item.product_image || null,
        item.variation_id || null,
        item.variation_color || null,
        item.quantity,
        item.unit_price,
        item.unit_price * item.quantity,
        now
      ).run();
    }

    // Buscar pedido criado
    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();

    return new Response(JSON.stringify({
      success: true,
      order,
      order_number: orderNumber,
    }), {
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
