// FILE: src/core/store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../../types/product'

interface CartItem extends Product {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  count: number
  category: string
  search: string
  add: (p: Product) => void
  remove: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  toggle: () => void
  setCategory: (c: string) => void
  setSearch: (s: string) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      count: 0,
      category: 'Todos',
      search: '',
      
      add: (p) => {
        const items = get().items
        const existing = items.find(i => i.id === p.id && i.cor === p.cor)
        
        const newItems = existing
          ? items.map(i => (i.id === p.id && i.cor === p.cor) ? { ...i, quantity: i.quantity + 1 } : i)
          : [...items, { ...p, quantity: 1 }]
        
        set({ items: newItems, count: newItems.reduce((sum, i) => sum + i.quantity, 0) })
      },
      
      remove: (id) => {
        const newItems = get().items.filter(i => !(i.id === id || `${i.id}-${i.cor}` === id))
        set({ items: newItems, count: newItems.reduce((sum, i) => sum + i.quantity, 0) })
      },

      updateQuantity: (id, quantity) => {
        const newItems = get().items.map(i => {
          const itemKey = i.cor ? `${i.id}-${i.cor}` : i.id
          return itemKey === id || i.id === id ? { ...i, quantity } : i
        })
        set({ items: newItems, count: newItems.reduce((sum, i) => sum + i.quantity, 0) })
      },
      
      clear: () => set({ items: [], count: 0 }),
      toggle: () => {
        console.log('Toggle chamado, isOpen atual:', get().isOpen)
        set({ isOpen: !get().isOpen })
      },
      setCategory: (c) => set({ category: c }),
      setSearch: (s) => set({ search: s })
    }),
    { name: 'cart-storage' }
  )
)