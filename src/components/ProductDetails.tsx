import { createSignal, For, Show } from 'solid-js';
import { ShoppingCart, Check, Tag, Truck, Shield, MessageCircle } from 'lucide-solid';
import { addToCart } from '@/stores/cart';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function ProductDetails(props: Props) {
  const [selectedVariation, setSelectedVariation] = createSignal<string | null>(null);
  const [quantity, setQuantity] = createSignal(1);
  const [addedToCart, setAddedToCart] = createSignal(false);

  const hasVariations = () => props.product.variations && props.product.variations.length > 0;

  const handleAddToCart = () => {
    const variation = hasVariations()
      ? props.product.variations?.find((v) => v.id === selectedVariation())
      : null;

    addToCart({
      product_id: props.product.id,
      product_name: props.product.name,
      product_image: props.product.main_image_url,
      variation_id: variation?.id || null,
      variation_color: variation?.color || null,
      unit_price: props.product.price,
      quantity: quantity(),
    });

    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no produto: ${props.product.name}\n\nLink: ${window.location.href}`;
    const whatsappNumber = '5596981247830'; // From wrangler.toml
    const whatsappLink = generateWhatsAppLink(whatsappNumber, message);
    window.open(whatsappLink, '_blank');
  };

  const canAddToCart = () => {
    if (hasVariations() && !selectedVariation()) {
      return false;
    }
    return quantity() > 0;
  };

  return (
    <div class="space-y-6">
      {/* Product Title */}
      <div>
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          {props.product.name}
        </h1>
        <Show when={props.product.categories && props.product.categories.length > 0}>
          <div class="flex flex-wrap gap-2">
            <For each={props.product.categories}>
              {(category) => (
                <a
                  href={`/loja?category=${category.slug}`}
                  class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  <Tag size={14} />
                  {category.name}
                </a>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Price */}
      <div class="border-t border-b border-gray-200 py-4">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-gray-900">
            {formatPrice(props.product.price)}
          </span>
          <span class="text-gray-600">por unidade</span>
        </div>
      </div>

      {/* Description */}
      <Show when={props.product.description}>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">
            {props.product.description}
          </p>
        </div>
      </Show>

      {/* Variations (Colors) */}
      <Show when={hasVariations()}>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            Selecione a Cor
            {!selectedVariation() && (
              <span class="text-sm text-red-500 ml-2">(obrigatório)</span>
            )}
          </h3>
          <div class="flex flex-wrap gap-3">
            <For each={props.product.variations}>
              {(variation) => (
                <button
                  onClick={() => setSelectedVariation(variation.id)}
                  class={`px-4 py-2 border-2 rounded-lg transition-all font-medium ${
                    selectedVariation() === variation.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {variation.color}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Quantity */}
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Quantidade</h3>
        <div class="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity() - 1))}
            class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity()}
            onInput={(e) => setQuantity(Math.max(1, parseInt(e.currentTarget.value) || 1))}
            class="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"
          />
          <button
            onClick={() => setQuantity(quantity() + 1)}
            class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div class="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={!canAddToCart()}
          class={`w-full btn-primary text-lg ${
            !canAddToCart() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Show
            when={addedToCart()}
            fallback={
              <>
                <ShoppingCart size={24} />
                Adicionar ao Carrinho
              </>
            }
          >
            <Check size={24} />
            Adicionado!
          </Show>
        </button>

        <button
          onClick={handleWhatsAppContact}
          class="w-full btn border-2 border-green-500 text-green-600 hover:bg-green-50 text-lg"
        >
          <MessageCircle size={24} />
          Falar no WhatsApp
        </button>
      </div>

      {/* Features */}
      <div class="border-t border-gray-200 pt-6 space-y-4">
        <div class="flex items-start gap-3">
          <Truck size={24} class="text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-gray-900">Entrega para todo o Brasil</h4>
            <p class="text-sm text-gray-600">Consulte prazos e valores no checkout</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <Shield size={24} class="text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-gray-900">Produto de qualidade</h4>
            <p class="text-sm text-gray-600">Brindes personalizados com garantia</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <MessageCircle size={24} class="text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-gray-900">Atendimento personalizado</h4>
            <p class="text-sm text-gray-600">Nossa equipe está pronta para ajudar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
