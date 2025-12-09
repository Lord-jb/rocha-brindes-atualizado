// Script de migração: Cloudflare Images → R2 (organizadas por produto)
// Migra Firestore → D1 atualizando URLs para R2
// Execute: node scripts/migrate-images-to-r2.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// ========================================
// CONFIGURAÇÃO
// ========================================

const CONFIG = {
  // Firebase
  firebaseCredentials: './firebase-credentials.json',

  // Cloudflare
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
  cloudflareAccountHash: 'iem94FVEkj3Qjv3DsJXpbQ',

  // D1
  d1DatabaseId: process.env.D1_DATABASE_ID,
  d1ApiUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.D1_DATABASE_ID}/query`,

  // R2
  r2BucketName: 'rocha-brindes-images',
  r2Endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  r2PublicUrl: process.env.R2_PUBLIC_URL || 'https://images.rochabrindes.com', // Configure seu domínio customizado
};

// ========================================
// INICIALIZAR FIREBASE
// ========================================

let db;

async function initFirebase() {
  try {
    const serviceAccount = JSON.parse(
      await fs.readFile(CONFIG.firebaseCredentials, 'utf-8')
    );

    initializeApp({
      credential: cert(serviceAccount),
    });

    db = getFirestore();
    console.log('✅ Firebase inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    process.exit(1);
  }
}

// ========================================
// INICIALIZAR R2 CLIENT
// ========================================

let r2Client;

function initR2() {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: CONFIG.r2Endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('✅ R2 Cliente inicializado');
}

// ========================================
// CLOUDFLARE D1 HELPERS
// ========================================

async function executeD1Query(sql, params = []) {
  const response = await fetch(CONFIG.d1ApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.cloudflareApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(result.errors)}`);
  }

  return result.result;
}

// ========================================
// DOWNLOAD DE IMAGEM DO CLOUDFLARE IMAGES
// ========================================

