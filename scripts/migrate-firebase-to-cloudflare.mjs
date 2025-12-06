// Script de migração: Firestore → Cloudflare D1 + R2 + Images
// Execute: node scripts/migrate-firebase-to-cloudflare.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// ========================================
// CONFIGURAÇÃO
// ========================================

const CONFIG = {
  // Firebase
  firebaseCredentials: './firebase-credentials.json', // Baixe do Firebase Console
  firebaseStorageBucket: 'rocha-brindes.firebasestorage.app',

  // Cloudflare
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
  cloudflareAccountHash: 'iem94FVEkj3Qjv3DsJXpbQ',
  cloudflareImagesToken: process.env.CLOUDFLARE_IMAGES_TOKEN,

  // D1
  d1DatabaseId: process.env.D1_DATABASE_ID,
  d1ApiUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.D1_DATABASE_ID}/query`,

  // R2
  r2BucketName: 'rocha-brindes-images',
};

// ========================================
// INICIALIZAR FIREBASE
// ========================================

let db, storage;

async function initFirebase() {
  try {
    const serviceAccount = JSON.parse(
      await fs.readFile(CONFIG.firebaseCredentials, 'utf-8')
    );

    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: CONFIG.firebaseStorageBucket,
    });

    db = getFirestore();
    storage = getStorage();

    console.log('✅ Firebase inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    process.exit(1);
  }
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
    body: JSON.stringify({
      sql,
      params,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(result.errors)}`);
  }

  return result.result;
}

// ========================================
// CLOUDFLARE IMAGES UPLOAD
// ========================================

async function uploadToCloudflareImages(imageBuffer, imageId, metadata = {}) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer]);
  formData.append('file', blob, `${imageId}.jpg`);
  formData.append('id', imageId);
  formData.append('metadata', JSON.stringify(metadata));

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CONFIG.cloudflareAccountId}/images/v1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.cloudflareImagesToken}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(`Upload failed: ${JSON.stringify(result.errors)}`);
  }

  return result.result.id;
}

// ========================================
// MIGRAR IMAGENS
// ========================================

