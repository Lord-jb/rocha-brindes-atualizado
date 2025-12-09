-- ==========================================
-- ROCHA BRINDES - SEED DATA
-- Dados de exemplo para desenvolvimento
-- ==========================================

-- Limpar dados existentes (exceto settings)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_variations;
DELETE FROM product_images;
DELETE FROM product_categories;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM banners;

-- ==========================================
-- CATEGORIAS DE EXEMPLO
-- ==========================================

INSERT INTO categories (id, name, slug, description, popular, product_count, order_index, created_at, updated_at) VALUES
('malas-mochilas', 'Malas e Mochilas', 'malas-mochilas', 'Mochilas, malas de viagem e bolsas personalizadas', 1, 0, 1, strftime('%s', 'now'), strftime('%s', 'now')),
('copos-garrafas', 'Copos e Garrafas', 'copos-garrafas', 'Copos, garrafas térmicas e squeeze personalizados', 1, 0, 2, strftime('%s', 'now'), strftime('%s', 'now')),
('tecnologia', 'Tecnologia', 'tecnologia', 'Pen drives, fones de ouvido, carregadores e acessórios tech', 1, 0, 3, strftime('%s', 'now'), strftime('%s', 'now')),
('escritorio', 'Escritório', 'escritorio', 'Canetas, cadernos, blocos de notas e material de escritório', 1, 0, 4, strftime('%s', 'now'), strftime('%s', 'now')),
('esportes', 'Esportes e Lazer', 'esportes', 'Brindes esportivos e itens para lazer', 0, 0, 5, strftime('%s', 'now'), strftime('%s', 'now')),
('sustentaveis', 'Ecológicos', 'sustentaveis', 'Produtos sustentáveis e ecológicos', 1, 0, 6, strftime('%s', 'now'), strftime('%s', 'now'));

-- ==========================================
-- PRODUTOS DE EXEMPLO
-- ==========================================

-- Produto 1: Mochila Executiva
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('mochila-executiva-001', 'Mochila Executiva Premium', 'mochila-executiva-premium',
'Mochila executiva em material de alta qualidade com compartimento para notebook até 15.6", bolsos organizadores internos, alças acolchoadas e design elegante. Perfeita para executivos e profissionais modernos.',
189.90, 1, 1, '/images/products/mochila-001.jpg', '/images/products/mochila-001-thumb.jpg',
strftime('%s', 'now'), strftime('%s', 'now'));

-- Produto 2: Garrafa Térmica
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('garrafa-termica-500ml', 'Garrafa Térmica Inox 500ml', 'garrafa-termica-inox-500ml',
'Garrafa térmica em aço inoxidável 304, mantém bebidas quentes por até 12h e frias por até 24h. Capacidade de 500ml, tampa com vedação de silicone, design moderno e elegante.',
79.90, 1, 1, '/images/products/garrafa-001.jpg', '/images/products/garrafa-001-thumb.jpg',
strftime('%s', 'now'), strftime('%s', 'now'));

-- Produto 3: Pen Drive
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('pen-drive-32gb', 'Pen Drive Giratório 32GB', 'pen-drive-giratorio-32gb',
'Pen Drive USB 2.0 com capacidade de 32GB, design giratório que protege o conector USB, corpo em metal resistente. Ideal para brindes corporativos.',
35.90, 1, 1, '/images/products/pendrive-001.jpg', '/images/products/pendrive-001-thumb.jpg',
strftime('%s', 'now'), strftime('%s', 'now'));

-- Produto 4: Caderno Personalizado
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('caderno-a5-capa-dura', 'Caderno A5 Capa Dura', 'caderno-a5-capa-dura',
'Caderno executivo tamanho A5 com capa dura, 192 páginas pautadas, papel 75g/m², marcador de página em tecido, bolso interno e elástico de fechamento.',
42.90, 0, 1, '/images/products/caderno-001.jpg', '/images/products/caderno-001-thumb.jpg',
strftime('%s', 'now'), strftime('%s', 'now'));

-- Produto 5: Copo Térmico
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('copo-termico-450ml', 'Copo Térmico com Tampa 450ml', 'copo-termico-tampa-450ml',
'Copo térmico em aço inoxidável com tampa rosqueável, capacidade de 450ml, mantém a temperatura por horas. Ideal para café, chá e outras bebidas.',
52.90, 0, 1, '/images/products/copo-001.jpg', '/images/products/copo-001-thumb.jpg',
strftime('%s', 'now'), strftime('%s', 'now'));

-- Produto 6: Sacola Ecológica
INSERT INTO products (id, name, slug, description, price, featured, active, main_image_url, main_thumb_url, created_at, updated_at) VALUES
('sacola-ecologica-algodao', 'Sacola Ecológica de Algodão', 'sacola-ecologica-algodao',
'Sacola reutilizável em algodão 100% natural, alças resistentes, tamanho 40x35cm. Produto sustentável e durável, perfeito para compras e uso diário.',
24.90, 1, 1, '/images/products/sacola-001.jpg', '/images/products/sacola-001-thumb.jpg',
strftime('%s', 'now'), strftime('%s', 'now'));

-- ==========================================
-- RELACIONAMENTOS PRODUTO-CATEGORIA
-- ==========================================

