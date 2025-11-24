// FILE: src/shared/components/FeaturedProducts.tsx
import { optimizeUrl } from '../../core/lib/cloudflare'
import type { Product } from '../../types/product'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mb-8 sm:mb-12 relative">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-title font-bold text-dark mb-6 sm:mb-8 text-center px-4">
        Produtos em Destaque
      </h2>
      
      <div className="relative group">
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 lg:w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 lg:w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 md:mx-0 md:px-0 md:overflow-hidden scrollbar-hide">
          <div className="flex gap-3 sm:gap-4 md:gap-6 md:animate-scroll-infinite md:hover:pause-animation pb-2">
            {[...products, ...products].map((product, idx) => {
              const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url || product.variacoes?.[0]?.imagem_url
              const imgUrl = imgId ? optimizeUrl(imgId, 'public') : ''

              return (
                <a
                  key={`${product.id}-${idx}`}
                  href="/catalogo"
                  className="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 group/card"
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.nome}
                          className="w-full h-full object-contain p-3 sm:p-4 group-hover/card:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-xs sm:text-sm font-medium">Sem imagem</span>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2">
                        <span className="bg-accent text-dark px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                          ⭐ Destaque
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 md:p-5 bg-white">
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-dark mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover/card:text-primary transition-colors">
                        {product.nome}
                      </h3>
                      
                      {product.categorias && product.categorias.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                          {product.categorias.slice(0, 2).map((cat, catIdx) => (
                            <span 
                              key={catIdx} 
                              className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold rounded-md"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">Ver detalhes</span>
                        <svg 
                          className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover/card:translate-x-1 transition-transform" 
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
        
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-4">
            ← Deslize para ver mais produtos →
          </p>
          <a
            href="/catalogo"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
          >
            Ver catálogo completo
          </a>
        </div>
      </div>
    </section>
  )
}