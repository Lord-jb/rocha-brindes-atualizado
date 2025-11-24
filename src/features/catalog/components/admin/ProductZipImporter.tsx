// src/features/catalog/components/admin/ProductZipImporter.tsx
import { useState } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle, Link as LinkIcon, Eye, X, Save, Edit2, Trash2, Check } from 'lucide-react'
import { optimizeUrl, uploadToCloudflare } from '../../../../core/lib/cloudflare'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { useCategories } from '../../../../core/hooks/useCategories'

// src/features/catalog/components/admin/ProductZipImporter.tsx (atualização na interface)
interface ScrapedProduct {
  id: string
  nome: string
  descricao: string
  imagens: string[]
  cores: string[]
  imagensPorCor: Record<string, string[]>  // NOVO
  selected: boolean
  categorias?: string[]
  destaque?: boolean
}

export default function ProductZipImporter() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<ScrapedProduct | null>(null)
  const { data: categories = [] } = useCategories()

  const handleUrlScrape = async () => {
    if (!url.trim()) {
      setMessage('Insira uma URL válida')
      return
    }

    setLoading(true)
    setMessage('Iniciando extração...')
    setProgress({ current: 0, total: 0 })
    setScrapedProducts([])

    try {
      const listResponse = await fetch('/api/scrape-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!listResponse.ok) throw new Error('Erro ao buscar produtos')

      const { productUrls } = await listResponse.json()
      setProgress({ current: 0, total: productUrls.length })
      setMessage(`Encontrados ${productUrls.length} produtos. Extraindo dados...`)

      const products: ScrapedProduct[] = []
      for (let i = 0; i < productUrls.length; i++) {
        const productUrl = productUrls[i]
        setProgress({ current: i + 1, total: productUrls.length })
        setMessage(`Processando ${i + 1}/${productUrls.length}`)

        const productResponse = await fetch('/api/scrape-product-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: productUrl })
        })

        if (productResponse.ok) {
          const product = await productResponse.json()
          products.push({
            ...product,
            selected: true,
            categorias: [],
            destaque: false
          })
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setScrapedProducts(products)
      setShowPreview(true)
      setMessage(`✅ ${products.length} produtos extraídos! Revise antes de salvar.`)

    } catch (error) {
      console.error(error)
      setMessage('❌ Erro ao extrair produtos')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleProduct = (index: number) => {
    setScrapedProducts(prev => 
      prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p)
    )
  }

  const handleToggleAll = () => {
    const allSelected = scrapedProducts.every(p => p.selected)
    setScrapedProducts(prev => 
      prev.map(p => ({ ...p, selected: !allSelected }))
    )
  }

  const handleDeleteProduct = (index: number) => {
    setScrapedProducts(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditProduct = (index: number) => {
    setEditingIndex(index)
    setEditForm({ ...scrapedProducts[index] })
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      setScrapedProducts(prev => 
        prev.map((p, i) => i === editingIndex ? editForm : p)
      )
      setEditingIndex(null)
      setEditForm(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditForm(null)
  }

  const handleToggleCategory = (categoria: string) => {
    if (!editForm) return
    const hasCategory = editForm.categorias?.includes(categoria)
    setEditForm({
      ...editForm,
      categorias: hasCategory
        ? editForm.categorias?.filter(c => c !== categoria)
        : [...(editForm.categorias || []), categoria]
    })
  }

// src/features/catalog/components/admin/ProductZipImporter.tsx (atualização no handleSaveAll)
const handleSaveAll = async () => {
  const selectedProducts = scrapedProducts.filter(p => p.selected)
  if (selectedProducts.length === 0) {
    setMessage('❌ Nenhum produto selecionado')
    return
  }

  setSaving(true)
  setMessage('Salvando produtos no Firebase...')
  let savedCount = 0

  try {
    for (let i = 0; i < selectedProducts.length; i++) {
      const product = selectedProducts[i]
      setProgress({ current: i + 1, total: selectedProducts.length })

      try {
        const imageIds: string[] = []
        const imagensPorCorCloudflare: Record<string, string[]> = {}

        // Upload de imagens POR COR
        for (const [cor, urls] of Object.entries(product.imagensPorCor || {})) {
          imagensPorCorCloudflare[cor] = []
          
          for (const imgUrl of urls.slice(0, 5)) { // Máximo 5 imagens por cor
            try {
              const response = await fetch(imgUrl)
              const blob = await response.blob()
              const file = new File([blob], `${product.id}_${cor}_${imagensPorCorCloudflare[cor].length}.jpg`, { type: blob.type })
              
              const imageId = await uploadToCloudflare(file, {
                folder: `produtos/${product.id}/variacoes`,
                productId: product.id,
                variation: cor,
                type: 'variation'
              })
              
              imagensPorCorCloudflare[cor].push(imageId)
              if (!imageIds.includes(imageId)) {
                imageIds.push(imageId)
              }
            } catch (err) {
              console.error(`Erro ao fazer upload da imagem ${imgUrl}:`, err)
            }
          }
        }

        if (imageIds.length === 0) {
          console.warn(`Produto ${product.id} sem imagens, pulando...`)
          continue
        }

        // Criar variações com suas respectivas imagens
        const variacoes = product.cores.map((cor) => {
          const imagensDaCor = imagensPorCorCloudflare[cor] || []
          return {
            cor,
            imagem_url: imagensDaCor[0] || imageIds[0],
            thumb_url: imagensDaCor[0] || imageIds[0],
            imagens_urls: imagensDaCor.length > 0 ? imagensDaCor : [imageIds[0]]
          }
        })

        // Definir imagem principal (primeira cor ou GERAL)
        const mainImageId = imagensPorCorCloudflare['GERAL']?.[0] || 
                           imagensPorCorCloudflare[product.cores[0]]?.[0] || 
                           imageIds[0]

        await setDoc(doc(collection(db, 'produtos'), product.id), {
          id: product.id,
          nome: product.nome,
          descricao: product.descricao,
          categorias: product.categorias || [],
          destaque: product.destaque || false,
          variacoes,
          imagem_url: mainImageId,
          thumb_url: mainImageId,
          imagens_urls: imageIds,
          thumbs_urls: imageIds,
          createdAt: serverTimestamp(),
        })

        savedCount++
      } catch (err) {
        console.error(`Erro ao salvar produto ${product.id}:`, err)
      }
    }

    setMessage(`✅ ${savedCount} produtos salvos com sucesso!`)
    setScrapedProducts([])
    setShowPreview(false)
    setUrl('')

  } catch (error) {
    console.error(error)
    setMessage('❌ Erro ao salvar produtos')
  } finally {
    setSaving(false)
  }
}

  const selectedCount = scrapedProducts.filter(p => p.selected).length

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <LinkIcon className="text-primary" size={24} />
          <h3 className="text-lg font-bold">Importar produtos via URL</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.xbzbrindes.com.br/categoria"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={handleUrlScrape}
              disabled={loading || !url.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Extraindo...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Extrair
                </>
              )}
            </button>
          </div>

          {loading && progress.total > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {progress.current} / {progress.total}
              </p>
            </div>
          )}

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-700' 
                : message.includes('❌')
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {message.includes('✅') && <CheckCircle size={18} />}
              {message.includes('❌') && <AlertCircle size={18} />}
              {!message.includes('✅') && !message.includes('❌') && <Loader2 className="animate-spin" size={18} />}
              <span className="text-sm font-semibold">{message}</span>
            </div>
          )}

          {scrapedProducts.length > 0 && !loading && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(true)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                Ver {scrapedProducts.length} produtos ({selectedCount} selecionados)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Preview */}
      {showPreview && scrapedProducts.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold">Produtos Extraídos ({scrapedProducts.length})</h2>
                <p className="text-sm text-gray-600">{selectedCount} selecionados para salvar</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleAll}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {scrapedProducts.every(p => p.selected) ? 'Desmarcar todos' : 'Selecionar todos'}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scrapedProducts.map((product, idx) => (
                  <div 
                    key={idx} 
                    className={`border-2 rounded-lg p-4 space-y-3 transition-all ${
                      product.selected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={product.selected}
                        onChange={() => handleToggleProduct(idx)}
                        className="mt-1 rounded"
                      />
                      <div className="flex-1">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                          {product.imagens[0] ? (
                            <img
                              src={product.imagens[0]}
                              alt={product.nome}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Sem imagem
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-sm mb-1">{product.nome}</h3>
                          <p className="text-xs text-gray-500 mb-2">SKU: {product.id}</p>
                          
                          {product.descricao && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {product.descricao}
                            </p>
                          )}

                          {product.categorias && product.categorias.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.categorias.map((cat, i) => (
                                <span key={i} className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}

                          {product.cores.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.cores.slice(0, 3).map((cor, i) => (
                                <span key={i} className="text-[10px] bg-gray-200 px-2 py-1 rounded">
                                  {cor}
                                </span>
                              ))}
                              {product.cores.length > 3 && (
                                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded">
                                  +{product.cores.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mb-2">
                            {product.imagens.length} {product.imagens.length === 1 ? 'imagem' : 'imagens'}
                          </p>

                          {product.destaque && (
                            <span className="inline-block text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                              ⭐ Destaque
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditProduct(idx)}
                            className="flex-1 px-2 py-1.5 text-xs border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center justify-center gap-1"
                          >
                            <Edit2 size={12} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(idx)}
                            className="px-2 py-1.5 text-xs border border-red-500 text-red-500 rounded hover:bg-red-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  handleSaveAll()
                }}
                disabled={saving || selectedCount === 0}
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                Salvar {selectedCount} {selectedCount === 1 ? 'produto' : 'produtos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingIndex !== null && editForm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold">Editar Produto</h3>
              <button onClick={handleCancelEdit} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome</label>
                <input
                  type="text"
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">SKU/Código</label>
                <input
                  type="text"
                  value={editForm.id}
                  onChange={(e) => setEditForm({ ...editForm, id: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <textarea
                  value={editForm.descricao}
                  onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Categorias</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={editForm.categorias?.includes(cat.nome)}
                        onChange={() => handleToggleCategory(cat.nome)}
                        className="rounded"
                      />
                      <span className="text-sm">{cat.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.destaque}
                    onChange={(e) => setEditForm({ ...editForm, destaque: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-semibold">Produto em destaque</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Cores</label>
                <div className="flex flex-wrap gap-2">
                  {editForm.cores.map((cor, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-200 rounded text-sm">
                      {cor}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Imagens ({editForm.imagens.length})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {editForm.imagens.slice(0, 8).map((img, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden">
                      <img src={img} alt={`Imagem ${i + 1}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 flex items-center gap-2"
              >
                <Check size={18} />
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Progresso de Salvamento */}
      {saving && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Salvando produtos...</h3>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-center text-gray-600">
                {progress.current} / {progress.total} produtos salvos
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}