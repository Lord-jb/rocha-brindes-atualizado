// API endpoint para upload de imagens no R2
import type { PagesFunction } from '@cloudflare/workers-types';
import type { Env } from './types';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // TODO: Adicionar verificação de autenticação

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Gerar ID único para a imagem
    const imageId = crypto.randomUUID();
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${imageId}.${ext}`;

    // Fazer upload para R2
    await env.IMAGES.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Retornar URL otimizada via Cloudflare Images
    const imageUrl = `https://imagedelivery.net/${env.CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
    const thumbUrl = `https://imagedelivery.net/${env.CLOUDFLARE_ACCOUNT_HASH}/${imageId}/thumbnail`;

    return new Response(JSON.stringify({
      success: true,
      imageId,
      imageUrl,
      thumbUrl,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // TODO: Adicionar verificação de autenticação

    const { imageId } = await request.json();

    if (!imageId) {
      return new Response(JSON.stringify({ error: 'No imageId provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Deletar do R2
    await env.IMAGES.delete(`${imageId}.jpg`);
    await env.IMAGES.delete(`${imageId}.png`);
    await env.IMAGES.delete(`${imageId}.webp`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
