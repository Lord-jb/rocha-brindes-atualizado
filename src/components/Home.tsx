// FILE: src/components/Home.tsx
import { lazy, Suspense, useState, useEffect } from 'react'
import { useCatalog, setCachedCatalog } from '../core/hooks/useCatalog'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../core/lib/firebase'
import type { Product } from '../types/product'

import Header from '../shared/components/Header'
import HeroBanner from '../shared/components/HeroBanner'
import HeroSection from '../shared/components/HeroSection'
import InfoSection from '../shared/components/InfoSection'
import FeaturedProducts from '../shared/components/FeaturedProducts'
import PopularCategories from '../shared/components/PopularCategories'
import StatsSection from '../shared/components/StatsSection'
import VideoSection from '../shared/components/VideoSection'
import CTASection from '../shared/components/CTASection'
import WhatsAppButton from '../shared/components/WhatsAppButton'
import Footer from '../shared/components/Footer'
import CartSidebar from '../features/cart/CartSidebar'
import Providers from './Providers'

interface VideoItem {
  url: string
  title?: string
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

const DEFAULT_INFO_SECTIONS: InfoBlock[] = [
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
]

function HomeContent() {
  const { data, isLoading } = useCatalog(1000)
  const [whatsappNumber, setWhatsappNumber] = useState('5589994333316')
  const [landingData, setLandingData] = useState<LandingData>({
    hero: {
      title: 'Brindes que Impressionam',
      subtitle: 'Transforme sua marca em experiências memoráveis',
      ctaText: 'Explorar Catálogo'
    },
    infoSections: DEFAULT_INFO_SECTIONS,
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
          setLandingData(prev => ({
            ...prev,
            ...loadedData,
            infoSections: loadedData.infoSections && loadedData.infoSections.length > 0 
              ? loadedData.infoSections 
              : DEFAULT_INFO_SECTIONS
          }))
          
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-3 sm:pt-6">
        <div className="container mx-auto px-3 sm:px-4 pb-4">
          <Suspense fallback={<div className="mb-6 sm:mb-8 h-40 sm:h-48 md:h-56 rounded-2xl sm:rounded-3xl bg-gray-100 animate-pulse" />}>
            <HeroBanner banners={data?.layout.banners || []} />
          </Suspense>

          <HeroSection 
            title={landingData.hero.title}
            subtitle={landingData.hero.subtitle}
          />

          <StatsSection stats={landingData.stats} />

          {landingData.infoSections?.[0] && (
            <InfoSection {...landingData.infoSections[0]} />
          )}

          <VideoSection videos={landingData.videos} />

          <CTASection 
            title={landingData.cta.title}
            description={landingData.cta.description}
            buttonText={landingData.cta.buttonText}
          />

          <Suspense fallback={null}>
            <PopularCategories 
              categories={data?.categories.filter(c => c.popular).slice(0, 4) || []} 
              onSelect={(cat) => window.location.href = `/catalogo?categoria=${encodeURIComponent(cat)}`}
            />
          </Suspense>

          <FeaturedProducts products={featuredProducts} />

          {landingData.infoSections?.[1] && (
            <InfoSection {...landingData.infoSections[1]} />
          )}

          {landingData.infoSections?.[2] && (
            <InfoSection {...landingData.infoSections[2]} />
          )}
        </div>
      </main>

      <WhatsAppButton number={whatsappNumber} />
      <CartSidebar />

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