// Cliente API para Cloudflare Workers
import type { Product, Category } from '../../types/product';

const API_BASE = '/api';

export interface CatalogData {
  products: Product[];
  categories: Category[];
  layout: {
    logo?: string;
    banners: Array<{ url: string; alt?: string }>;
    promotions: string[];
    popups: string[];
    whatsapp?: string;
    companyInfo?: {
      title?: string;
      description: string;
    };
  };
  whatsapp?: string;
}

// Catalog
export async function fetchCatalog(limit = 100): Promise<CatalogData> {
  const response = await fetch(`${API_BASE}/catalog?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch catalog');
  return response.json();
}

// Products
export async function fetchProducts(limit = 100, offset = 0): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
}

// Upload
export async function uploadImage(file: File, metadata?: any): Promise<{ imageId: string; imageUrl: string; thumbUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload image');
  return response.json();
}

export async function deleteImage(imageId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId }),
  });
  if (!response.ok) throw new Error('Failed to delete image');
}
