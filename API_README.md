# API Documentation - Rocha Brindes

## Estrutura das APIs

Todas as APIs estão localizadas em `functions/api/` e são executadas como Cloudflare Workers Functions.

### Endpoints Disponíveis

#### 1. **Catálogo** - `/api/catalog`
Retorna produtos em destaque, categorias populares e configurações do site.

**Método:** GET

**Parâmetros de Query:**
- `limit` (opcional): Número de produtos em destaque (padrão: 8)
- `popular` (opcional): Retornar apenas categorias populares (true/false)

**Exemplo de Resposta:**
```json
{
  "featured_products": [...],
  "categories": [...],
  "settings": {...}
}
```

---

#### 2. **Produtos** - `/api/products`

**GET** - Listar produtos ou obter um específico

**Parâmetros de Query:**
- `id`: Buscar produto por ID
- `slug`: Buscar produto por slug
- `category`: Filtrar por categoria
- `featured`: Filtrar produtos em destaque (true/false)
- `search`: Buscar por nome ou descrição
- `min_price`: Preço mínimo
- `max_price`: Preço máximo
- `sort`: Ordenação (name_asc, name_desc, price_asc, price_desc, newest, oldest)
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 12)

**POST** - Criar produto (Admin)

**Body:**
```json
{
  "name": "Nome do Produto",
  "slug": "nome-do-produto",
  "description": "Descrição do produto",
  "price": 99.90,
  "featured": true,
  "active": true,
  "main_image_url": "https://...",
  "main_thumb_url": "https://...",
  "category_ids": ["cat-id-1", "cat-id-2"],
  "images": [
    {
      "image_url": "https://...",
      "thumb_url": "https://...",
      "order_index": 0,
      "alt_text": "Descrição da imagem"
    }
  ],
  "variations": [
    {
      "color": "Azul",
      "size": "M",
      "sku": "PROD-AZU-M",
      "price_modifier": 0,
      "stock": 100
    }
  ]
}
```

**PUT** - Atualizar produto (Admin)

**Parâmetros de Query:**
- `id`: ID do produto

**DELETE** - Deletar produto (Admin)

**Parâmetros de Query:**
- `id`: ID do produto

---

#### 3. **Categorias** - `/api/categories`

**GET** - Listar categorias ou obter uma específica

**Parâmetros de Query:**
- `id`: Buscar categoria por ID
- `slug`: Buscar categoria por slug
- `popular`: Retornar apenas categorias populares (true/false)

**POST** - Criar categoria (Admin)

**Body:**
```json
{
  "name": "Nome da Categoria",
  "slug": "nome-da-categoria",
  "description": "Descrição da categoria",
  "image_url": "https://...",
  "popular": true,
  "order_index": 0
}
```

**PUT** - Atualizar categoria (Admin)

**Parâmetros de Query:**
- `id`: ID da categoria

**DELETE** - Deletar categoria (Admin)

**Parâmetros de Query:**
- `id`: ID da categoria

---

#### 4. **Pedidos** - `/api/orders`

**GET** - Listar pedidos ou obter um específico

**Parâmetros de Query:**
- `id`: Buscar pedido por ID
- `order_number`: Buscar pedido por número
- `status`: Filtrar por status (pending, confirmed, processing, shipped, delivered, cancelled)
- `customer_whatsapp`: Filtrar por WhatsApp do cliente
- `date_from`: Data inicial (timestamp Unix)
- `date_to`: Data final (timestamp Unix)
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)

**POST** - Criar pedido

**Body:**
```json
{
  "customer_name": "Nome do Cliente",
  "customer_email": "email@example.com",
  "customer_whatsapp": "5596981247830",
  "customer_address": "Endereço completo",
  "notes": "Observações do pedido",
  "items": [
    {
      "product_id": "prod-id",
      "product_name": "Nome do Produto",
      "product_image": "https://...",
      "variation_id": "var-id",
      "variation_color": "Azul",
      "quantity": 2,
      "unit_price": 99.90,
      "subtotal": 199.80
    }
  ]
}
```

