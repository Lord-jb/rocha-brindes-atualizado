// Database helpers para D1
import type { Env, Product, Category, LayoutConfig } from './types';

export async function getProducts(env: Env, limit = 100, offset = 0): Promise<Product[]> {
  const { results } = await env.DB.prepare(`
    SELECT DISTINCT
      p.*,
      GROUP_CONCAT(DISTINCT pc.categoria_id) as categoria_ids,
      GROUP_CONCAT(DISTINCT pi.imagem_url) as imagem_urls,
      GROUP_CONCAT(DISTINCT pi.thumb_url) as thumb_urls
    FROM produtos p
    LEFT JOIN produto_categorias pc ON p.id = pc.produto_id
    LEFT JOIN produto_imagens pi ON p.id = pi.produto_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  return Promise.all(results.map(async (row: any) => {
    const variacoes = await getProductVariations(env, row.id);
    return {
      id: row.id,
      nome: row.nome,
      descricao: row.descricao,
      cor: row.cor,
      imagem_url: row.imagem_url,
      thumb_url: row.thumb_url,
      destaque: Boolean(row.destaque),
      categorias: row.categoria_ids ? row.categoria_ids.split(',') : [],
      imagens_urls: row.imagem_urls ? row.imagem_urls.split(',').filter(Boolean) : [],
      thumbs_urls: row.thumb_urls ? row.thumb_urls.split(',').filter(Boolean) : [],
      variacoes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }));
}

export async function getProductById(env: Env, id: string): Promise<Product | null> {
  const { results } = await env.DB.prepare(`
    SELECT p.* FROM produtos p WHERE p.id = ?
  `).bind(id).all();

  if (results.length === 0) return null;

  const row: any = results[0];
  const categorias = await getProductCategories(env, id);
  const imagens = await getProductImages(env, id);
  const variacoes = await getProductVariations(env, id);

  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    cor: row.cor,
    imagem_url: row.imagem_url,
    thumb_url: row.thumb_url,
    destaque: Boolean(row.destaque),
    categorias: categorias.map(c => c.id),
    imagens_urls: imagens.map(i => i.imagem_url),
    thumbs_urls: imagens.map(i => i.thumb_url).filter(Boolean),
    variacoes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function getProductCategories(env: Env, productId: string) {
  const { results } = await env.DB.prepare(`
    SELECT c.* FROM categorias c
    JOIN produto_categorias pc ON c.id = pc.categoria_id
    WHERE pc.produto_id = ?
  `).bind(productId).all();
  return results;
}

async function getProductImages(env: Env, productId: string) {
  const { results } = await env.DB.prepare(`
    SELECT imagem_url, thumb_url FROM produto_imagens
    WHERE produto_id = ?
    ORDER BY ordem
  `).bind(productId).all();
  return results;
}

async function getProductVariations(env: Env, productId: string) {
  const { results } = await env.DB.prepare(`
    SELECT cor, imagem_url, thumb_url FROM produto_variacoes
    WHERE produto_id = ?
  `).bind(productId).all();
  return results;
}

export async function createProduct(env: Env, product: Partial<Product>): Promise<Product> {
  const now = Date.now();
  const id = product.id || crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO produtos (id, nome, descricao, cor, imagem_url, thumb_url, destaque, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    product.nome,
    product.descricao || '',
    product.cor || '',
    product.imagem_url,
    product.thumb_url || '',
    product.destaque ? 1 : 0,
    now,
    now
  ).run();

  // Inserir categorias
  if (product.categorias && product.categorias.length > 0) {
    for (const catId of product.categorias) {
      await env.DB.prepare(`
        INSERT INTO produto_categorias (produto_id, categoria_id)
        VALUES (?, ?)
      `).bind(id, catId).run();
    }
  }

  // Inserir imagens adicionais
  if (product.imagens_urls && product.imagens_urls.length > 0) {
    for (let i = 0; i < product.imagens_urls.length; i++) {
      await env.DB.prepare(`
        INSERT INTO produto_imagens (produto_id, imagem_url, thumb_url, ordem)
        VALUES (?, ?, ?, ?)
      `).bind(id, product.imagens_urls[i], product.thumbs_urls?.[i] || '', i).run();
    }
  }

  // Inserir variações
  if (product.variacoes && product.variacoes.length > 0) {
    for (const v of product.variacoes) {
      await env.DB.prepare(`
        INSERT INTO produto_variacoes (produto_id, cor, imagem_url, thumb_url)
        VALUES (?, ?, ?, ?)
      `).bind(id, v.cor, v.imagem_url, v.thumb_url || '').run();
    }
  }

  return (await getProductById(env, id))!;
}

export async function updateProduct(env: Env, id: string, product: Partial<Product>): Promise<Product> {
  const now = Date.now();

  await env.DB.prepare(`
    UPDATE produtos SET
      nome = COALESCE(?, nome),
      descricao = COALESCE(?, descricao),
      cor = COALESCE(?, cor),
      imagem_url = COALESCE(?, imagem_url),
      thumb_url = COALESCE(?, thumb_url),
      destaque = COALESCE(?, destaque),
      updated_at = ?
    WHERE id = ?
  `).bind(
    product.nome,
    product.descricao,
    product.cor,
    product.imagem_url,
    product.thumb_url,
    product.destaque !== undefined ? (product.destaque ? 1 : 0) : null,
    now,
    id
  ).run();

  // Atualizar categorias se fornecidas
  if (product.categorias) {
    await env.DB.prepare('DELETE FROM produto_categorias WHERE produto_id = ?').bind(id).run();
    for (const catId of product.categorias) {
      await env.DB.prepare(`
        INSERT INTO produto_categorias (produto_id, categoria_id)
        VALUES (?, ?)
      `).bind(id, catId).run();
    }
  }

  return (await getProductById(env, id))!;
}

export async function deleteProduct(env: Env, id: string): Promise<void> {
  await env.DB.prepare('DELETE FROM produtos WHERE id = ?').bind(id).run();
}

export async function getCategories(env: Env): Promise<Category[]> {
  const { results } = await env.DB.prepare(`
    SELECT * FROM categorias ORDER BY ordem, nome
  `).all();

  return results.map((row: any) => ({
    id: row.id,
    nome: row.nome,
    image_path: row.image_path,
    popular: Boolean(row.popular),
    descricao: row.descricao,
    video_url: row.video_url,
    ordem: row.ordem,
  }));
}

export async function getLayoutConfig(env: Env): Promise<LayoutConfig> {
  const { results: layoutResults } = await env.DB.prepare(
    'SELECT * FROM layout_config WHERE id = ?'
  ).bind('default').all();

  const layoutRow: any = layoutResults[0] || {};

  const { results: banners } = await env.DB.prepare(
    'SELECT url, alt FROM banners WHERE ativo = 1 ORDER BY ordem'
  ).all();

  const { results: promotions } = await env.DB.prepare(
    'SELECT imagem_url FROM promocoes WHERE ativo = 1 ORDER BY ordem'
  ).all();

  const { results: popups } = await env.DB.prepare(
    'SELECT imagem_url FROM popups WHERE ativo = 1 ORDER BY ordem'
  ).all();

  return {
    logo: layoutRow.logo || '',
    banners: banners.map((b: any) => ({ url: b.url, alt: b.alt })),
    promotions: promotions.map((p: any) => p.imagem_url),
    popups: popups.map((p: any) => p.imagem_url),
    whatsapp: layoutRow.whatsapp,
    companyInfo: {
      title: layoutRow.company_info_title,
      description: layoutRow.company_info_description || '',
    },
  };
}
