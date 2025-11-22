// src/shared/components/WhatsAppButton.tsx
import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  number: string
}

export default function WhatsAppButton({ number }: WhatsAppButtonProps) {
  const handleWhatsApp = () => {
    const cleanNumber = number.replace(/\D/g, '')
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`
    
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = whatsappUrl
    } else {
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <button
      onClick={handleWhatsApp}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40"
      aria-label="Contato WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  )
}