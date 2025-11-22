// src/shared/components/PopularCategories.tsx
import { memo } from 'react'
import { optimizeUrl } from '../utils/image'
import type { Category } from '../../types/product'

interface Props {
  categories: Category[]
  onSelect: (name: string) => void
}

export default memo(function PopularCategories({ categories, onSelect }: Props) {
  if (!categories.length) return null

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-title font-bold text-dark mb-8 text-center">
        Categorias Populares
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map(cat => {
          const imageUrl = cat.imagePath ? optimizeUrl(cat.imagePath, 'thumbnail') : ''
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.nome)}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                {/* Imagem da Categoria */}
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
                      <span className="text-6xl opacity-20">📦</span>
                    </div>
                  )}
                  
                  {/* Badge de Popular */}
                  <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Popular
                  </div>
                </div>
                
                {/* Nome da Categoria */}
                <div className="p-5 bg-white">
                  <h3 className="font-bold text-lg text-dark mb-2 group-hover:text-primary transition-colors text-center">
                    {cat.nome}
                  </h3>
                  
                  <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Ver produtos</span>
                    <svg 
                      className="w-5 h-5 text-primary ml-2 group-hover:translate-x-1 transition-transform" 
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
    </section>
  )
})