// FILE: src/types/product.ts
export interface Product {
  id: string
  nome: string
  descricao?: string
  cor?: string
  categorias: string[]
  imagens_urls: string[]
  thumbs_urls?: string[]
  imagem_url: string
  thumb_url?: string 
  variacoes?: ProductVariation[]
  destaque?: boolean
  createdAt: Date
}

export interface ProductVariation {
  cor: string
  imagem_url: string
  thumb_url?: string
}

export interface Category {
  id: string
  nome: string
  imagePath?: string
  popular?: boolean
  descricao?: string
  videoUrl?: string
}

export interface LayoutConfig {
  logo: string
  banners: { url: string; alt?: string }[]
  whatsapp?: string
  companyInfo?: {
    title?: string
    description: string
  }
}

// Draft/import helpers for ZIP importer (does not change existing Product schema)
export type ZipImageRef = {
  path: string
  file: File
  previewUrl: string
}

export type DraftProduct = {
  id: string
  nome: string
  descricao: string
  categorias: string[]
  destaque: boolean
  colors: string[]
  imagesByColor: Record<string, ZipImageRef[]>
  selectedByColor?: Record<string, string>
  coverPath?: string
  mainColor?: string
  categoryScores?: Record<string, number>
  validation?: {
    critical: string[]
    warnings: string[]
  }
  status: 'draft' | 'saving' | 'saved' | 'error'
  errors?: string[]
}