async function downloadCloudflareImage(imageId, variant = 'public') {
  const url = `https://imagedelivery.net/${CONFIG.cloudflareAccountHash}/${imageId}/${variant}`;

  console.log(`  📥 Baixando: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  return {
    buffer: await response.arrayBuffer(),
    contentType: response.headers.get('content-type') || 'image/jpeg',
  };
}

// ========================================
// UPLOAD PARA R2
// ========================================

async function uploadToR2(buffer, key, contentType = 'image/jpeg', metadata = {}) {
  console.log(`  📤 Uploading para R2: ${key}`);

  const command = new PutObjectCommand({
    Bucket: CONFIG.r2BucketName,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: contentType,
    Metadata: metadata,
  });

  await r2Client.send(command);

  // Retornar URL pública do R2
  return `${CONFIG.r2PublicUrl}/${key}`;
}

// ========================================
// EXTRAIR IMAGE ID DE URL CLOUDFLARE
// ========================================

function extractImageIdFromUrl(url) {
  if (!url) return null;

  // Formatos possíveis:
  // https://imagedelivery.net/{hash}/{imageId}/public
  // https://imagedelivery.net/{hash}/{imageId}/thumbnail
  // {imageId} (já é só o ID)

  if (url.includes('imagedelivery.net')) {
    const parts = url.split('/');
    const imageId = parts[parts.length - 2]; // penúltimo elemento
    return imageId;
  }

  // Se não tem protocolo, assume que já é o imageId
  if (!url.startsWith('http')) {
    return url;
  }

  return null;
}

// ========================================
// MIGRAR UMA IMAGEM
// ========================================

async function migrateImage(imageUrl, productId, imageName, type = 'main') {
  try {
    const imageId = extractImageIdFromUrl(imageUrl);

    if (!imageId) {
      console.log(`  ⚠️  URL inválida, pulando: ${imageUrl}`);
      return null;
    }

    // Download da imagem do Cloudflare Images
    const { buffer, contentType } = await downloadCloudflareImage(imageId);

    // Determinar extensão
    const ext = contentType.includes('png') ? 'png' :
                contentType.includes('webp') ? 'webp' : 'jpg';

    // Montar key do R2: produtos/{productId}/{imageName}.{ext}
    const r2Key = `produtos/${productId}/${imageName}.${ext}`;

    // Upload para R2
    const r2Url = await uploadToR2(buffer, r2Key, contentType, {
      productId,
      type,
      originalImageId: imageId,
      migratedAt: new Date().toISOString(),
    });

    console.log(`  ✅ Migrado: ${imageId} → ${r2Key}`);

    return {
      r2Key,
      r2Url,
      originalImageId: imageId,
    };
  } catch (error) {
    console.error(`  ❌ Erro ao migrar imagem ${imageUrl}:`, error.message);
    return null;
  }
}

// ========================================
// MIGRAR PRODUTOS
// ========================================

async function migrateProducts() {
  console.log('\n📦 Migrando produtos do Firestore para D1 com imagens no R2...\n');

  const productsSnapshot = await db.collection('produtos').get();
  let migratedCount = 0;
  let errorCount = 0;

  for (const doc of productsSnapshot.docs) {
    try {
      const product = doc.data();
      const productId = doc.id;

      console.log(`\n🔄 Produto: ${productId} - ${product.nome}`);

      // ===== IMAGEM PRINCIPAL =====
      let mainImageUrl = null;
      if (product.imagem_url) {
        const result = await migrateImage(
          product.imagem_url,
          productId,
          'main',
          'main'
        );
        if (result) mainImageUrl = result.r2Url;
      }

      // ===== IMAGENS ADICIONAIS (GALERIA) =====
      const galleryImages = [];
      if (product.imagens_urls && Array.isArray(product.imagens_urls)) {
        for (let i = 0; i < product.imagens_urls.length; i++) {
          const result = await migrateImage(
            product.imagens_urls[i],
            productId,
            `gallery-${i}`,
            'gallery'
          );
          if (result) galleryImages.push(result);
        }
      }

      // ===== VARIAÇÕES =====
      const variations = [];
      if (product.variacoes && Array.isArray(product.variacoes)) {
        for (const variation of product.variacoes) {
          const slug = variation.cor.toLowerCase().replace(/\s+/g, '-');
          const result = await migrateImage(
            variation.imagem_url,
            productId,
            `var-${slug}`,
            'variation'
          );
          if (result) {
            variations.push({
              cor: variation.cor,
              imagem_url: result.r2Url,
              r2_key: result.r2Key,
            });
          }
        }
      }

      // ===== INSERIR NO D1 =====
      const now = Date.now();

      await executeD1Query(
        `INSERT INTO produtos (id, nome, descricao, cor, imagem_url, thumb_url, destaque, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           nome = excluded.nome,
           descricao = excluded.descricao,
           imagem_url = excluded.imagem_url,
           updated_at = excluded.updated_at`,
        [
          productId,
          product.nome || '',
          product.descricao || '',
          product.cor || '',
          mainImageUrl || '',
          mainImageUrl || '', // R2 não precisa de thumb separado
          product.destaque ? 1 : 0,
          product.createdAt?.toMillis() || now,
          now,
        ]
      );

      // ===== CATEGORIAS =====
      if (product.categorias && Array.isArray(product.categorias)) {
        // Primeiro, remover categorias antigas
        await executeD1Query(
          `DELETE FROM produto_categorias WHERE produto_id = ?`,
          [productId]
        );

        // Inserir novas
        for (const categoria of product.categorias) {
          await executeD1Query(
            `INSERT OR IGNORE INTO produto_categorias (produto_id, categoria_id) VALUES (?, ?)`,
            [productId, categoria]
          );
        }
      }

      // ===== IMAGENS DA GALERIA =====
      // Limpar antigas
      await executeD1Query(
        `DELETE FROM produto_imagens WHERE produto_id = ?`,
        [productId]
      );

      // Inserir novas
      for (let i = 0; i < galleryImages.length; i++) {
        await executeD1Query(
          `INSERT INTO produto_imagens (produto_id, imagem_url, thumb_url, ordem)
           VALUES (?, ?, ?, ?)`,
          [productId, galleryImages[i].r2Url, galleryImages[i].r2Url, i]
        );
      }

      // ===== VARIAÇÕES =====
      // Limpar antigas
      await executeD1Query(
        `DELETE FROM produto_variacoes WHERE produto_id = ?`,
        [productId]
      );

      // Inserir novas
      for (const variation of variations) {
        await executeD1Query(
          `INSERT INTO produto_variacoes (produto_id, cor, imagem_url, thumb_url)
           VALUES (?, ?, ?, ?)`,
          [productId, variation.cor, variation.imagem_url, variation.imagem_url]
        );
      }

      console.log(`✅ Produto migrado com sucesso! (${galleryImages.length} imagens + ${variations.length} variações)`);
      migratedCount++;

    } catch (error) {
      console.error(`❌ Erro ao migrar produto ${doc.id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Resultados:`);
  console.log(`  ✅ Produtos migrados: ${migratedCount}`);
  console.log(`  ❌ Erros: ${errorCount}`);
}

// ========================================
// MIGRAR CATEGORIAS
// ========================================

async function migrateCategories() {
  console.log('\n📂 Migrando categorias...\n');

  const categoriesSnapshot = await db.collection('categorias').get();
  let migratedCount = 0;

  for (const doc of categoriesSnapshot.docs) {
    try {
      const category = doc.data();
      const categoryId = doc.id;

      console.log(`🔄 Categoria: ${categoryId} - ${category.nome}`);

      // Migrar imagem da categoria
      let categoryImageUrl = null;
      if (category.imagePath) {
        const result = await migrateImage(
          category.imagePath,
          `cat-${categoryId}`,
          'main',
          'category'
        );
        if (result) categoryImageUrl = result.r2Url;
      }

      await executeD1Query(
        `INSERT OR REPLACE INTO categorias (id, nome, image_path, popular, descricao, video_url, ordem)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          category.nome,
          categoryImageUrl || '',
          category.popular ? 1 : 0,
          category.descricao || '',
          category.videoUrl || '',
          category.ordem || 0,
        ]
      );

      console.log(`✅ Categoria migrada`);
      migratedCount++;
    } catch (error) {
      console.error(`❌ Erro ao migrar categoria ${doc.id}:`, error.message);
    }
  }

  console.log(`\n📊 Categorias migradas: ${migratedCount}`);
}

