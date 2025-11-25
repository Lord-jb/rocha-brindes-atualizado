// FILE: src/features/catalog/components/ProductModal.tsx
import { useState, useMemo, memo, useEffect, useRef } from 'react'
import { X, ShoppingCart, Plus, Minus, Package, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { optimizeUrl } from '../../../core/lib/cloudflare'
import { useCart } from '../../../core/store/cart'
import type { Product, ProductVariation } from '../../../types/product'

interface Props {
  product: Product
  onClose: () => void
}

interface GalleryItem {
  label: string
  url: string
  variation?: ProductVariation 
}

export default memo(function ProductModal({ product, onClose }: Props) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [quantityInput, setQuantityInput] = useState('1')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const gallery = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = []

    if (product.imagem_url) {
      items.push({ label: 'Principal', url: optimizeUrl(product.imagem_url, 'public') })
    }

    if (product.variacoes?.length) {
      product.variacoes.forEach(v => {
        if (v.imagem_url) {
          items.push({ label: v.cor, url: optimizeUrl(v.imagem_url, 'public'), variation: v })
        }
      })
    }

    return items
  }, [product])

  const [activeIndex, setActiveIndex] = useState(0)
  const active = gallery[activeIndex] || gallery[0] || { label: 'Principal', url: product.imagem_url ? optimizeUrl(product.imagem_url, 'public') : '' }

  const handleAdd = () => {
    const colorToUse = selectedColor || active?.variation?.cor || product.variacoes?.[0]?.cor
    
    if (product.variacoes?.length && !colorToUse) {
      alert('Selecione uma cor antes de adicionar ao orçamento')
      return
    }
    for (let i = 0; i < quantity; i++) {
      add({ ...product, cor: colorToUse })
    }
    onClose()
  }

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantityInput(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue >= 1) {
      setQuantity(numValue)
    }
  }

  const handleQuantityInputBlur = () => {
    const numValue = parseInt(quantityInput)
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1)
      setQuantityInput('1')
    } else {
      setQuantity(numValue)
      setQuantityInput(numValue.toString())
    }
  }

  const handleIncrement = () => {
    const newValue = quantity + 1
    setQuantity(newValue)
    setQuantityInput(newValue.toString())
  }

  const handleDecrement = () => {
    const newValue = Math.max(1, quantity - 1)
    setQuantity(newValue)
    setQuantityInput(newValue.toString())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 sm:py-8">
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[calc(100vh-4rem)] overflow-hidden shadow-2xl flex flex-col my-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-2 z-10 hover:bg-white shadow-lg transition-all"
        >
          <X size={18} />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {/* Imagem Principal */}
          <div className="bg-white flex items-center justify-center flex-shrink-0">
            {active && (
              <img
                src={active.url}
                alt={`${product.nome} - ${active.label}`}
                className="w-full h-full object-contain p-3 sm:p-4 md:p-6"
                loading="eager"
              />
            )}
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="border-t border-gray-200 bg-white px-2 sm:px-3 py-2 flex gap-1.5 sm:gap-2 overflow-x-auto overscroll-x-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {gallery.map((item, idx) => (
                <button
                  key={`${item.label}-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all ${
                    idx === activeIndex
                      ? 'ring-2 ring-primary scale-105 shadow-md'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={optimizeUrl(item.url, 'thumbnail')} 
                    alt={item.label} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </button>
              ))}
            </div>
          )}

          {/* Conteúdo */}
          <div className="p-3 xs:p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            {/* Header do Produto */}
            <div>
              <div className="flex items-start gap-2 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                  <Package className="text-primary" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-title font-bold text-base xs:text-lg sm:text-xl text-gray-900 leading-tight break-words flex-1">
                      {product.nome}
                    </h2>
                    
                    {product.descricao && (
                      <button
                        type="button"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        aria-label={isDescriptionExpanded ? 'Ocultar descrição' : 'Mostrar descrição'}
                      >
                        {isDescriptionExpanded ? (
                          <ChevronUp size={18} className="text-primary" strokeWidth={2.5} />
                        ) : (
                          <ChevronDown size={18} className="text-gray-600" strokeWidth={2.5} />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <Tag size={12} className="flex-shrink-0" />
                    <span className="font-mono font-semibold break-all">SKU: {product.id}</span>
                  </div>
                </div>
              </div>

              {product.categorias?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.categorias.map(cat => (
                    <span key={cat} className="inline-flex items-center px-2 py-0.5 sm:py-1 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-[10px] sm:text-xs font-semibold text-primary">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Descrição Expansível */}
            {product.descricao && (
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isDescriptionExpanded 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto max-h-80">
                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line break-words leading-relaxed">
                    {product.descricao}
                  </p>
                </div>
              </div>
            )}

            {/* Seleção de Cores */}
            {product.variacoes?.length ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-900">
                    Escolha a cor
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {selectedColor && (
                    <span className="text-[10px] sm:text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                      ✓ {selectedColor}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 max-h-[100px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1">
                  {product.variacoes?.map(v => {
                    const isActive = selectedColor === v.cor
                    return (
                      <button
                        key={v.cor}
                        type="button"
                        onClick={() => {
                          setSelectedColor(v.cor)
                          const targetIndex = gallery.findIndex(g => g.variation?.cor === v.cor)
                          if (targetIndex >= 0) setActiveIndex(targetIndex)
                        }}
                        className={`px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all break-words text-center ${
                          isActive
                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md scale-[1.02]'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {v.cor}
                      </button>
                    )
                  })}
                </div>
                
                {product.variacoes.length > 0 && !selectedColor && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-2 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Selecione uma cor antes de adicionar
                  </p>
                )}
              </div>
            ) : null}

            {/* Quantidade */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all active:scale-95 touch-manipulation"
                >
                  <Minus size={14} className="text-gray-700" />
                </button>
                
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantityInput}
                  onChange={handleQuantityInputChange}
                  onBlur={handleQuantityInputBlur}
                  className="w-14 xs:w-16 text-center px-2 py-2 bg-gray-50 text-gray-900 text-sm sm:text-base font-bold rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none touch-manipulation"
                />
                
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all active:scale-95 touch-manipulation"
                >
                  <Plus size={14} className="text-gray-700" />
                </button>

                <span className="text-xs text-gray-500 font-medium ml-1">
                  {quantity === 1 ? 'un.' : 'uns.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixo e compacto */}
        <div className="border-t border-gray-200 bg-white p-3 sm:p-4 space-y-2 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button
            onClick={handleAdd}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base active:scale-[0.98] touch-manipulation"
          >
            <ShoppingCart size={18} />
            Adicionar ao Orçamento
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg border-2 border-gray-300 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98] touch-manipulation"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  )
})