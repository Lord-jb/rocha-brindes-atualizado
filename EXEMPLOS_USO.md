# 📝 Exemplos Práticos de Uso das APIs

## 🎯 Casos de Uso Comuns

### 1. Página Inicial (Home Page)

Carregar produtos em destaque, categorias e configurações de uma vez:

```astro
---
// src/pages/index.astro
import Layout from '@/layouts/Layout.astro';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

// Buscar dados do catálogo
let featured_products = [];
let categories = [];
let settings = {};

try {
  const catalogUrl = new URL('/api/catalog?limit=8', Astro.url.origin);
  const response = await fetch(catalogUrl.toString());

  if (response.ok) {
    const data = await response.json();
    featured_products = data.featured_products || [];
    categories = data.categories || [];
    settings = data.settings || {};
  }
} catch (error) {
  console.error('Error fetching catalog:', error);
}
---

<Layout title={settings.meta_title || 'Rocha Brindes'}>
  <Header client:load />

  <main>
    <!-- Hero Section -->
    <section>
      <h1>{settings.company_name || 'Rocha Brindes'}</h1>
      <p>{settings.description || 'Brindes Personalizados'}</p>
      <a href={`https://wa.me/${settings.whatsapp_number}`}>Falar no WhatsApp</a>
    </section>

    <!-- Produtos em Destaque -->
    <section>
      <h2>Produtos em Destaque</h2>
      <div class="grid">
        {featured_products.map(product => (
          <ProductCard product={product} client:visible />
        ))}
      </div>
    </section>

    <!-- Categorias -->
    <section>
      <h2>Categorias</h2>
      <div class="categories">
        {categories.map(category => (
          <a href={`/loja?category=${category.slug}`}>
            {category.name} ({category.product_count})
          </a>
        ))}
      </div>
    </section>
  </main>

  <Footer client:load />
</Layout>
```

---

### 2. Página da Loja (Com Filtros)

```astro
---
// src/pages/loja.astro
import { getProducts, getCategories } from '@/lib/db';

// Obter parâmetros da URL
const url = new URL(Astro.request.url);
const category = url.searchParams.get('category');
const search = url.searchParams.get('search');
const sort = url.searchParams.get('sort') || 'newest';
const page = parseInt(url.searchParams.get('page') || '1');

// Buscar produtos com filtros
const filters = {
  category,
  search,
  sort,
  page,
  limit: 12
};

const { products, total } = await getProducts(Astro.locals.runtime.env, filters);
const categories = await getCategories(Astro.locals.runtime.env);
const totalPages = Math.ceil(total / 12);
---

<Layout title="Loja - Rocha Brindes">
  <Header client:load />

  <main class="container">
    <h1>Nossos Produtos</h1>

    <!-- Filtros -->
    <aside>
      <h3>Filtrar por Categoria</h3>
      <ul>
        <li><a href="/loja">Todas</a></li>
        {categories.map(cat => (
          <li>
            <a href={`/loja?category=${cat.slug}`} class={category === cat.slug ? 'active' : ''}>
              {cat.name} ({cat.product_count})
            </a>
          </li>
        ))}
      </ul>

      <h3>Ordenar</h3>
      <select onchange="location.href=`/loja?sort=${this.value}`">
        <option value="newest" selected={sort === 'newest'}>Mais Recentes</option>
        <option value="price_asc" selected={sort === 'price_asc'}>Menor Preço</option>
        <option value="price_desc" selected={sort === 'price_desc'}>Maior Preço</option>
        <option value="name_asc" selected={sort === 'name_asc'}>A-Z</option>
      </select>
    </aside>

    <!-- Grid de Produtos -->
    <section>
      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div class="product-grid">
          {products.map(product => (
            <ProductCard product={product} client:visible />
          ))}
        </div>
      )}

      <!-- Paginação -->
      {totalPages > 1 && (
        <div class="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a
              href={`/loja?page=${p}${category ? `&category=${category}` : ''}`}
              class={p === page ? 'active' : ''}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </section>
  </main>

  <Footer client:load />
</Layout>
```

---

### 3. Página de Produto Individual

```astro
---
// src/pages/produto/[slug].astro
import { getProductBySlug } from '@/lib/db';

const { slug } = Astro.params;
const product = await getProductBySlug(Astro.locals.runtime.env, slug);

if (!product) {
  return Astro.redirect('/404');
}
---

<Layout title={`${product.name} - Rocha Brindes`}>
  <Header client:load />

  <main class="container">
    <article class="product-detail">
      <!-- Galeria de Imagens -->
      <div class="gallery">
        <img src={product.main_image_url || '/placeholder.jpg'} alt={product.name} />
        {product.images?.map(img => (
          <img src={img.image_url} alt={img.alt_text || product.name} />
        ))}
      </div>

      <!-- Informações do Produto -->
      <div class="info">
        <h1>{product.name}</h1>

        <!-- Categorias -->
        <div class="categories">
          {product.categories?.map(cat => (
            <a href={`/loja?category=${cat.slug}`}>{cat.name}</a>
          ))}
        </div>

        <!-- Preço -->
        <div class="price">
          R$ {product.price.toFixed(2)}
        </div>

        <!-- Descrição -->
        <div class="description">
          {product.description}
        </div>

        <!-- Variações (Cores/Tamanhos) -->
        {product.variations && product.variations.length > 0 && (
          <div class="variations">
            <h3>Opções Disponíveis:</h3>
            {product.variations.map(variation => (
              <div class="variation">
                {variation.color && <span>Cor: {variation.color}</span>}
                {variation.size && <span>Tamanho: {variation.size}</span>}
                <span>Estoque: {variation.stock}</span>
              </div>
            ))}
          </div>
        )}

        <!-- Botão de Compra -->
        <button onclick="addToCart('{product.id}')">
          Adicionar ao Carrinho
        </button>

        <a
          href={`https://wa.me/5596981247830?text=Olá! Gostaria de fazer um orçamento do produto: ${product.name}`}
          class="whatsapp-button"
        >
          Solicitar Orçamento via WhatsApp
        </a>
      </div>
    </article>
  </main>

  <Footer client:load />
</Layout>
```

---

### 4. Criar Pedido no Checkout

```tsx
// src/components/CheckoutForm.tsx
import { createSignal } from 'solid-js';
import { useCart } from '@/store/cart';

export default function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);

    const orderData = {
      customer_name: formData.get('name'),
      customer_email: formData.get('email'),
      customer_whatsapp: formData.get('whatsapp'),
      customer_address: formData.get('address'),
      notes: formData.get('notes'),
      items: items().map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        variation_id: item.variation_id,
        variation_color: item.variation_color,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        clearCart();

        // Redirecionar para página de confirmação
        setTimeout(() => {
          window.location.href = `/pedido/${data.order.order_number}`;
        }, 2000);
      } else {
        const error = await response.json();
        setError(error.error || 'Erro ao criar pedido');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Finalizar Pedido</h2>

      {error() && <div class="alert error">{error()}</div>}
      {success() && <div class="alert success">Pedido criado com sucesso!</div>}

      <div class="form-group">
        <label>Nome Completo *</label>
        <input type="text" name="name" required />
      </div>

      <div class="form-group">
        <label>E-mail</label>
        <input type="email" name="email" />
      </div>

      <div class="form-group">
        <label>WhatsApp *</label>
        <input type="tel" name="whatsapp" required placeholder="(96) 98124-7830" />
      </div>

      <div class="form-group">
        <label>Endereço Completo</label>
        <textarea name="address" rows={3} />
      </div>

      <div class="form-group">
        <label>Observações</label>
        <textarea name="notes" rows={3} />
      </div>

      <div class="order-summary">
        <h3>Resumo do Pedido</h3>
        <ul>
          {items().map(item => (
            <li>
              {item.product_name} x {item.quantity} = R$ {(item.quantity * item.unit_price).toFixed(2)}
            </li>
          ))}
        </ul>
        <div class="total">
          <strong>Total: R$ {total().toFixed(2)}</strong>
        </div>
      </div>

      <button type="submit" disabled={loading()}>
        {loading() ? 'Processando...' : 'Finalizar Pedido'}
      </button>
    </form>
  );
}
```

---

### 5. Admin - Listar e Atualizar Pedidos

```tsx
// src/components/AdminOrdersList.tsx
import { createQuery, createMutation, useQueryClient } from '@tanstack/solid-query';
import { For, createSignal } from 'solid-js';

