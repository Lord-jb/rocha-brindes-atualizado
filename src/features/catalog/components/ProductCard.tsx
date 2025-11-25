// FILE: src/features/catalog/components/ProductCard.tsx
import { memo } from 'react'
import { Eye, Package, Tag } from 'lucide-react'
import { optimizeUrl } from '../../../core/lib/cloudflare'
import type { Product } from '../../../types/product'

interface Props {
  product: Product
  onClick: () => void
}

export default memo(function ProductCard({ product, onClick }: Props) {
  const imageUrl = product.imagem_url ? optimizeUrl(product.imagem_url, 'thumbnail') : ''
  const hasVariations = product.variacoes && product.variacoes.length > 0

  return (
    <article 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-primary/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nome}
            className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-300" />
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
          {/* Category Badge */}
          {product.categorias && product.categorias.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
              {product.categorias[0]}
            </span>
          )}
          
          {/* Variations Badge */}
          {hasVariations && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/95 backdrop-blur-sm rounded-full text-[10px] font-bold text-white shadow-sm">
              <div className="flex -space-x-1">
                <span className="w-3 h-3 rounded-full bg-white border border-primary" />
                <span className="w-3 h-3 rounded-full bg-white border border-primary" />
              </div>
              {product.variacoes?.length || 0}
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye size={16} />
            Ver Detalhes
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* SKU */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Tag size={11} className="flex-shrink-0" />
          <span className="font-mono font-semibold truncate">SKU: {product.id}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.nome}
        </h3>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            className="w-full py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Eye size={14} />
            Ver Produto
          </button>
        </div>
      </div>
    </article>
  )
})