INSERT INTO product_categories (product_id, category_id) VALUES
('mochila-executiva-001', 'malas-mochilas'),
('garrafa-termica-500ml', 'copos-garrafas'),
('pen-drive-32gb', 'tecnologia'),
('caderno-a5-capa-dura', 'escritorio'),
('copo-termico-450ml', 'copos-garrafas'),
('sacola-ecologica-algodao', 'sustentaveis'),
('sacola-ecologica-algodao', 'malas-mochilas');

-- ==========================================
-- VARIAÇÕES DE PRODUTOS (CORES)
-- ==========================================

-- Variações da Mochila
INSERT INTO product_variations (id, product_id, color, image_url, thumb_url, stock, created_at) VALUES
('var-mochila-001-preto', 'mochila-executiva-001', 'Preto', '/images/products/mochila-001-preto.jpg', '/images/products/mochila-001-preto-thumb.jpg', 50, strftime('%s', 'now')),
('var-mochila-001-azul', 'mochila-executiva-001', 'Azul Marinho', '/images/products/mochila-001-azul.jpg', '/images/products/mochila-001-azul-thumb.jpg', 30, strftime('%s', 'now')),
('var-mochila-001-cinza', 'mochila-executiva-001', 'Cinza', '/images/products/mochila-001-cinza.jpg', '/images/products/mochila-001-cinza-thumb.jpg', 25, strftime('%s', 'now'));

-- Variações da Garrafa
INSERT INTO product_variations (id, product_id, color, image_url, thumb_url, stock, created_at) VALUES
('var-garrafa-001-branco', 'garrafa-termica-500ml', 'Branco', '/images/products/garrafa-001-branco.jpg', '/images/products/garrafa-001-branco-thumb.jpg', 100, strftime('%s', 'now')),
('var-garrafa-001-preto', 'garrafa-termica-500ml', 'Preto', '/images/products/garrafa-001-preto.jpg', '/images/products/garrafa-001-preto-thumb.jpg', 80, strftime('%s', 'now')),
('var-garrafa-001-azul', 'garrafa-termica-500ml', 'Azul', '/images/products/garrafa-001-azul.jpg', '/images/products/garrafa-001-azul-thumb.jpg', 60, strftime('%s', 'now')),
('var-garrafa-001-rosa', 'garrafa-termica-500ml', 'Rosa', '/images/products/garrafa-001-rosa.jpg', '/images/products/garrafa-001-rosa-thumb.jpg', 40, strftime('%s', 'now'));

-- Variações da Sacola
INSERT INTO product_variations (id, product_id, color, image_url, thumb_url, stock, created_at) VALUES
('var-sacola-001-natural', 'sacola-ecologica-algodao', 'Natural', '/images/products/sacola-001-natural.jpg', '/images/products/sacola-001-natural-thumb.jpg', 200, strftime('%s', 'now')),
('var-sacola-001-bege', 'sacola-ecologica-algodao', 'Bege', '/images/products/sacola-001-bege.jpg', '/images/products/sacola-001-bege-thumb.jpg', 150, strftime('%s', 'now'));

-- ==========================================
-- IMAGENS ADICIONAIS DOS PRODUTOS
-- ==========================================

INSERT INTO product_images (id, product_id, image_url, thumb_url, order_index, alt_text, created_at) VALUES
('img-mochila-001-1', 'mochila-executiva-001', '/images/products/mochila-001-view1.jpg', '/images/products/mochila-001-view1-thumb.jpg', 1, 'Vista lateral da mochila', strftime('%s', 'now')),
('img-mochila-001-2', 'mochila-executiva-001', '/images/products/mochila-001-view2.jpg', '/images/products/mochila-001-view2-thumb.jpg', 2, 'Compartimentos internos', strftime('%s', 'now')),
('img-mochila-001-3', 'mochila-executiva-001', '/images/products/mochila-001-view3.jpg', '/images/products/mochila-001-view3-thumb.jpg', 3, 'Detalhes das alças', strftime('%s', 'now'));

INSERT INTO product_images (id, product_id, image_url, thumb_url, order_index, alt_text, created_at) VALUES
('img-garrafa-001-1', 'garrafa-termica-500ml', '/images/products/garrafa-001-view1.jpg', '/images/products/garrafa-001-view1-thumb.jpg', 1, 'Detalhe da tampa', strftime('%s', 'now')),
('img-garrafa-001-2', 'garrafa-termica-500ml', '/images/products/garrafa-001-view2.jpg', '/images/products/garrafa-001-view2-thumb.jpg', 2, 'Tamanho real', strftime('%s', 'now'));

-- ==========================================
-- BANNERS DA HOME
-- ==========================================

INSERT INTO banners (id, title, subtitle, image_url, link_url, cta_text, order_index, active, created_at) VALUES
('banner-001', 'Brindes Personalizados', 'Qualidade e criatividade para sua marca', '/images/banners/banner-01.jpg', '/loja', 'Ver Catálogo', 1, 1, strftime('%s', 'now')),
('banner-002', 'Novidades 2025', 'Confira os lançamentos desta temporada', '/images/banners/banner-02.jpg', '/loja?featured=1', 'Ver Novidades', 2, 1, strftime('%s', 'now')),
('banner-003', 'Ecológico e Sustentável', 'Opções eco-friendly para sua empresa', '/images/banners/banner-03.jpg', '/loja?category=sustentaveis', 'Conhecer', 3, 1, strftime('%s', 'now'));

-- ==========================================
-- ATUALIZAR CONTADORES
-- ==========================================

UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM product_categories WHERE category_id = categories.id
);
