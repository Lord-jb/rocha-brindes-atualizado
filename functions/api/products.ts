// API endpoint para produtos
import type { EventContext } from '@cloudflare/workers-types';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './db';
import type { Env, Product } from './types';

export const onRequestGet = async ({ request, env, params }: EventContext<Env, any, Record<string, any>>) => {
  const url = new URL(request.url);
  const id = params.id as string | undefined;

  try {
    if (id) {
      const product = await getProductById(env, id);
      if (!product) {
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(product), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const products = await getProducts(env, limit, offset);

    return new Response(JSON.stringify(products), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async ({ request, env }: EventContext<Env, any, Record<string, any>>) => {
  try {
    // TODO: Adicionar verificação de autenticação
    const body = await request.json() as Partial<Product>;
    const product = await createProduct(env, body);

    return new Response(JSON.stringify(product), {
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

export const onRequestPut = async ({ request, env, params }: EventContext<Env, any, Record<string, any>>) => {
  try {
    // TODO: Adicionar verificação de autenticação
    const id = params.id as string;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json() as Partial<Product>;
    const product = await updateProduct(env, id, body);

    return new Response(JSON.stringify(product), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestDelete = async ({ env, params }: EventContext<Env, any, Record<string, any>>) => {
  try {
    // TODO: Adicionar verificação de autenticação
    const id = params.id as string;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await deleteProduct(env, id);

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
