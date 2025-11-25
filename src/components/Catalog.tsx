// FILE: src/components/Catalog.tsx
import { Suspense, lazy, useState, useMemo, useEffect } from 'react'
import { useCatalog } from '../core/hooks/useCatalog'
import { useCart } from '../core/store/cart'
import { MessageSquare, TrendingUp, Package, Hash, Filter, X, ChevronDown, Search } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../core/lib/firebase'
import type { Product } from '../types/product'
import Providers from './Providers'
import Header from '../shared/components/Header'

const ProductGrid = lazy(() => import('../features/catalog/components/ProductGrid'))
const ProductModal = lazy(() => import('../features/catalog/components/ProductModal'))
const CategorySidebar = lazy(() => import('../features/catalog/components/CategorySidebar'))

type SortOption = 'trending' | 'name-asc' | 'name-desc' | 'sku-asc' | 'sku-desc' | 'newest'

const SORT_OPTIONS = [
  { value: 'trending' as const, label: 'Mais Populares', icon: TrendingUp },
  { value: 'name-asc' as const, label: 'Nome (A-Z)', icon: Package },
  { value: 'name-desc' as const, label: 'Nome (Z-A)', icon: Package },
  { value: 'sku-asc' as const, label: 'Código (0-9)', icon: Hash },
  { value: 'sku-desc' as const, label: 'Código (9-0)', icon: Hash },
  { value: 'newest' as const, label: 'Mais Recentes', icon: Package },
]

interface CatalogProps {
  showBackButton?: boolean
}

function CatalogContent({ showBackButton = true }: CatalogProps) {
  const { data, isLoading } = useCatalog(1000)
  const { toggle } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('trending')
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const itemsPerPage = isMobile ? 20 : 40

  useEffect(() => {
    const loadWhatsAppNumber = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'general'))
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber)
        }
      } catch (error) {
        console.error('Erro ao carregar Contato:', error)
      }
    }
    void loadWhatsAppNumber()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    if (!data?.products) return []

    let filtered = data.products

    // Filtro por categoria
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((p: Product) => 
        p.categorias?.some((cat: string) => 
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim()
      filtered = filtered.filter((p: Product) => 
        p.nome.toLowerCase().includes(search) ||
        p.id.toLowerCase().includes(search) ||
        p.categorias?.some((cat: string) => cat.toLowerCase().includes(search))
      )
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          // Produtos com mais variações = mais populares
          const aPopularity = (a.variacoes?.length || 0) + (a.categorias?.length || 0)
          const bPopularity = (b.variacoes?.length || 0) + (b.categorias?.length || 0)
          return bPopularity - aPopularity
        
        case 'name-asc':
          return a.nome.localeCompare(b.nome, 'pt-BR')
        
        case 'name-desc':
          return b.nome.localeCompare(a.nome, 'pt-BR')
        
        case 'sku-asc':
          return a.id.localeCompare(b.id, 'pt-BR', { numeric: true })
        
        case 'sku-desc':
          return b.id.localeCompare(a.id, 'pt-BR', { numeric: true })
        
        case 'newest':
          // Assume que IDs mais altos = mais recentes
          return b.id.localeCompare(a.id, 'pt-BR', { numeric: true })
        
        default:
          return 0
      }
    })

    return sorted
  }, [data?.products, selectedCategory, searchTerm, sortBy])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleWhatsApp = () => {
    if (!whatsappNumber) return
    const message = encodeURIComponent('Olá! Gostaria de tirar algumas dúvidas sobre os produtos.')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
    setIsSortMenuOpen(false)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const selectedSortOption = SORT_OPTIONS.find(opt => opt.value === sortBy)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600 font-medium">Carregando catálogo...</p>
        </div>
      </div>
    )
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header showBackButton={showBackButton} />
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
                <CategorySidebar
                  categories={data?.categories || []}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategoryChange}
                  productsCount={data?.products.length || 0}
                />
              </Suspense>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="min-w-0 space-y-4 sm:space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Sort and Filter Bar */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Category Filter */}
                <div className="lg:hidden flex-1">
                  <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                    <CategorySidebar
                      categories={data?.categories || []}
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleCategoryChange}
                      productsCount={data?.products.length || 0}
                    />
                  </Suspense>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all whitespace-nowrap"
                  >
                    {selectedSortOption && (
                      <selectedSortOption.icon size={16} className="text-primary flex-shrink-0" />
                    )}
                    <span className="hidden sm:inline">{selectedSortOption?.label}</span>
                    <span className="sm:hidden">Ordenar</span>
                    <ChevronDown size={16} className={`transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Sort Menu */}
                  {isSortMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsSortMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                              sortBy === option.value
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <option.icon size={16} className="flex-shrink-0" />
                            <span>{option.label}</span>
                            {sortBy === option.value && (
                              <span className="ml-auto text-primary">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== 'Todos' || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                  <span className="text-xs font-semibold text-gray-500">Filtros ativos:</span>
                  {selectedCategory !== 'Todos' && (
                    <button
                      onClick={() => handleCategoryChange('Todos')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <Filter size={12} />
                      {selectedCategory}
                      <X size={12} />
                    </button>
                  )}
                  {searchTerm && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <Search size={12} />
                      "{searchTerm}"
                      <X size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleCategoryChange('Todos')
                      handleSearchChange('')
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium underline ml-auto"
                  >
                    Limpar tudo
                  </button>
                </div>
              )}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> de{' '}
                <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> produtos
              </span>
              <span className="text-xs text-gray-500">
                Página {currentPage} de {totalPages || 1}
              </span>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full">
                    <Package size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Nenhum produto encontrado</h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou termos de busca para encontrar o que procura.
                  </p>
                  <button
                    onClick={() => {
                      handleCategoryChange('Todos')
                      handleSearchChange('')
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all"
                  >
                    <X size={18} />
                    Limpar Filtros
                  </button>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
                    ))}
                  </div>
                }
              >
                <ProductGrid
                  products={paginatedProducts}
                  onSelect={setSelectedProduct}
                />
              </Suspense>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Próxima
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </Suspense>
      )}

      {/* WhatsApp FAB */}
      {whatsappNumber && (
        <button
          onClick={handleWhatsApp}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-30 group"
          aria-label="Falar no WhatsApp"
        >
          <MessageSquare size={24} className="sm:w-7 sm:h-7" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Precisa de ajuda?
          </span>
        </button>
      )}
    </div>
  )
}

export default function Catalog({ showBackButton = true }: CatalogProps) {
  return (
    <Providers>
      <CatalogContent showBackButton={showBackButton} />
    </Providers>
  )
}