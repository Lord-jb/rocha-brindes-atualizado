// src/components/AdminFooterEditor.tsx - EDITOR COMPLETO DO FOOTER

import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { Save, Loader, LayoutTemplate, MapPin, Phone, Mail, Globe, Plus, X, Type } from 'lucide-react'

interface FooterData {
  companyName: string
  description: string
  address: string
  phone: string
  email: string
  copyright: string
  instagramUrl: string
  facebookUrl: string
  linkedinUrl: string
  youtubeUrl: string
  navigation: {
    title: string
    links: Array<{ label: string; url: string }>
  }
}

export default function AdminFooterEditor() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  
  const [formData, setFormData] = useState<FooterData>({
    companyName: 'Rocha Brindes',
    description: '',
    address: '',
    phone: '',
    email: '',
    copyright: '© 2024 Rocha Brindes. Todos os direitos reservados.',
    instagramUrl: '',
    facebookUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    navigation: {
      title: 'Navegação',
      links: [
        { label: 'Início', url: '/' },
        { label: 'Catálogo', url: '/catalogo' }
      ]
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'footer'))
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }))
        }
      } catch (error) {
        console.error("Erro carregar footer:", error)
      }
    }
    loadData()
  }, [])

  const handleChange = (field: keyof FooterData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleNavigationTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      navigation: { ...formData.navigation, title } 
    })
  }

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...formData.navigation.links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setFormData({ 
      ...formData, 
      navigation: { ...formData.navigation, links: newLinks } 
    })
  }

  const addLink = () => {
    setFormData({ 
      ...formData, 
      navigation: { 
        ...formData.navigation, 
        links: [...formData.navigation.links, { label: '', url: '' }] 
      } 
    })
  }

  const removeLink = (index: number) => {
    setFormData({ 
      ...formData, 
      navigation: { 
        ...formData.navigation, 
        links: formData.navigation.links.filter((_, i) => i !== index) 
      } 
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setMsg('')
    try {
      await setDoc(doc(db, 'config', 'footer'), formData)
      setMsg('✅ Rodapé atualizado!')
      setTimeout(() => setMsg(''), 3000)
    } catch (error) {
      setMsg('❌ Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <LayoutTemplate size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Configurar Rodapé</h2>
        </div>
        {msg && <span className={`px-3 py-1 rounded-md text-sm font-bold ${msg.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msg}</span>}
      </div>

      {/* Informações da Empresa */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Type size={18} className="text-primary" />
          Informações da Empresa
        </h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Empresa</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Rocha Brindes"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Transformando ideias em brindes únicos..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Copyright</label>
          <input
            type="text"
            value={formData.copyright}
            onChange={(e) => handleChange('copyright', e.target.value)}
            className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="© 2024 Rocha Brindes"
          />
        </div>
      </div>

      {/* Contato */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Phone size={18} className="text-primary" />
          Informações de Contato
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <MapPin size={14}/> Endereço
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Rua Example, 123 - Centro"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Phone size={14}/> Telefone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="(00) 0000-0000"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Mail size={14}/> Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="contato@rochabrindes.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Globe size={18} className="text-primary" />
          Redes Sociais
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram</label>
            <input
              type="url"
              value={formData.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://instagram.com/rochabrindes"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
            <input
              type="url"
              value={formData.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://facebook.com/rochabrindes"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://linkedin.com/company/rochabrindes"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://youtube.com/@rochabrindes"
            />
          </div>
        </div>
      </div>

      {/* Links de Navegação */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Links de Navegação</h3>
          <button
            onClick={addLink}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 text-sm font-semibold"
          >
            <Plus size={16} />
            Adicionar Link
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Título da Seção</label>
          <input
            type="text"
            value={formData.navigation.title}
            onChange={(e) => handleNavigationTitleChange(e.target.value)}
            className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Navegação"
          />
        </div>

        <div className="space-y-3">
          {formData.navigation.links.map((link, index) => (
            <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Texto do Link"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="/caminho ou https://..."
                />
              </div>
              <button
                onClick={() => removeLink(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Rodapé
        </button>
      </div>
    </div>
  )
}