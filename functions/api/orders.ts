// ==========================================
// API DE PEDIDOS
// CRUD completo para pedidos
// ==========================================

import type { Env, OrderFilters, OrderStatus } from '@/types';
import { getOrders, getOrderById, getOrderByNumber } from '@/lib/db';
import { generateOrderNumber } from '@/types';

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
    // GET - Listar pedidos ou obter um específico
    if (request.method === 'GET') {
      const id = url.searchParams.get('id');
      const orderNumber = url.searchParams.get('order_number');

      // Buscar por ID
      if (id) {
        const order = await getOrderById(env, id);
        if (!order) {
          return new Response(
            JSON.stringify({ error: 'Order not found' }),
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(JSON.stringify(order), { status: 200, headers: corsHeaders });
      }

      // Buscar por número do pedido
      if (orderNumber) {
        const order = await getOrderByNumber(env, orderNumber);
        if (!order) {
          return new Response(
            JSON.stringify({ error: 'Order not found' }),
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(JSON.stringify(order), { status: 200, headers: corsHeaders });
      }

      // Listar pedidos com filtros
      const filters: OrderFilters = {
        status: (url.searchParams.get('status') as OrderStatus) || undefined,
        customer_whatsapp: url.searchParams.get('customer_whatsapp') || undefined,
        date_from: url.searchParams.get('date_from') ? parseInt(url.searchParams.get('date_from')!) : undefined,
        date_to: url.searchParams.get('date_to') ? parseInt(url.searchParams.get('date_to')!) : undefined,
        page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 1,
        limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 20,
      };

      const { orders, total } = await getOrders(env, filters);

      return new Response(
        JSON.stringify({
          orders,
          total,
          page: filters.page,
          limit: filters.limit,
          total_pages: Math.ceil(total / (filters.limit || 20)),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // POST - Criar pedido
    if (request.method === 'POST') {
      const data = await request.json();

      const id = crypto.randomUUID();
      const orderNumber = generateOrderNumber();
      const now = Math.floor(Date.now() / 1000);

      // Validar dados obrigatórios
      if (!data.customer_name || !data.customer_whatsapp || !data.items || data.items.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: customer_name, customer_whatsapp, items' }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Calcular total e quantidade de itens
      let totalAmount = 0;
      let itemsCount = 0;

      for (const item of data.items) {
        totalAmount += item.subtotal;
        itemsCount += item.quantity;
      }

      // Criar pedido
      await env.DB.prepare(`
        INSERT INTO orders (
          id, order_number, customer_name, customer_email, customer_whatsapp,
          customer_address, notes, status, total_amount, items_count,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        orderNumber,
        data.customer_name,
        data.customer_email || null,
        data.customer_whatsapp,
        data.customer_address || null,
        data.notes || null,
        'pending',
        totalAmount,
        itemsCount,
        now,
        now
      ).run();

      // Adicionar itens do pedido
      for (const item of data.items) {
        await env.DB.prepare(`
          INSERT INTO order_items (
            id, order_id, product_id, product_name, product_image,
            variation_id, variation_color, quantity, unit_price, subtotal, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(),
          id,
          item.product_id,
          item.product_name,
          item.product_image || null,
          item.variation_id || null,
          item.variation_color || null,
          item.quantity,
          item.unit_price,
          item.subtotal,
          now
        ).run();
      }

      const order = await getOrderById(env, id);

      // Enviar notificação via WhatsApp (opcional)
      // TODO: Implementar integração com WhatsApp Business API

      return new Response(
        JSON.stringify({ success: true, order }),
        { status: 201, headers: corsHeaders }
      );
    }

    // PUT - Atualizar pedido (principalmente status)
    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Order ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      const data = await request.json();
      const now = Math.floor(Date.now() / 1000);

      // Verificar se o pedido existe
      const existingOrder = await getOrderById(env, id);
      if (!existingOrder) {
        return new Response(
          JSON.stringify({ error: 'Order not found' }),
          { status: 404, headers: corsHeaders }
        );
      }

      // Atualizar pedido
      const completedAt = data.status === 'delivered' || data.status === 'cancelled' ? now : null;

      await env.DB.prepare(`
        UPDATE orders SET
          status = ?,
          notes = ?,
          updated_at = ?,
          completed_at = ?
        WHERE id = ?
      `).bind(
        data.status || existingOrder.status,
        data.notes !== undefined ? data.notes : existingOrder.notes,
        now,
        completedAt,
        id
      ).run();

      const order = await getOrderById(env, id);

      return new Response(
        JSON.stringify({ success: true, order }),
        { status: 200, headers: corsHeaders }
      );
    }

    // DELETE - Deletar pedido (admin)
    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Order ID is required' }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Deletar itens do pedido
      await env.DB.prepare('DELETE FROM order_items WHERE order_id = ?').bind(id).run();

      // Deletar pedido
      await env.DB.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ success: true, message: 'Order deleted successfully' }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error in orders API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
