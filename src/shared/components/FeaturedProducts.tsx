// src/shared/components/FeaturedProducts.tsx
import { optimizeUrl } from '../utils/image'
import type { Product } from '../../types/product'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mb-16 relative">
      <h2 className="text-2xl md:text-3xl font-title font-bold text-dark mb-8 text-center">
        Produtos em Destaque
      </h2>
      
      <div className="relative group">
        {/* Gradientes apenas no desktop */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 md:mx-0 md:px-0 md:overflow-hidden scrollbar-hide">
          <div className="flex gap-4 md:gap-6 md:animate-scroll-infinite md:hover:pause-animation">
            {[...products, ...products].map((product, idx) => {
              const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url || product.variacoes?.[0]?.imagem_url
              const imgUrl = imgId ? optimizeUrl(imgId, 'public') : ''

              return (
                <a
                  key={`${product.id}-${idx}`}
                  href="/catalogo"
                  className="flex-shrink-0 w-72 md:w-80 group/card"
                >
                  <div className="bg-white rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.nome}
                          className="w-full h-full object-contain p-4 group-hover/card:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm font-medium">Sem imagem</span>
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Destaque
                      </div>
                    </div>
                    
                    <div className="p-5 bg-white">
                      <h3 className="font-bold text-lg text-dark mb-2 line-clamp-2 min-h-[56px] group-hover/card:text-primary transition-colors">
                        {product.nome}
                      </h3>
                      
                      {product.categorias && product.categorias.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.categorias.slice(0, 2).map((cat, catIdx) => (
                            <span 
                              key={catIdx} 
                              className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">Ver detalhes</span>
                        <svg 
                          className="w-5 h-5 text-primary group-hover/card:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 font-medium">
            ← Deslize para ver mais produtos →
          </p>
        </div>
      </div>
    </section>
  )
}