async function migrateImage(firebaseImageUrl, productId, type = 'main') {
  try {
    console.log(`  📷 Migrando imagem: ${firebaseImageUrl}`);

    // Download da imagem do Firebase Storage
    const response = await fetch(firebaseImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    // Upload para Cloudflare Images
    const imageId = `${productId}-${type}-${Date.now()}`;
    await uploadToCloudflareImages(Buffer.from(imageBuffer), imageId, {
      productId,
      type,
      migratedFrom: 'firebase',
    });

    console.log(`  ✅ Imagem migrada: ${imageId}`);
    return imageId;
  } catch (error) {
    console.error(`  ❌ Erro ao migrar imagem:`, error.message);
    return null;
  }
}

// ========================================
// MIGRAR PRODUTOS
// ========================================

async function migrateProducts() {
  console.log('\n📦 Migrando produtos...\n');

  const productsSnapshot = await db.collection('produtos').get();
  let migratedCount = 0;
  let errorCount = 0;

  for (const doc of productsSnapshot.docs) {
    try {
      const product = doc.data();
      const productId = doc.id;

      console.log(`\n🔄 Produto: ${productId} - ${product.nome}`);

      // Migrar imagem principal
      let mainImageId = null;
      if (product.imagem_url) {
        mainImageId = await migrateImage(product.imagem_url, productId, 'main');
      }

      // Migrar imagens adicionais
      const additionalImageIds = [];
      if (product.imagens_urls && Array.isArray(product.imagens_urls)) {
        for (let i = 0; i < product.imagens_urls.length; i++) {
          const imageId = await migrateImage(
            product.imagens_urls[i],
            productId,
            `gallery-${i}`
          );
          if (imageId) additionalImageIds.push(imageId);
        }
      }

      // Migrar variações
      const variations = [];
      if (product.variacoes && Array.isArray(product.variacoes)) {
        for (const variation of product.variacoes) {
          const varImageId = await migrateImage(
            variation.imagem_url,
            productId,
            `var-${variation.cor}`
          );
          if (varImageId) {
            variations.push({
              cor: variation.cor,
              imagem_url: varImageId,
            });
          }
        }
      }

      // Inserir no D1
      const now = Date.now();
      await executeD1Query(
        `INSERT INTO produtos (id, nome, descricao, cor, imagem_url, thumb_url, destaque, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          product.nome || '',
          product.descricao || '',
          product.cor || '',
          mainImageId || '',
          mainImageId || '', // Cloudflare Images gera thumb automaticamente
          product.destaque ? 1 : 0,
          product.createdAt?.toMillis() || now,
          now,
        ]
      );

      // Inserir categorias
      if (product.categorias && Array.isArray(product.categorias)) {
        for (const categoria of product.categorias) {
          await executeD1Query(
            `INSERT OR IGNORE INTO produto_categorias (produto_id, categoria_id) VALUES (?, ?)`,
            [productId, categoria]
          );
        }
      }

      // Inserir imagens adicionais
      for (let i = 0; i < additionalImageIds.length; i++) {
        await executeD1Query(
          `INSERT INTO produto_imagens (produto_id, imagem_url, thumb_url, ordem)
           VALUES (?, ?, ?, ?)`,
          [productId, additionalImageIds[i], additionalImageIds[i], i]
        );
      }

      // Inserir variações
      for (const variation of variations) {
        await executeD1Query(
          `INSERT INTO produto_variacoes (produto_id, cor, imagem_url, thumb_url)
           VALUES (?, ?, ?, ?)`,
          [productId, variation.cor, variation.imagem_url, variation.imagem_url]
        );
      }

      console.log(`✅ Produto migrado com sucesso!`);
      migratedCount++;
    } catch (error) {
      console.error(`❌ Erro ao migrar produto ${doc.id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Produtos migrados: ${migratedCount}`);
  console.log(`❌ Erros: ${errorCount}`);
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

      // Migrar imagem da categoria se existir
      let categoryImageId = null;
      if (category.imagePath) {
        categoryImageId = await migrateImage(
          category.imagePath,
          categoryId,
          'category'
        );
      }

      await executeD1Query(
        `INSERT OR REPLACE INTO categorias (id, nome, image_path, popular, descricao, video_url, ordem)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          category.nome,
          categoryImageId || '',
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
// MIGRAR CONFIGURAÇÕES
// ========================================

async function migrateConfig() {
  console.log('\n⚙️  Migrando configurações...\n');

  try {
    // Layout config
    const layoutDoc = await db.collection('config').doc('layout').get();
    if (layoutDoc.exists) {
      const layout = layoutDoc.data();

      // Migrar logo
      let logoId = null;
      if (layout.logo) {
        logoId = await migrateImage(layout.logo, 'logo', 'logo');
      }

      // Inserir no D1
      await executeD1Query(
        `INSERT OR REPLACE INTO layout_config (id, logo, whatsapp, company_info_title, company_info_description, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'default',
          logoId || '',
          layout.whatsapp || '',
          layout.companyInfo?.title || '',
          layout.companyInfo?.description || '',
          Date.now(),
        ]
      );

      // Migrar banners
      if (layout.banners && Array.isArray(layout.banners)) {
        for (let i = 0; i < layout.banners.length; i++) {
          const bannerId = await migrateImage(layout.banners[i], `banner-${i}`, 'banner');
          if (bannerId) {
            await executeD1Query(
              `INSERT INTO banners (url, alt, ordem, ativo) VALUES (?, ?, ?, ?)`,
              [bannerId, 'Banner Rocha Brindes', i, 1]
            );
          }
        }
      }

      console.log('✅ Layout config migrado');
    }
  } catch (error) {
    console.error('❌ Erro ao migrar config:', error.message);
  }
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log('🚀 Iniciando migração Firestore → Cloudflare\n');

  // Validar env vars
  if (!CONFIG.cloudflareAccountId || !CONFIG.cloudflareApiToken) {
    console.error('❌ Variáveis de ambiente não configuradas!');
    console.log('\nConfigure:');
    console.log('  export CLOUDFLARE_ACCOUNT_ID="your-account-id"');
    console.log('  export CLOUDFLARE_API_TOKEN="your-api-token"');
    console.log('  export CLOUDFLARE_IMAGES_TOKEN="your-images-token"');
    console.log('  export D1_DATABASE_ID="your-d1-id"');
    process.exit(1);
  }

  await initFirebase();

  // Migrar em ordem
  await migrateCategories();
  await migrateProducts();
  await migrateConfig();

  console.log('\n✅ Migração concluída!\n');
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