export default function AdminOrdersList() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = createSignal('');

  // Query para listar pedidos
  const ordersQuery = createQuery(() => ({
    queryKey: ['orders', selectedStatus()],
    queryFn: async () => {
      const status = selectedStatus() ? `?status=${selectedStatus()}` : '';
      const res = await fetch(`/api/orders${status}`);
      return res.json();
    }
  }));

  // Mutation para atualizar status
  const updateOrderMutation = createMutation(() => ({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  }));

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (confirm(`Deseja alterar o status deste pedido para "${newStatus}"?`)) {
      updateOrderMutation.mutate({ orderId, status: newStatus });
    }
  };

  return (
    <div class="admin-orders">
      <h2>Pedidos</h2>

      {/* Filtro por Status */}
      <select onChange={(e) => setSelectedStatus(e.target.value)}>
        <option value="">Todos os Status</option>
        <option value="pending">Pendente</option>
        <option value="confirmed">Confirmado</option>
        <option value="processing">Em Produção</option>
        <option value="shipped">Enviado</option>
        <option value="delivered">Entregue</option>
        <option value="cancelled">Cancelado</option>
      </select>

      {/* Lista de Pedidos */}
      {ordersQuery.isLoading && <p>Carregando pedidos...</p>}
      {ordersQuery.isError && <p>Erro ao carregar pedidos</p>}

      {ordersQuery.data && (
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>WhatsApp</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <For each={ordersQuery.data.orders}>
              {(order) => (
                <tr>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_whatsapp}</td>
                  <td>{order.items_count}</td>
                  <td>R$ {order.total_amount.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="processing">Em Produção</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td>{new Date(order.created_at * 1000).toLocaleDateString()}</td>
                  <td>
                    <a href={`/admin/pedidos/${order.id}`}>Ver Detalhes</a>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## 🔍 Dicas e Boas Práticas

### 1. Cache de Dados

Use cache para melhorar performance:

```tsx
import { createQuery } from '@tanstack/solid-query';

const query = createQuery(() => ({
  queryKey: ['settings'],
  queryFn: async () => {
    const res = await fetch('/api/settings');
    return res.json();
  },
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
}));
```

### 2. Tratamento de Erros

Sempre trate erros adequadamente:

```tsx
try {
  const res = await fetch('/api/products');
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
} catch (error) {
  console.error('Erro ao buscar produtos:', error);
  return { products: [], total: 0 };
}
```

### 3. Validação de Dados

Valide dados antes de enviar:

```tsx
const validateOrder = (data) => {
  if (!data.customer_name || data.customer_name.trim() === '') {
    throw new Error('Nome é obrigatório');
  }
  if (!data.customer_whatsapp || !/^\d{10,15}$/.test(data.customer_whatsapp)) {
    throw new Error('WhatsApp inválido');
  }
  if (!data.items || data.items.length === 0) {
    throw new Error('Pedido deve ter pelo menos 1 item');
  }
};
```

---

Esses exemplos cobrem os casos de uso mais comuns. Para mais detalhes, consulte `API_README.md`! 🚀
