// FILE: src/features/catalog/components/CategorySidebar.tsx
import { memo, useState, useMemo } from 'react'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import type { Category } from '../../../types/product'

interface Props {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  productsCount: number
}

export default memo(function CategorySidebar({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  productsCount 
}: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories
    const search = searchTerm.toLowerCase()
    return categories.filter(cat => 
      cat.nome.toLowerCase().includes(search)
    )
  }, [categories, searchTerm])

  const handleSelectCategory = (categoryName: string) => {
    onSelectCategory(categoryName)
    if (isMobile) {
      setIsMenuOpen(false)
    }
  }

  const selectedCount = selectedCategory !== 'Todos' ? 1 : 0

  // Mobile: Dropdown Menu
  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all shadow-sm w-full"
        >
          <Filter size={16} className="text-primary flex-shrink-0" />
          <span className="flex-1 text-left">
            {selectedCategory === 'Todos' ? 'Categorias' : selectedCategory}
          </span>
          {selectedCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
              {selectedCount}
            </span>
          )}
          <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden max-h-[400px] flex flex-col">
              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto p-2">
                <button
                  onClick={() => handleSelectCategory('Todos')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    selectedCategory === 'Todos'
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Todas as Categorias</span>
                    {selectedCategory === 'Todos' && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                </button>

                {filteredCategories.map(cat => {
                  const isActive = selectedCategory === cat.nome
                  return (
                    <button
                      key={cat.nome}
                      onClick={() => handleSelectCategory(cat.nome)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.nome}</span>
                        {isActive && (
                          <span className="text-primary">✓</span>
                        )}
                      </div>
                    </button>
                  )
                })}

                {filteredCategories.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    Nenhuma categoria encontrada
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Desktop: Sidebar
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="text-primary" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Categorias</h3>
            <p className="text-xs text-gray-500">{productsCount} produtos</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="p-3 max-h-[calc(100vh-300px)] overflow-y-auto overscroll-contain space-y-1.5">
        <button
          onClick={() => handleSelectCategory('Todos')}
          className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            selectedCategory === 'Todos'
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Todas as Categorias
        </button>

        {filteredCategories.map(cat => {
          const isActive = selectedCategory === cat.nome
          return (
            <button
              key={cat.nome}
              onClick={() => handleSelectCategory(cat.nome)}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.nome}
            </button>
          )
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            Nenhuma categoria encontrada
          </div>
        )}
      </div>

      {/* Clear Button */}
      {selectedCategory !== 'Todos' && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => handleSelectCategory('Todos')}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-all"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  )
})