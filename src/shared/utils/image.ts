// src/shared/utils/image.ts - CORRIGIR preload

const CLOUDFLARE_ACCOUNT_HASH = 'iem94FVEkj3Qjv3DsJXpbQ'

export function optimizeUrl(imageId: string, variant: 'public' | 'thumbnail' | 'original' = 'public'): string {
  if (!imageId) return ''
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) return imageId
  if (imageId.startsWith('blob:') || imageId.startsWith('data:')) return imageId
  
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`
}

export function preloadImage(imageId: string, priority: 'high' | 'low' = 'high') {
  if (typeof window === 'undefined') return
  if (!imageId) return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.fetchPriority = priority
  link.href = optimizeUrl(imageId, 'public')
  
  // Remove o preload após carregar para evitar o warning
  link.onload = () => {
    setTimeout(() => link.remove(), 100)
  }
  
  document.head.appendChild(link)
}

// Remover preload - não é necessário e causa warnings
export function preloadCriticalImages(imageIds: string[]) {
  // Função vazia - preload será feito automaticamente pelo navegador
  return
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}