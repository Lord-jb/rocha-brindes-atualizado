import { For, Show, createSignal } from 'solid-js';
import { Edit, Trash2, Eye } from 'lucide-solid';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

export default function AdminProductsList(props: Props) {
  const [products, setProducts] = createSignal(props.products);
  const [deleting, setDeleting] = createSignal<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from list
        setProducts(products().filter((p) => p.id !== id));
        alert('Produto excluído com sucesso!');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (response.ok) {
        // Update in list
        setProducts(
          products().map((p) =>
            p.id === id ? { ...p, active: !currentActive } : p
          )
        );
      } else {
        throw new Error('Failed to toggle active');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  return (
    <div class="bg-white rounded-xl shadow-card overflow-hidden">
      <Show
        when={products().length > 0}
        fallback={
          <div class="p-12 text-center">
            <p class="text-gray-600 mb-4">Nenhum produto cadastrado</p>
            <a href="/admin/produtos/novo" class="btn-primary inline-flex">
              Criar Primeiro Produto
            </a>
          </div>
        }
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destaque
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={products()}>
                {(product) => (
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={product.main_image_url || 'https://placehold.co/100x100/f3f4f6/9ca3af?text=Sem+Imagem'}
                          alt={product.name}
                          class="w-12 h-12 object-cover rounded-lg bg-gray-100"
                        />
                        <div class="min-w-0">
                          <div class="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div class="text-sm text-gray-500 truncate">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(product.id, product.active)}
                        class={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.featured
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.featured ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          href={`/produto/${product.slug}`}
                          target="_blank"
                          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Ver no site"
                        >
                          <Eye size={18} />
                        </a>
                        <a
                          href={`/admin/produtos/${product.id}/editar`}
                          class="p-2 text-primary-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </a>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting() === product.id}
                          class="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
