-- ==========================================
-- SEED DATA - ROCHA BRINDES
-- Dados iniciais para o banco de dados
-- ==========================================

-- Configurações do Site
INSERT INTO settings (
  id, company_name, description, address, phone, email,
  whatsapp_number, instagram_url, facebook_url, linkedin_url,
  youtube_url, business_hours, cnpj, copyright, logo_url,
  favicon_url, primary_color, secondary_color, meta_title,
  meta_description, updated_at
) VALUES (
  'main',
  'Rocha Brindes',
  'Brindes personalizados de alta qualidade para empresas e eventos',
  'Macapá, Amapá, Brasil',
  '(96) 98124-7830',
  'contato@rochabrindes.com',
  '5596981247830',
  'https://instagram.com/rochabrindes',
  'https://facebook.com/rochabrindes',
  null,
  null,
  'Segunda a Sexta: 8h às 18h',
  null,
  '© 2024 Rocha Brindes. Todos os direitos reservados.',
  null,
  null,
  '#0066cc',
  '#ff6600',
  'Rocha Brindes - Brindes Personalizados de Alta Qualidade',
  'A Rocha Brindes oferece os melhores brindes personalizados para empresas e eventos. Qualidade garantida e entrega rápida em todo o Brasil.',
  strftime('%s', 'now')
);

-- Categorias
INSERT INTO categories (id, name, slug, description, image_url, popular, product_count, order_index, created_at, updated_at) VALUES
('cat-1', 'Canetas', 'canetas', 'Canetas personalizadas para brindes', null, 1, 0, 1, strftime('%s', 'now'), strftime('%s', 'now')),
('cat-2', 'Copos e Garrafas', 'copos-garrafas', 'Copos, garrafas e canecas personalizadas', null, 1, 0, 2, strftime('%s', 'now'), strftime('%s', 'now')),
('cat-3', 'Mochilas e Bolsas', 'mochilas-bolsas', 'Mochilas, bolsas e sacolas personalizadas', null, 1, 0, 3, strftime('%s', 'now'), strftime('%s', 'now')),
('cat-4', 'Tecnologia', 'tecnologia', 'Pen drives, power banks e acessórios tech', null, 1, 0, 4, strftime('%s', 'now'), strftime('%s', 'now')),
('cat-5', 'Escritório', 'escritorio', 'Cadernos, agendas e materiais de escritório', null, 1, 0, 5, strftime('%s', 'now'), strftime('%s', 'now')),
('cat-6', 'Vestuário', 'vestuario', 'Camisetas, bonés e roupas personalizadas', null, 1, 0, 6, strftime('%s', 'now'), strftime('%s', 'now'));

-- Produtos de Exemplo
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('prod-1', 'Caneta Metal Premium', 'caneta-metal-premium', 'Caneta esferográfica de metal com acabamento premium. Perfeita para brindes corporativos de alta qualidade.', 15.90, 1, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-2', 'Garrafa Térmica 500ml', 'garrafa-termica-500ml', 'Garrafa térmica de inox com capacidade de 500ml. Mantém bebidas quentes ou frias por até 12 horas.', 45.90, 1, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-3', 'Mochila Executiva', 'mochila-executiva', 'Mochila executiva com compartimento para notebook até 15.6". Material resistente e design moderno.', 89.90, 1, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-4', 'Power Bank 10000mAh', 'power-bank-10000mah', 'Carregador portátil com capacidade de 10000mAh. Duas saídas USB para carregar múltiplos dispositivos.', 65.90, 1, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-5', 'Caderno Capa Dura A5', 'caderno-capa-dura-a5', 'Caderno com capa dura formato A5, 96 folhas pautadas. Ideal para anotações e reuniões.', 28.90, 1, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-6', 'Camiseta Polo', 'camiseta-polo', 'Camiseta polo 100% algodão, com gola e punhos em malha. Disponível em várias cores.', 55.90, 1, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-7', 'Caneca Cerâmica 300ml', 'caneca-ceramica-300ml', 'Caneca de cerâmica branca 300ml. Ótima para personalização com logos e mensagens.', 12.90, 0, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now')),
('prod-8', 'Pen Drive 16GB', 'pen-drive-16gb', 'Pen drive giratório 16GB. Design compacto e prático.', 25.90, 0, 1, null, null, strftime('%s', 'now'), strftime('%s', 'now'));

-- Relacionamento Produto-Categoria
INSERT INTO product_categories (product_id, category_id) VALUES
('prod-1', 'cat-1'),
('prod-2', 'cat-2'),
('prod-3', 'cat-3'),
('prod-4', 'cat-4'),
('prod-5', 'cat-5'),
('prod-6', 'cat-6'),
('prod-7', 'cat-2'),
('prod-8', 'cat-4');

-- Variações de Exemplo (cores, tamanhos)
INSERT INTO product_variations (id, product_id, color, size, sku, image_url, thumb_url, price_modifier, stock, created_at) VALUES
-- Caneta Metal Premium
('var-1-1', 'prod-1', 'Prata', null, 'CAN-MET-PRA', null, null, 0, 100, strftime('%s', 'now')),
('var-1-2', 'prod-1', 'Azul', null, 'CAN-MET-AZU', null, null, 0, 80, strftime('%s', 'now')),
('var-1-3', 'prod-1', 'Preto', null, 'CAN-MET-PRE', null, null, 0, 120, strftime('%s', 'now')),
-- Garrafa Térmica
('var-2-1', 'prod-2', 'Preto', null, 'GAR-TER-PRE', null, null, 0, 50, strftime('%s', 'now')),
('var-2-2', 'prod-2', 'Branco', null, 'GAR-TER-BRA', null, null, 0, 40, strftime('%s', 'now')),
('var-2-3', 'prod-2', 'Azul', null, 'GAR-TER-AZU', null, null, 0, 30, strftime('%s', 'now')),
-- Camiseta Polo
('var-6-1', 'prod-6', 'Branco', 'P', 'POL-BRA-P', null, null, 0, 25, strftime('%s', 'now')),
('var-6-2', 'prod-6', 'Branco', 'M', 'POL-BRA-M', null, null, 0, 30, strftime('%s', 'now')),
('var-6-3', 'prod-6', 'Branco', 'G', 'POL-BRA-G', null, null, 0, 35, strftime('%s', 'now')),
('var-6-4', 'prod-6', 'Azul', 'P', 'POL-AZU-P', null, null, 0, 20, strftime('%s', 'now')),
('var-6-5', 'prod-6', 'Azul', 'M', 'POL-AZU-M', null, null, 0, 25, strftime('%s', 'now')),
('var-6-6', 'prod-6', 'Azul', 'G', 'POL-AZU-G', null, null, 0, 30, strftime('%s', 'now'));

-- Atualizar contagem de produtos por categoria
UPDATE categories SET product_count = (
  SELECT COUNT(DISTINCT pc.product_id)
  FROM product_categories pc
  WHERE pc.category_id = categories.id
);

-- Banner de Exemplo
INSERT INTO banners (id, title, subtitle, image_url, link_url, cta_text, order_index, active, created_at) VALUES
('banner-1', 'Brindes Personalizados', 'Qualidade e personalização para sua empresa', '/images/banner-1.jpg', '/loja', 'Ver Catálogo', 1, 1, strftime('%s', 'now'));

-- Usuário Admin de Exemplo (senha: admin123)
-- Hash gerado com bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, email, name, password_hash, role, active, created_at, updated_at) VALUES
('user-admin', 'admin@rochabrindes.com', 'Administrador', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 1, strftime('%s', 'now'), strftime('%s', 'now'));
