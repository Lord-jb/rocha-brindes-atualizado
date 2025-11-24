import { useEffect, useMemo, useState } from 'react'
import { X, Trash2, AlertTriangle, Plus } from 'lucide-react'
import { useCategories } from '../../../../core/hooks/useCategories'
import type { DraftProduct, ZipImageRef } from '../../../../types/product'
import {
  colorToSlug,
  computeColorsFromImages,
  validateDraft,
  autoCompactDraft,
} from './importUtils'

interface Props {
  draft: DraftProduct | null
  onClose: () => void
  onSave: (draft: DraftProduct) => void
}

type DraggingImage = {
  path: string
  fromColor: string
}

function revokePreview(url?: string) {
  if (url) URL.revokeObjectURL(url)
}

function createImageRef(file: File): ZipImageRef {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()
  const path = `local:${id}`
  return {
    path,
    file,
    previewUrl: URL.createObjectURL(file),
  }
}

export default function ProductImportModal({ draft, onClose, onSave }: Props) {
  const [localDraft, setLocalDraft] = useState<DraftProduct | null>(draft)
  const [newColor, setNewColor] = useState('')
  const [colorError, setColorError] = useState('')
  const [draggingImage, setDraggingImage] = useState<DraggingImage | null>(null)
  const { data: categories = [] } = useCategories()

  useEffect(() => {
    setLocalDraft(draft)
    setNewColor('')
    setColorError('')
    setDraggingImage(null)
  }, [draft])

  const colorOptions = useMemo(() => {
    if (!localDraft) return []
    return (localDraft.colors || []).map((label) => ({
      label,
      slug: colorToSlug(label),
    }))
  }, [localDraft])

  const colorSlugs = useMemo(() => {
    if (!localDraft) return []
    const set = new Set<string>()
    colorOptions.forEach((c) => set.add(c.slug))
    Object.keys(localDraft.imagesByColor || {}).forEach((key) => {
      if (key !== 'geral') set.add(key)
    })
    return Array.from(set)
  }, [localDraft, colorOptions])

  const validation = useMemo(
    () => (localDraft ? validateDraft(localDraft) : { critical: [], warnings: [] }),
    [localDraft]
  )

  if (!draft || !localDraft) return null

  const getColorLabel = (slug: string) =>
    colorOptions.find((c) => c.slug === slug)?.label || slug.replace(/[-_]+/g, ' ').toUpperCase()

  const updateMainColor = (nextColors: string[], currentMain?: string) => {
    if (currentMain && nextColors.some((label) => colorToSlug(label) === currentMain)) {
      return currentMain
    }
    return nextColors[0] ? colorToSlug(nextColors[0]) : undefined
  }

  const handleCategoryToggle = (name: string) => {
    setLocalDraft((prev) => {
      if (!prev) return prev
      const alreadySelected = prev.categorias.includes(name)
      const nextCategories = alreadySelected
        ? prev.categorias.filter((c) => c !== name)
        : [...prev.categorias, name]

      return {
        ...prev,
        categorias: nextCategories,
      }
    })
  }

  const handleAddColor = () => {
    if (!localDraft) return
    const raw = newColor.trim()
    if (!raw) return
    const label = raw.toUpperCase()
    const slug = colorToSlug(label)
    const existingSlug = colorSlugs.includes(slug)

    if (!slug || existingSlug) {
      setColorError('Cor jÃ¡ existe ou invÃ¡lida')
      return
    }

    setColorError('')
    setLocalDraft((prev) => {
      if (!prev) return prev
      const imagesByColor = { ...prev.imagesByColor }
      imagesByColor[slug] = imagesByColor[slug] || []

      const nextColors = [...prev.colors, label]
      const nextMainColor = updateMainColor(nextColors, prev.mainColor)

      return {
        ...prev,
        colors: nextColors,
        imagesByColor,
        selectedByColor: { ...(prev.selectedByColor || {}) },
        mainColor: nextMainColor,
      }
    })
    setNewColor('')
  }

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>, colorSlug: string) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'))

    if (files.length) {
      const refs = files.map(createImageRef)
      setLocalDraft((prev) => {
        if (!prev) return prev

        const current = prev.imagesByColor[colorSlug] || []
        const nextImages = [...current, ...refs]
        const nextImagesByColor = { ...prev.imagesByColor, [colorSlug]: nextImages }

        const nextSelected = { ...(prev.selectedByColor || {}) }
        if (!nextSelected[colorSlug] && nextImages[0]) {
          nextSelected[colorSlug] = nextImages[0].path
        }

        const nextCover =
          prev.coverPath ||
          refs[0]?.path ||
          (prev.coverPath && current.some((img) => img.path === prev.coverPath)
            ? prev.coverPath
            : undefined)

        const nextColors =
          colorSlug === 'geral' ? prev.colors : computeColorsFromImages(nextImagesByColor, prev.colors)
        const nextMainColor = updateMainColor(nextColors, prev.mainColor)

        return {
          ...prev,
          imagesByColor: nextImagesByColor,
          selectedByColor: Object.keys(nextSelected).length ? nextSelected : undefined,
          coverPath: nextCover,
          colors: nextColors,
          mainColor: nextMainColor,
        }
      })
    } else if (draggingImage && draggingImage.fromColor !== colorSlug) {
      handleMoveImage(draggingImage.path, draggingImage.fromColor, colorSlug)
    }

    setDraggingImage(null)
  }

  const handleMoveImage = (path: string, fromColor: string, toColor: string) => {
    setLocalDraft((prev) => {
      if (!prev) return prev
      const fromImages = prev.imagesByColor[fromColor] || []
      const moving = fromImages.find((img) => img.path === path)
      if (!moving) return prev

      const remaining = fromImages.filter((img) => img.path !== path)
      const toImages = prev.imagesByColor[toColor] || []

      const nextImagesByColor = {
        ...prev.imagesByColor,
        [fromColor]: remaining,
        [toColor]: [...toImages, moving],
      }
      if (!remaining.length) delete nextImagesByColor[fromColor]

      const nextSelected = { ...(prev.selectedByColor || {}) }
      if (nextSelected[fromColor] === path) {
        if (remaining[0]) {
          nextSelected[fromColor] = remaining[0].path
        } else {
          delete nextSelected[fromColor]
        }
      }
      if (!nextSelected[toColor]) nextSelected[toColor] = path

      return {
        ...prev,
        imagesByColor: nextImagesByColor,
        selectedByColor: Object.keys(nextSelected).length ? nextSelected : undefined,
      }
    })
  }

  const handleRemoveImage = (colorSlug: string, path: string) => {
    setLocalDraft((prev) => {
      if (!prev) return prev
      const images = prev.imagesByColor[colorSlug] || []
      const target = images.find((img) => img.path === path)
      const updatedImages = images.filter((img) => img.path !== path)

      const nextImagesByColor = { ...prev.imagesByColor }
      if (updatedImages.length) {
        nextImagesByColor[colorSlug] = updatedImages
      } else {
        delete nextImagesByColor[colorSlug]
      }

      const nextSelected = { ...(prev.selectedByColor || {}) }
      if (nextSelected[colorSlug] === path) {
        if (updatedImages[0]) {
          nextSelected[colorSlug] = updatedImages[0].path
        } else {
          delete nextSelected[colorSlug]
        }
      }

      const flattened = Object.values(nextImagesByColor).flat()
      const nextCover =
        prev.coverPath && prev.coverPath !== path
          ? prev.coverPath
          : flattened[0]?.path || undefined

      const nextColors = computeColorsFromImages(nextImagesByColor, prev.colors)
      const nextMainColor = updateMainColor(nextColors, prev.mainColor)

      revokePreview(target?.previewUrl)

      return {
        ...prev,
        imagesByColor: nextImagesByColor,
        selectedByColor: Object.keys(nextSelected).length ? nextSelected : undefined,
        coverPath: nextCover,
        colors: nextColors,
        mainColor: nextMainColor,
      }
    })
  }

  const handleSelectForColor = (colorSlug: string, path: string) => {
    setLocalDraft((prev) => {
      if (!prev) return prev
      const nextSelected = { ...(prev.selectedByColor || {}) }
      nextSelected[colorSlug] = path
      return {
        ...prev,
        selectedByColor: nextSelected,
      }
    })
  }

  const handleSetCover = (colorSlug: string, path: string) => {
    setLocalDraft((prev) => {
      if (!prev) return prev
      const nextMain = colorSlug !== 'geral' ? colorSlug : prev.mainColor
      return {
        ...prev,
        coverPath: path,
        mainColor: nextMain,
      }
    })
  }

  const handleSave = () => {
    if (!localDraft) return
    const colors = computeColorsFromImages(localDraft.imagesByColor, localDraft.colors)
    const normalizedMainColor = updateMainColor(colors, localDraft.mainColor)

    const prepared: DraftProduct = {
      ...localDraft,
      colors,
      mainColor: normalizedMainColor,
    }

    const compacted = autoCompactDraft(prepared)
    const validationAfter = validateDraft(compacted)

    onSave({
      ...compacted,
      status: 'draft',
      validation: validationAfter,
      errors: [...validationAfter.critical, ...validationAfter.warnings],
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div>
            <p className="text-sm text-gray-500">Revisar produto importado</p>
            <h2 className="text-xl font-title font-bold">{localDraft.nome || localDraft.id}</h2>
          </div>
          <button
            onClick={() => {
              onClose()
            }}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[80vh] p-6 space-y-6">
          {(validation.critical.length > 0 || validation.warnings.length > 0) && (
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <AlertTriangle className="text-amber-500" size={18} />
              {validation.critical.map((issue) => (
                <span
                  key={`c-${issue}`}
                  className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200"
                >
                  {issue}
                </span>
              ))}
              {validation.warnings.map((issue) => (
                <span
                  key={`w-${issue}`}
                  className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                >
                  {issue}
                </span>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nome</label>
              <input
                type="text"
                value={localDraft.nome}
                onChange={(e) =>
                  setLocalDraft((prev) => (prev ? { ...prev, nome: e.target.value } : prev))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">ID/SKU</label>
              <input
                type="text"
                value={localDraft.id}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">DescriÃ§Ã£o</label>
            <textarea
              value={localDraft.descricao}
              onChange={(e) =>
                setLocalDraft((prev) => (prev ? { ...prev, descricao: e.target.value } : prev))
              }
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
                    checked={localDraft.categorias.includes(cat.nome)}
                    onChange={() => handleCategoryToggle(cat.nome)}
                    className="rounded"
                  />
                  <span className="text-sm">{cat.nome}</span>
                </label>
              ))}
            </div>
            {localDraft.categoryScores && (
              <div className="mt-2 text-xs text-gray-600 space-y-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="font-semibold text-gray-700">Motivo da categoria</p>
                {Object.entries(localDraft.categoryScores)
                  .filter(([, score]) => score > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, score]) => (
                    <p key={cat}>
                      {cat}: score {score}
                    </p>
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localDraft.destaque}
                onChange={(e) =>
                  setLocalDraft((prev) =>
                    prev ? { ...prev, destaque: e.target.checked } : prev
                  )
                }
                className="rounded"
              />
              <span className="text-sm font-semibold">Produto em destaque</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Cor principal</span>
              <select
                value={localDraft.mainColor || ''}
                onChange={(e) =>
                  setLocalDraft((prev) =>
                    prev ? { ...prev, mainColor: e.target.value || undefined } : prev
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">Usar imagem geral</option>
                {colorOptions.map((color) => (
                  <option key={color.slug} value={color.slug}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Cores</span>
              {colorError && <span className="text-xs text-red-500">{colorError}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Nova cor (ex: VERMELHO)"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90"
              >
                <Plus size={16} />
                Adicionar cor
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="border border-gray-200 rounded-lg p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropFiles(e, 'geral')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Imagens gerais</span>
                {localDraft.coverPath && localDraft.imagesByColor['geral']?.some((img) => img.path === localDraft.coverPath) && (
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                    Capa
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(localDraft.imagesByColor['geral'] || []).map((image, idx) => (
                  <div
                    key={`${image.path}-${idx}`}
                    draggable
                    onDragStart={() => setDraggingImage({ path: image.path, fromColor: 'geral' })}
                    onDragEnd={() => setDraggingImage(null)}
                    className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={image.previewUrl}
                      alt={`geral-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                      {localDraft.coverPath === image.path && (
                        <span className="self-start text-[11px] bg-primary text-white px-2 py-1 rounded-full">
                          Capa
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetCover('geral', image.path)}
                        className="flex-1 bg-white/80 hover:bg-white text-xs rounded px-2 py-1"
                      >
                        Definir como capa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('geral', image.path)}
                        className="bg-white/80 hover:bg-white text-red-600 p-1 rounded"
                        aria-label="Remover imagem"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Solte imagens aqui para adicionar ao geral.</p>
            </div>

            {colorSlugs.map((colorSlug) => {
              const images = localDraft.imagesByColor[colorSlug] || []
              const selectedPath = localDraft.selectedByColor?.[colorSlug]
              const label = getColorLabel(colorSlug)
              const isMain = localDraft.mainColor === colorSlug

              return (
                <div
                  key={colorSlug}
                  className="border border-gray-200 rounded-lg p-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropFiles(e, colorSlug)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold capitalize">{`Cor: ${label}`}</span>
                      {isMain && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                          Principal
                        </span>
                      )}
                      {localDraft.coverPath &&
                        images.some((img) => img.path === localDraft.coverPath) && (
                          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                            Capa
                          </span>
                        )}
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="main-color"
                        checked={localDraft.mainColor === colorSlug}
                        onChange={() =>
                          setLocalDraft((prev) =>
                            prev ? { ...prev, mainColor: colorSlug } : prev
                          )
                        }
                      />
                      Usar como principal
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((image, idx) => (
                      <div
                        key={`${image.path}-${idx}`}
                        draggable
                        onDragStart={() => setDraggingImage({ path: image.path, fromColor: colorSlug })}
                        onDragEnd={() => setDraggingImage(null)}
                        className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border ${selectedPath === image.path ? 'border-primary' : ''}`}
                      >
                        <img
                          src={image.previewUrl}
                          alt={`${colorSlug}-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                          {selectedPath === image.path && (
                            <span className="self-start text-[11px] bg-primary text-white px-2 py-1 rounded-full">
                              Usada na cor
                            </span>
                          )}
                          {localDraft.coverPath === image.path && (
                            <span className="self-end text-[11px] bg-primary text-white px-2 py-1 rounded-full">
                              Capa
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleSelectForColor(colorSlug, image.path)}
                            className="bg-white/80 hover:bg-white text-xs rounded px-2 py-1"
                          >
                            Usar para esta cor
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetCover(colorSlug, image.path)}
                              className="flex-1 bg-white/80 hover:bg-white text-xs rounded px-2 py-1"
                            >
                              Definir como capa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(colorSlug, image.path)}
                              className="bg-white/80 hover:bg-white text-red-600 p-1 rounded"
                              aria-label="Remover imagem"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!images.length && (
                      <div className="col-span-full text-xs text-gray-500">
                        Solte imagens aqui para esta cor.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90"
            type="button"
          >
            Salvar alteraÃ§Ãµes
          </button>
        </div>
      </div>
    </div>
  )
}
