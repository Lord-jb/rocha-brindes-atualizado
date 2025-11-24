// src/pages/api/scrape-products.ts
import type { APIRoute } from 'astro'

export const prerender = false // Adicionar esta linha

export const POST: APIRoute = async ({ request }) => {
  console.log('[SCRAPE-PRODUCTS] Iniciando...')
  
  try {
    // Ler o body como text primeiro para debug
    const bodyText = await request.text()
    console.log('[SCRAPE-PRODUCTS] Body recebido:', bodyText)
    
    let body
    try {
      body = bodyText ? JSON.parse(bodyText) : {}
    } catch (e) {
      console.error('[SCRAPE-PRODUCTS] Erro ao parsear JSON:', e)
      return new Response(JSON.stringify({ 
        error: 'JSON inválido',
        receivedBody: bodyText
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const { url } = body
    
    console.log('[SCRAPE-PRODUCTS] URL recebida:', url)

    if (!url) {
      return new Response(JSON.stringify({ 
        error: 'URL não fornecida' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    })

    console.log('[SCRAPE-PRODUCTS] Status da resposta:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    console.log('[SCRAPE-PRODUCTS] HTML recebido, tamanho:', html.length)

    const productIds = new Set<string>()
    const baseUrl = 'https://www.xbzbrindes.com.br/'

    // Padrão 1: IDs de 5 dígitos começando com 0
    const idRegex = /(?:data-id|id|href)=["']\/?(0\d{4})["']/gi
    let match
    
    while ((match = idRegex.exec(html)) !== null) {
      const id = match[1]
      if (id && /^0\d{4}$/.test(id)) {
        productIds.add(id)
      }
    }

    // Padrão 2: Links diretos
    const linkRegex = /<a[^>]*href=["']([^"']*\/?(0\d{4}))["'][^>]*>/gi
    while ((match = linkRegex.exec(html)) !== null) {
      const id = match[2] || match[1].split('/').pop()
      if (id && /^0\d{4}$/.test(id)) {
        productIds.add(id)
      }
    }

    // Padrão 3: onclick
    const onclickRegex = /onclick=["'][^"']*\/(0\d{4})[^"']*["']/gi
    while ((match = onclickRegex.exec(html)) !== null) {
      const id = match[1]
      if (id && /^0\d{4}$/.test(id)) {
        productIds.add(id)
      }
    }

    // Padrão 4: window.location
    const locationRegex = /window\.location[^=]*=["'][^"']*(0\d{4})[^"']*["']/gi
    while ((match = locationRegex.exec(html)) !== null) {
      const id = match[1]
      if (id && /^0\d{4}$/.test(id)) {
        productIds.add(id)
      }
    }

    const productUrls = Array.from(productIds).map(id => `${baseUrl}${id}`)

    console.log('[SCRAPE-PRODUCTS] IDs encontrados:', Array.from(productIds).slice(0, 10))
    console.log('[SCRAPE-PRODUCTS] Total de produtos:', productUrls.length)

    return new Response(JSON.stringify({ 
      productUrls: productUrls.slice(0, 100),
      debug: {
        idsFound: Array.from(productIds).slice(0, 10),
        totalProducts: productUrls.length
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[SCRAPE-PRODUCTS] ERRO:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    const errorStack = error instanceof Error ? error.stack : ''
    
    console.error('[SCRAPE-PRODUCTS] Stack:', errorStack)

    return new Response(JSON.stringify({ 
      error: 'Erro ao buscar produtos',
      message: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}