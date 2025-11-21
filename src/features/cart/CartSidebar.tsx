// src/features/cart/CartSidebar.tsx - ajustes de responsividade
import { useState, useEffect } from 'react'
import { X, Trash2, Send, ShoppingCart, Plus, Minus } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import { useCart } from '../../core/store/cart'
import { optimizeUrl } from '../../shared/utils/image'

export default function CartSidebar() {
  const { items, isOpen, toggle, remove, clear, updateQuantity } = useCart()
  const [whatsappNumber, setWhatsappNumber] = useState('5589994333316')
  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    address: '',
    cep: '',
    obs: ''
  })

  useEffect(() => {
    void loadWhatsAppNumber()
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let message = `*Orçamento - Rocha Brindes*\n\n`
    message += `*Cliente:* ${formData.name}\n`
    message += `*Contato:* ${formData.doc}\n`
    message += `*Endereço:* ${formData.address}\n`
    message += `*CEP:* ${formData.cep}\n\n`
    message += `*Produtos:*\n`
    
    items.forEach(item => {
      message += `• ${item.nome} (Cód: ${item.id})`
      if (item.cor) message += ` - Cor: ${item.cor}`
      message += ` - Qtd: ${item.quantity}\n`
    })
    
    if (formData.obs) {
      message += `\n*Observações:* ${formData.obs}`
    }

// remove tudo que não for número
const cleanNumber = whatsappNumber.replace(/\D/g, '')

// WhatsApp Mobile odeia espaços e quebras no final.
// trim() resolve
const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message.trim())}`

// iOS/Safari precisa de _self
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  window.location.href = whatsappUrl
} else {
  window.open(whatsappUrl, '_blank')
}

    
    clear()
    toggle()
    setFormData({ name: '', doc: '', address: '', cep: '', obs: '' })
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggle}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md md:max-w-lg bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-primary flex-shrink-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-white">Carrinho</h2>
              {totalItems > 0 && (
                <p className="text-white/80 text-xs sm:text-sm mt-1">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              )}
            </div>
            <button
              onClick={toggle}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-light">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart size={32} className="sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-sm sm:text-base">Nenhum produto adicionado</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Adicione produtos para solicitar um orçamento</p>
              </div>
            ) : (
              <>
                {items.map(item => {
                  let imgId = item.thumb_url || item.imagem_url
                  
                  if (item.cor && item.variacoes?.length) {
                    const colorVariation = item.variacoes.find(v => v.cor === item.cor)
                    if (colorVariation) {
                      imgId = colorVariation.thumb_url || colorVariation.imagem_url || imgId
                    }
                  }
                  
                  if (!imgId && item.variacoes?.[0]) {
                    imgId = item.variacoes[0].thumb_url || item.variacoes[0].imagem_url
                  }
                  
                  const imgUrl = imgId ? optimizeUrl(imgId, 'thumbnail') : ''

                  return (
                    <div
                      key={`${item.id}-${item.cor || 'default'}`}
                      className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200"
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={item.nome}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                          <span className="text-xs text-gray-400">Sem img</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 text-dark mb-1 break-words">
                          {item.nome}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
                          Cód: {item.id}
                        </p>
                        
                        {item.cor && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] sm:text-xs text-gray-600">Cor:</span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:py-1 bg-gray-100 rounded-md">
                              <span className="text-[10px] sm:text-xs font-medium text-gray-700">{item.cor}</span>
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Minus size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600" />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1
                              updateQuantity(item.id, Math.max(1, val))
                            }}
                            className="w-12 sm:w-16 text-center px-1 sm:px-2 py-1 sm:py-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-bold rounded-lg border-2 border-transparent focus:border-primary focus:outline-none"
                          />
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Plus size={12} className="sm:w-3.5 sm:h-3.5 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => remove(item.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg h-fit transition-all duration-200 flex-shrink-0"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                  )
                })}

                <button
                  onClick={clear}
                  className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 border-2 border-red-200"
                >
                  Limpar carrinho
                </button>
              </>
            )}
          </div>

          {items.length > 0 && (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 border-t space-y-2.5 sm:space-y-3 bg-white shadow-lg flex-shrink-0">
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />

              <input
                type="text"
                placeholder="Contato"
                value={formData.doc}
                onChange={(e) =>
                  setFormData({ ...formData, doc: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />

              <input
                type="text"
                placeholder="Endereço"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />

              <input
                type="text"
                placeholder="CEP"
                value={formData.cep}
                onChange={(e) =>
                  setFormData({ ...formData, cep: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />

              <textarea
                placeholder="Observações (opcional)"
                value={formData.obs}
                onChange={(e) =>
                  setFormData({ ...formData, obs: e.target.value })
                }
                rows={2}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />

              <button
                type="submit"
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-title font-bold text-base sm:text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
                Finalizar no WhatsApp
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  )
}