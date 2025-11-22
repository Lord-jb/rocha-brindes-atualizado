// src/components/Home.tsx - VERSÃO FINAL COM DADOS DINÂMICOS

import { lazy, Suspense, useState, useEffect } from 'react'
import { useCatalog, setCachedCatalog } from '../core/hooks/useCatalog'
import { optimizeUrl } from '../shared/utils/image'
import Header from '../shared/components/Header'
import Providers from './Providers'
import { MessageCircle } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../core/lib/firebase'
import type { Product } from '../types/product'

import HeroBanner from '../shared/components/HeroBanner'
import PopularCategories from '../shared/components/PopularCategories'
const Footer = lazy(() => import('../shared/components/Footer'))

interface VideoItem {
  url: string
  title?: string
  thumbnail?: string
}

interface LandingData {
  hero: {
    title: string
    subtitle: string
    ctaText: string
  }
  videos: VideoItem[]
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

function HomeContent() {
  const { data, isLoading } = useCatalog(1000)
  const [whatsappNumber, setWhatsappNumber] = useState('5589994333316')
  const [landingData, setLandingData] = useState<LandingData>({
    hero: {
      title: 'Brindes que Impressionam',
      subtitle: 'Transforme sua marca em experiências memoráveis',
      ctaText: 'Explorar Catálogo'
    },
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
  })
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (data) {
      setCachedCatalog(data)
    }
  }, [data])

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'landing'))
        if (docSnap.exists()) {
          const loadedData = docSnap.data() as LandingData
          setLandingData(loadedData)
          
          if (loadedData.featuredProductIds && data?.products) {
            const featured = data.products.filter((p: Product) => 
              loadedData.featuredProductIds.includes(p.id)
            )
            setFeaturedProducts(featured)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar landing:', error)
      }
    }

    const loadWhatsAppNumber = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'general'))
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.whatsappNumber) {
            setWhatsappNumber(data.whatsappNumber)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar Contato:', error)
      }
    }

    if (data) {
      void loadLandingData()
    }
    void loadWhatsAppNumber()
  }, [data])

  const handleWhatsApp = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`
    
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = whatsappUrl
    } else {
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-4 md:pt-8">
        <div className="container mx-auto px-4 pb-4">
          <Suspense fallback={<div className="mb-8 h-48 md:h-56 rounded-2xl bg-gray-100 animate-pulse" />}>
            <HeroBanner banners={data?.layout.banners || []} />
          </Suspense>

          {/* Hero Section - DINÂMICO */}
          <section className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-title font-bold text-dark mb-6">
              {landingData.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {landingData.hero.subtitle}
            </p>
            <a
              href="/catalogo"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {landingData.hero.ctaText}
            </a>
          </section>

          {/* Carrossel de Produtos em Destaque */}
          {featuredProducts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-title font-bold text-dark mb-6 text-center">
                Produtos em Destaque
              </h2>
              <div className="relative overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {featuredProducts.map((product) => {
                    const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url || product.variacoes?.[0]?.imagem_url
                    const imgUrl = imgId ? optimizeUrl(imgId, 'public') : ''

                    return (
                      <a
                        key={product.id}
                        href="/catalogo"
                        className="flex-shrink-0 w-72 snap-start group"
                      >
                        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={product.nome}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400 text-sm">Sem imagem</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="text-white font-bold line-clamp-2">{product.nome}</p>
                            {product.categorias && product.categorias.length > 0 && (
                              <p className="text-white/80 text-xs mt-1">{product.categorias[0]}</p>
                            )}
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          <Suspense fallback={null}>
            <PopularCategories 
              categories={data?.categories.filter(c => c.popular).slice(0, 4) || []} 
              onSelect={(cat) => window.location.href = `/catalogo?categoria=${encodeURIComponent(cat)}`}
            />
          </Suspense>

          {/* Stats - DINÂMICO */}
          <section className="mb-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">{landingData.stats.products.value}</p>
              <p className="text-gray-600">{landingData.stats.products.label}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">{landingData.stats.clients.value}</p>
              <p className="text-gray-600">{landingData.stats.clients.label}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">{landingData.stats.years.value}</p>
              <p className="text-gray-600">{landingData.stats.years.label}</p>
            </div>
          </section>

          {/* Seção de Vídeos */}
          {landingData.videos.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-title font-bold text-dark mb-6 text-center">
                Conheça Nossos Produtos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {landingData.videos.map((video, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
                  >
                    <video
                      src={video.url}
                      poster={video.thumbnail}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                    {video.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-semibold text-sm">{video.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section - DINÂMICO */}
          <section className="mb-16 bg-white rounded-2xl shadow-card p-8 text-center">
            <h2 className="text-3xl font-title font-bold text-dark mb-4">
              {landingData.cta.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {landingData.cta.description}
            </p>
            <a
              href="/catalogo"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {landingData.cta.buttonText}
            </a>
          </section>
        </div>
      </main>

      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40"
        aria-label="Contato WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  )
}