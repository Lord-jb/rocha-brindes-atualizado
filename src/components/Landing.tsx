// src/components/Landing.tsx
import { lazy, Suspense, useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../core/lib/firebase'
import { optimizeUrl } from '../shared/utils/image'
import { ChevronRight, Package, Sparkles, ArrowRight, Play } from 'lucide-react'
import Header from '../shared/components/Header'
import Providers from './Providers'

const Footer = lazy(() => import('../shared/components/Footer'))

interface VideoSection {
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
}

interface ShowcaseImage {
  url: string
  title: string
}

interface LandingData {
  hero: {
    title: string
    subtitle: string
    ctaText: string
    backgroundUrl: string
  }
  videos: VideoSection[]
  showcase: ShowcaseImage[]
}

function LandingContent() {
  const [data, setData] = useState<LandingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'landing'))
        if (docSnap.exists()) {
          setData(docSnap.data() as LandingData)
        }
      } catch (error) {
        console.error('Erro ao carregar landing:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const hero = data?.hero || {
    title: 'Brindes que Impressionam',
    subtitle: 'Transforme sua marca em experiências memoráveis',
    ctaText: 'Explorar Catálogo',
    backgroundUrl: ''
  }

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {hero.backgroundUrl && (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={optimizeUrl(hero.backgroundUrl, 'public')}
                alt="Hero"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10"></div>
          </>
        )}
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-title font-bold text-white mb-6 leading-tight tracking-tight">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light max-w-3xl mx-auto">
            {hero.subtitle}
          </p>
          <a
            href="/catalogo"
            className="inline-flex items-center gap-3 bg-white text-dark px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            {hero.ctaText}
            <ChevronRight size={24} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Produtos Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {data?.videos && data.videos.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-title font-bold text-dark mb-4">
                Nosso Processo
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Veja como transformamos ideias em produtos de qualidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {data.videos.map((video, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setActiveVideo(video.videoUrl)}>
                    {video.thumbnailUrl ? (
                      <img
                        src={optimizeUrl(video.thumbnailUrl, 'public')}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="text-dark ml-1" size={28} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark mb-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Showcase Carousel */}
      {data?.showcase && data.showcase.length > 0 && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 mb-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-title font-bold text-dark mb-4">
                Produtos em Destaque
              </h2>
              <p className="text-xl text-gray-600">
                Qualidade que fala por si
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-6 animate-scroll">
              {[...data.showcase, ...data.showcase].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                >
                  <img
                    src={optimizeUrl(item.url, 'public')}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <h3 className="text-white text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="mx-auto mb-6 text-accent" size={48} />
          <h2 className="text-4xl md:text-5xl font-title font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            Solicite um orçamento personalizado e descubra como podemos ajudar sua marca
          </p>
          <a
            href="/catalogo"
            className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            Ver Catálogo Completo
            <ArrowRight size={24} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold"
            >
              Fechar ✕
            </button>
            <video
              src={activeVideo}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

export default function Landing() {
  return (
    <Providers>
      <LandingContent />
    </Providers>
  )
}