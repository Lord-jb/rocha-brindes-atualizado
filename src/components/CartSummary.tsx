import { Show } from 'solid-js';
import { ShoppingCart } from 'lucide-solid';
import { cart, cartIsEmpty, cartItemsCount, cartTotal } from '@/stores/cart';
import { formatPrice } from '@/lib/utils';

export default function CartSummary() {
  return (
    <div class="cart-summary-wrapper sticky top-24">
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-xl font-display font-bold text-gray-900 mb-4">
          Resumo do Pedido
        </h2>

        <Show when={!cartIsEmpty()}>
          <div class="space-y-3 mb-6">
            {/* Items Count */}
            <div class="flex items-center justify-between text-gray-600">
              <span>Itens ({cartItemsCount()})</span>
              <span>{formatPrice(cartTotal())}</span>
            </div>

            {/* Divider */}
            <div class="border-t border-gray-200"></div>

            {/* Total */}
            <div class="flex items-center justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(cartTotal())}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <a
            href="/checkout"
            class="w-full btn-primary text-center text-lg mb-4"
          >
            <ShoppingCart size={24} />
            Finalizar Pedido
          </a>

          {/* Info */}
          <div class="text-sm text-gray-600 space-y-2">
            <p class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Produtos de alta qualidade</span>
            </p>
            <p class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Entrega para todo o Brasil</span>
            </p>
            <p class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Atendimento personalizado</span>
            </p>
          </div>
        </Show>

        <Show when={cartIsEmpty()}>
          <p class="text-center text-gray-600 py-8">
            Adicione produtos ao carrinho para ver o resumo
          </p>
        </Show>
      </div>
    </div>
  );
}
