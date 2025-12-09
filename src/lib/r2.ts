// ==========================================
// HELPERS PARA CLOUDFLARE R2
// Funções para upload e gerenciamento de imagens
// ==========================================

import type { Env } from '@/types';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

// ==========================================
// UPLOAD DE IMAGENS
// ==========================================

export async function uploadImageToR2(
  env: Env,
  file: File,
  folder: string = 'products'
): Promise<UploadResult> {
  try {
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Tipo de arquivo não permitido. Use: JPG, PNG, WEBP ou GIF',
      };
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Arquivo muito grande. Tamanho máximo: 5MB',
      };
    }

    // Gerar nome único
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().split('-')[0];
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomId}.${ext}`;
    const key = `${folder}/${filename}`;

    // Fazer upload para R2
    await env.R2.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        folder: folder,
      },
    });

    // URL pública (você precisa configurar um domínio custom no R2)
    // Ou usar o domínio padrão do R2
    const url = `${env.BASE_URL}/images/${key}`;

    return {
      success: true,
      url,
      key,
    };
  } catch (error: any) {
    console.error('Erro ao fazer upload para R2:', error);
    return {
      success: false,
      error: error.message || 'Erro ao fazer upload',
    };
  }
}

// ==========================================
// UPLOAD MÚLTIPLO
// ==========================================

export async function uploadMultipleImagesToR2(
  env: Env,
  files: File[],
  folder: string = 'products'
): Promise<UploadResult[]> {
  const uploads = files.map((file) => uploadImageToR2(env, file, folder));
  return Promise.all(uploads);
}

// ==========================================
// DELETAR IMAGEM
// ==========================================

export async function deleteImageFromR2(env: Env, key: string): Promise<boolean> {
  try {
    await env.R2.delete(key);
    return true;
  } catch (error) {
    console.error('Erro ao deletar imagem do R2:', error);
    return false;
  }
}

// ==========================================
// DELETAR MÚLTIPLAS IMAGENS
// ==========================================

export async function deleteMultipleImagesFromR2(env: Env, keys: string[]): Promise<boolean> {
  try {
    await Promise.all(keys.map((key) => env.R2.delete(key)));
    return true;
  } catch (error) {
    console.error('Erro ao deletar imagens do R2:', error);
    return false;
  }
}

// ==========================================
// OBTER IMAGEM
// ==========================================

export async function getImageFromR2(env: Env, key: string): Promise<R2ObjectBody | null> {
  try {
    const object = await env.R2.get(key);
    return object;
  } catch (error) {
    console.error('Erro ao buscar imagem do R2:', error);
    return null;
  }
}

// ==========================================
// LISTAR IMAGENS DE UMA PASTA
// ==========================================

export async function listImagesFromR2(
  env: Env,
  folder: string = 'products',
  limit: number = 100
): Promise<string[]> {
  try {
    const list = await env.R2.list({
      prefix: `${folder}/`,
      limit: limit,
    });

    return list.objects.map((obj) => obj.key);
  } catch (error) {
    console.error('Erro ao listar imagens do R2:', error);
    return [];
  }
}

// ==========================================
// UTILITÁRIOS
// ==========================================

// Extrair key da URL
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/images/');
    return pathParts[1] || null;
  } catch {
    return null;
  }
}

// Validar se é uma imagem
export function isValidImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(file.type);
}

// Obter extensão do arquivo
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Gerar thumbnail name
export function getThumbnailKey(key: string): string {
  const parts = key.split('.');
  const ext = parts.pop();
  return `${parts.join('.')}_thumb.${ext}`;
}
