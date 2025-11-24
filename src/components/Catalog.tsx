// src/components/Catalog.tsx - NOVO ARQUIVO
import { useMemo, lazy, Suspense, useState, useEffect } from 'react'
import { useCatalog, setCachedCatalog } from '../core/hooks/useCatalog'
import { useCart } from '../core/store/cart'
import { preloadCriticalImages } from '../core/lib/cloudflare'
import Header from '../shared/components/Header'
import Providers from './Providers'
import type { Product } from '../types/product'
import { ChevronLeft, ChevronRight, MessageCircle, Search } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../core/lib/firebase'

const CategorySidebar = lazy(() => import('../features/catalog/components/CategorySidebar'))
const ProductGrid = lazy(() => import('../features/catalog/components/ProductGrid'))
const ProductModal = lazy(() => import('../features/catalog/components/ProductModal'))
const CartSidebar = lazy(() => import('../features/cart/CartSidebar'))
const Footer = lazy(() => import('../shared/components/Footer'))

function CatalogContent() {
  const { data, isLoading } = useCatalog(1000)
  const { category, search, add, setCategory, setSearch } = useCart()
  const [selected, setSelected] = useState<Product | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState('5589994333316')
  const [page, setPage] = useState(0)
  const [isMobileGrid, setIsMobileGrid] = useState(false)

  useEffect(() => {
    const updateGrid = () => {
      setIsMobileGrid(window.innerWidth < 768)
    }
    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [])

  const pageSize = isMobileGrid ? 15 : 40

  useEffect(() => {
    if (data) {
      setCachedCatalog(data)
      const criticalImages: string[] = []
      if (data.layout.logo) criticalImages.push(data.layout.logo)
      preloadCriticalImages(criticalImages)
    }
  }, [data])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('categoria')
    if (cat) setCategory(cat)
  }, [setCategory])

  useEffect(() => {
    setPage(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category, search])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.products.filter((p: Product) => {
      const matchCat = category === 'Todos' || p.categorias?.includes(category)
      const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [data, category, search])

  const paginatedProducts = useMemo(() => {
    const start = page * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  const handleWhatsApp = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`
    
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = whatsappUrl
    } else {
      window.open(whatsappUrl, '_blank')
    }
  }

  const skeleton = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(pageSize)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
      ))}
    </div>
  )

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-all font-medium text-sm"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span className="text-sm text-gray-600 font-medium">
            Página <span className="font-bold text-primary">{page + 1}</span> de{' '}
            <span className="font-bold">{totalPages}</span>
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-all font-medium text-sm"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  const categoryInfo = data?.categories.find(c => c.nome === category)
  const categoriesList = data?.categories.map(c => c.nome) || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-4 md:pt-8 overflow-x-hidden">
        <div className="container mx-auto px-4 pb-4">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <Suspense fallback={null}>
              <CategorySidebar
                categories={categoriesList}
                selected={category}
                onSelect={setCategory}
                search={search}
                onSearch={setSearch}
              />
            </Suspense>

            <div>
              {isMobileGrid && (
                <div className="md:hidden mb-6 space-y-3">
                  <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-4 py-2 shadow-sm">
                    <Search size={18} className="text-gray-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar produtos ou SKUs"
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {['Todos', ...categoriesList].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-xs ${
                          category === cat
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {categoryInfo && (categoryInfo.descricao || categoryInfo.videoUrl) && (
                <div className="mb-8 bg-white rounded-2xl shadow-card overflow-hidden">
                  {categoryInfo.videoUrl && (
                    <div className="relative w-full aspect-video bg-gray-900">
                      <video
                        src={categoryInfo.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>
                  )}
                  {categoryInfo.descricao && (
                    <div className="p-6">
                      <h3 className="text-xl font-title font-bold text-dark mb-3">{category}</h3>
                      <p className="text-gray-700 leading-relaxed">{categoryInfo.descricao}</p>
                    </div>
                  )}
                </div>
              )}

              {isLoading ? skeleton : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500">Nenhum produto encontrado</p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Mostrando <span className="font-semibold">{page * pageSize + 1}</span> -{' '}
                      <span className="font-semibold">{Math.min((page + 1) * pageSize, filtered.length)}</span> de{' '}
                      <span className="font-semibold">{filtered.length}</span> {filtered.length === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>

                  <Suspense fallback={skeleton}>
                    <ProductGrid products={paginatedProducts} onView={setSelected} onAdd={add} />
                  </Suspense>
                  
                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <button
        onClick={handleWhatsApp}
        className="fixed bottom-20 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40"
        aria-label="Contato WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      <Suspense fallback={null}>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
        <CartSidebar />
        <Footer />
      </Suspense>

      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-8 px-4 mt-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-title font-bold text-dark">Precisa de ajuda rápida?</h3>
            <p className="text-sm text-gray-600">Use os filtros e a busca para achar produtos ou fale conosco pelo WhatsApp.</p>
          </div>
          <button
            onClick={handleWhatsApp}
            className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md font-semibold text-sm transition-all"
          >
            Abrir WhatsApp
          </button>
        </div>
      </div>
    </>
  )
}

export default function Catalog() {
  return (
    <Providers>
      <CatalogContent />
    </Providers>
  )
}
