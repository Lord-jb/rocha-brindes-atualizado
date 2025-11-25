// FILE: src/features/catalog/components/ProductGrid.tsx
import { memo } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '../../../types/product'

interface Props {
  products: Product[]
  onSelect: (product: Product) => void
}

export default memo(function ProductGrid({ products, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelect(product)}
        />
      ))}
    </div>
  )
})