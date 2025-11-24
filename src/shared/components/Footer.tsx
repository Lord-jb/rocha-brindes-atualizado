// src/shared/components/Footer.tsx - VERSÃO COMPLETA

import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import { Facebook, Instagram, MapPin, Phone, Mail, Heart, Linkedin, Youtube } from 'lucide-react'

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

const DEFAULT_FOOTER: FooterData = {
  companyName: 'Rocha Brindes',
  description: 'Transformando ideias em brindes únicos.',
  address: 'Endereço não configurado',
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
      { label: 'Catálogo', url: '/catalogo' },
      { label: 'Sobre', url: '/#sobre' },
      { label: 'Contato', url: '/#contato' }
    ]
  }
}

export default function Footer() {
  const [data, setData] = useState<FooterData>(DEFAULT_FOOTER)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'footer'), (doc) => {
      if (doc.exists()) {
        const footerData = doc.data() as Partial<FooterData>
        setData({
          ...DEFAULT_FOOTER,
          ...footerData,
          navigation: footerData.navigation || DEFAULT_FOOTER.navigation
        })
      }
    })
    return () => unsub()
  }, [])

  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8 text-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Coluna 1: Sobre a Empresa */}
          <div>
            <h3 className="text-2xl font-title font-bold text-white mb-4">
              {data.companyName}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {data.description}
            </p>
            <div className="flex gap-3">
              {data.instagramUrl && (
                <a 
                  href={data.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-800 rounded-full hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all text-gray-200"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {data.facebookUrl && (
                <a 
                  href={data.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-all text-gray-200"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {data.linkedinUrl && (
                <a 
                  href={data.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-800 rounded-full hover:bg-blue-700 hover:text-white transition-all text-gray-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {data.youtubeUrl && (
                <a 
                  href={data.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-800 rounded-full hover:bg-red-600 hover:text-white transition-all text-gray-200"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">{data.navigation.title}</h4>
            <ul className="space-y-3 text-gray-300">
              {data.navigation.links.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.url} 
                    className="hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contato</h4>
            <ul className="space-y-4 text-gray-300">
              {data.address && (
                <li className="flex items-start gap-3 group">
                  <MapPin className="text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" size={20} />
                  <span>{data.address}</span>
                </li>
              )}
              {data.phone && (
                <li className="flex items-center gap-3 group">
                  <Phone className="text-primary shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <a href={`tel:${data.phone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">
                    {data.phone}
                  </a>
                </li>
              )}
              {data.email && (
                <li className="flex items-center gap-3 group">
                  <Mail className="text-primary shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <a href={`mailto:${data.email}`} className="hover:text-primary transition-colors">
                    {data.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>{data.copyright}</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> pela <span className="font-bold text-white">Império Lord</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