**PUT** - Atualizar pedido (Admin)

**Parâmetros de Query:**
- `id`: ID do pedido

**Body:**
```json
{
  "status": "confirmed",
  "notes": "Novas observações"
}
```

**DELETE** - Deletar pedido (Admin)

**Parâmetros de Query:**
- `id`: ID do pedido

---

#### 5. **Configurações** - `/api/settings`

**GET** - Obter configurações do site

**PUT** - Atualizar configurações (Admin)

**Body:**
```json
{
  "company_name": "Rocha Brindes",
  "description": "Descrição da empresa",
  "address": "Endereço completo",
  "phone": "(96) 98124-7830",
  "email": "contato@rochabrindes.com",
  "whatsapp_number": "5596981247830",
  "instagram_url": "https://instagram.com/rochabrindes",
  "facebook_url": "https://facebook.com/rochabrindes",
  "linkedin_url": null,
  "youtube_url": null,
  "business_hours": "Segunda a Sexta: 8h às 18h",
  "cnpj": "00.000.000/0000-00",
  "copyright": "© 2024 Rocha Brindes",
  "logo_url": "https://...",
  "favicon_url": "https://...",
  "primary_color": "#0066cc",
  "secondary_color": "#ff6600",
  "meta_title": "Título SEO",
  "meta_description": "Descrição SEO"
}
```

---

#### 6. **Banners** - `/api/banners`

**GET** - Listar banners

**Parâmetros de Query:**
- `active`: Retornar apenas banners ativos (true/false, padrão: true)

**POST** - Criar banner (Admin)

**Body:**
```json
{
  "title": "Título do Banner",
  "subtitle": "Subtítulo",
  "image_url": "https://...",
  "link_url": "/loja",
  "cta_text": "Ver Produtos",
  "order_index": 0,
  "active": true
}
```

**PUT** - Atualizar banner (Admin)

**Parâmetros de Query:**
- `id`: ID do banner

**DELETE** - Deletar banner (Admin)

**Parâmetros de Query:**
- `id`: ID do banner

---

## Como usar as APIs

### Em páginas Astro (Server-Side)

```astro
---
const catalogUrl = new URL('/api/catalog?limit=8', Astro.url.origin);
const response = await fetch(catalogUrl.toString());
const data = await response.json();
---
```

### Em componentes Solid.js (Client-Side)

```tsx
import { createQuery } from '@tanstack/solid-query';

const query = createQuery(() => ({
  queryKey: ['products'],
  queryFn: async () => {
    const res = await fetch('/api/products?limit=12');
    return res.json();
  }
}));
```

---

## Comandos Úteis

### Banco de Dados

```bash
# Inicializar o banco (criar tabelas)
npm run db:init

# Popular o banco com dados iniciais
npm run db:seed

# Resetar o banco (init + seed)
npm run db:reset
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Deploy para Cloudflare Pages
npm run pages:deploy
```

---

## Estrutura de Pastas

```
functions/
└── api/
    ├── catalog.ts     # API de catálogo
    ├── products.ts    # API de produtos
    ├── categories.ts  # API de categorias
    ├── orders.ts      # API de pedidos
    ├── settings.ts    # API de configurações
    └── banners.ts     # API de banners

src/
└── lib/
    └── db.ts          # Funções auxiliares do banco de dados
```

---

## CORS

Todas as APIs estão configuradas com CORS aberto (`Access-Control-Allow-Origin: *`) para permitir requisições de qualquer origem durante o desenvolvimento. Para produção, considere restringir isso.

---

## Autenticação (TODO)

As rotas marcadas como "(Admin)" devem ser protegidas com autenticação em produção. Atualmente, estão abertas para facilitar o desenvolvimento.

Implementações futuras podem incluir:
- JWT tokens
- Session-based auth com Cloudflare KV
- OAuth integrations
