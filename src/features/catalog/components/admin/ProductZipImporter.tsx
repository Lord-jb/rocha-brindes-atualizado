import { useCallback, useMemo, useState } from 'react'
import JSZip from 'jszip'
import { collection, doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  CheckCircle2,
  Edit,
  FileArchive,
  ListChecks,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { db } from '../../../../core/lib/firebase'
import { uploadToCloudflare } from '../../../../core/lib/cloudflare'
import type { DraftProduct, ProductVariation, ZipImageRef } from '../../../../types/product'
import ProductImportModal from './ProductImportModal'
import { useCategories } from '../../../../core/hooks/useCategories'
import {
  autoFillDraft,
  colorToSlug,
  computeColorsFromImages,
  slugToLabel,
  validateDraft,
} from './importUtils'

type IgnoredRecord = { id: string; reason: 'duplicate_in_zip' | 'already_exists' }

type ZipMeta = {
  id?: string
  name?: string
  description?: string
  colors?: string[]
  categorias?: string[]
  destaque?: boolean
  mainColor?: string
}

const mimeByExt: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

async function zipEntryToImageRef(entry: JSZip.JSZipObject): Promise<ZipImageRef> {
  const blob = await entry.async('blob')
  const ext = entry.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = entry.name.split('/').pop() || `image.${ext}`
  const mime = mimeByExt[ext] || blob.type || 'image/jpeg'
  const file = new File([blob], filename, { type: mime })

  return {
    path: entry.name,
    file,
    previewUrl: URL.createObjectURL(file),
  }
}

function findImageByPath(draft: DraftProduct, path?: string): ZipImageRef | undefined {
  if (!path) return undefined
  for (const images of Object.values(draft.imagesByColor)) {
    const found = images?.find((img) => img.path === path)
    if (found) return found
  }
  return undefined
}

function getThumbnail(draft: DraftProduct): string | undefined {
  const cover = findImageByPath(draft, draft.coverPath)
  if (cover) return cover.previewUrl
  const general = draft.imagesByColor['geral']?.[0]?.previewUrl
  if (general) return general
  const firstColorSlug = Object.keys(draft.imagesByColor).find((key) => key !== 'geral')
  if (firstColorSlug) return draft.imagesByColor[firstColorSlug]?.[0]?.previewUrl
}

function cleanupDraftPreviews(draft: DraftProduct) {
  Object.values(draft.imagesByColor).forEach((images) => {
    images?.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl)
    })
  })
}

function withValidation(draft: DraftProduct): DraftProduct {
  const validation = validateDraft(draft)
  return {
    ...draft,
    validation,
    errors: [...validation.critical, ...validation.warnings],
  }
}

function isProductFolder(name: string): boolean {
  return /^[A-Za-z0-9_ -]+$/.test(name) && !name.includes('.')
}

