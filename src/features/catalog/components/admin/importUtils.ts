import type { DraftProduct, ZipImageRef } from '../../../../types/product'

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  CHAVEIROS: ['CHAVEIRO', 'KEYRING', 'MOSQUETAO', 'MOSQUETÃO', 'ARGOLA'],
  CANETAS: ['CANETA', 'PEN', 'ESFERO'],
  KITS: ['KIT', 'CONJUNTO', 'COMBO'],
  CHURRASCO: ['CHURRASCO', 'GRELHA', 'ESPETO', 'TABUA', 'TÁBUA'],
  COZINHA: ['COZINHA', 'COPO', 'TAÇA', 'JARRA', 'FACA', 'GARFO', 'COLHER'],
  ESCRITORIO: ['ESCRITORIO', 'ESCRITÓRIO', 'CADERNO', 'BLOCO', 'AGENDA', 'POST-IT'],
  ECOLOGICOS: ['ECO', 'BAMBU', 'SUSTENTAVEL', 'SUSTENTÁVEL'],
  TECNOLOGIA: ['TECH', 'TECNOLOGIA', 'USB', 'PEN DRIVE', 'CARREGADOR', 'CABO'],
  MOCHILAS: ['MOCHILA', 'BOLSA', 'SACO', 'SACOLA', 'BAG'],
  VESTUARIO: ['CAMISETA', 'BONÉ', 'BONE', 'COLETE', 'JAQUETA', 'MOLETOM'],
  COPOS_E_GARRAFAS: [
    'COPO',
    'COPO S',
    'COPO DE',
    'COPOS',
    'GARRAFA',
    'GARRAFAS',
    'SQUEEZE',
    'GARRAFA TERMICA',
    'TUMBLER',
    'TAÇA',
    'MUG',
    'CANUDO',
    'VIDRO',
    'BAMBU',
    'INOX',
    'ACRILICO',
    'ACRÍLICO',
    'PLASTICO',
    'PLÁSTICO',
  ],
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

export function colorToSlug(color: string): string {
  return normalize(color)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function slugToLabel(slug: string): string {
  if (!slug) return ''
  return slug.replace(/[-_]+/g, ' ').trim().toUpperCase()
}

export function computeColorsFromImages(
  imagesByColor: Record<string, ZipImageRef[]>,
  fallbackColors: string[] = []
): string[] {
  const ordered = new Map<string, string>()

  fallbackColors.forEach((label) => {
    if (!label) return
    const slug = colorToSlug(label)
    if (!ordered.has(slug)) ordered.set(slug, label)
  })

  Object.entries(imagesByColor).forEach(([key, images]) => {
    if (key.toLowerCase() === 'geral') return
    if (!images?.length) return
    if (!ordered.has(key)) {
      ordered.set(key, slugToLabel(key))
    }
  })

  return Array.from(ordered.values())
}

export function autoPickCategories(
  draft: DraftProduct,
  categoriesMaster: string[]
): { categorias: string[]; categoryScores: Record<string, number> } {
  const text = normalize(`${draft.nome || ''} ${draft.descricao || ''}`)
  const scores: Record<string, number> = {}

  categoriesMaster.forEach((cat) => {
    const key = normalize(cat)
    const keyNoSpaces = key.replace(/\s+/g, '')
    const keyUnderscore = key.replace(/\s+/g, '_')
    const keywords =
      CATEGORY_KEYWORDS[key] ||
      CATEGORY_KEYWORDS[keyUnderscore] ||
      CATEGORY_KEYWORDS[keyNoSpaces] ||
      CATEGORY_KEYWORDS[keyNoSpaces.replace(/_/g, '')] ||
      []
    let score = 0

    // Hit by explicit keywords map
    keywords.forEach((kw) => {
      const nKw = normalize(kw)
      if (text.includes(nKw)) score += 2
    })

    if (score > 0) scores[cat] = score
  })

  const sorted = Object.entries(scores)
    .filter(([, s]) => s >= 2) // exige confiança mínima
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat)

  return { categorias: sorted, categoryScores: scores }
}

export function autoPickMainColor(draft: DraftProduct): string | undefined {
  const colors = draft.colors || []
  if (!colors.length) return undefined
  const normalized = colors.map((c) => ({ label: c, slug: colorToSlug(c) }))
  const hasPreto = normalized.find((c) => c.slug.includes('preto'))
  if (hasPreto) return hasPreto.slug
  return normalized[0]?.slug
}

export function autoSelectOnePerColor(draft: DraftProduct): Record<string, string> | undefined {
  const selected: Record<string, string> = { ...(draft.selectedByColor || {}) }

  (draft.colors || []).forEach((label) => {
    const slug = colorToSlug(label)
    const imagesRaw = draft.imagesByColor[slug]
    const images = Array.isArray(imagesRaw) ? imagesRaw : []
    if (!images.length) return
    if (!selected[slug] || !images.find((img) => img.path === selected[slug])) {
      selected[slug] = images[0].path
    }
  })

  return Object.keys(selected).length ? selected : undefined
}

