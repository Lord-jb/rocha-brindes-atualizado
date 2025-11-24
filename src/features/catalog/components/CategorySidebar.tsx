// FILE: src/features/catalog/components/CategorySidebar.tsx
import { memo, useState } from 'react'
import { Search, Grid, X, Filter, ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  search: string
  onSearch: (term: string) => void
}

export default memo(function CategorySidebar({ categories, selected, onSelect, search, onSearch }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Versão Mobile - Barra de busca + expandir */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl">
        <div className="container mx-auto px-3 py-2.5">
          <div className="flex items-center gap-2">
            {/* Input de Busca */}
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary transition-colors">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
              />
              {search && (
                <button
                  onClick={() => onSearch('')}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Botão Expandir Categorias */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 relative"
            >
              <Filter size={16} />
              {isOpen ? (
                <ChevronDown size={18} strokeWidth={2.5} />
              ) : (
                <ChevronUp size={18} strokeWidth={2.5} />
              )}
              
              {/* Badge com categoria selecionada */}
              {selected !== 'Todos' && (
                <span className="absolute -top-1 -right-1 bg-accent text-dark text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  1
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Categorias Mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`
        fixed lg:sticky bottom-0 lg:top-28 left-0 right-0 lg:left-auto lg:right-auto
        h-[75vh] lg:h-fit w-full lg:w-auto z-50 lg:z-auto
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        rounded-t-3xl lg:rounded-none shadow-2xl lg:shadow-none
        bg-white lg:bg-transparent
        overflow-hidden
      `}>
        {/* Header do Modal Mobile */}
        <div className="lg:hidden bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter size={20} />
            <h3 className="font-title font-bold text-base">Categorias</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo das Categorias */}
        <div className="p-4 lg:p-0 overflow-y-auto max-h-[calc(75vh-140px)] lg:max-h-none overscroll-contain">
          {/* Input de Busca - Desktop Only */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card p-4 lg:p-6 mb-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {search && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Lista de Categorias */}
          <div className="bg-white lg:rounded-2xl lg:shadow-card p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Grid className="text-primary" size={20} />
              <h3 className="font-title font-bold text-lg text-dark">Categorias</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelect('Todos')
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selected === 'Todos'
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
                }`}
              >
                Todos os produtos
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelect(cat)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selected === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer do Modal Mobile */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          {(selected !== 'Todos' || search) && (
            <button
              onClick={() => {
                onSelect('Todos')
                onSearch('')
              }}
              className="flex-1 py-2.5 border-2 border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all"
            >
              Limpar Filtros
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm"
          >
            Ver Resultados
          </button>
        </div>
      </aside>
    </>
  )
})