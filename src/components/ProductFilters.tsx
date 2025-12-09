import { createSignal, For, Show } from 'solid-js';
import { Search, Filter, X, ChevronDown } from 'lucide-solid';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  searchQuery?: string;
  mobile?: boolean;
}

export default function ProductFilters(props: Props) {
  const [searchInput, setSearchInput] = createSignal(props.searchQuery || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = createSignal(false);

  const sortOptions = [
    { value: 'featured', label: 'Em Destaque' },
    { value: 'name-asc', label: 'Nome (A-Z)' },
    { value: 'name-desc', label: 'Nome (Z-A)' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'newest', label: 'Mais Recentes' },
  ];

  const handleSearch = (e: Event) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    if (searchInput()) {
      params.set('search', searchInput());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to first page

    window.location.href = `/loja?${params.toString()}`;
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(window.location.search);

    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to first page

    window.location.href = `/loja?${params.toString()}`;
    if (props.mobile) setMobileFiltersOpen(false);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', value);
    params.delete('page'); // Reset to first page
    window.location.href = `/loja?${params.toString()}`;
  };

  const clearFilters = () => {
    window.location.href = '/loja';
  };

  const hasActiveFilters = () => {
    return props.currentCategory || props.searchQuery;
  };

  // Mobile version
  if (props.mobile) {
    return (
      <div>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen())}
          class="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Filter size={20} />
          Filtros
          {hasActiveFilters() && (
            <span class="bg-white text-primary-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              !
            </span>
          )}
        </button>

        <Show when={mobileFiltersOpen()}>
          <div class="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-display font-bold text-gray-900">Filtros</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div class="mb-6">
              <form onSubmit={handleSearch}>
                <div class="relative">
                  <input
                    type="text"
                    value={searchInput()}
                    onInput={(e) => setSearchInput(e.currentTarget.value)}
                    placeholder="Buscar produtos..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </form>
            </div>

            {/* Sort */}
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={props.currentSort || 'featured'}
                onChange={(e) => handleSortChange(e.currentTarget.value)}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <For each={sortOptions}>
                  {(option) => (
                    <option value={option.value}>{option.label}</option>
                  )}
                </For>
              </select>
            </div>

            {/* Categories */}
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Categorias</h4>
              <div class="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !props.currentCategory
                      ? 'bg-primary-500 text-white font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Todas as Categorias
                </button>
                <For each={props.categories}>
                  {(category) => (
                    <button
                      onClick={() => handleCategoryChange(category.slug)}
                      class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        props.currentCategory === category.slug
                          ? 'bg-primary-500 text-white font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Clear Filters */}
            <Show when={hasActiveFilters()}>
              <button
                onClick={clearFilters}
                class="w-full btn border border-gray-300 hover:bg-gray-50"
              >
                Limpar Filtros
              </button>
            </Show>
          </div>
        </Show>
      </div>
    );
  }

  // Desktop version
  return (
    <div class="bg-white rounded-xl shadow-card p-6 sticky top-24">
      {/* Search */}
      <div class="mb-6">
        <form onSubmit={handleSearch}>
          <div class="relative">
            <input
              type="text"
              value={searchInput()}
              onInput={(e) => setSearchInput(e.currentTarget.value)}
              placeholder="Buscar produtos..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button type="submit" class="sr-only">Buscar</button>
        </form>
      </div>

      {/* Sort */}
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ordenar por
        </label>
        <select
          value={props.currentSort || 'featured'}
          onChange={(e) => handleSortChange(e.currentTarget.value)}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <For each={sortOptions}>
            {(option) => (
              <option value={option.value}>{option.label}</option>
            )}
          </For>
        </select>
      </div>

      {/* Categories */}
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Categorias</h4>
        <div class="space-y-1">
          <button
            onClick={() => handleCategoryChange('')}
            class={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !props.currentCategory
                ? 'bg-primary-500 text-white font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            Todas as Categorias
          </button>
          <For each={props.categories}>
            {(category) => (
              <button
                onClick={() => handleCategoryChange(category.slug)}
                class={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  props.currentCategory === category.slug
                    ? 'bg-primary-500 text-white font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Clear Filters */}
      <Show when={hasActiveFilters()}>
        <button
          onClick={clearFilters}
          class="w-full btn border border-gray-300 hover:bg-gray-50 text-sm"
        >
          Limpar Filtros
        </button>
      </Show>
    </div>
  );
}
