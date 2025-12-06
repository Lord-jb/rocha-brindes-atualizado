# Guia de Migração: Firebase → Cloudflare

Este guia detalha como migrar todos os dados do Firebase (Firestore + Storage) para Cloudflare (D1 + R2 + Images).

## 📋 Pré-requisitos

### 1. Credenciais Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Project Settings** → **Service Accounts**
3. Clique em **Generate New Private Key**
4. Salve o arquivo como `firebase-credentials.json` na raiz do projeto

### 2. Tokens Cloudflare

```bash
# Login no Wrangler
wrangler login

# Obter Account ID
wrangler whoami

# Criar API Token
# Acesse: https://dash.cloudflare.com/profile/api-tokens
# Permissões necessárias:
# - Account.Cloudflare Images: Edit
# - Account.D1: Edit
# - Account.Workers R2 Storage: Edit
```

### 3. Criar Recursos Cloudflare

```bash
# D1 Database
wrangler d1 create rocha-brindes-db
# Copie o database_id

# R2 Bucket
wrangler r2 bucket create rocha-brindes-images

# KV Namespaces
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "SESSIONS"

# Executar schema
wrangler d1 execute rocha-brindes-db --file=./schema.sql
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```bash
CLOUDFLARE_ACCOUNT_ID="seu-account-id"
CLOUDFLARE_API_TOKEN="seu-api-token"
CLOUDFLARE_IMAGES_TOKEN="seu-images-token"
D1_DATABASE_ID="seu-d1-database-id"
```

## 🚀 Executar Migração

### 1. Instalar dependências do script

```bash
npm install --save-dev firebase-admin node-fetch
```

### 2. Executar migração

```bash
# Carregar env vars
export $(cat .env | xargs)

# Executar script
node scripts/migrate-firebase-to-cloudflare.mjs
```

## 📊 O que o script migra

### ✅ Produtos
- [x] Dados básicos (nome, descrição, cor, destaque)
- [x] Imagem principal
- [x] Imagens adicionais (galeria)
- [x] Variações de cor
- [x] Categorias associadas
- [x] Timestamps

### ✅ Categorias
- [x] Nome e descrição
- [x] Imagem da categoria
- [x] Popular flag
- [x] URL de vídeo
- [x] Ordem

### ✅ Configurações
- [x] Logo
- [x] Banners
- [x] WhatsApp
- [x] Informações da empresa

### ✅ Imagens
- [x] Download do Firebase Storage
- [x] Upload para Cloudflare Images
- [x] Metadata preservada
- [x] Otimização automática (thumbnails, formatos)

## 🔍 Verificar Migração

### Verificar D1

```bash
# Contar produtos
wrangler d1 execute rocha-brindes-db --command "SELECT COUNT(*) FROM produtos"

# Listar produtos
wrangler d1 execute rocha-brindes-db --command "SELECT id, nome FROM produtos LIMIT 10"

# Verificar categorias
wrangler d1 execute rocha-brindes-db --command "SELECT * FROM categorias"
```

### Verificar Cloudflare Images

1. Acesse: `https://dash.cloudflare.com/[account-id]/images`
2. Verifique se as imagens foram uploadadas
3. Teste uma URL: `https://imagedelivery.net/[account-hash]/[image-id]/public`

## 🔄 Migração Incremental

Para migrar apenas produtos novos/atualizados:

```bash
# Modificar o script para filtrar por data
# Adicionar WHERE clause no Firestore query:
# .where('updatedAt', '>', lastMigrationDate)
```

## ⚠️ Troubleshooting

### Erro: "Firebase credentials not found"
```bash
# Certifique-se que o arquivo existe
ls -la firebase-credentials.json
```

### Erro: "Cloudflare API Token invalid"
```bash
# Verificar token
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Erro: "Image upload failed"
```bash
# Verificar permissões do token
# Deve ter: Account.Cloudflare Images: Edit
```

### Algumas imagens falharam
- O script continua mesmo se algumas imagens falharem
- Verifique os logs para ver quais falharam
- Execute o script novamente (ele pula duplicatas)

## 📈 Performance

- **Produtos**: ~2-5 por segundo (depende do tamanho das imagens)
- **Categorias**: ~5-10 por segundo
- **Total**: Para 1000 produtos com 5 imagens cada, espere ~30-60 minutos

## 🔒 Segurança

- ✅ Nunca commite `firebase-credentials.json`
- ✅ Nunca commite `.env`
- ✅ Use `.gitignore` para excluir esses arquivos
- ✅ Revogue tokens antigos após migração

## 📝 Pós-Migração

1. **Testar o site**
   ```bash
   npm run build
   npm run pages:deploy
   ```

2. **Verificar funcionalidades**
   - [ ] Catálogo carrega
   - [ ] Imagens aparecem
   - [ ] Categorias funcionam
   - [ ] Busca funciona

3. **Backup do Firebase** (opcional)
   ```bash
   # Exportar Firestore
   gcloud firestore export gs://[BUCKET_NAME]
   ```

4. **Desativar Firebase** (opcional)
   - Manter por alguns dias em paralelo
   - Monitorar o novo sistema
   - Depois desativar Firebase para economizar

## 🆘 Rollback

Se algo der errado:

```bash
# Limpar D1
wrangler d1 execute rocha-brindes-db --command "DELETE FROM produtos"
wrangler d1 execute rocha-brindes-db --command "DELETE FROM categorias"
wrangler d1 execute rocha-brindes-db --command "DELETE FROM layout_config"

# Deletar imagens do Cloudflare
# (use o dashboard ou API)

# Reverter deploy
# (use commit anterior)
```

## ✅ Checklist Final

- [ ] Firebase credentials baixadas
- [ ] Cloudflare tokens criados
- [ ] D1 database criado e schema executado
- [ ] R2 bucket criado
- [ ] Variáveis de ambiente configuradas
- [ ] Script executado com sucesso
- [ ] Dados verificados no D1
- [ ] Imagens verificadas no Cloudflare
- [ ] Site testado em preview
- [ ] Deploy em produção
- [ ] Monitoramento por 24-48h
- [ ] Backup do Firebase (opcional)
- [ ] Desativar Firebase (após confirmação)
