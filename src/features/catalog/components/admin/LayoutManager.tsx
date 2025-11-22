// src/features/catalog/components/admin/LayoutManager.tsx - CORREÇÃO
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { uploadToCloudflare, optimizeUrl, deleteCloudflareImage } from '../../../../core/lib/cloudflare'
import { db } from '../../../../core/lib/firebase'
import { Upload, X, Loader2, Image as ImageIcon, Info, Phone, Settings } from 'lucide-react'
import AdminFooterEditor from '../../../../components/AdminFooterEditor'

interface LayoutAssets {
  logo?: string
  companyInfo?: {
    title?: string
    description: string
  }
  whatsapp?: string
}

export default function LayoutManager() {
  const [assets, setAssets] = useState<LayoutAssets>({})
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'logo' | null>(null)
  const [message, setMessage] = useState('')
  const [companyTitle, setCompanyTitle] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    void loadAssets()
    void loadWhatsAppFromGeneral()
  }, [])

  const loadAssets = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'layout'))
      if (docSnap.exists()) {
        const data = docSnap.data() as LayoutAssets
        setAssets(data)
        setCompanyTitle(data.companyInfo?.title || '')
        setCompanyDescription(data.companyInfo?.description || '')
        if (data.whatsapp) setWhatsapp(data.whatsapp)
      }
    } catch (error) {
      console.error('Erro ao carregar assets:', error)
      setMessage('Erro ao carregar configurações')
    }
  }

  const loadWhatsAppFromGeneral = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'general'))
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.whatsappNumber && !whatsapp) {
          setWhatsapp(data.whatsappNumber)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar WhatsApp:', error)
    }
  }

  const saveAssets = async (data: LayoutAssets) => {
    await setDoc(doc(db, 'config', 'layout'), data, { merge: true })
  }

  const saveWhatsAppToGeneral = async (number: string) => {
    await setDoc(doc(db, 'config', 'general'), { whatsappNumber: number }, { merge: true })
  }

  const showMessage = (msg: string, timeout = 3000) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), timeout)
  }

  const saveCompanyInfo = async () => {
    try {
      const newAssets: LayoutAssets = {
        ...assets,
        companyInfo: companyDescription ? {
          title: companyTitle,
          description: companyDescription
        } : undefined,
        whatsapp: whatsapp || undefined
      }
      
      await saveAssets(newAssets)
      
      if (whatsapp) {
        await saveWhatsAppToGeneral(whatsapp)
      }
      
      setAssets(newAssets)
      showMessage('Informações salvas com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao salvar informações')
    }
  }

  const handleLogoUpload = async (file: File) => {
    setLoading(true)
    setLoadingType('logo')
    try {
      const imageId = await uploadToCloudflare(file, {
        folder: 'layout',
        type: 'logo'
      })

      if (assets.logo) {
        await deleteCloudflareImage(assets.logo)
      }

      const newAssets: LayoutAssets = { ...assets, logo: imageId }
      await saveAssets(newAssets)
      setAssets(newAssets)
      showMessage('Logo atualizado com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao fazer upload do logo')
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const removeLogo = async () => {
    if (!assets.logo) return
    
    try {
      await deleteCloudflareImage(assets.logo)
      const newAssets: LayoutAssets = { ...assets, logo: undefined }
      await saveAssets(newAssets)
      setAssets(newAssets)
      showMessage('Logo removido com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao remover logo')
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl text-center font-semibold shadow-md animate-fade-in ${message.includes('sucesso') ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-red-50 text-red-700 border-2 border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ImageIcon size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-title font-bold text-gray-800">Logo Principal</h2>
              <p className="text-sm text-gray-500">Logotipo exibido no cabeçalho</p>
            </div>
          </div>
          
          {assets.logo ? (
            <div className="relative inline-block">
              <div className="w-64 h-32 border-2 border-gray-200 rounded-xl p-4 group hover:border-primary transition-colors bg-gray-50">
                <img 
                  src={optimizeUrl(assets.logo, 'thumbnail')} 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <button
                onClick={() => void removeLogo()}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
                title="Remover logo"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary hover:from-primary/20 hover:to-primary/10 transition-all">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                {loadingType === 'logo' ? (
                  <Loader2 size={20} className="animate-spin text-primary" />
                ) : (
                  <Upload size={20} className="text-primary" />
                )}
              </div>
              <span className="font-semibold text-gray-800">Adicionar Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleLogoUpload(file)
                }}
                className="hidden"
                disabled={loading}
              />
            </label>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-title font-bold text-gray-800">Configurações</h2>
              <p className="text-sm text-gray-500">WhatsApp e outros</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone size={16} />
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: 5589994333316"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Apenas números com DDI e DDD</p>
          </div>
        </div> 
      </div>
          <AdminFooterEditor />
      <div className="flex justify-end">
        <button
          onClick={() => void saveCompanyInfo()}
          className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  )
}