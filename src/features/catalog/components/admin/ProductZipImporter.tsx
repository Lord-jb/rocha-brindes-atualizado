// FILE: src/components/admin/ProductZipImporter.tsx
import { useState } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle, LinkIcon, Eye, X, Save, Edit2, Trash2, Check } from 'lucide-react'
import { uploadToCloudflare } from '../../../../core/lib/cloudflare'
import { collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { useCategories } from '../../../../core/hooks/useCategories'

interface ScrapedProduct {
  id: string
  nome: string
  descricao: string
  imagens: string[]
  imagemPrincipal: string | null
  cores: string[]
  imagensPorCor: Record<string, string[]>
  selected: boolean
  categorias: string[]
  destaque: boolean
}

const extractCategoryFromUrl = (inputUrl: string): { name: string; id: string } => {
  const parse = (path: string) => {
    const segments = path.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1] || 'geral'

    let name = lastSegment.replace(/-/g, ' ').trim()
    name = name.replace(/\b\w/g, (l) => l.toUpperCase())

    const id = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    return { name, id }
  }

  try {
    const urlObj = new URL(inputUrl)
    return parse(urlObj.pathname)
  } catch {
    return parse(inputUrl)
  }
}

const WORKER_URL = 'https://imagens.bjeslee19.workers.dev'

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
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; id: string } | null>(null)
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
      const catInfo = extractCategoryFromUrl(url)
      setCategoryInfo(catInfo)
      console.log('[IMPORTER] Categoria:', catInfo)

      const listResponse = await fetch(`${WORKER_URL}/scrape-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!listResponse.ok) {
        const errorText = await listResponse.text()
        console.error('[IMPORTER] Erro na resposta:', errorText)
        throw new Error(`Erro ${listResponse.status}: ${errorText}`)
      }

      const { productUrls } = await listResponse.json()
      setProgress({ current: 0, total: productUrls.length })
      setMessage(`Encontrados ${productUrls.length} produtos em "${catInfo.name}"`)

      const products: ScrapedProduct[] = []
      
      for (let i = 0; i < productUrls.length; i++) {
        const productUrl = productUrls[i]
        setProgress({ current: i + 1, total: productUrls.length })
        setMessage(`Processando ${i + 1}/${productUrls.length}`)

        try {
          const productResponse = await fetch(`${WORKER_URL}/scrape-product-detail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: productUrl })
          })

          if (productResponse.ok) {
            const product = await productResponse.json()
            products.push({
              ...product,
              selected: true,
              categorias: [catInfo.name],
              destaque: false
            })
          } else {
            console.error(`[IMPORTER] Erro ${productResponse.status} ao processar ${productUrl}`)
          }
        } catch (err) {
          console.error(`[IMPORTER] Erro ao processar ${productUrl}:`, err)
        }

        await new Promise(resolve => setTimeout(resolve, 800))
      }

      setScrapedProducts(products)
      setShowPreview(true)
      setMessage(`✅ ${products.length} produtos extraídos de "${catInfo.name}"!`)

    } catch (error) {
      console.error('[IMPORTER] Erro geral:', error)
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro ao extrair produtos'}`)
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

  const handleSaveAll = async () => {
    const selectedProducts = scrapedProducts.filter(p => p.selected)
    if (selectedProducts.length === 0) {
      setMessage('❌ Nenhum produto selecionado')
      return
    }

    if (!categoryInfo) {
      setMessage('❌ Categoria não identificada')
      return
    }

    setSaving(true)
    setMessage('Salvando produtos...')
    let savedCount = 0

    try {
      const categoryRef = doc(db, 'categorias', categoryInfo.id)
      const categorySnap = await getDoc(categoryRef)
      
      if (!categorySnap.exists()) {
        await setDoc(categoryRef, {
          id: categoryInfo.id,
          nome: categoryInfo.name,
          productCount: 0,
          popular: false,
          createdAt: serverTimestamp()
        })
        console.log('[IMPORTER] Categoria criada:', categoryInfo.name)
      }

      for (let i = 0; i < selectedProducts.length; i++) {
        const product = selectedProducts[i]
        setProgress({ current: i + 1, total: selectedProducts.length })
        setMessage(`Salvando ${i + 1}/${selectedProducts.length}: ${product.nome}`)

        try {
          const imageIds: string[] = []
          const imagensPorCorCloudflare: Record<string, string[]> = {}

          for (const [cor, urls] of Object.entries(product.imagensPorCor || {})) {
            imagensPorCorCloudflare[cor] = []
            console.log(`[IMPORTER] Processando cor ${cor}: ${urls.length} imagens`)
            
            for (let idx = 0; idx < Math.min(urls.length, 5); idx++) {
              const imgUrl = urls[idx]
              try {
                console.log(`[IMPORTER] Baixando via proxy: ${imgUrl}`)
                
                const proxyResponse = await fetch(`${WORKER_URL}/proxy-image`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: imgUrl })
                })
                
                if (!proxyResponse.ok) {
                  console.error(`[IMPORTER] Erro no proxy: ${proxyResponse.status}`)
                  continue
                }
                
                const blob = await proxyResponse.blob()
                const ext = imgUrl.split('.').pop()?.split('?')[0] || 'jpg'
                const file = new File(
                  [blob], 
                  `${product.id}_${cor}_${idx}.${ext}`, 
                  { type: blob.type }
                )
                
                console.log(`[IMPORTER] Upload para Cloudflare: ${file.name}`)
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
                
                console.log(`[IMPORTER] ✓ Upload OK: ${imageId}`)
              } catch (err) {
                console.error(`[IMPORTER] Erro ao processar ${imgUrl}:`, err)
              }
            }
          }

          if (imageIds.length === 0) {
            console.warn(`[IMPORTER] Produto ${product.id} sem imagens, pulando...`)
            continue
          }

          const variacoes = product.cores.map((cor) => {
            const imagensDaCor = imagensPorCorCloudflare[cor] || []
            return {
              cor,
              imagem_url: imagensDaCor[0] || imageIds[0],
              thumb_url: imagensDaCor[0] || imageIds[0]
            }
          })

          let mainImageId = imageIds[0]
          
          if (product.imagemPrincipal) {
            for (const [cor, urls] of Object.entries(product.imagensPorCor)) {
              const mainIndex = urls.indexOf(product.imagemPrincipal)
              if (mainIndex !== -1 && imagensPorCorCloudflare[cor]?.[mainIndex]) {
                mainImageId = imagensPorCorCloudflare[cor][mainIndex]
                break
              }
            }
          } else {
            const pretoImages = imagensPorCorCloudflare['PRETO'] || imagensPorCorCloudflare['PRETO FOSCO']
            if (pretoImages?.[0]) {
              mainImageId = pretoImages[0]
            } else if (product.cores[0] && imagensPorCorCloudflare[product.cores[0]]) {
              mainImageId = imagensPorCorCloudflare[product.cores[0]][0] || imageIds[0]
            }
          }

          await setDoc(doc(collection(db, 'produtos'), product.id), {
            id: product.id,
            nome: product.nome,
            descricao: product.descricao,
            categorias: product.categorias,
            destaque: product.destaque,
            variacoes,
            imagem_url: mainImageId,
            thumb_url: mainImageId,
            imagens_urls: imageIds,
            thumbs_urls: imageIds,
            createdAt: serverTimestamp(),
          })

          console.log(`[IMPORTER] ✓ Produto ${product.id} salvo com sucesso`)
          savedCount++
        } catch (err) {
          console.error(`[IMPORTER] Erro ao salvar ${product.id}:`, err)
        }
      }

      setMessage(`✅ ${savedCount} produtos salvos em "${categoryInfo.name}"!`)
      setScrapedProducts([])
      setShowPreview(false)
      setUrl('')
      setCategoryInfo(null)

    } catch (error) {
      console.error('[IMPORTER] Erro ao salvar:', error)
      setMessage('❌ Erro ao salvar produtos')
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = scrapedProducts.filter(p => p.selected).length

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
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
              placeholder="https://www.xbzbrindes.com.br/brindes/Bar-e-Bebidas"
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
            <button
              onClick={() => setShowPreview(true)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              Ver {scrapedProducts.length} produtos ({selectedCount} selecionados)
            </button>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold">Produtos ({scrapedProducts.length})</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{selectedCount} selecionados</span>
                  {categoryInfo && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-primary">{categoryInfo.name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleAll}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                >
                  {scrapedProducts.every(p => p.selected) ? 'Desmarcar' : 'Selecionar'} todos
                </button>
                <button onClick={() => setShowPreview(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {scrapedProducts.map((product, idx) => (
                  <div 
                    key={idx} 
                    className={`border-2 rounded-lg p-4 ${product.selected ? 'border-primary bg-primary/5' : 'border-gray-200 opacity-60'}`}
                  >
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={product.selected}
                        onChange={() => handleToggleProduct(idx)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                          <img
                            src={product.imagemPrincipal || product.imagens[0] || ''}
                            alt={product.nome}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-bold text-sm mb-1">{product.nome}</h3>
                        <p className="text-xs text-gray-500 mb-2">SKU: {product.id}</p>
                        {product.categorias.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              {product.categorias[0]}
                            </span>
                          </div>
                        )}
                        {product.cores.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.cores.slice(0, 3).map((cor, i) => (
                              <span key={i} className="text-[10px] bg-gray-200 px-2 py-1 rounded">{cor}</span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500">{product.imagens.length} imagens</p>
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

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Fechar
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving || selectedCount === 0}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                Salvar {selectedCount}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingIndex !== null && editForm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Editar Produto</h3>
                <p className="text-sm text-gray-500 mt-1">Revise e ajuste as informações do produto</p>
              </div>
              <button 
                onClick={handleCancelEdit} 
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Nome</label>
                  <input
                    type="text"
                    value={editForm.nome}
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">SKU/Código</label>
                  <input
                    type="text"
                    value={editForm.id}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">O código não pode ser alterado</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Descrição</label>
                  <textarea
                    value={editForm.descricao}
                    onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{editForm.descricao.length} caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Categoria</label>
                  <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-primary">
                        {editForm.categorias[0] || 'Nenhuma categoria'}
                      </span>
                      {categoryInfo && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          Da URL
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {categories.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Categorias adicionais:</p>
                      <div className="flex flex-wrap gap-2">
                        {categories
                          .filter(cat => !editForm.categorias.includes(cat.nome))
                          .map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setEditForm({
                                ...editForm,
                                categorias: [...editForm.categorias, cat.nome]
                              })}
                              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 border rounded-lg"
                            >
                              + {cat.nome}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {editForm.categorias.length > 1 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {editForm.categorias.slice(1).map((cat, i) => (
                          <div 
                            key={i}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg"
                          >
                            <span className="text-sm font-medium">{cat}</span>
                            <button
                              onClick={() => setEditForm({
                                ...editForm,
                                categorias: editForm.categorias.filter(c => c !== cat)
                              })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.destaque}
                      onChange={(e) => setEditForm({ ...editForm, destaque: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <div>
                      <span className="text-sm font-bold">Produto em destaque</span>
                      <p className="text-xs text-gray-600">Aparece na página inicial</p>
                    </div>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold">Cores e Imagens</label>
                    <span className="text-xs bg-gray-200 px-3 py-1 rounded-full font-semibold">
                      {editForm.cores.length} cores • {editForm.imagens.length} imagens
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(editForm.imagensPorCor)
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(([cor, imagens]) => (
                        <div 
                          key={cor} 
                          className="border-2 border-primary/30 rounded-lg p-4 bg-primary/5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold capitalize">{cor}</h4>
                            <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">
                              {imagens.length}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3">
                            {imagens.slice(0, 8).map((img, idx) => (
                              <div key={idx} className="relative aspect-square bg-white rounded-lg overflow-hidden border-2">
                                <img 
                                  src={img} 
                                  alt={`${cor} ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-primary text-white px-2 py-0.5 rounded text-xs">
                                  #{idx + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={handleCancelEdit} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2"
              >
                <Check size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {saving && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Salvando...</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-center">{progress.current} / {progress.total}</p>
          </div>
        </div>
      )}
    </>
  )
}