export default function ProductZipImporter() {
  const [drafts, setDrafts] = useState<DraftProduct[]>([])
  const [selectedDraft, setSelectedDraft] = useState<DraftProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [savingAll, setSavingAll] = useState(false)
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  })
  const [ignored, setIgnored] = useState<IgnoredRecord[]>([])
  const [showIgnored, setShowIgnored] = useState(false)
  const [autoSummary, setAutoSummary] = useState<{ processed: number; pending: number }>({
    processed: 0,
    pending: 0,
  })
  const [turboFill, setTurboFill] = useState(false)
  const [bulkCategories, setBulkCategories] = useState<string[]>([])

  const qc = useQueryClient()
  const { data: categoryData = [] } = useCategories()
  const categoryNames = useMemo(() => categoryData.map((c) => c.nome), [categoryData])

  const handleZipSelect = async (file: File | null) => {
    if (!file) return
    setLoading(true)
    setMessage('')
    drafts.forEach(cleanupDraftPreviews)
    setDrafts([])
    setSelectedDraft(null)
    setIgnored([])
    setShowIgnored(false)

    try {
      const zip = await JSZip.loadAsync(file)
      const folderIds = new Set<string>()

      zip.forEach((relativePath) => {
        if (!relativePath.includes('/')) return
        const [maybeId] = relativePath.split('/')
        if (!maybeId || maybeId.startsWith('__MACOSX')) return
        if (isProductFolder(maybeId)) {
          folderIds.add(maybeId)
        }
      })

      const nextIgnored: IgnoredRecord[] = []
      const seenIds = new Set<string>()
      const uniqueFolders: Array<{ raw: string; normalized: string }> = []

      for (const folderId of Array.from(folderIds)) {
        const normalized = folderId.toUpperCase()
        if (seenIds.has(normalized)) {
          nextIgnored.push({ id: normalized, reason: 'duplicate_in_zip' })
          continue
        }
        seenIds.add(normalized)
        uniqueFolders.push({ raw: folderId, normalized })
      }

      const existingDocs = await Promise.all(
        uniqueFolders.map(({ normalized }) => getDoc(doc(db, 'produtos', normalized)))
      )
      const alreadyExists = new Set<string>()
      existingDocs.forEach((snap, idx) => {
        if (snap.exists()) {
          const id = uniqueFolders[idx].normalized
          alreadyExists.add(id)
          nextIgnored.push({ id, reason: 'already_exists' })
        }
      })

      const nextDrafts: DraftProduct[] = []

      for (const { raw: rawId, normalized: id } of uniqueFolders) {
        if (alreadyExists.has(id)) continue

        const metaEntry = zip.file(`${rawId}/meta.json`)
        let meta: ZipMeta = {}
        if (metaEntry) {
          try {
            const raw = await metaEntry.async('string')
            meta = JSON.parse(raw)
          } catch (error) {
            console.warn(`Não foi possível ler meta.json de ${id}`, error)
          }
        }

        const imagesByColor: Record<string, ZipImageRef[]> = {}
        const imageEntries = zip.file(
          new RegExp(`^${rawId}/images/[^/]+/[^/]+\\.(jpe?g|png|webp)$`, 'i')
        )

        for (const entry of imageEntries) {
          const parts = entry.name.split('/')
          const colorFolder = parts[parts.length - 2] || ''
          const colorSlug = colorFolder ? colorToSlug(colorFolder) : 'geral'
          const isGeneral = colorSlug === 'geral'
          const isHidden = colorFolder.startsWith('_')
          if (isHidden) continue
          const key = isGeneral ? 'geral' : colorSlug
          const imageRef = await zipEntryToImageRef(entry)
          if (!imagesByColor[key]) imagesByColor[key] = []
          imagesByColor[key].push(imageRef)
        }

        const metaColors = (meta.colors || meta.cores || []) as string[]
        const folderColorSlugs = Object.keys(imagesByColor).filter(
          (key) => key !== 'geral'
        )
        const colors =
          metaColors.length > 0
            ? metaColors
            : folderColorSlugs.map((slug) => slugToLabel(slug))

        const selectedByColor: Record<string, string> = {}
        folderColorSlugs.forEach((slug) => {
          const first = imagesByColor[slug]?.[0]
          if (first) selectedByColor[slug] = first.path
        })

        const fallbackCover =
          imagesByColor['geral']?.[0]?.path ||
          Object.values(selectedByColor)[0] ||
          Object.values(imagesByColor).flat()[0]?.path

        const mainColorSlug =
          meta.mainColor ? colorToSlug(meta.mainColor) : folderColorSlugs.find((c) => c.includes('preto')) || folderColorSlugs[0]

        const draft: DraftProduct = {
          id,
          nome: meta.name ?? meta.nome ?? id,
          descricao: meta.description ?? meta.descricao ?? '',
          categorias: Array.isArray(meta.categorias) ? meta.categorias : [],
          destaque: Boolean(meta.destaque),
          colors,
          imagesByColor,
          selectedByColor: Object.keys(selectedByColor).length ? selectedByColor : undefined,
          coverPath: fallbackCover,
          mainColor: folderColorSlugs.length ? mainColorSlug : undefined,
          status: 'draft',
        }

        nextDrafts.push(withValidation(draft))
      }

      const autoFilled =
        turboFill && categoryNames.length
          ? nextDrafts.map((d) => autoFillDraft(d, categoryNames))
          : nextDrafts

      const finalDrafts = autoFilled.map(withValidation)

      setDrafts(finalDrafts)
      setIgnored(nextIgnored)
      setAutoSummary({
        processed: turboFill ? finalDrafts.length : 0,
        pending: turboFill ? finalDrafts.filter((d) => d.validation?.critical.length).length : 0,
      })

      if (!finalDrafts.length) {
        setMessage('Nenhum produto encontrado no ZIP.')
      }
    } catch (error) {
      console.error(error)
      setMessage('Não foi possível ler o ZIP. Confira o formato e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const resetImport = () => {
    drafts.forEach(cleanupDraftPreviews)
    setDrafts([])
    setSelectedDraft(null)
    setMessage('')
    setBulkProgress({ current: 0, total: 0 })
    setIgnored([])
    setShowIgnored(false)
    setAutoSummary({ processed: 0, pending: 0 })
  }

  const toggleDraftCategoryInline = (id: string, categoria: string) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d
        const set = new Set(d.categorias || [])
        if (set.has(categoria)) set.delete(categoria)
        else set.add(categoria)
        const merged = Array.from(set)
        return withValidation({ ...d, categorias: merged, status: d.status === "saved" ? "draft" : d.status })
      })
    )
  }

  const toggleBulkCategory = (categoria: string) => {
    setBulkCategories((prev) => {
      const set = new Set(prev)
      if (set.has(categoria)) set.delete(categoria)
      else set.add(categoria)
      return Array.from(set)
    })
  }

  const updateDraft = (nextDraft: DraftProduct) => {
    const normalized = nextDraft.validation ? nextDraft : withValidation(nextDraft)
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === nextDraft.id ? { ...normalized } : draft))
    )
    setSelectedDraft(null)
  }

  const removeDraft = (id: string) => {
    const draft = drafts.find((d) => d.id === id)
    if (draft) cleanupDraftPreviews(draft)
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }

  const updateDraftCategoriesInline = (id: string, categorias: string[]) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === id
          ? withValidation({ ...d, categorias, status: d.status === "saved" ? "draft" : d.status })
          : d
      )
    )
  }

  const applyCategoriesToAll = () => {
    if (!bulkCategories.length) return
    setDrafts((prev) =>
      prev.map((d) => {
        const merged = Array.from(new Set([...(d.categorias || []), ...bulkCategories]))
        return withValidation({ ...d, categorias: merged, status: d.status === "saved" ? "draft" : d.status })
      })
    )
  }

  const autoFillAll = () => {
    let processed = 0
    let pending = 0
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.status !== 'draft') return draft
        processed += 1
        const filled = autoFillDraft(draft, categoryNames)
        const validated = withValidation(filled)
        if (validated.validation?.critical.length) pending += 1
        return validated
      })
    )
    setAutoSummary({ processed, pending })
  }

  const uploadImagesAndSave = useCallback(
    async (draft: DraftProduct) => {
      const issues = validateDraft(draft)
      if (issues.critical.length) {
        throw new Error(issues.critical.join(' | '))
      }

      const uploadCache = new Map<string, string>()
      const uploadRef = async (
        ref: ZipImageRef,
        metadata: { folder: string; productId: string; type: 'main' | 'variation'; variation?: string }
      ) => {
        if (uploadCache.has(ref.path)) return uploadCache.get(ref.path) as string
        const id = await uploadToCloudflare(ref.file, metadata)
        uploadCache.set(ref.path, id)
        return id
      }

      const getSelectedRef = (slug: string): ZipImageRef | undefined => {
        const selectedPath = draft.selectedByColor?.[slug]
        if (selectedPath) {
          const found = findImageByPath(draft, selectedPath)
          if (found) return found
        }
        const images = draft.imagesByColor[slug]
        return images?.[0]
      }

      const colorEntries = (draft.colors || []).map((label) => ({
        label,
        slug: colorToSlug(label),
      }))

      const coverRef =
        findImageByPath(draft, draft.coverPath) ||
        findImageByPath(draft, draft.imagesByColor['geral']?.[0]?.path) ||
        findImageByPath(draft, getSelectedRef(colorEntries[0]?.slug)?.path)

      if (!coverRef) {
        throw new Error('Nenhuma imagem disponível para usar como capa.')
      }

      const imageIds: string[] = []
      const variations: ProductVariation[] = []

      const mainImageId = await uploadRef(coverRef, {
        folder: `produtos/${draft.id}`,
        productId: draft.id,
        type: 'main',
      })
      imageIds.push(mainImageId)

      for (const { label, slug } of colorEntries) {
        const ref = getSelectedRef(slug)
        if (!ref) continue
        const imageId = await uploadRef(ref, {
          folder: `produtos/${draft.id}/variacoes`,
          productId: draft.id,
          variation: slug,
          type: 'variation',
        })
        variations.push({
          cor: label,
          imagem_url: imageId,
          thumb_url: imageId,
        })
        imageIds.push(imageId)
      }

      const uniqueImageIds = Array.from(new Set(imageIds))

      const payload = {
        id: draft.id,
        nome: draft.nome,
        descricao: draft.descricao,
        categorias: draft.categorias,
        destaque: draft.destaque,
        variacoes: variations,
        imagem_url: mainImageId,
        thumb_url: mainImageId,
        imagens_urls: uniqueImageIds,
        thumbs_urls: uniqueImageIds,
        createdAt: serverTimestamp(),
      }

      await setDoc(doc(collection(db, 'produtos'), draft.id), payload)
    },
    []
  )

  const saveDraft = async (draft: DraftProduct) => {
    const validation = validateDraft(draft)
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draft.id
          ? {
              ...d,
              status: 'saving',
              validation,
              errors: [...validation.critical, ...validation.warnings],
            }
          : d
      )
    )

    try {
      await uploadImagesAndSave(draft)
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draft.id
            ? { ...d, status: 'saved', errors: [], validation: { critical: [], warnings: [] } }
            : d
        )
      )
      await qc.invalidateQueries({ queryKey: ['admin-products'] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar produto'
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draft.id ? { ...d, status: 'error', errors: [message] } : d
        )
      )
      throw error
    }
  }

  const saveAllValid = async () => {
    const validDrafts = drafts.filter((draft) => {
      const validation = draft.validation || validateDraft(draft)
      return (validation.critical?.length ?? 0) === 0
    })
    if (!validDrafts.length) return
    setSavingAll(true)
    setBulkProgress({ current: 0, total: validDrafts.length })

    for (let index = 0; index < validDrafts.length; index++) {
      const draft = validDrafts[index]
      try {
        await saveDraft(draft)
      } catch {
        // Continue saving others even if one fails
      } finally {
        setBulkProgress({ current: index + 1, total: validDrafts.length })
      }
    }

    setSavingAll(false)
  }

  const readyCount = useMemo(
    () =>
      drafts.filter((draft) => {
        const validation = draft.validation || validateDraft(draft)
        return (validation.critical?.length ?? 0) === 0
      }).length,
    [drafts]
  )

  const dropHandlers = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => e.preventDefault(),
    onDrop: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file && file.name.toLowerCase().endsWith('.zip')) {
        void handleZipSelect(file)
      }
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Importar lote via ZIP</p>
          <h2 className="text-xl font-title font-bold">Product ZIP Importer</h2>
          <p className="text-sm text-gray-500">
            Formato esperado: {'{ID}/meta.json'}, imagens em geral/ e {`{cor}`}/.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetImport}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Limpar importação
          </button>
          <label className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2 cursor-pointer hover:opacity-90">
            <UploadCloud size={16} />
            Selecionar ZIP
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => handleZipSelect(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center hover:border-primary transition-colors"
        {...dropHandlers}
      >
        <div className="flex flex-col items-center gap-2">
          <FileArchive className="text-gray-400" size={32} />
          <p className="text-sm text-gray-600">
            Arraste um arquivo .zip aqui ou clique em &quot;Selecionar ZIP&quot;
          </p>
          {loading && (
            <div className="flex items-center gap-2 text-primary text-sm">
              <Loader2 className="animate-spin" size={16} />
              Lendo ZIP...
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
        <span className="font-semibold">{drafts.length} produtos carregados</span>
        <span>{ignored.length} ignorados</span>
        {ignored.length > 0 && (
          <button
            type="button"
            onClick={() => setShowIgnored((v) => !v)}
            className="text-primary underline underline-offset-2"
          >
            {showIgnored ? 'Ocultar ignorados' : 'Ver ignorados'}
          </button>
        )}
      </div>

      {showIgnored && ignored.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 text-sm text-amber-800 space-y-2">
          {ignored.map((item) => (
            <div key={`${item.id}-${item.reason}`} className="flex items-center justify-between">
              <span className="font-semibold">{item.id}</span>
              <span className="text-xs uppercase tracking-wide">
                {item.reason === 'duplicate_in_zip' ? 'duplicate_in_zip' : 'already_exists'}
              </span>
            </div>
          ))}
        </div>
      )}

      {message && <p className="text-sm text-red-600">{message}</p>}

      {drafts.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ListChecks size={16} />
              {readyCount} prontos · {drafts.length} carregados
              {autoSummary.processed > 0 && (
                <span className="text-xs text-gray-500">
                  Auto-preenchidos: {autoSummary.processed} (pendentes: {autoSummary.pending})
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <button
                type="button"
                onClick={autoFillAll}
                title="Seleciona categorias, capa, cor principal e 1 foto por cor automaticamente"
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90"
              >
                <RefreshCw size={16} />
                Auto-preencher tudo
              </button>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={turboFill}
                  onChange={(e) => setTurboFill(e.target.checked)}
                  className="rounded"
                />
                Modo turbo (auto após import)
              </label>
              <button
                type="button"
                onClick={saveAllValid}
                disabled={savingAll || readyCount === 0}
                className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:opacity-90"
              >
                {savingAll ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Salvar todos válidos
                {savingAll && (
                  <span className="text-xs bg-white/20 rounded px-2 py-1">
                    {bulkProgress.current}/{bulkProgress.total}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Aplicar categorias a todos:</span>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-auto border border-gray-200 rounded p-2 bg-white">
                {categoryNames.map((cat) => {
                  const checked = bulkCategories.includes(cat)
                  return (
                    <label
                      key={cat}
                      className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded border ${
                        checked
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBulkCategory(cat)}
                        className="rounded"
                      />
                      {cat}
                    </label>
                  )
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={applyCategoriesToAll}
              disabled={!bulkCategories.length}
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:opacity-90"
            >
              <ListChecks size={16} />
              Aplicar categorias em massa
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {drafts.map((draft) => {
              const thumb = getThumbnail(draft)
              const validation = draft.validation || validateDraft(draft)
              const hasCritical = (validation.critical?.length ?? 0) > 0
              const hasWarnings = (validation.warnings?.length ?? 0) > 0
              return (
                <div
                  key={draft.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-20 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={draft.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center px-2">Sem imagem</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{draft.nome || draft.id}</h3>
                        {draft.status === 'saved' && (
                          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                            <CheckCircle2 size={14} />
                            Salvo
                          </span>
                        )}
                        {draft.status === 'saving' && (
                          <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full">
                            <Loader2 className="animate-spin" size={14} />
                            Salvando...
                          </span>
                        )}
                        {draft.status === 'error' && (
                          <span className="flex items-center gap-1 text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                            <AlertTriangle size={14} />
                            Erro
                          </span>
                        )}
                        {!hasCritical && draft.status === 'draft' && (
                          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                            <CheckCircle2 size={14} />
                            Pronto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">SKU: {draft.id}</p>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {(draft.colors || []).map((color) => {
                          const slug = colorToSlug(color)
                          return (
                            <span
                              key={color}
                              className={`text-[11px] px-2 py-1 rounded-full border ${
                                draft.mainColor === slug
                                  ? 'border-primary text-primary bg-primary/5'
                                  : 'border-gray-200 text-gray-600 bg-white'
                              }`}
                            >
                              {color}
                            </span>
                          )
                        })}
                      </div>
                    {draft.categorias?.length ? (
                      <div className="flex gap-2 flex-wrap mt-1">
                        {draft.categorias.map((cat) => (
                          <span
                            key={cat}
                            className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-white"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {categoryNames.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2 text-xs">
                        <p className="text-gray-600">Categorias (selecione quantas precisar):</p>
                        <div className="flex flex-wrap gap-2 max-h-28 overflow-auto border border-gray-200 rounded p-2 bg-white">
                          {categoryNames.map((cat) => {
                            const checked = (draft.categorias || []).includes(cat)
                            return (
                              <label
                                key={cat}
                                className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded border ${
                                  checked
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 text-gray-700 bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleDraftCategoryInline(draft.id, cat)}
                                  className="rounded"
                                />
                                {cat}
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                  {(hasCritical || hasWarnings) && (
                    <div className="flex flex-wrap gap-1">
                      {validation.critical?.map((issue) => (
                        <span
                          key={`c-${issue}`}
                          className="text-[11px] px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full"
                        >
                          {issue}
                        </span>
                      ))}
                      {validation.warnings?.map((issue) => (
                        <span
                          key={`w-${issue}`}
                          className="text-[11px] px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDraft(draft)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm flex items-center gap-2 hover:bg-white"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => saveDraft(draft)}
                      disabled={draft.status === 'saving'}
                      className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:opacity-90"
                    >
                      {draft.status === 'saving' ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDraft(draft.id)}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm flex items-center gap-2 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedDraft && (
        <ProductImportModal
          draft={selectedDraft}
          onClose={() => setSelectedDraft(null)}
          onSave={(draft) => {
            const validation = validateDraft(draft)
            updateDraft({
              ...draft,
              validation,
              errors: [...validation.critical, ...validation.warnings],
              status: 'draft',
            })
          }}
        />
      )}
    </div>
  )
}


