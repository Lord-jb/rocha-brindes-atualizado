# Migração de Imagens: Cloudflare Images → R2

Este guia explica como migrar as imagens do Cloudflare Images para o R2, organizando cada produto em sua própria pasta.

## 🎯 Objetivo

Migrar de:
```
https://imagedelivery.net/{hash}/{imageId}/public
```

Para:
```
https://images.rochabrindes.com/produtos/{productId}/main.jpg
https://images.rochabrindes.com/produtos/{productId}/gallery-0.jpg
https://images.rochabrindes.com/produtos/{productId}/var-azul.jpg
```

## 📁 Estrutura no R2

```
r2://rocha-brindes-images/
├── produtos/
│   ├── produto-001/
│   │   ├── main.jpg
│   │   ├── gallery-0.jpg
│   │   ├── gallery-1.jpg
│   │   └── var-azul.jpg
│   ├── produto-002/
│   │   ├── main.jpg
│   │   └── gallery-0.jpg
│   └── ...
├── config/
│   ├── logo.jpg
│   ├── banner-0.jpg
│   └── banner-1.jpg
└── cat-{categoriaId}/
    └── main.jpg
```

## 🔧 Configuração

### 1. Criar R2 Bucket

```bash
wrangler r2 bucket create rocha-brindes-images
```

### 2. Criar API Token do R2

1. Acesse: https://dash.cloudflare.com/[account-id]/r2
2. Clique em **Manage R2 API Tokens**
3. Clique em **Create API Token**
4. Configure:
   - **Token Name**: `rocha-brindes-migration`
   - **Permissions**: `Read` e `Write`
   - **TTL**: 1 hour (ou mais se precisar)
5. Copie:
   - `Access Key ID`
   - `Secret Access Key`

### 3. Configurar Domínio Customizado (Opcional)

Para usar URLs como `https://images.rochabrindes.com`:

1. Acesse: https://dash.cloudflare.com/[account-id]/r2/buckets/rocha-brindes-images
2. Vá em **Settings** → **Public Access**
3. Clique em **Connect Domain**
4. Escolha seu domínio: `images.rochabrindes.com`
5. Configure DNS automaticamente

**Alternativa:** Use a URL padrão do R2:
```
https://pub-{hash}.r2.dev
```

### 4. Configurar Variáveis de Ambiente

Edite `.env`:

```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID="seu-account-id"
CLOUDFLARE_API_TOKEN="seu-api-token"

# D1
D1_DATABASE_ID="seu-d1-database-id"

# R2
R2_ACCESS_KEY_ID="seu-r2-access-key"
R2_SECRET_ACCESS_KEY="seu-r2-secret-key"
R2_PUBLIC_URL="https://images.rochabrindes.com"  # ou URL padrão do R2
```

## 🚀 Executar Migração

### 1. Instalar Dependências

```bash
npm install --save-dev @aws-sdk/client-s3 firebase-admin node-fetch
```

### 2. Executar Script

```bash
# Carregar variáveis
export $(cat .env | xargs)

# Executar migração
node scripts/migrate-images-to-r2.mjs
```

## 📊 O que o Script Faz

### Para Cada Produto:

1. **Lê do Firestore**
   - Produto completo com todas as URLs de imagens

2. **Extrai Image ID**
   - De URLs como: `https://imagedelivery.net/{hash}/{imageId}/public`
   - Ou imageIds diretos

3. **Baixa do Cloudflare Images**
   - Usa a variant `public` (alta resolução)
   - Detecta tipo de conteúdo (JPEG, PNG, WebP)

4. **Organiza por Pasta**
   ```
   produtos/{productId}/main.jpg          → Imagem principal
   produtos/{productId}/gallery-0.jpg     → Primeira imagem adicional
   produtos/{productId}/gallery-1.jpg     → Segunda imagem adicional
   produtos/{productId}/var-azul.jpg      → Variação azul
   produtos/{productId}/var-vermelho.jpg  → Variação vermelha
   ```

5. **Upload para R2**
   - Mantém metadata (produto ID, tipo, data)
   - Define Content-Type correto

6. **Atualiza D1**
   - Produto com nova URL principal
   - Galeria de imagens com novas URLs
   - Variações com novas URLs

### Para Categorias:

```
cat-{categoriaId}/main.jpg
```

### Para Configurações:

```
config/logo.jpg
config/banner-0.jpg
config/banner-1.jpg
```

