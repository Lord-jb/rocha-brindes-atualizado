// FILE: src/components/admin/tabs/landing/LandingManager.tsx
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { optimizeUrl } from '../../../../core/lib/cloudflare'
import { Upload, X, Loader2, Video, Sparkles, Save, Package, Type, BarChart3, Info, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react'
import type { Product } from '../../../../types/product'

interface VideoSection {
  url: string
  title: string
  description: string
  thumbnail?: string
}

interface InfoBlock {
  title: string
  description: string
  imageUrl?: string
  imagePosition?: 'left' | 'right'
  features?: string[]
}

interface LandingData {
  hero: {
    title: string
    subtitle: string
    ctaText: string
  }
  infoSections?: InfoBlock[]
  videos: VideoSection[]
  featuredProductIds: string[]
  stats: {
    products: { value: string; label: string }
    clients: { value: string; label: string }
    years: { value: string; label: string }
  }
  cta: {
    title: string
    description: string
    buttonText: string
  }
}

const DEFAULT_LANDING_DATA: LandingData = {
  hero: {
    title: 'Brindes que Impressionam',
    subtitle: 'Transforme sua marca em experiências memoráveis',
    ctaText: 'Explorar Catálogo'
  },
  infoSections: [
    {
      title: 'Qualidade Garantida',
      description: 'Trabalhamos apenas com fornecedores certificados e produtos de alta qualidade para garantir a satisfação dos nossos clientes.',
      imagePosition: 'right',
      features: [
        'Produtos certificados e testados',
        'Garantia de qualidade em todos os itens',
        'Entrega rápida e segura'
      ]
    },
    {
      title: 'Personalização Completa',
      description: 'Oferecemos personalização completa para que sua marca se destaque. Do design à produção, cuidamos de cada detalhe.',
      imagePosition: 'left',
      features: [
        'Design exclusivo para sua marca',
        'Múltiplas opções de personalização',
        'Equipe especializada em branding'
      ]
    },
    {
      title: 'Atendimento Especializado',
      description: 'Nossa equipe está pronta para ajudar você em cada etapa do processo, desde a escolha do produto até a entrega final.',
      imagePosition: 'right',
      features: [
        'Consultoria gratuita',
        'Suporte em todo o processo',
        'Pós-venda diferenciado'
      ]
    }
  ],
  videos: [],
  featuredProductIds: [],
  stats: {
    products: { value: '500+', label: 'Produtos Disponíveis' },
    clients: { value: '1000+', label: 'Clientes Satisfeitos' },
    years: { value: '15+', label: 'Anos de Experiência' }
  },
  cta: {
    title: 'Pronto para Começar?',
    description: 'Solicite um orçamento personalizado e descubra como podemos ajudar sua marca',
    buttonText: 'Ver Catálogo Completo'
  }
}

export default function LandingManager() {
  const [data, setData] = useState<LandingData>(DEFAULT_LANDING_DATA)
  const [loading, setLoading] = useState(false)
  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    void loadData()
    void loadProducts()
  }, [])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const docSnap = await getDoc(doc(db, 'config', 'landing'))
      if (docSnap.exists()) {
        const landingData = docSnap.data()
        
        setData({
          hero: landingData.hero || DEFAULT_LANDING_DATA.hero,
          infoSections: landingData.infoSections || DEFAULT_LANDING_DATA.infoSections,
          videos: landingData.videos || [],
          featuredProductIds: landingData.featuredProductIds || [],
          stats: {
            products: landingData.stats?.products || DEFAULT_LANDING_DATA.stats.products,
            clients: landingData.stats?.clients || DEFAULT_LANDING_DATA.stats.clients,
            years: landingData.stats?.years || DEFAULT_LANDING_DATA.stats.years
          },
          cta: landingData.cta || DEFAULT_LANDING_DATA.cta
        })
        
        setSelectedProducts(landingData.featuredProductIds || [])
      }
    } catch (error) {
      console.error('Erro ao carregar landing:', error)
      showMessage('❌ Erro ao carregar dados')
    } finally {
      setLoadingData(false)
    }
  }

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const q = query(collection(db, 'produtos'), orderBy('createdAt', 'desc'), limit(100))
      const snapshot = await getDocs(q)
      const prods = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[]
      setProducts(prods)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showMessage('❌ Erro ao carregar produtos')
    } finally {
      setLoadingProducts(false)
    }
  }

  const saveData = async () => {
    setLoading(true)
    try {
      await setDoc(doc(db, 'config', 'landing'), {
        ...data,
        featuredProductIds: selectedProducts
      })
      showMessage('✅ Landing page atualizada!')
    } catch (error) {
      showMessage('❌ Erro ao salvar')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else {
        if (prev.length >= 10) return prev
        return [...prev, productId]
      }
    })
  }

  const handleVideoUpload = async (url: string, thumbnail: string, title: string, description: string) => {
    setUploadingType('video')
    try {
      const newVideo: VideoSection = {
        url,
        title,
        description
      }
      
      if (thumbnail && thumbnail.trim()) {
        newVideo.thumbnail = thumbnail
      }

      setData(prev => ({
        ...prev,
        videos: [...prev.videos, newVideo]
      }))
      
      showMessage('✅ Vídeo adicionado!')
    } catch (error) {
      console.error('Erro ao adicionar vídeo:', error)
      showMessage('❌ Erro ao adicionar')
    } finally {
      setUploadingType(null)
    }
  }

  const removeVideo = (index: number) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
    showMessage('✅ Vídeo removido!')
  }

  const addInfoSection = () => {
    const newSection: InfoBlock = {
      title: 'Nova Seção',
      description: 'Descrição da seção',
      imagePosition: 'right',
      features: ['Item 1', 'Item 2', 'Item 3']
    }
    
    setData(prev => ({
      ...prev,
      infoSections: [...(prev.infoSections || []), newSection]
    }))
    showMessage('✅ Seção adicionada!')
  }

  const removeInfoSection = (index: number) => {
    setData(prev => ({
      ...prev,
      infoSections: prev.infoSections?.filter((_, i) => i !== index)
    }))
    showMessage('✅ Seção removida!')
  }

  const updateInfoSection = (index: number, field: keyof InfoBlock, value: any) => {
    setData(prev => ({
      ...prev,
      infoSections: prev.infoSections?.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const addFeature = (sectionIndex: number) => {
    setData(prev => ({
      ...prev,
      infoSections: prev.infoSections?.map((section, i) => 
        i === sectionIndex 
          ? { ...section, features: [...(section.features || []), 'Novo item'] }
          : section
      )
    }))
  }

  const removeFeature = (sectionIndex: number, featureIndex: number) => {
    setData(prev => ({
      ...prev,
      infoSections: prev.infoSections?.map((section, i) => 
        i === sectionIndex 
          ? { ...section, features: section.features?.filter((_, fi) => fi !== featureIndex) }
          : section
      )
    }))
  }

  const updateFeature = (sectionIndex: number, featureIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      infoSections: prev.infoSections?.map((section, i) => 
        i === sectionIndex 
          ? { 
              ...section, 
              features: section.features?.map((f, fi) => fi === featureIndex ? value : f) 
            }
          : section
      )
    }))
  }

  const moveInfoSection = (index: number, direction: 'up' | 'down') => {
    if (!data.infoSections) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= data.infoSections.length) return

    const newSections = [...data.infoSections]
    const temp = newSections[index]
    newSections[index] = newSections[newIndex]
    newSections[newIndex] = temp

    setData(prev => ({
      ...prev,
      infoSections: newSections
    }))
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={48} />
        <span className="ml-4 text-xl text-gray-600">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl text-center font-semibold ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Seção Hero (Principal)</h2>
            <p className="text-sm text-gray-500">Primeira impressão do site</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Título Principal</label>
            <input
              type="text"
              value={data.hero?.title || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
              placeholder="Ex: Brindes que Impressionam"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Subtítulo</label>
            <input
              type="text"
              value={data.hero?.subtitle || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
              placeholder="Ex: Transforme sua marca em experiências memoráveis"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Texto do Botão Principal</label>
            <input
              type="text"
              value={data.hero?.ctaText || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                hero: { ...prev.hero, ctaText: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
              placeholder="Ex: Explorar Catálogo"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
              <Info size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Seções de Informação</h2>
              <p className="text-sm text-gray-500">Blocos informativos ao longo da página</p>
            </div>
          </div>
          <button
            onClick={addInfoSection}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            <Plus size={18} />
            Adicionar Seção
          </button>
        </div>

        {data.infoSections && data.infoSections.length > 0 ? (
          <div className="space-y-6">
            {data.infoSections.map((section, idx) => (
              <div key={idx} className="border-2 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Seção {idx + 1}</h3>
                  <div className="flex items-center gap-2">
                    {idx > 0 && (
                      <button
                        onClick={() => moveInfoSection(idx, 'up')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Mover para cima"
                      >
                        <MoveUp size={18} />
                      </button>
                    )}
                    {idx < data.infoSections!.length - 1 && (
                      <button
                        onClick={() => moveInfoSection(idx, 'down')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Mover para baixo"
                      >
                        <MoveDown size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => removeInfoSection(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Título</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateInfoSection(idx, 'title', e.target.value)}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
                      placeholder="Título da seção"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Posição da Imagem</label>
                    <select
                      value={section.imagePosition || 'right'}
                      onChange={(e) => updateInfoSection(idx, 'imagePosition', e.target.value as 'left' | 'right')}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
                    >
                      <option value="left">Esquerda</option>
                      <option value="right">Direita</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Descrição</label>
                  <textarea
                    value={section.description}
                    onChange={(e) => updateInfoSection(idx, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none resize-none"
                    placeholder="Descrição detalhada da seção"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">URL da Imagem (opcional)</label>
                  <input
                    type="url"
                    value={section.imageUrl || ''}
                    onChange={(e) => updateInfoSection(idx, 'imageUrl', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold">Itens em Destaque</label>
                    <button
                      onClick={() => addFeature(idx)}
                      className="text-sm text-primary hover:underline"
                    >
                      + Adicionar Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {section.features?.map((feature, fIdx) => (
                      <div key={fIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(idx, fIdx, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
                          placeholder={`Item ${fIdx + 1}`}
                        />
                        <button
                          onClick={() => removeFeature(idx, fIdx)}
                          className="px-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Info className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600 font-semibold">Nenhuma seção adicionada</p>
            <p className="text-sm text-gray-500 mt-1">Clique em "Adicionar Seção" para começar</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Package size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Produtos em Destaque</h2>
            <p className="text-sm text-gray-500">Selecione até 10 produtos para o carrossel</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700">
            Selecionados: <span className="text-primary">{selectedProducts.length}</span>/10
          </p>
        </div>

        {loadingProducts ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="ml-3 text-gray-600">Carregando produtos...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Package className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600 font-semibold">Nenhum produto cadastrado</p>
            <p className="text-sm text-gray-500 mt-1">Cadastre produtos primeiro na aba Produtos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto p-2">
            {products.map((product) => {
              const isSelected = selectedProducts.includes(product.id)
              const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url
              const imgUrl = imgId ? optimizeUrl(imgId, 'thumbnail') : ''
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  disabled={!isSelected && selectedProducts.length >= 10}
                  className={`relative group border-2 rounded-xl overflow-hidden transition-all ${
                    isSelected 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!isSelected && selectedProducts.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="aspect-square bg-gray-100">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={product.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-2 bg-white">
                    <p className="text-xs font-semibold line-clamp-2 text-left">{product.nome}</p>
                    <p className="text-[10px] text-gray-500 text-left mt-1">SKU: {product.id}</p>
                  </div>

                  {isSelected && (
                    <>
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5 shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="absolute top-2 left-2 bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                        {selectedProducts.indexOf(product.id) + 1}
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {selectedProducts.length >= 10 && (
          <p className="text-sm text-orange-600 mt-4 text-center font-semibold">
            Limite máximo de produtos atingido
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Estatísticas</h2>
            <p className="text-sm text-gray-500">Números da empresa</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Produtos - Valor</label>
            <input
              type="text"
              value={data.stats?.products?.value || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                stats: { 
                  ...prev.stats, 
                  products: { 
                    ...prev.stats.products, 
                    value: e.target.value 
                  }
                }
              }))}
              className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
              placeholder="500+"
            />
            <label className="block text-sm font-semibold mb-2 mt-2">Produtos - Texto</label>
            <input
              type="text"
              value={data.stats?.products?.label || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                stats: { 
                  ...prev.stats, 
                  products: { 
                    ...prev.stats.products, 
                    label: e.target.value 
                  }
                }
              }))}
              className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
              placeholder="Produtos Disponíveis"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Clientes - Valor</label>
            <input
              type="text"
              value={data.stats?.clients?.value || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                stats: { 
                  ...prev.stats, 
                  clients: { 
                    ...prev.stats.clients, 
                    value: e.target.value 
                  }
                }
              }))}
              className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
              placeholder="1000+"
            />
            <label className="block text-sm font-semibold mb-2 mt-2">Clientes - Texto</label>
            <input
              type="text"
              value={data.stats?.clients?.label || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                stats: { 
                  ...prev.stats, 
                  clients: { 
                    ...prev.stats.clients, 
                    label: e.target.value 
                  }
                }
              }))}
              className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
              placeholder="Clientes Satisfeitos"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Experiência - Valor</label>
            <input
              type="text"
              value={data.stats?.years?.value || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                stats: { 
                  ...prev.stats, 
                  years: { 
                    ...prev.stats.years, 
                    value: e.target.value 
                  }
                }
              }))}
              className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
              placeholder="15+"
            />
            <label className="block text-sm font-semibold mb-2 mt-2">Experiência - Texto</label>
            <input
              type="text"
              value={data.stats?.years?.label || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                stats: { 
                  ...prev.stats, 
                  years: { 
                    ...prev.stats.years, 
                    label: e.target.value 
                  }
                }
              }))}
              className="w-full px-4 py-2 border-2 rounded-lg focus:border-primary outline-none"
              placeholder="Anos de Experiência"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Video size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Vídeos de Produção</h2>
            <p className="text-sm text-gray-500">Exibidos abaixo das estatísticas</p>
          </div>
        </div>

        <VideoUploadForm onSubmit={handleVideoUpload} loading={uploadingType === 'video'} />

        {data.videos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {data.videos.map((video, idx) => (
              <div key={idx} className="border-2 rounded-xl overflow-hidden group">
                <div className="relative aspect-video bg-gray-900">
                  <video src={video.url} className="w-full h-full object-cover" muted />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  <button
                    onClick={() => removeVideo(idx)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
            <Type size={20} className="text-pink-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Call to Action Final</h2>
            <p className="text-sm text-gray-500">Seção de conversão no final da página</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Título</label>
            <input
              type="text"
              value={data.cta.title}
              onChange={(e) => setData(prev => ({
                ...prev,
                cta: { ...prev.cta, title: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
              placeholder="Pronto para Começar?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea
              value={data.cta.description}
              onChange={(e) => setData(prev => ({
                ...prev,
                cta: { ...prev.cta, description: e.target.value }
              }))}
              rows={3}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none resize-none"
              placeholder="Solicite um orçamento personalizado..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Texto do Botão</label>
            <input
              type="text"
              value={data.cta.buttonText}
              onChange={(e) => setData(prev => ({
                ...prev,
                cta: { ...prev.cta, buttonText: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
              placeholder="Ver Catálogo Completo"
            />
          </div>
        </div>
      </div>

      <button
        onClick={saveData}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        Salvar Landing Page
      </button>
    </div>
  )
}

function VideoUploadForm({ onSubmit, loading }: { onSubmit: (url: string, thumbnail: string, title: string, desc: string) => void, loading: boolean }) {
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const handleSubmit = () => {
    if (url && title && desc) {
      onSubmit(url, thumbnail, title, desc)
      setUrl('')
      setThumbnail('')
      setTitle('')
      setDesc('')
    }
  }

  return (
    <div className="border-2 border-dashed rounded-xl p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-primary"
            placeholder="Ex: Processo de Personalização"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Descrição</label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-primary"
            placeholder="Breve descrição do vídeo"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">URL do Vídeo</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-primary"
            placeholder="https://seusite.com/videos/video-producao.mp4"
          />
          <p className="text-xs text-gray-500 mt-1">
            Cole a URL completa do vídeo hospedado
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">URL da Thumbnail (opcional)</label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-primary"
            placeholder="https://seusite.com/videos/thumb-producao.jpg"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!url || !title || !desc || loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Adicionando...' : 'Adicionar Vídeo'}
      </button>
    </div>
  )
}