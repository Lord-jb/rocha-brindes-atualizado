import { For, Show } from 'solid-js';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-solid';
import { cart, updateQuantity, removeFromCart, cartIsEmpty } from '@/stores/cart';
import { formatPrice } from '@/lib/utils';

export default function CartItems() {
  const handleUpdateQuantity = (productId: string, variationId: string | null, newQuantity: number) => {
    if (newQuantity < 1) {
      if (confirm('Deseja remover este item do carrinho?')) {
        removeFromCart(productId, variationId);
      }
    } else {
      updateQuantity(productId, newQuantity, variationId);
    }
  };

  const handleRemoveItem = (productId: string, variationId: string | null) => {
    if (confirm('Deseja remover este item do carrinho?')) {
      removeFromCart(productId, variationId);
    }
  };

  return (
    <div class="cart-items-wrapper">
      <Show
        when={!cartIsEmpty()}
        fallback={
          <div class="bg-white rounded-xl shadow-card p-12 text-center">
            <ShoppingBag size={64} class="mx-auto text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h3>
            <p class="text-gray-600 mb-6">
              Adicione produtos ao seu carrinho para continuar
            </p>
            <a href="/loja" class="btn-primary inline-flex">
              Ir para a Loja
            </a>
          </div>
        }
      >
        <div class="space-y-4">
          <For each={cart.items}>
            {(item) => (
              <div class="bg-white rounded-xl shadow-card p-4 md:p-6">
                <div class="flex gap-4">
                  {/* Product Image */}
                  <a
                    href={`/produto/${item.product_id}`}
                    class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.product_image || 'https://placehold.co/200x200/f3f4f6/9ca3af?text=Sem+Imagem'}
                      alt={item.product_name}
                      class="w-full h-full object-cover"
                    />
                  </a>

                  {/* Product Details */}
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-4 mb-2">
                      <div class="flex-1 min-w-0">
                        <a
                          href={`/produto/${item.product_id}`}
                          class="font-semibold text-gray-900 hover:text-primary-500 transition-colors line-clamp-2"
                        >
                          {item.product_name}
                        </a>
                        <Show when={item.variation_color}>
                          <p class="text-sm text-gray-600 mt-1">
                            Cor: <span class="font-medium">{item.variation_color}</span>
                          </p>
                        </Show>
                      </div>

                      {/* Remove Button (Desktop) */}
                      <button
                        onClick={() => handleRemoveItem(item.product_id, item.variation_id)}
                        class="hidden md:flex p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div class="flex items-center justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div class="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id, item.variation_id, item.quantity - 1)}
                          class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onInput={(e) => {
                            const newQty = parseInt(e.currentTarget.value) || 1;
                            handleUpdateQuantity(item.product_id, item.variation_id, newQty);
                          }}
                          class="w-16 text-center border border-gray-300 rounded-lg py-1 font-semibold text-sm"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id, item.variation_id, item.quantity + 1)}
                          class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div class="text-right">
                        <div class="text-sm text-gray-600">
                          {formatPrice(item.unit_price)} × {item.quantity}
                        </div>
                        <div class="font-bold text-gray-900">
                          {formatPrice(item.unit_price * item.quantity)}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button (Mobile) */}
                    <button
                      onClick={() => handleRemoveItem(item.product_id, item.variation_id)}
                      class="md:hidden mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
