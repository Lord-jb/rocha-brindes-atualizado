-- Schema D1 para Rocha Brindes
-- Database: rocha-brindes-db

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT,
  imagem_url TEXT NOT NULL,
  thumb_url TEXT,
  destaque INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_created_at ON produtos(created_at DESC);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  image_path TEXT,
  popular INTEGER DEFAULT 0,
  descricao TEXT,
  video_url TEXT,
  ordem INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_categorias_popular ON categorias(popular);
CREATE INDEX IF NOT EXISTS idx_categorias_ordem ON categorias(ordem);

-- Tabela de relação produto-categoria (many-to-many)
CREATE TABLE IF NOT EXISTS produto_categorias (
  produto_id TEXT NOT NULL,
  categoria_id TEXT NOT NULL,
  PRIMARY KEY (produto_id, categoria_id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_produto_categorias_produto ON produto_categorias(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_categorias_categoria ON produto_categorias(categoria_id);

-- Tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS produto_imagens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id TEXT NOT NULL,
  imagem_url TEXT NOT NULL,
  thumb_url TEXT,
  ordem INTEGER DEFAULT 0,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_produto_imagens_produto ON produto_imagens(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_imagens_ordem ON produto_imagens(ordem);

-- Tabela de variações de produtos (cores)
CREATE TABLE IF NOT EXISTS produto_variacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id TEXT NOT NULL,
  cor TEXT NOT NULL,
  imagem_url TEXT NOT NULL,
  thumb_url TEXT,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_produto_variacoes_produto ON produto_variacoes(produto_id);

-- Tabela de configuração do layout
CREATE TABLE IF NOT EXISTS layout_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  logo TEXT,
  whatsapp TEXT,
  company_info_title TEXT,
  company_info_description TEXT,
  updated_at INTEGER NOT NULL
);

-- Tabela de banners
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  alt TEXT,
  ordem INTEGER DEFAULT 0,
  ativo INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_banners_ordem ON banners(ordem);
CREATE INDEX IF NOT EXISTS idx_banners_ativo ON banners(ativo);

-- Tabela de promoções
CREATE TABLE IF NOT EXISTS promocoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imagem_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_promocoes_ordem ON promocoes(ordem);
CREATE INDEX IF NOT EXISTS idx_promocoes_ativo ON promocoes(ativo);

-- Tabela de popups
CREATE TABLE IF NOT EXISTS popups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imagem_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_popups_ordem ON popups(ordem);
CREATE INDEX IF NOT EXISTS idx_popups_ativo ON popups(ativo);

-- Tabela de usuários admin
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabela de sessões
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Inserir configuração padrão
INSERT OR IGNORE INTO layout_config (id, logo, whatsapp, company_info_description, updated_at)
VALUES ('default', '', '+5589994333316', 'Especialista em brindes personalizados', strftime('%s', 'now'));
