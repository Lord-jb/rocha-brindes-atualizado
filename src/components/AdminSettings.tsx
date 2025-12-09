import { createSignal, Show } from 'solid-js';
import { Save } from 'lucide-solid';
import type { Settings } from '@/types';

interface Props {
  settings: Settings | null;
}

export default function AdminSettings(props: Props) {
  const [formData, setFormData] = createSignal<Partial<Settings>>(props.settings || {});
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveSuccess, setSaveSuccess] = createSignal(false);

  const updateField = (field: keyof Settings, value: string) => {
    setFormData({ ...formData(), [field]: value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData()),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="bg-white rounded-xl shadow-card p-6 md:p-8">
      <div class="space-y-6">
        {/* Company Name */}
        <div>
          <label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
            Nome da Empresa
          </label>
          <input
            type="text"
            id="company_name"
            value={formData().company_name || ''}
            onInput={(e) => updateField('company_name', e.currentTarget.value)}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Rocha Brindes"
          />
        </div>

        {/* Company Description */}
        <div>
          <label for="company_description" class="block text-sm font-medium text-gray-700 mb-2">
            Descrição da Empresa
          </label>
          <textarea
            id="company_description"
            value={formData().company_description || ''}
            onInput={(e) => updateField('company_description', e.currentTarget.value)}
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Especializada em brindes personalizados de alta qualidade..."
          />
        </div>

        {/* Contact Information */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="company_email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="company_email"
              value={formData().company_email || ''}
              onInput={(e) => updateField('company_email', e.currentTarget.value)}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="contato@rochabrindes.com"
            />
          </div>

          <div>
            <label for="company_phone" class="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="company_phone"
              value={formData().company_phone || ''}
              onInput={(e) => updateField('company_phone', e.currentTarget.value)}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="(96) 98124-7830"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label for="company_address" class="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <input
            type="text"
            id="company_address"
            value={formData().company_address || ''}
            onInput={(e) => updateField('company_address', e.currentTarget.value)}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Macapá, AP"
          />
        </div>

        {/* Social Media */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="instagram_url" class="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              id="instagram_url"
              value={formData().instagram_url || ''}
              onInput={(e) => updateField('instagram_url', e.currentTarget.value)}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://instagram.com/rochabrindes"
            />
          </div>

          <div>
            <label for="facebook_url" class="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              id="facebook_url"
              value={formData().facebook_url || ''}
              onInput={(e) => updateField('facebook_url', e.currentTarget.value)}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://facebook.com/rochabrindes"
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div>
          <label for="whatsapp_number" class="block text-sm font-medium text-gray-700 mb-2">
            Número do WhatsApp (com DDI)
          </label>
          <input
            type="tel"
            id="whatsapp_number"
            value={formData().whatsapp_number || ''}
            onInput={(e) => updateField('whatsapp_number', e.currentTarget.value)}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="5596981247830"
          />
          <p class="text-sm text-gray-500 mt-1">
            Formato: código do país + DDD + número (ex: 5596981247830)
          </p>
        </div>

        {/* Submit Button */}
        <div class="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving()}
            class={`btn-primary ${isSaving() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save size={20} />
            {isSaving() ? 'Salvando...' : 'Salvar Configurações'}
          </button>

          <Show when={saveSuccess()}>
            <span class="text-green-600 font-medium">
              ✓ Configurações salvas com sucesso!
            </span>
          </Show>
        </div>
      </div>
    </form>
  );
}
