// ==========================================
// HELPERS PARA CLOUDFLARE D1
// Funções para trabalhar com o banco de dados
// ==========================================

import type {
  Env,
  Product,
  ProductImage,
  ProductVariation,
  Category,
  Order,
  OrderItem,
  Settings,
  Banner,
  ProductFilters,
  OrderFilters,
} from '@/types';
import { dbBoolToBoolean, booleanToDbBool } from '@/types';

// ==========================================
// PRODUTOS
// ==========================================

export async function getProducts(
  env: Env,
  filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
  const {
    category,
    featured,
    search,
    min_price,
    max_price,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = filters;

  let query = `
    SELECT DISTINCT p.* FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    WHERE p.active = 1
  `;

  const params: any[] = [];

  if (category) {
    query += ` AND pc.category_id = ?`;
    params.push(category);
  }

  if (featured !== undefined) {
    query += ` AND p.featured = ?`;
    params.push(featured ? 1 : 0);
  }

  if (search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (min_price !== undefined) {
    query += ` AND p.price >= ?`;
    params.push(min_price);
  }

  if (max_price !== undefined) {
    query += ` AND p.price <= ?`;
    params.push(max_price);
  }

  // Ordenação
  switch (sort) {
    case 'name_asc':
      query += ` ORDER BY p.name ASC`;
      break;
    case 'name_desc':
      query += ` ORDER BY p.name DESC`;
      break;
    case 'price_asc':
      query += ` ORDER BY p.price ASC`;
      break;
    case 'price_desc':
      query += ` ORDER BY p.price DESC`;
      break;
    case 'oldest':
      query += ` ORDER BY p.created_at ASC`;
      break;
    case 'newest':
    default:
      query += ` ORDER BY p.created_at DESC`;
      break;
  }

  // Contagem total
  const countQuery = query.replace(/SELECT DISTINCT p\.\*/, 'SELECT COUNT(DISTINCT p.id) as count');
  const countResult = await env.DB.prepare(countQuery).bind(...params).first<{ count: number }>();
  const total = countResult?.count || 0;

  // Paginação
  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const { results } = await env.DB.prepare(query).bind(...params).all();

  // Converter e adicionar relações
  const products = await Promise.all(
    results.map(async (row: any) => {
      const product = mapRowToProduct(row);
      product.categories = await getProductCategories(env, product.id);
      product.images = await getProductImages(env, product.id);
      product.variations = await getProductVariations(env, product.id);
      return product;
    })
  );

  return { products, total };
}

export async function getProductById(env: Env, id: string): Promise<Product | null> {
  const result = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();

  if (!result) return null;

  const product = mapRowToProduct(result);
  product.categories = await getProductCategories(env, id);
  product.images = await getProductImages(env, id);
  product.variations = await getProductVariations(env, id);

  return product;
}

export async function getProductBySlug(env: Env, slug: string): Promise<Product | null> {
  const result = await env.DB.prepare('SELECT * FROM products WHERE slug = ? AND active = 1')
    .bind(slug)
    .first();

  if (!result) return null;

  const product = mapRowToProduct(result);
  product.categories = await getProductCategories(env, product.id);
  product.images = await getProductImages(env, product.id);
  product.variations = await getProductVariations(env, product.id);

  return product;
}

async function getProductCategories(env: Env, productId: string): Promise<Category[]> {
  const { results } = await env.DB.prepare(`
    SELECT c.* FROM categories c
    JOIN product_categories pc ON c.id = pc.category_id
    WHERE pc.product_id = ?
  `)
    .bind(productId)
    .all();

  return results.map((row: any) => mapRowToCategory(row));
}

async function getProductImages(env: Env, productId: string): Promise<ProductImage[]> {
  const { results } = await env.DB.prepare(`
    SELECT * FROM product_images
    WHERE product_id = ?
    ORDER BY order_index ASC
  `)
    .bind(productId)
    .all();

  return results.map((row: any) => ({
    id: row.id,
    product_id: row.product_id,
    image_url: row.image_url,
    thumb_url: row.thumb_url,
    order_index: row.order_index,
    alt_text: row.alt_text,
    created_at: row.created_at,
  }));
}

async function getProductVariations(env: Env, productId: string): Promise<ProductVariation[]> {
  const { results } = await env.DB.prepare(`
    SELECT * FROM product_variations
    WHERE product_id = ?
  `)
    .bind(productId)
    .all();

  return results.map((row: any) => ({
    id: row.id,
    product_id: row.product_id,
    color: row.color,
    size: row.size,
    sku: row.sku,
    image_url: row.image_url,
    thumb_url: row.thumb_url,
    price_modifier: row.price_modifier,
    stock: row.stock,
    created_at: row.created_at,
  }));
}

// ==========================================
// CATEGORIAS
// ==========================================

export async function getCategories(env: Env, popularOnly = false): Promise<Category[]> {
  let query = 'SELECT * FROM categories';

  if (popularOnly) {
    query += ' WHERE popular = 1';
  }

  query += ' ORDER BY order_index ASC, name ASC';

  const { results } = await env.DB.prepare(query).all();

  return results.map((row: any) => mapRowToCategory(row));
}

export async function getCategoryById(env: Env, id: string): Promise<Category | null> {
  const result = await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();

  if (!result) return null;

  return mapRowToCategory(result);
}

export async function getCategoryBySlug(env: Env, slug: string): Promise<Category | null> {
  const result = await env.DB.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first();

  if (!result) return null;

  return mapRowToCategory(result);
}

// ==========================================
// PEDIDOS
// ==========================================

export async function getOrders(
  env: Env,
  filters: OrderFilters = {}
): Promise<{ orders: Order[]; total: number }> {
  const { status, customer_whatsapp, date_from, date_to, page = 1, limit = 20 } = filters;

  let query = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (customer_whatsapp) {
    query += ' AND customer_whatsapp LIKE ?';
    params.push(`%${customer_whatsapp}%`);
  }

  if (date_from) {
    query += ' AND created_at >= ?';
    params.push(date_from);
  }

  if (date_to) {
    query += ' AND created_at <= ?';
    params.push(date_to);
  }

  query += ' ORDER BY created_at DESC';

  // Contagem total
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
  const countResult = await env.DB.prepare(countQuery).bind(...params).first<{ count: number }>();
  const total = countResult?.count || 0;

  // Paginação
  const offset = (page - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await env.DB.prepare(query).bind(...params).all();

  const orders = await Promise.all(
    results.map(async (row: any) => {
      const order = mapRowToOrder(row);
      order.items = await getOrderItems(env, order.id);
      return order;
    })
  );

  return { orders, total };
}

export async function getOrderById(env: Env, id: string): Promise<Order | null> {
  const result = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();

  if (!result) return null;

  const order = mapRowToOrder(result);
  order.items = await getOrderItems(env, id);

  return order;
}

export async function getOrderByNumber(env: Env, orderNumber: string): Promise<Order | null> {
  const result = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ?')
    .bind(orderNumber)
    .first();

  if (!result) return null;

  const order = mapRowToOrder(result);
  order.items = await getOrderItems(env, order.id);

  return order;
}

async function getOrderItems(env: Env, orderId: string): Promise<OrderItem[]> {
  const { results } = await env.DB.prepare(`
    SELECT * FROM order_items
    WHERE order_id = ?
  `)
    .bind(orderId)
    .all();

  return results.map((row: any) => ({
    id: row.id,
    order_id: row.order_id,
    product_id: row.product_id,
    product_name: row.product_name,
    product_image: row.product_image,
    variation_id: row.variation_id,
    variation_color: row.variation_color,
    quantity: row.quantity,
    unit_price: row.unit_price,
    subtotal: row.subtotal,
    created_at: row.created_at,
  }));
}

// ==========================================
// CONFIGURAÇÕES
// ==========================================

export async function getSettings(env: Env): Promise<Settings | null> {
  const result = await env.DB.prepare('SELECT * FROM settings WHERE id = ?').bind('main').first();

  if (!result) return null;

  return mapRowToSettings(result);
}

// ==========================================
// BANNERS
// ==========================================

export async function getBanners(env: Env, activeOnly = true): Promise<Banner[]> {
  let query = 'SELECT * FROM banners';

  if (activeOnly) {
    query += ' WHERE active = 1';
  }

  query += ' ORDER BY order_index ASC';

  const { results } = await env.DB.prepare(query).all();

  return results.map((row: any) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image_url: row.image_url,
    link_url: row.link_url,
    cta_text: row.cta_text,
    order_index: row.order_index,
    active: dbBoolToBoolean(row.active),
    created_at: row.created_at,
  }));
}

// ==========================================
// MAPPERS (DB ROW → TYPE)
// ==========================================

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    featured: dbBoolToBoolean(row.featured),
    active: dbBoolToBoolean(row.active),
    main_image_url: row.main_image_url,
    main_thumb_url: row.main_thumb_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapRowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.image_url,
    popular: dbBoolToBoolean(row.popular),
    product_count: row.product_count,
    order_index: row.order_index,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    order_number: row.order_number,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_whatsapp: row.customer_whatsapp,
    customer_address: row.customer_address,
    notes: row.notes,
    status: row.status,
    total_amount: row.total_amount,
    items_count: row.items_count,
    created_at: row.created_at,
    updated_at: row.updated_at,
    completed_at: row.completed_at,
  };
}

function mapRowToSettings(row: any): Settings {
  return {
    id: row.id,
    company_name: row.company_name,
    description: row.description,
    address: row.address,
    phone: row.phone,
    email: row.email,
    whatsapp_number: row.whatsapp_number,
    instagram_url: row.instagram_url,
    facebook_url: row.facebook_url,
    linkedin_url: row.linkedin_url,
    youtube_url: row.youtube_url,
    business_hours: row.business_hours,
    cnpj: row.cnpj,
    copyright: row.copyright,
    logo_url: row.logo_url,
    favicon_url: row.favicon_url,
    primary_color: row.primary_color,
    secondary_color: row.secondary_color,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    updated_at: row.updated_at,
  };
}
