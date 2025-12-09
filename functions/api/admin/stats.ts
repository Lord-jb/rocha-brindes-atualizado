import type { EventContext } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  R2: R2Bucket;
  CACHE: KVNamespace;
  SESSIONS: KVNamespace;
}

export const onRequestGet = async ({ env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    // Get total products count
    const totalProducts = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();

    // Get active products count
    const activeProducts = await env.DB.prepare('SELECT COUNT(*) as count FROM products WHERE active = 1').first();

    // Get total categories count
    const totalCategories = await env.DB.prepare('SELECT COUNT(*) as count FROM categories').first();

    // Get total orders count
    const totalOrders = await env.DB.prepare('SELECT COUNT(*) as count FROM orders').first();

    // Get pending orders count
    const pendingOrders = await env.DB.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').bind('pending').first();

    // Get total revenue (sum of all orders)
    const totalRevenue = await env.DB.prepare('SELECT SUM(total_amount) as revenue FROM orders WHERE status != ?').bind('cancelled').first();

    // Get recent orders (last 10)
    const { results: recentOrders } = await env.DB.prepare(`
      SELECT id, order_number, customer_name, total_amount, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    const stats = {
      total_products: (totalProducts as any)?.count || 0,
      active_products: (activeProducts as any)?.count || 0,
      total_categories: (totalCategories as any)?.count || 0,
      total_orders: (totalOrders as any)?.count || 0,
      pending_orders: (pendingOrders as any)?.count || 0,
      total_revenue: (totalRevenue as any)?.revenue || 0,
      recent_orders: recentOrders || [],
    };

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
