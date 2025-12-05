# Setup Cloudflare para Rocha Brindes

Este documento descreve como configurar o Cloudflare D1, R2 e Pages para o projeto Rocha Brindes.

## Requisitos

- Conta Cloudflare
- Wrangler CLI instalado (`npm install -g wrangler`)
- Autenticação configurada (`wrangler login`)

## 1. Criar Database D1

```bash
# Criar o database
wrangler d1 create rocha-brindes-db

# Copie o database_id retornado e atualize no wrangler.toml
# Substitua "your-database-id" pelo ID real
```

## 2. Executar Migrations

```bash
# Executar o schema SQL
wrangler d1 execute rocha-brindes-db --file=./schema.sql

# Ou usar o comando npm
npm run db:init
```

## 3. Criar R2 Bucket

```bash
# Criar bucket para imagens
wrangler r2 bucket create rocha-brindes-images
```

## 4. Criar KV Namespaces

```bash
# KV para cache
wrangler kv:namespace create "CACHE"

# KV para sessões
wrangler kv:namespace create "SESSIONS"

# Copie os IDs retornados e atualize no wrangler.toml
```

## 5. Configurar Cloudflare Images

O projeto usa Cloudflare Images para otimização automática de imagens.

1. Acesse: https://dash.cloudflare.com/[account-id]/images
2. Ative o Cloudflare Images
3. Configure as variantes:
   - `public` - 800x800 (fit: scale-down)
   - `thumbnail` - 300x300 (fit: cover)
   - `original` - Sem transformação

## 6. Atualizar wrangler.toml

Após criar os recursos, atualize o arquivo `wrangler.toml` com os IDs corretos:

```toml
[[d1_databases]]
binding = "DB"
database_name = "rocha-brindes-db"
database_id = "SEU-DATABASE-ID-AQUI"

[[kv_namespaces]]
binding = "CACHE"
id = "SEU-KV-CACHE-ID-AQUI"

[[kv_namespaces]]
binding = "SESSIONS"
id = "SEU-KV-SESSIONS-ID-AQUI"
```

## 7. Deploy para Cloudflare Pages

```bash
# Build do projeto
npm run build

# Deploy usando Wrangler
npm run pages:deploy

# Ou conecte o repositório GitHub diretamente no dashboard:
# 1. Acesse https://dash.cloudflare.com/[account-id]/pages
# 2. Clique em "Create a project"
# 3. Conecte seu repositório GitHub
# 4. Configure:
#    - Framework preset: Astro
#    - Build command: npm run build
#    - Build output directory: dist
```

## 8. Configurar Environment Variables (Produção)

No Cloudflare Pages Dashboard, adicione as seguintes variáveis de ambiente:

- `CLOUDFLARE_ACCOUNT_HASH` - Seu account hash do Cloudflare Images
- Outros segredos necessários

## 9. Configurar Bindings no Pages

No Cloudflare Pages Dashboard, em Settings > Functions:

1. Adicione os D1 bindings
2. Adicione os R2 bindings
3. Adicione os KV bindings

## 10. Testar Localmente

```bash
# Desenvolvimento local
npm run dev

# Testar com Wrangler Pages localmente
npm run pages:dev
```

## Estrutura da API

As APIs estão disponíveis em:

- `GET /api/catalog` - Catálogo completo (produtos + categorias + layout)
- `GET /api/products` - Lista de produtos
- `GET /api/products/:id` - Produto específico
- `POST /api/products` - Criar produto (requer auth)
- `PUT /api/products/:id` - Atualizar produto (requer auth)
- `DELETE /api/products/:id` - Deletar produto (requer auth)
- `POST /api/upload` - Upload de imagem (requer auth)
- `DELETE /api/upload` - Deletar imagem (requer auth)

## Performance e Otimizações

### Mobile

- Code splitting automático via Vite
- Lazy loading de imagens
- Prefetch de páginas
- Minificação agressiva (Terser)
- Inlining de CSS crítico

### Cloudflare

- Cache em KV (5 minutos)
- CDN global
- D1 para queries rápidas
- R2 + Cloudflare Images para entrega otimizada

## Migração de Dados do Firebase

Para migrar dados existentes do Firebase para D1:

```bash
# TODO: Criar script de migração
# O script deve:
# 1. Exportar produtos, categorias e config do Firestore
# 2. Fazer upload de imagens para R2/Cloudflare Images
# 3. Inserir dados no D1
```

## Monitoramento

- Analytics: Cloudflare Web Analytics
- Logs: `wrangler pages deployment tail`
- Errors: Cloudflare Dashboard > Analytics > Errors

## Segurança

- [ ] Implementar autenticação para rotas admin
- [ ] Adicionar rate limiting
- [ ] Configurar CORS adequadamente
- [ ] Validar todos os inputs
- [ ] Sanitizar uploads de arquivos

## Próximos Passos

1. Implementar autenticação completa (OAuth/JWT)
2. Criar painel admin completo em SolidJS
3. Adicionar sistema de cache mais sofisticado
4. Implementar busca full-text
5. Adicionar analytics e tracking
6. Criar script de migração automática do Firebase
