// FILE: src/features/catalog/components/ProductModal.tsx
import { useState, useMemo, memo } from 'react'
import { X, ShoppingCart, Plus, Minus, Package, Tag, ChevronDown, ChevronUp, Palette } from 'lucide-react'
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

// Função para gerar cor baseada no nome - EXPANDIDA
const getColorFromName = (name: string): string => {
  const colors: Record<string, string> = {
    // Cores básicas
    'branco': '#FFFFFF',
    'preto': '#000000',
    'vermelho': '#DC2626',
    'azul': '#2563EB',
    'verde': '#16A34A',
    'amarelo': '#EAB308',
    'laranja': '#EA580C',
    'rosa': '#EC4899',
    'roxo': '#9333EA',
    'marrom': '#92400E',
    'cinza': '#6B7280',
    'bege': '#D4C4A8',
    'dourado': '#F59E0B',
    'prata': '#C0C0C0',
    
    // Azuis
    'azul marinho': '#1E3A8A',
    'azul claro': '#60A5FA',
    'azul royal': '#1E40AF',
    'azul turquesa': '#06B6D4',
    'azul bebê': '#BFDBFE',
    'azul petróleo': '#155E75',
    'azul céu': '#7DD3FC',
    
    // Verdes
    'verde escuro': '#14532D',
    'verde claro': '#86EFAC',
    'verde limão': '#84CC16',
    'verde musgo': '#65A30D',
    'verde água': '#5EEAD4',
    'verde bandeira': '#15803D',
    'verde militar': '#4D7C0F',
    
    // Vermelhos
    'vermelho escuro': '#7F1D1D',
    'vermelho vinho': '#881337',
    'vermelho cereja': '#BE123C',
    'bordô': '#991B1B',
    'vinho': '#881337',
    'marsala': '#9F1239',
    
    // Rosas
    'rosa claro': '#FBCFE8',
    'rosa pink': '#DB2777',
    'rosa bebê': '#FECDD3',
    'rosa shocking': '#E11D48',
    'rosa antigo': '#F472B6',
    
    // Roxos
    'roxo escuro': '#581C87',
    'roxo claro': '#C084FC',
    'lilás': '#D8B4FE',
    'violeta': '#7C3AED',
    'magenta': '#C026D3',
    'lavanda': '#E9D5FF',
    
    // Laranjas
    'laranja claro': '#FB923C',
    'laranja escuro': '#C2410C',
    'coral': '#FB7185',
    'terracota': '#DC2626',
    'pêssego': '#FED7AA',
    
    // Amarelos
    'amarelo claro': '#FDE047',
    'amarelo ouro': '#CA8A04',
    'amarelo canário': '#FACC15',
    'mostarda': '#A16207',
    
    // Marrons
    'marrom claro': '#D97706',
    'marrom escuro': '#78350F',
    'chocolate': '#92400E',
    'café': '#57534E',
    'caramelo': '#B45309',
    'mogno': '#7C2D12',
    'madeira': '#A16207',
    
    // Cinzas
    'cinza escuro': '#374151',
    'cinza claro': '#D1D5DB',
    'cinza chumbo': '#4B5563',
    'grafite': '#1F2937',
    'carvão': '#27272A',
    
    // Neutros e especiais
    'off white': '#FAFAF9',
    'creme': '#FEF3C7',
    'areia': '#E7E5E4',
    'nude': '#FAF5FF',
    'champagne': '#FDE68A',
    'ivory': '#FFFBEB',
    'perola': '#F5F5F4',
    
    // Metálicos e especiais
    'inox': '#A8A29E',
    'bronze': '#B45309',
    'cobre': '#C2410C',
    'cromado': '#D4D4D8',
    'ouro rose': '#F59E0B',
    'grafite metalizado': '#52525B',
    
    // Tons pastéis
    'azul pastel': '#DBEAFE',
    'verde pastel': '#DCFCE7',
    'rosa pastel': '#FCE7F3',
    'amarelo pastel': '#FEF9C3',
    'lilás pastel': '#F3E8FF',
    
    // Cores vibrantes
    'pink neon': '#FF1493',
    'verde neon': '#39FF14',
    'amarelo neon': '#FFFF00',
    'laranja neon': '#FF6600',
    
    // Cores naturais
    'verde oliva': '#84CC16',
    'terra': '#78350F',
    'ocre': '#D97706',
    'tijolo': '#B91C1C',
    'verde floresta': '#166534',
    'azul navy': '#172554',
  }
  
  const lowerName = name.toLowerCase()
  
  if (colors[lowerName]) {
    return colors[lowerName]
  }
  
  for (const [key, value] of Object.entries(colors)) {
    if (lowerName.includes(key)) {
      return value
    }
  }
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 60%, 50%)`
}

export default memo(function ProductModal({ product, onClose }: Props) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [quantityInput, setQuantityInput] = useState('1')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isColorsExpanded, setIsColorsExpanded] = useState(false)

  // Desktop sempre expandido
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
  const shouldShowColors = isDesktop ? true : isColorsExpanded
  const shouldShowDescription = isDesktop ? true : isDescriptionExpanded

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

  const colorOptions = useMemo(() => {
    if (!product.variacoes?.length) return []
    return product.variacoes.map(v => ({
      name: v.cor,
      color: getColorFromName(v.cor)
    }))
  }, [product.variacoes])

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

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName)
    const targetIndex = gallery.findIndex(g => g.variation?.cor === colorName)
    if (targetIndex >= 0) setActiveIndex(targetIndex)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 sm:py-8">
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-6xl max-h-[98vh] sm:max-h-[calc(100vh-4rem)] overflow-hidden shadow-2xl flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-2 z-10 hover:bg-white shadow-lg transition-all"
        >
          <X size={18} />
        </button>

        {/* Layout Responsivo: Mobile vertical, Desktop horizontal */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Lado Esquerdo - Galeria (Desktop) / Topo (Mobile) */}
          <div className="md:w-1/2 flex flex-col bgwhite">
            {/* Imagem Principal */}
            <div className="flex-1 flex items-center justify-center">
              {active && (
                <img
                  src={active.url}
                  alt={`${product.nome} - ${active.label}`}
                  className="w-full h-full object-contain max-h-[300px] md:max-h-full"
                  loading="eager"
                />
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="border-t border-gray-200 bg-white px-3 py-2 flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {gallery.map((item, idx) => (
                  <button
                    key={`${item.label}-${idx}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
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
          </div>

          {/* Lado Direito - Informações (Desktop) / Meio (Mobile) */}
          <div className="md:w-1/2 flex flex-col">
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-4">
              {/* Header do Produto */}
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                    <Package className="text-primary" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-title font-bold text-lg md:text-2xl text-gray-900 leading-tight break-words">
                      {product.nome}
                    </h2>
                    
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <Tag size={14} className="flex-shrink-0" />
                      <span className="font-mono font-semibold break-all">SKU: {product.id}</span>
                    </div>
                  </div>
                </div>

                {product.categorias && product.categorias.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.categorias.map(cat => (
                      <span key={cat} className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Descrição Expansível (Mobile) / Sempre Visível (Desktop) */}
              {product.descricao && (
                <div>
                  {!isDesktop && (
                    <button
                      type="button"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-2"
                    >
                      <span className="text-sm font-bold text-gray-900">Descrição</span>
                      <ChevronDown size={16} className={`text-gray-600 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                  
                  {isDesktop && (
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Descrição</h3>
                  )}
                  
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    shouldShowDescription 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto max-h-60">
                      <p className="text-sm text-gray-700 whitespace-pre-line break-words leading-relaxed">
                        {product.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Seleção de Cores */}
              {colorOptions.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                    className={`w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-2 ${isDesktop ? 'md:pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Palette size={18} className="text-primary" />
                      <span className="text-sm font-bold text-gray-900">
                        Cores disponíveis ({colorOptions.length})
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </div>
                    {!isDesktop && (
                      <ChevronDown size={18} className={`text-gray-600 transition-transform ${isColorsExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Cores Selecionadas Preview (apenas mobile quando fechado) */}
                  {selectedColor && !isColorsExpanded && !isDesktop && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg mb-2">
                      <div 
                        className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-2 ring-primary"
                        style={{ backgroundColor: getColorFromName(selectedColor) }}
                      />
                      <span className="text-sm font-semibold text-primary">
                        {selectedColor}
                      </span>
                    </div>
                  )}

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    shouldShowColors 
                      ? 'max-h-[500px] opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 p-3 bg-gray-50 rounded-lg max-h-[400px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {colorOptions.map((color) => {
                        const isActive = selectedColor === color.name
                        const colorValue = color.color
                        const isBright = colorValue === '#FFFFFF' || colorValue.toLowerCase().includes('fff')
                        
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => handleColorSelect(color.name)}
                            className="flex flex-col items-center gap-1.5 group"
                            title={color.name}
                          >
                            <div className={`relative w-14 h-14 rounded-full transition-all ${
                              isActive
                                ? 'ring-4 ring-primary ring-offset-2 scale-110 shadow-lg'
                                : 'ring-2 ring-gray-300 hover:ring-primary/50 hover:scale-105'
                            }`}>
                              <div 
                                className={`w-full h-full rounded-full ${isBright ? 'border border-gray-200' : ''}`}
                                style={{ backgroundColor: colorValue }}
                              />
                              {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-white rounded-full p-1 shadow-md">
                                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className={`text-[10px] font-medium text-center leading-tight line-clamp-2 max-w-[60px] ${
                              isActive ? 'text-primary font-bold' : 'text-gray-600'
                            }`}>
                              {color.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {!selectedColor && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Selecione uma cor antes de adicionar
                    </p>
                  )}
                </div>
              )}

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all active:scale-95 touch-manipulation"
                  >
                    <Minus size={16} className="text-gray-700" />
                  </button>
                  
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantityInput}
                    onChange={handleQuantityInputChange}
                    onBlur={handleQuantityInputBlur}
                    className="w-20 text-center px-3 py-2.5 bg-gray-50 text-gray-900 text-base font-bold rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none touch-manipulation"
                  />
                  
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all active:scale-95 touch-manipulation"
                  >
                    <Plus size={16} className="text-gray-700" />
                  </button>

                  <span className="text-sm text-gray-500 font-medium ml-1">
                    {quantity === 1 ? 'unidade' : 'unidades'}
                  </span>
                </div>
              </div>

              {/* Espaçamento extra para o footer não cobrir conteúdo no mobile */}
              <div className="h-20 md:hidden"></div>
            </div>

            {/* Footer - Fixo na parte inferior */}
            <div className="border-t border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="flex items-stretch gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98] touch-manipulation"
                >
                  Continuar Comprando
                </button>
                <button
                  onClick={handleAdd}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2 font-semibold text-sm whitespace-nowrap"
                >
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})