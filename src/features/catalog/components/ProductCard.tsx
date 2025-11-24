// FILE: src/features/catalog/components/ProductCard.tsx
import { memo } from 'react'
import { ShoppingCart, Eye } from 'lucide-react'
import { optimizeUrl } from '../../../core/lib/cloudflare'
import type { Product } from '../../../types/product'

interface Props {
  product: Product
  onView: () => void
  onAdd: () => void
}

export default memo(function ProductCard({ product, onView, onAdd }: Props) {
  const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url || product.variacoes?.[0]?.imagem_url
  const imgUrl = imgId ? optimizeUrl(imgId, 'thumbnail') : ''
  
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`Produto ${product.nome}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs font-medium">Sem imagem</span>
          </div>
        )}
        
        {product.variacoes && product.variacoes.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-accent text-dark backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold shadow-md">
              {product.variacoes.length} {product.variacoes.length === 1 ? 'cor' : 'cores'}
            </span>
          </div>
        )}

        {product.destaque && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary text-white backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold shadow-md">
              Destaque
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-title font-bold text-sm leading-tight mb-1.5 line-clamp-2 min-h-[2.5rem] text-dark group-hover:text-primary transition-colors">
          {product.nome}
        </h3>
        <p className="text-[10px] text-gray-500 font-medium mb-3">Cód: {product.id}</p>

        <button 
          onClick={onView} 
          className="w-full flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-dark font-semibold py-2 px-3 rounded-lg text-xs transition-all duration-200"
          aria-label={`Ver detalhes de ${product.nome}`}
        >
          <Eye size={14} />
          Detalhes
        </button>
      </div>
    </article>
  )
})