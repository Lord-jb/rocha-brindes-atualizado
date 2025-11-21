// src/features/catalog/components/admin/LandingManager.tsx - VERSÃO CORRIGIDA COMPLETA

import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { optimizeUrl } from '../../../../core/lib/cloudflare'
import { Upload, X, Loader2, Video, Sparkles, Save, Package } from 'lucide-react'
import type { Product } from '../../../../types/product'

interface VideoSection {
  url: string
  title: string
  description: string
  thumbnail?: string
}

interface LandingData {
  hero: {
    title: string
    subtitle: string
    ctaText: string
    backgroundUrl: string
  }
  videos: VideoSection[]
  featuredProductIds: string[]
}

export default function LandingManager() {
  const [data, setData] = useState<LandingData>({
    hero: {
      title: 'Brindes que Impressionam',
      subtitle: 'Transforme sua marca em experiências memoráveis',
      ctaText: 'Explorar Catálogo',
      backgroundUrl: ''
    },
    videos: [],
    featuredProductIds: []
  })
  const [loading, setLoading] = useState(false)
  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    void loadData()
    void loadProducts()
  }, [])

  const loadData = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'landing'))
      if (docSnap.exists()) {
        const landingData = docSnap.data() as LandingData
        setData(landingData)
        setSelectedProducts(landingData.featuredProductIds || [])
      }
    } catch (error) {
      console.error('Erro ao carregar landing:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const q = query(collection(db, 'produtos'), orderBy('createdAt', 'desc'), limit(100))
      const snapshot = await getDocs(q)
      const prods = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[]
      setProducts(prods)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
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

// src/features/catalog/components/admin/LandingManager.tsx - CORRIGIR handleVideoUpload

const handleVideoUpload = async (url: string, thumbnail: string, title: string, description: string) => {
  setUploadingType('video')
  try {
    const newVideo: VideoSection = {
      url,
      title,
      description
    }
    
    // Só adiciona thumbnail se não estiver vazio
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

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl text-center font-semibold ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold">Seção Hero (Principal)</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Título</label>
            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => setData(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Subtítulo</label>
            <input
              type="text"
              value={data.hero.subtitle}
              onChange={(e) => setData(prev => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Texto do Botão</label>
            <input
              type="text"
              value={data.hero.ctaText}
              onChange={(e) => setData(prev => ({
                ...prev,
                hero: { ...prev.hero, ctaText: e.target.value }
              }))}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Video size={20} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold">Vídeos de Produção</h2>
        </div>

        <VideoUploadForm onSubmit={handleVideoUpload} loading={uploadingType === 'video'} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.videos.map((video, idx) => (
            <div key={idx} className="border-2 rounded-xl overflow-hidden group">
              <div className="relative aspect-video bg-gray-900">
                <video src={video.url} className="w-full h-full object-cover" muted />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.description}</p>
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
      </div>

      {/* Produtos em Destaque Section */}
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto">
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

        {selectedProducts.length >= 10 && (
          <p className="text-sm text-orange-600 mt-4 text-center font-semibold">
            Limite máximo de produtos atingido
          </p>
        )}
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
            Cole a URL completa do vídeo hospedado em seu servidor
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
          <p className="text-xs text-gray-500 mt-1">
            Imagem de pré-visualização do vídeo
          </p>
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