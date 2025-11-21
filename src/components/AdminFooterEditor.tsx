// Arquivo: src/components/AdminFooterEditor.tsx

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../core/lib/firebase'; // Confirme se o caminho do firebase está certo
import { Save, Loader, LayoutTemplate, MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function AdminFooterEditor() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    phone: '',
    email: '',
    copyright: '',
    instagramUrl: '',
    facebookUrl: '',
    whatsappUrl: ''
  });

  useEffect(() => {
    // Carrega dados atuais do banco
    const loadData = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'footer'));
        if (docSnap.exists()) setFormData(prev => ({ ...prev, ...docSnap.data() }));
      } catch (error) {
        console.error("Erro carregar footer:", error);
      }
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg('');
    try {
      await setDoc(doc(db, 'config', 'footer'), formData);
      setMsg('✅ Rodapé atualizado!');
      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      setMsg('❌ Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 my-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <LayoutTemplate size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Editar Rodapé do Site</h2>
        </div>
        {msg && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold">{msg}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sobre a Empresa (Texto)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Descrição curta..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Copyright (Fim da página)</label>
            <input
              type="text"
              name="copyright"
              value={formData.copyright}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"><MapPin size={14}/> Endereço</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"><Phone size={14}/> Telefone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"><Mail size={14}/> Email</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"><Globe size={14}/> Links Redes Sociais</label>
            <div className="flex gap-2">
              <input type="text" name="instagramUrl" placeholder="Instagram URL" value={formData.instagramUrl} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
              <input type="text" name="facebookUrl" placeholder="Facebook URL" value={formData.facebookUrl} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}