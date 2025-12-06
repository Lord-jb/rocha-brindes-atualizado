# Rocha Brindes - Astro + SolidJS + Cloudflare

Este é o catálogo digital da Rocha Brindes, migrado para uma stack moderna e otimizada para alto desempenho em dispositivos móveis.

## 🚀 Stack Tecnológica

- **Frontend**: Astro + SolidJS
- **Backend**: Cloudflare Workers (Pages Functions)
- **Database**: Cloudflare D1 (SQLite distribuído)
- **Storage**: Cloudflare R2 + Images
- **CDN**: Cloudflare Pages
- **Styling**: TailwindCSS

## 📦 Estrutura do Projeto

```
.
├── functions/api/         # Cloudflare Workers API
│   ├── catalog.ts         # Endpoint de catálogo completo
│   ├── products.ts        # CRUD de produtos
│   ├── upload.ts          # Upload de imagens
│   ├── db.ts              # Database helpers
│   └── types.ts           # TypeScript types
├── src/
│   ├── components/        # Componentes principais
│   │   ├── Admin.solid.tsx
│   │   ├── Catalog.solid.tsx
│   │   ├── Home.solid.tsx
│   │   └── Providers.solid.tsx
│   ├── core/
│   │   ├── lib/
│   │   │   ├── api.ts           # Cliente API
│   │   │   └── cloudflare.ts    # Helpers Cloudflare Images
│   │   └── store/
│   │       └── cart.solid.ts    # State management
│   ├── features/          # Features modulares
│   ├── shared/            # Componentes compartilhados
│   ├── pages/             # Páginas Astro
│   └── layouts/           # Layouts
├── schema.sql             # Schema do D1
├── wrangler.toml          # Config Cloudflare
└── CLOUDFLARE_SETUP.md    # Guia de setup
```

## 🛠️ Instalação e Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Cloudflare (Produção)

Siga as instruções em [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) para:
- Criar D1 Database
- Criar R2 Bucket
- Criar KV Namespaces
- Configurar bindings

### 3. Desenvolvimento Local

```bash
npm run dev
```

O site estará disponível em `http://localhost:4321`

### 4. Build

```bash
npm run build
```

### 5. Deploy para Cloudflare Pages

```bash
npm run pages:deploy
```

Ou conecte o repositório GitHub diretamente no dashboard do Cloudflare Pages.

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run pages:dev` - Desenvolvimento com Wrangler
- `npm run pages:deploy` - Deploy para Cloudflare Pages
- `npm run db:init` - Inicializar database D1
- `npm run db:migrate` - Executar migrations

## 🔧 Configuração

### Database (D1)

O schema SQL está em `schema.sql`. Para criar/atualizar:

```bash
npm run db:init
```

### Environment Variables

Configure no Cloudflare Pages Dashboard:
- `CLOUDFLARE_ACCOUNT_HASH` - Hash da conta para Cloudflare Images

### Bindings

Configure os bindings no `wrangler.toml`:
- `DB` - D1 Database
- `IMAGES` - R2 Bucket
- `CACHE` - KV Namespace para cache
- `SESSIONS` - KV Namespace para sessões

## 🎯 API Endpoints

- `GET /api/catalog` - Catálogo completo (com cache)
- `GET /api/products` - Lista de produtos
- `GET /api/products/:id` - Produto específico
- `POST /api/products` - Criar produto (requer auth)
- `PUT /api/products/:id` - Atualizar produto (requer auth)
- `DELETE /api/products/:id` - Deletar produto (requer auth)
- `POST /api/upload` - Upload de imagem (requer auth)
- `DELETE /api/upload` - Deletar imagem (requer auth)

## 📱 Otimizações Mobile

- ✅ Code splitting automático
- ✅ Lazy loading de imagens
- ✅ Minificação agressiva (Terser)
- ✅ Tree-shaking
- ✅ CSS inline crítico
- ✅ Prefetch inteligente
- ✅ CDN global

## 🔐 Segurança

- [ ] TODO: Implementar autenticação para rotas admin
- [ ] TODO: Rate limiting
- [ ] TODO: Validação de inputs
- [ ] TODO: Sanitização de uploads

## 📊 Performance

### Métricas Esperadas
- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Cache Strategy
- Catálogo: 5 minutos (KV)
- Imagens: Cache infinito (Cloudflare Images)
- Assets estáticos: Cache agressivo (CDN)

## 🐛 Troubleshooting

### Erro: "_routes.json invalid"
O arquivo `public/_routes.json` deve ter o formato correto. Está configurado para:
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/_astro/*", "/favicon.ico"]
}
```

### Erro: "Cannot find module @astrojs/cloudflare"
Execute: `npm install`

### Build falha
1. Limpe o cache: `rm -rf node_modules/.vite dist`
2. Reinstale: `npm install`
3. Build novamente: `npm run build`

## 📝 Migração do Firebase

Para migrar dados existentes do Firebase:
1. Exportar dados do Firestore
2. Fazer upload de imagens para R2/Cloudflare Images
3. Importar dados para D1 usando o schema SQL

(Script de migração a ser criado)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Propriedade da Rocha Brindes. Todos os direitos reservados.

## 🆘 Suporte

Para questões técnicas, consulte a documentação completa em [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md).
