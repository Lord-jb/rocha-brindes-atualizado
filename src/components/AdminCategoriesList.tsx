import { For, Show, createSignal } from 'solid-js';
import { Edit, Trash2, Eye, Tag } from 'lucide-solid';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
}

export default function AdminCategoriesList(props: Props) {
  const [categories, setCategories] = createSignal(props.categories);
  const [deleting, setDeleting] = createSignal<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories().filter((c) => c.id !== id));
        alert('Categoria excluída com sucesso!');
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erro ao excluir categoria. Tente novamente.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Show when={categories().length > 0}>
        <For each={categories()}>
          {(category) => (
            <div class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Tag size={24} class="text-primary-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{category.name}</h3>
                    <p class="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{category.product_count || 0} produtos</span>
                {category.popular && (
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>

              <div class="flex items-center gap-2 pt-4 border-t border-gray-200">
                <a
                  href={`/loja?category=${category.slug}`}
                  target="_blank"
                  class="flex-1 btn border border-gray-300 hover:bg-gray-50 text-sm py-2"
                >
                  <Eye size={16} />
                  Ver
                </a>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={deleting() === category.id}
                  class="px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </For>
      </Show>

      <Show when={categories().length === 0}>
        <div class="col-span-full p-12 text-center bg-white rounded-xl shadow-card">
          <p class="text-gray-600 mb-4">Nenhuma categoria cadastrada</p>
        </div>
      </Show>
    </div>
  );
}
