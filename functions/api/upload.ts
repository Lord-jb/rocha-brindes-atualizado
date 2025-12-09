// API endpoint para upload de imagens no R2
import type { EventContext } from '@cloudflare/workers-types';
import type { Env } from './types';

export const onRequestPost = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    // TODO: Adicionar verificação de autenticação

    const formData = await request.formData();
    const fileEntry = formData.get('file');

    if (!fileEntry || typeof fileEntry === 'string') {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const file = fileEntry as File;

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

export const onRequestDelete = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    // TODO: Adicionar verificação de autenticação

    const body = await request.json() as { imageId?: string };
    const imageId = body.imageId;

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
