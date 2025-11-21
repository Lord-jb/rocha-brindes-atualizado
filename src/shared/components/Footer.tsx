// src/shared/components/Footer.tsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../core/lib/firebase';
import { Facebook, Instagram, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const [data, setData] = useState({
    description: 'Transformando ideias em brindes únicos.',
    address: 'Endereço não configurado',
    phone: '',
    email: '',
    copyright: '© 2024 Rocha Brindes',
    instagramUrl: '',
    facebookUrl: '',
    whatsappUrl: ''
  });

  // Escuta as mudanças em tempo real do banco de dados
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'footer'), (doc) => {
      if (doc.exists()) {
        setData(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-2xl font-title font-bold text-dark mb-4">
              Rocha Brindes
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {data.description}
            </p>
            <div className="flex gap-4">
              {data.instagramUrl && (
                <a 
                  href={data.instagramUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-all text-gray-600"
                >
                  <Instagram size={20} />
                </a>
              )}
              {data.facebookUrl && (
                <a 
                  href={data.facebookUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-all text-gray-600"
                >
                  <Facebook size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Coluna 2: Links Rápidos (Estáticos por enquanto, pois são do sistema) */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-dark">Navegação</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Catálogo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mais Vendidos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-dark">Contato</h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>{data.address}</span>
              </li>
              {data.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" size={20} />
                  <span>{data.phone}</span>
                </li>
              )}
              {data.email && (
                <li className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={20} />
                  <span>{data.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{data.copyright}</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={14} className="text-red-500 fill-red-500" /> pela <span className="font-bold text-dark">Império Lord</span>
          </p>
        </div>
      </div>
    </footer>
  );
}