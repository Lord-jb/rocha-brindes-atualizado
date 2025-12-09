-- ==========================================
-- ROCHA BRINDES - DATABASE SCHEMA
-- Cloudflare D1 (SQLite)
-- E-commerce de Brindes Personalizados
-- ==========================================

-- ==========================================
-- TABELAS PRINCIPAIS
-- ==========================================

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  popular INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price REAL DEFAULT 0,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  main_image_url TEXT,
  main_thumb_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Tabela de Relacionamento Produto-Categoria (N:N)
CREATE TABLE IF NOT EXISTS product_categories (
  product_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabela de Imagens de Produtos
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumb_url TEXT,
  order_index INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de Variações de Produtos (cores, tamanhos, etc.)
CREATE TABLE IF NOT EXISTS product_variations (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  color TEXT,
  size TEXT,
  sku TEXT,
  image_url TEXT,
  thumb_url TEXT,
  price_modifier REAL DEFAULT 0,
  stock INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_whatsapp TEXT NOT NULL,
  customer_address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  total_amount REAL DEFAULT 0,
  items_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER
);

-- Tabela de Itens de Pedido
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variation_id TEXT,
  variation_color TEXT,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Tabela de Configurações do Site
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  company_name TEXT DEFAULT 'Rocha Brindes',
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  whatsapp_number TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  business_hours TEXT,
  cnpj TEXT,
  copyright TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#F97316',
  secondary_color TEXT DEFAULT '#7C3AED',
  meta_title TEXT,
  meta_description TEXT,
  updated_at INTEGER NOT NULL
);

-- Tabela de Banners/Slides da Home
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  cta_text TEXT,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);

-- Tabela de Usuários Admin
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Tabela de Sessões
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================

-- Produtos
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Categorias
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_popular ON categories(popular);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);

-- Relacionamentos
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);

-- Imagens
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(order_index);

-- Variações
CREATE INDEX IF NOT EXISTS idx_product_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variations_sku ON product_variations(sku);

-- Pedidos
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_whatsapp ON orders(customer_whatsapp);

-- Itens de Pedido
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Usuários e Sessões
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Banners
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(order_index);

-- ==========================================
-- DADOS INICIAIS
-- ==========================================

-- Configurações do Site
INSERT OR REPLACE INTO settings (
  id,
  company_name,
  description,
  address,
  phone,
  email,
  whatsapp_number,
  instagram_url,
  facebook_url,
  business_hours,
  copyright,
  primary_color,
  secondary_color,
  meta_title,
  meta_description,
  updated_at
) VALUES (
  'main',
  'Rocha Brindes',
  'Especialistas em brindes personalizados de alta qualidade para empresas e eventos. Oferecemos uma ampla variedade de produtos promocionais com personalização profissional.',
  'Rua Doutor Bento Teobaldo Ferraz 330, Bairro Novo Horizonte, Macapá - AP',
  '(96) 8124-7830',
  'rochabrindes29@gmail.com',
  '5596981247830',
  'https://www.instagram.com/rochabrindesoficial',
  'https://www.facebook.com/profile.php?id=61576684446307',
  'Segunda a Sexta: 09:00–18:00 | Sábado: 09:00–13:00',
  '© 2025 Rocha Brindes. Todos os direitos reservados.',
  '#F97316',
  '#7C3AED',
  'Rocha Brindes - Brindes Personalizados de Alta Qualidade',
  'Especialistas em brindes personalizados para empresas e eventos. Qualidade, preço justo e entrega rápida.',
  strftime('%s', 'now')
);
