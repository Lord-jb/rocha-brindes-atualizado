// ==========================================
// TIPOS PRINCIPAIS DO E-COMMERCE
// ==========================================

// Tipos do Cloudflare Workers
export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  CACHE: KVNamespace;
  SESSIONS: KVNamespace;
  ENVIRONMENT: string;
  BASE_URL: string;
  WHATSAPP_NUMBER: string;
  ADMIN_EMAIL: string;
}

// ==========================================
// PRODUTOS
// ==========================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  featured: boolean;
  active: boolean;
  main_image_url: string | null;
  main_thumb_url: string | null;
  created_at: number;
  updated_at: number;
  // Relações (populadas dinamicamente)
  categories?: Category[];
  category_ids?: string[];
  images?: ProductImage[];
  variations?: ProductVariation[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  thumb_url: string | null;
  order_index: number;
  alt_text: string | null;
  created_at: number;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  image_url: string | null;
  thumb_url: string | null;
  price_modifier: number;
  stock: number;
  created_at: number;
}

// ==========================================
// CATEGORIAS
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  popular: boolean;
  product_count: number;
  order_index: number;
  created_at: number;
  updated_at: number;
}

// ==========================================
// PEDIDOS
// ==========================================

export type OrderStatus =
  | 'pending'      // Aguardando confirmação
  | 'confirmed'    // Confirmado
  | 'processing'   // Em produção
  | 'shipped'      // Enviado
  | 'delivered'    // Entregue
  | 'cancelled';   // Cancelado

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_whatsapp: string;
  customer_address: string | null;
  notes: string | null;
  status: OrderStatus;
  total_amount: number;
  items_count: number;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
  // Relações
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  variation_id: string | null;
  variation_color: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: number;
}

// ==========================================
// CONFIGURAÇÕES DO SITE
// ==========================================

export interface Settings {
  id: string;
  company_name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  business_hours: string | null;
  cnpj: string | null;
  copyright: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: number;
}

// ==========================================
// BANNERS
// ==========================================

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  cta_text: string | null;
  order_index: number;
  active: boolean;
  created_at: number;
}

// ==========================================
// USUÁRIOS E AUTENTICAÇÃO
// ==========================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  role: 'admin' | 'moderator';
  active: boolean;
  created_at: number;
  updated_at: number;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: number;
  created_at: number;
}

// ==========================================
// CARRINHO (CLIENT-SIDE)
// ==========================================

export interface CartItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  variation_id: string | null;
  variation_color: string | null;
  quantity: number;
  unit_price: number;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

// ==========================================
// FORMS E INPUTS
// ==========================================

export interface CheckoutFormData {
  customer_name: string;
  customer_email?: string;
  customer_whatsapp: string;
  customer_address?: string;
  notes?: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  featured: boolean;
  active: boolean;
  main_image_url?: string;
  main_thumb_url?: string;
  category_ids: string[];
  images?: {
    image_url: string;
    thumb_url?: string;
    alt_text?: string;
    order_index: number;
  }[];
  variations?: {
    color?: string;
    size?: string;
    sku?: string;
    image_url?: string;
    thumb_url?: string;
    price_modifier: number;
    stock: number;
  }[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  popular: boolean;
  order_index: number;
}

// ==========================================
// API RESPONSES
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// ==========================================
// FILTROS E QUERIES
// ==========================================

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  customer_whatsapp?: string;
  date_from?: number;
  date_to?: number;
  page?: number;
  limit?: number;
}

// ==========================================
// UTILITÁRIOS
// ==========================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T | null>;

// Helper para transformar tipos do DB em tipos da aplicação
export type DBTimestamp = number;
export type DBBoolean = 0 | 1;

// Converter DBBoolean para boolean
export function dbBoolToBoolean(value: DBBoolean | number): boolean {
  return value === 1;
}

// Converter boolean para DBBoolean
export function booleanToDbBool(value: boolean): DBBoolean {
  return value ? 1 : 0;
}

// Gerar slug a partir de string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Formatar preço
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

// Formatar data
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(timestamp * 1000));
}

// Gerar número de pedido único
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RB-${timestamp}-${random}`;
}