## ⏱️ Tempo Estimado

| Quantidade | Imagens por Produto | Tempo Total |
|------------|---------------------|-------------|
| 100 produtos | 3 imagens | ~10-15 min |
| 500 produtos | 3 imagens | ~40-60 min |
| 1000 produtos | 5 imagens | ~90-120 min |

*Depende da velocidade da internet e tamanho das imagens*

## ✅ Verificar Migração

### 1. Verificar R2

```bash
# Listar buckets
wrangler r2 bucket list

# Listar objetos em um bucket
wrangler r2 object list rocha-brindes-images --prefix="produtos/"
```

### 2. Verificar D1

```bash
# Ver produtos
wrangler d1 execute rocha-brindes-db \
  --command "SELECT id, nome, imagem_url FROM produtos LIMIT 5"

# Ver imagens de um produto
wrangler d1 execute rocha-brindes-db \
  --command "SELECT * FROM produto_imagens WHERE produto_id = 'PRODUTO_ID'"
```

### 3. Testar URLs

Abra no navegador:
```
https://images.rochabrindes.com/produtos/{productId}/main.jpg
```

## 🔄 Atualizar Cloudflare Workers

Atualize `functions/api/db.ts` para usar URLs do R2:

```typescript
// Antes (Cloudflare Images)
const imageUrl = `https://imagedelivery.net/${hash}/${imageId}/public`;

// Depois (R2)
const imageUrl = row.imagem_url; // Já vem do D1 com URL completa
```

## 🛡️ CORS para R2

Se precisar acessar imagens via JavaScript, configure CORS:

```bash
wrangler r2 bucket cors put rocha-brindes-images \
  --rules '[{
    "AllowedOrigins": ["https://rochabrindes.com"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }]'
```

## 🗑️ Limpeza (Após Confirmação)

**Depois de confirmar que tudo funciona:**

### Deletar Imagens do Cloudflare Images (Opcional)

```bash
# Via Dashboard:
# https://dash.cloudflare.com/[account-id]/images

# Ou via API (criar script separado se necessário)
```

### Desabilitar Cloudflare Images

1. Acesse: https://dash.cloudflare.com/[account-id]/images/images
2. Settings → Disable

## 📝 Logs e Monitoramento

O script gera logs detalhados:

```
🔄 Produto: produto-001 - Caneta Personalizada
  📥 Baixando: https://imagedelivery.net/{hash}/{id}/public
  📤 Uploading para R2: produtos/produto-001/main.jpg
  ✅ Migrado: {imageId} → produtos/produto-001/main.jpg
  📥 Baixando: https://imagedelivery.net/{hash}/{id2}/public
  📤 Uploading para R2: produtos/produto-001/gallery-0.jpg
  ✅ Migrado: {imageId2} → produtos/produto-001/gallery-0.jpg
✅ Produto migrado com sucesso! (2 imagens + 1 variações)
```

## ⚠️ Troubleshooting

### Erro: "Access Denied"
- Verifique `R2_ACCESS_KEY_ID` e `R2_SECRET_ACCESS_KEY`
- Confirme que o token tem permissão de `Write`

### Erro: "Bucket not found"
- Crie o bucket: `wrangler r2 bucket create rocha-brindes-images`

### Imagens não carregam
- Verifique se o domínio customizado está configurado
- Ou use a URL padrão do R2
- Verifique CORS se acessando via JavaScript

### Algumas imagens falharam
- O script continua mesmo com erros
- Verifique os logs para ver quais falharam
- Execute novamente (ele atualiza/sobrescreve)

## 💡 Dicas

### Migração Incremental

Se tiver muitos produtos, migre em lotes:

```javascript
// No script, adicione um filtro:
const productsSnapshot = await db.collection('produtos')
  .limit(100)  // 100 por vez
  .get();
```

### Backup

Antes de deletar do Cloudflare Images, faça backup:
```bash
# Baixar todas as imagens localmente primeiro
```

### Monitorar Uso R2

```bash
# Ver estatísticas
wrangler r2 bucket list
```

## 🎉 Resultado Final

Após a migração:
- ✅ Imagens organizadas por produto no R2
- ✅ URLs atualizadas no D1
- ✅ Site funcionando com R2
- ✅ Redução de custos (R2 é mais barato que Images)
- ✅ Melhor organização (pastas por produto)
- ✅ Maior controle (você gerencia o storage)