export function autoPickCover(draft: DraftProduct): string | undefined {
  const mainColor = draft.mainColor
  const selected = draft.selectedByColor || {}
  if (mainColor && selected[mainColor]) {
    return selected[mainColor]
  }

  const colorEntries = draft.colors?.map((label) => colorToSlug(label)) || []
  for (const slug of colorEntries) {
    const selectedPath = selected[slug]
    if (selectedPath) return selectedPath
    const first = draft.imagesByColor[slug]?.[0]?.path
    if (first) return first
  }

  const general = draft.imagesByColor['geral']?.[0]?.path
  if (general) return general

  const any = Object.values(draft.imagesByColor).flat()[0]?.path
  return any
}

export function autoCompactDraft(draft: DraftProduct): DraftProduct {
  const selected = draft.selectedByColor || {}
  const keepPaths = new Set<string>()

  if (draft.coverPath) keepPaths.add(draft.coverPath)

  Object.entries(draft.imagesByColor).forEach(([slug, images]) => {
    const arr = Array.isArray(images) ? images : []
    const selectedPath = selected[slug] || arr[0]?.path
    if (selectedPath) keepPaths.add(selectedPath)
  })

  const nextImagesByColor: Record<string, ZipImageRef[]> = {}
  Object.entries(draft.imagesByColor).forEach(([slug, images]) => {
    const arr = Array.isArray(images) ? images : []
    const kept = arr.filter((img) => keepPaths.has(img.path))
    const removed = arr.filter((img) => !keepPaths.has(img.path))
    removed.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    if (kept.length) nextImagesByColor[slug] = kept
  })

  const nextSelected: Record<string, string> = {}
  Object.entries(selected).forEach(([slug, path]) => {
    if (keepPaths.has(path)) nextSelected[slug] = path
  })
  Object.entries(nextImagesByColor).forEach(([slug, images]) => {
    if (!nextSelected[slug] && images[0]) nextSelected[slug] = images[0].path
  })

  let coverPath = draft.coverPath && keepPaths.has(draft.coverPath) ? draft.coverPath : undefined
  if (!coverPath) {
    const firstKept = Array.from(keepPaths)[0]
    if (firstKept) coverPath = firstKept
  }

  const colors = computeColorsFromImages(nextImagesByColor, draft.colors)
  const mainColor = draft.mainColor || autoPickMainColor(draft)

  return {
    ...draft,
    imagesByColor: nextImagesByColor,
    selectedByColor: Object.keys(nextSelected).length ? nextSelected : undefined,
    coverPath,
    colors,
    mainColor,
  }
}

export function validateDraft(draft: DraftProduct): { critical: string[]; warnings: string[] } {
  const critical: string[] = []
  const warnings: string[] = []

  const allImages = Object.values(draft.imagesByColor).flat()
  if (!allImages.length) {
    critical.push('Sem imagens')
  }

  const colors = draft.colors || []
  const selected = draft.selectedByColor || {}
  colors.forEach((label) => {
    const slug = colorToSlug(label)
    const images = Array.isArray(draft.imagesByColor[slug]) ? draft.imagesByColor[slug] : []
    const selectedPath = selected[slug]
    const hasSelected = selectedPath && images.some((img) => img.path === selectedPath)
    if (!images.length || !hasSelected) {
      critical.push(`Cor sem imagem (${label})`)
    }
  })

  const coverIsValid = draft.coverPath && allImages.some((img) => img.path === draft.coverPath)
  if (!coverIsValid) {
    critical.push('Sem capa')
  }

  if (!draft.nome || draft.nome.trim().length < 3) {
    critical.push('Nome curto')
  }

  if (!draft.categorias?.length) {
    warnings.push('Sem categorias')
  }

  if (!draft.descricao || draft.descricao.trim().length < 20) {
    warnings.push('Descrição curta')
  }

  return { critical: Array.from(new Set(critical)), warnings: Array.from(new Set(warnings)) }
}

export function autoFillDraft(
  draft: DraftProduct,
  categoriesMaster: string[]
): DraftProduct {
  const filled: DraftProduct = { ...draft }

  if (!filled.categorias || filled.categorias.length === 0) {
    const { categorias, categoryScores } = autoPickCategories(filled, categoriesMaster)
    filled.categorias = categorias
    filled.categoryScores = categoryScores
  }

  const validation = validateDraft(filled)

  return {
    ...filled,
    validation,
    errors: [...validation.critical, ...validation.warnings],
  }
}
