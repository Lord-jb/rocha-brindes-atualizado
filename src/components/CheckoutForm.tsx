import { createSignal, For, Show, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { User, Mail, Phone, MapPin, MessageCircle } from 'lucide-solid';
import { cart, cartIsEmpty, cartItemsCount, cartTotal, clearCart } from '@/stores/cart';
import { formatPrice, isValidEmail, isValidWhatsApp, generateWhatsAppLink, generateCheckoutWhatsAppMessage } from '@/lib/utils';
import type { CheckoutFormData } from '@/types';

export default function CheckoutForm() {
  const [formData, setFormData] = createSignal<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  // Redirect if cart is empty
  onMount(() => {
    if (cartIsEmpty()) {
      window.location.href = '/carrinho';
    }
  });

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData({ ...formData(), [field]: value });
    // Clear error for this field
    if (errors()[field]) {
      setErrors({ ...errors(), [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const data = formData();

    if (!data.name || data.name.length < 3) {
      newErrors.name = 'Nome completo é obrigatório';
    }

    if (!data.email || !isValidEmail(data.email)) {
      newErrors.email = 'Email válido é obrigatório';
    }

    if (!data.phone || !isValidWhatsApp(data.phone)) {
      newErrors.phone = 'Telefone válido é obrigatório (com DDD)';
    }

    if (!data.address) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!data.city) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!data.state) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!data.zip) {
      newErrors.zip = 'CEP é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData(),
          items: cart.items,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pedido');
      }

      const order = await response.json() as { order_number: string; id: string };

      // Generate WhatsApp message
      const whatsappNumber = '5596981247830'; // From wrangler.toml
      const trackingUrl = `${window.location.origin}/pedido/${order.order_number}`;
      const items = cart.items.map(item => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price * item.quantity
      }));

      const message = generateCheckoutWhatsAppMessage(
        order.order_number,
        formData().name,
        items,
        cartTotal(),
        trackingUrl
      );
      const whatsappLink = generateWhatsAppLink(whatsappNumber, message);

      // Clear cart
      clearCart();

      // Redirect to WhatsApp
      window.open(whatsappLink, '_blank');

      // Redirect to order tracking
      setTimeout(() => {
        window.location.href = `/pedido/${order.order_number}`;
      }, 1000);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente ou entre em contato conosco via WhatsApp.');
      setIsSubmitting(false);
    }
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Form */}
      <div class="lg:col-span-2">
        <div class="checkout-form-wrapper bg-white rounded-xl shadow-card p-6 md:p-8">
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">
            Informações de Contato
          </h2>

          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Name */}
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="name"
                  value={formData().name}
                  onInput={(e) => updateField('name', e.currentTarget.value)}
                  class={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors().name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="João Silva"
                  required
                />
                <User class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <Show when={errors().name}>
                <p class="text-sm text-red-500 mt-1">{errors().name}</p>
              </Show>
            </div>

            {/* Email and Phone */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData().email}
                    onInput={(e) => updateField('email', e.currentTarget.value)}
                    class={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors().email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="joao@email.com"
                    required
                  />
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <Show when={errors().email}>
                  <p class="text-sm text-red-500 mt-1">{errors().email}</p>
                </Show>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Telefone / WhatsApp *
                </label>
                <div class="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={formData().phone}
                    onInput={(e) => updateField('phone', e.currentTarget.value)}
                    class={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors().phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(11) 98765-4321"
                    required
                  />
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <Show when={errors().phone}>
                  <p class="text-sm text-red-500 mt-1">{errors().phone}</p>
                </Show>
              </div>
            </div>

            {/* Address */}
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo *
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="address"
                  value={formData().address}
                  onInput={(e) => updateField('address', e.currentTarget.value)}
                  class={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors().address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Rua, número, complemento"
                  required
                />
                <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <Show when={errors().address}>
                <p class="text-sm text-red-500 mt-1">{errors().address}</p>
              </Show>
            </div>

            {/* City, State, ZIP */}
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="col-span-2 md:col-span-1">
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData().city}
                  onInput={(e) => updateField('city', e.currentTarget.value)}
                  class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors().city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="São Paulo"
                  required
                />
                <Show when={errors().city}>
                  <p class="text-sm text-red-500 mt-1">{errors().city}</p>
                </Show>
              </div>

              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData().state}
                  onInput={(e) => updateField('state', e.currentTarget.value)}
                  class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors().state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="SP"
                  maxlength="2"
                  required
                />
                <Show when={errors().state}>
                  <p class="text-sm text-red-500 mt-1">{errors().state}</p>
                </Show>
              </div>

              <div>
                <label for="zip" class="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  id="zip"
                  value={formData().zip}
                  onInput={(e) => updateField('zip', e.currentTarget.value)}
                  class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors().zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="00000-000"
                  required
                />
                <Show when={errors().zip}>
                  <p class="text-sm text-red-500 mt-1">{errors().zip}</p>
                </Show>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                id="notes"
                value={formData().notes}
                onInput={(e) => updateField('notes', e.currentTarget.value)}
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Informações adicionais sobre o pedido..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting()}
              class={`w-full btn-primary text-lg ${isSubmitting() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Show when={!isSubmitting()} fallback="Processando...">
                <MessageCircle size={24} />
                Finalizar via WhatsApp
              </Show>
            </button>

            <p class="text-sm text-gray-600 text-center">
              Ao finalizar, você será redirecionado para o WhatsApp para confirmar seu pedido
            </p>
          </form>
        </div>
      </div>

      {/* Order Summary */}
      <div class="lg:col-span-1">
        <div class="checkout-summary-wrapper bg-white rounded-xl shadow-card p-6 sticky top-24">
          <h2 class="text-xl font-display font-bold text-gray-900 mb-4">
            Resumo do Pedido
          </h2>

          {/* Items */}
          <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
            <For each={cart.items}>
              {(item) => (
                <div class="flex gap-3">
                  <img
                    src={item.product_image || 'https://placehold.co/100x100/f3f4f6/9ca3af?text=Sem+Imagem'}
                    alt={item.product_name}
                    class="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.product_name}
                    </h4>
                    <Show when={item.variation_color}>
                      <p class="text-xs text-gray-600">{item.variation_color}</p>
                    </Show>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-xs text-gray-600">Qtd: {item.quantity}</span>
                      <span class="text-sm font-semibold text-gray-900">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class="border-t border-gray-200 pt-4 space-y-2">
            <div class="flex items-center justify-between text-gray-600">
              <span>Subtotal ({cartItemsCount()} itens)</span>
              <span>{formatPrice(cartTotal())}</span>
            </div>

            <div class="flex items-center justify-between text-lg font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>{formatPrice(cartTotal())}</span>
            </div>
          </div>

          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-xs text-blue-800">
              <strong>Nota:</strong> O valor final e prazo de entrega serão confirmados via WhatsApp após análise do pedido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
