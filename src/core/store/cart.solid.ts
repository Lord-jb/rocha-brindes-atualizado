// FILE: src/core/store/cart.solid.ts
import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';
import type { Product } from '../../types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  category: string;
  search: string;
}

// Criar store persistente
const STORAGE_KEY = 'cart-storage';

function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return {
      items: [],
      isOpen: false,
      count: 0,
      category: 'Todos',
      search: '',
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...data.state,
        isOpen: false, // Sempre começar fechado
      };
    }
  } catch (e) {
    console.warn('Failed to load cart from storage');
  }

  return {
    items: [],
    isOpen: false,
    count: 0,
    category: 'Todos',
    search: '',
  };
}

const [cart, setCart] = createStore<CartState>(loadCartFromStorage());

// Persistir no localStorage quando mudar
if (typeof window !== 'undefined') {
  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      state: {
        items: cart.items,
        count: cart.count,
        category: cart.category,
        search: cart.search,
      }
    }));
  });
}

// Actions
export const cartActions = {
  add: (product: Product) => {
    const existingIndex = cart.items.findIndex(
      i => i.id === product.id && i.cor === product.cor
    );

    if (existingIndex >= 0) {
      setCart('items', existingIndex, 'quantity', q => q + 1);
    } else {
      setCart('items', items => [...items, { ...product, quantity: 1 }]);
    }

    // Atualizar count
    setCart('count', cart.items.reduce((sum, i) => sum + i.quantity, 0));
  },

  remove: (id: string) => {
    setCart('items', items => items.filter(i => !(i.id === id || `${i.id}-${i.cor}` === id)));
    setCart('count', cart.items.reduce((sum, i) => sum + i.quantity, 0));
  },

  updateQuantity: (id: string, quantity: number) => {
    setCart('items', items => items.map(i => {
      const itemKey = i.cor ? `${i.id}-${i.cor}` : i.id;
      return itemKey === id || i.id === id ? { ...i, quantity } : i;
    }));
    setCart('count', cart.items.reduce((sum, i) => sum + i.quantity, 0));
  },

  clear: () => {
    setCart('items', []);
    setCart('count', 0);
  },

  toggle: () => {
    setCart('isOpen', !cart.isOpen);
  },

  setCategory: (category: string) => {
    setCart('category', category);
  },

  setSearch: (search: string) => {
    setCart('search', search);
  },
};

export { cart };
