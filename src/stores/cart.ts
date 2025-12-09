// ==========================================
// STORE DO CARRINHO
// Store reativo com SolidJS + localStorage
// ==========================================

import { createStore } from 'solid-js/store';
import { createEffect, onMount } from 'solid-js';
import type { CartItem, Cart } from '@/types';
import { getFromStorage, saveToStorage } from '@/lib/utils';

const CART_STORAGE_KEY = 'rocha-brindes-cart';

// ==========================================
// ESTADO INICIAL
// ==========================================

const initialCart: Cart = {
  items: [],
  total_items: 0,
  total_amount: 0,
};

// ==========================================
// STORE
// ==========================================

export const [cart, setCart] = createStore<Cart>(initialCart);

// ==========================================
// COMPUTED VALUES (GETTERS)
// ==========================================

export const cartIsEmpty = () => cart.items.length === 0;
export const cartItemsCount = () => cart.total_items;
export const cartTotal = () => cart.total_amount;

// ==========================================
// ACTIONS
// ==========================================

/**
 * Adicionar item ao carrinho
 */
export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
  const quantity = item.quantity || 1;

  // Verificar se o item já existe
  const existingIndex = cart.items.findIndex(
    (i) =>
      i.product_id === item.product_id &&
      i.variation_id === item.variation_id
  );

  if (existingIndex !== -1) {
    // Atualizar quantidade
    setCart('items', existingIndex, 'quantity', (q) => q + quantity);
  } else {
    // Adicionar novo item
    setCart('items', (items) => [
      ...items,
      {
        ...item,
        quantity,
      },
    ]);
  }

  recalculateTotals();
  saveCartToStorage();
}

/**
 * Remover item do carrinho
 */
export function removeFromCart(productId: string, variationId: string | null = null) {
  setCart('items', (items) =>
    items.filter(
      (item) =>
        !(item.product_id === productId && item.variation_id === variationId)
    )
  );

  recalculateTotals();
  saveCartToStorage();
}

/**
 * Atualizar quantidade de um item
 */
export function updateQuantity(
  productId: string,
  quantity: number,
  variationId: string | null = null
) {
  if (quantity <= 0) {
    removeFromCart(productId, variationId);
    return;
  }

  const index = cart.items.findIndex(
    (item) =>
      item.product_id === productId && item.variation_id === variationId
  );

  if (index !== -1) {
    setCart('items', index, 'quantity', quantity);
    recalculateTotals();
    saveCartToStorage();
  }
}

/**
 * Incrementar quantidade
 */
export function incrementQuantity(productId: string, variationId: string | null = null) {
  const item = cart.items.find(
    (item) =>
      item.product_id === productId && item.variation_id === variationId
  );

  if (item) {
    updateQuantity(productId, item.quantity + 1, variationId);
  }
}

/**
 * Decrementar quantidade
 */
export function decrementQuantity(productId: string, variationId: string | null = null) {
  const item = cart.items.find(
    (item) =>
      item.product_id === productId && item.variation_id === variationId
  );

  if (item) {
    updateQuantity(productId, item.quantity - 1, variationId);
  }
}

/**
 * Limpar carrinho
 */
export function clearCart() {
  setCart(initialCart);
  saveCartToStorage();
}

/**
 * Obter item do carrinho
 */
export function getCartItem(productId: string, variationId: string | null = null): CartItem | undefined {
  return cart.items.find(
    (item) =>
      item.product_id === productId && item.variation_id === variationId
  );
}

/**
 * Verificar se item está no carrinho
 */
export function isInCart(productId: string, variationId: string | null = null): boolean {
  return cart.items.some(
    (item) =>
      item.product_id === productId && item.variation_id === variationId
  );
}

/**
 * Obter quantidade de um item
 */
export function getItemQuantity(productId: string, variationId: string | null = null): number {
  const item = getCartItem(productId, variationId);
  return item?.quantity || 0;
}

// ==========================================
// HELPERS PRIVADOS
// ==========================================

/**
 * Recalcular totais
 */
function recalculateTotals() {
  const total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total_amount = cart.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  setCart({
    total_items,
    total_amount,
  });
}

/**
 * Salvar no localStorage
 */
function saveCartToStorage() {
  if (typeof window === 'undefined') return;
  saveToStorage(CART_STORAGE_KEY, cart);
}

/**
 * Carregar do localStorage
 */
export function loadCartFromStorage() {
  if (typeof window === 'undefined') return;

  const savedCart = getFromStorage<Cart>(CART_STORAGE_KEY, initialCart);

  if (savedCart && savedCart.items) {
    setCart(savedCart);
    recalculateTotals();
  }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Carregar carrinho do localStorage quando a aplicação inicia
if (typeof window !== 'undefined') {
  loadCartFromStorage();
}