// ========================================
// MIGRAR CONFIGURAÇÕES (LAYOUT)
// ========================================

async function migrateConfig() {
  console.log('\n⚙️  Migrando configurações...\n');

  try {
    const layoutDoc = await db.collection('config').doc('layout').get();
    if (!layoutDoc.exists) {
      console.log('⚠️  Nenhuma config de layout encontrada');
      return;
    }

    const layout = layoutDoc.data();

    // Migrar logo
    let logoUrl = null;
    if (layout.logo) {
      const result = await migrateImage(
        layout.logo,
        'config',
        'logo',
        'logo'
      );
      if (result) logoUrl = result.r2Url;
    }

    // Inserir config no D1
    await executeD1Query(
      `INSERT OR REPLACE INTO layout_config (id, logo, whatsapp, company_info_title, company_info_description, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'default',
        logoUrl || '',
        layout.whatsapp || '',
        layout.companyInfo?.title || '',
        layout.companyInfo?.description || '',
        Date.now(),
      ]
    );

    // Migrar banners
    if (layout.banners && Array.isArray(layout.banners)) {
      // Limpar banners antigos
      await executeD1Query(`DELETE FROM banners`);

      for (let i = 0; i < layout.banners.length; i++) {
        const result = await migrateImage(
          layout.banners[i],
          'config',
          `banner-${i}`,
          'banner'
        );
        if (result) {
          await executeD1Query(
            `INSERT INTO banners (url, alt, ordem, ativo) VALUES (?, ?, ?, ?)`,
            [result.r2Url, 'Banner Rocha Brindes', i, 1]
          );
        }
      }
    }

    console.log('✅ Layout config migrado');
  } catch (error) {
    console.error('❌ Erro ao migrar config:', error.message);
  }
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log('🚀 Iniciando migração: Cloudflare Images → R2 + Firestore → D1\n');

  // Validar env vars
  const requiredVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_API_TOKEN',
    'D1_DATABASE_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
  ];

  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missing.join(', '));
    console.log('\nConfigure no .env:');
    console.log('  CLOUDFLARE_ACCOUNT_ID="..."');
    console.log('  CLOUDFLARE_API_TOKEN="..."');
    console.log('  D1_DATABASE_ID="..."');
    console.log('  R2_ACCESS_KEY_ID="..."');
    console.log('  R2_SECRET_ACCESS_KEY="..."');
    console.log('  R2_PUBLIC_URL="https://images.rochabrindes.com" (opcional)');
    process.exit(1);
  }

  await initFirebase();
  initR2();

  // Migrar em ordem
  await migrateCategories();
  await migrateProducts();
  await migrateConfig();

  console.log('\n✅ Migração concluída!\n');
  console.log('📁 Estrutura no R2:');
  console.log('  produtos/');
  console.log('    ├── {produtoId}/');
  console.log('    │   ├── main.jpg');
  console.log('    │   ├── gallery-0.jpg');
  console.log('    │   ├── gallery-1.jpg');
  console.log('    │   └── var-{cor}.jpg');
  console.log('  config/');
  console.log('    ├── logo.jpg');
  console.log('    └── banner-{n}.jpg');
  console.log('  cat-{categoriaId}/');
  console.log('    └── main.jpg');
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
