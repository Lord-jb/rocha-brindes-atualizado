// src/pages/api/scrape-product-detail.ts
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  console.log('[SCRAPE-DETAIL] Iniciando...')
  
  try {
    const bodyText = await request.text()
    
    let body
    try {
      body = bodyText ? JSON.parse(bodyText) : {}
    } catch (e) {
      console.error('[SCRAPE-DETAIL] Erro ao parsear JSON:', e)
      return new Response(JSON.stringify({ 
        error: 'JSON inválido' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const { url } = body
    
    console.log('[SCRAPE-DETAIL] URL:', url)

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Referer': 'https://www.xbzbrindes.com.br/'
      }
    })

    console.log('[SCRAPE-DETAIL] Status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    console.log('[SCRAPE-DETAIL] HTML recebido, tamanho:', html.length)

    // Extrair ID
    const urlParts = url.split('/')
    let id = (urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]).toUpperCase()
    
    // Tentar do H1
    const idH1Match = html.match(/<h1[^>]*id=["']item_referencia["'][^>]*>([^<]+)<\/h1>/i)
    if (idH1Match) {
      id = idH1Match[1].trim().toUpperCase()
    }
    console.log('[SCRAPE-DETAIL] ID:', id)

    // Extrair nome
    let nome = id
    let nomeMatch = html.match(/<[^>]*class=["'][^"']*produto-nome[^"']*["'][^>]*>([^<]+)</i)
    if (nomeMatch) {
      nome = nomeMatch[1].trim()
    } else {
      nomeMatch = html.match(/<title>([^<]+)<\/title>/i)
      if (nomeMatch) {
        nome = nomeMatch[1]
          .replace(/\s*-\s*XBZ\s*Brindes.*$/i, '')
          .replace(/\s*\|\s*.*$/i, '')
          .trim()
      }
    }
    console.log('[SCRAPE-DETAIL] Nome:', nome)

    // Extrair descrição
    let descricao = ''
    const descMatch = html.match(/<div[^>]*class=["'][^"']*(?:my-desc-sub|desc-sub)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    if (descMatch) {
      descricao = descMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .trim()
        .substring(0, 500)
    }
    console.log('[SCRAPE-DETAIL] Descrição:', descricao.substring(0, 100))

    // Extrair cores
    const cores: string[] = []
    const imagensPorCor: Record<string, string[]> = {}

    // Buscar swatches de cor
    const colorRegex = /<img[^>]*class=["'][^"']*(?:imagem_cor|cor)[^"']*["'][^>]*(?:alt|title)=["']([^"']+)["'][^>]*>/gi
    let colorMatch
    
    while ((colorMatch = colorRegex.exec(html)) !== null) {
      const cor = colorMatch[1].trim().toUpperCase()
      if (cor && !cores.includes(cor)) {
        cores.push(cor)
        imagensPorCor[cor] = []
        console.log('[SCRAPE-DETAIL] Cor encontrada:', cor)
      }
    }

    // Extrair TODAS as imagens (ignorar timthumb, pegar originais)
    const todasImagens: string[] = []
    
    // Padrão 1: data-src ou data-original (lazy load)
    const imgDataRegex = /<img[^>]*(?:data-src|data-original)=["']([^"']+)["'][^>]*>/gi
    let imgMatch
    
    while ((imgMatch = imgDataRegex.exec(html)) !== null) {
      let imgUrl = imgMatch[1]
      
      // Pular timthumb e pegar imagem original
      if (imgUrl.includes('timthumb.php')) {
        const srcMatch = imgUrl.match(/[?&]src=([^&]+)/)
        if (srcMatch) {
          imgUrl = decodeURIComponent(srcMatch[1])
        }
      }
      
      if (!imgUrl.startsWith('http')) {
        imgUrl = new URL(imgUrl, url).href
      }
      
      if (imgUrl.includes('/img/produtos/') && !todasImagens.includes(imgUrl)) {
        todasImagens.push(imgUrl)
      }
    }

    // Padrão 2: src normal
    const imgSrcRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi
    while ((imgMatch = imgSrcRegex.exec(html)) !== null) {
      let imgUrl = imgMatch[1]
      
      if (imgUrl.includes('timthumb.php')) {
        const srcMatch = imgUrl.match(/[?&]src=([^&]+)/)
        if (srcMatch) {
          imgUrl = decodeURIComponent(srcMatch[1])
        }
      }
      
      if (!imgUrl.startsWith('http')) {
        imgUrl = new URL(imgUrl, url).href
      }
      
      if (imgUrl.includes('/img/produtos/') && !todasImagens.includes(imgUrl)) {
        todasImagens.push(imgUrl)
      }
    }

    console.log('[SCRAPE-DETAIL] Total de imagens:', todasImagens.length)
    console.log('[SCRAPE-DETAIL] Primeiras 3 imagens:', todasImagens.slice(0, 3))

    // Distribuir imagens por cor
    if (cores.length > 0 && todasImagens.length > 0) {
      todasImagens.forEach((img, idx) => {
        const cor = cores[idx % cores.length]
        imagensPorCor[cor].push(img)
      })
    } else if (todasImagens.length > 0) {
      cores.push('GERAL')
      imagensPorCor['GERAL'] = todasImagens
    }

    console.log('[SCRAPE-DETAIL] Distribuição final:')
    Object.keys(imagensPorCor).forEach(cor => {
      console.log(`  ${cor}: ${imagensPorCor[cor].length} imagens`)
    })

    const resultado = {
      id,
      nome,
      descricao,
      imagens: todasImagens,
      cores,
      imagensPorCor
    }

    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[SCRAPE-DETAIL] ERRO:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    const errorStack = error instanceof Error ? error.stack : ''
    
    console.error('[SCRAPE-DETAIL] Stack:', errorStack)
    
    return new Response(JSON.stringify({ 
      error: 'Erro ao extrair produto',
      message: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}