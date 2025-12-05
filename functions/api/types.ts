// Types para Workers API
export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  CACHE: KVNamespace;
  SESSIONS: KVNamespace;
  CLOUDFLARE_ACCOUNT_HASH: string;
}

export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  cor?: string;
  imagem_url: string;
  thumb_url?: string;
  destaque: boolean;
  categorias: string[];
  imagens_urls: string[];
  thumbs_urls?: string[];
  variacoes?: ProductVariation[];
  created_at: number;
  updated_at: number;
}

export interface ProductVariation {
  cor: string;
  imagem_url: string;
  thumb_url?: string;
}

export interface Category {
  id: string;
  nome: string;
  image_path?: string;
  popular: boolean;
  descricao?: string;
  video_url?: string;
  ordem: number;
}

export interface LayoutConfig {
  logo?: string;
  banners: Array<{ url: string; alt?: string }>;
  promotions: string[];
  popups: string[];
  whatsapp?: string;
  companyInfo?: {
    title?: string;
    description: string;
  };
}
