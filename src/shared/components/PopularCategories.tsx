// FILE: src/shared/components/PopularCategories.tsx
import { memo } from 'react'
import { optimizeUrl } from '../../core/lib/cloudflare'
import type { Category } from '../../types/product'

interface Props {
  categories: Category[]
  onSelect: (name: string) => void
}

export default memo(function PopularCategories({ categories, onSelect }: Props) {
  if (!categories.length) return null

  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-title font-bold text-dark mb-6 sm:mb-8 text-center px-4">
        Categorias Populares
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {categories.map(cat => {
          const imageUrl = cat.imagePath ? optimizeUrl(cat.imagePath, 'thumbnail') : ''
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.nome)}
              className="group"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={cat.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <span className="text-4xl sm:text-5xl md:text-6xl opacity-20">📦</span>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className="bg-primary text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                      Popular
                    </span>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 bg-white">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-dark mb-2 group-hover:text-primary transition-colors text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {cat.nome}
                  </h3>
                  
                  <div className="flex items-center justify-center pt-2 border-t border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">Ver produtos</span>
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-1 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <a
          href="/catalogo"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
        >
          Explorar catálogo
        </a>
      </div>
    </section>
  )
})