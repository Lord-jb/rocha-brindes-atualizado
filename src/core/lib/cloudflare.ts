// FILE: src/core/lib/cloudflare.ts

const CLOUDFLARE_ACCOUNT_HASH = "iem94FVEkj3Qjv3DsJXpbQ"

export function optimizeUrl(
  imageId: string,
  variant: "public" | "thumbnail" | "original" = "public"
): string {
  if (!imageId) return ""
  if (imageId.startsWith("http") || imageId.startsWith("blob:") || imageId.startsWith("data:"))
    return imageId

  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`
}
export function preloadImage(imageId: string, priority: "high" | "low" = "high") {
  if (typeof window === "undefined") return
  if (!imageId) return

  const url = optimizeUrl(imageId, "public")

  const link = document.createElement("link")
  link.rel = "preload"
  link.as = "image"
  link.href = url

  // fetchPriority só funciona no Chrome
  link.setAttribute("fetchpriority", priority)

  link.onload = () => {
    setTimeout(() => link.remove(), 200)
  }

  document.head.appendChild(link)
}
export function preloadCriticalImages(imageIds: string[]) {
  if (typeof window === "undefined") return
  if (!Array.isArray(imageIds)) return

  imageIds.forEach(id => preloadImage(id, "high"))
}
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  if (typeof window === "undefined") {
    return Promise.resolve({ width: 0, height: 0 })
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}

interface UploadMetadata {
  folder: string
  productId?: string
  variation?: string
  type?: "main" | "variation" | "logo" | "banner" | "category" | "promotion" | "popup"
}

export async function uploadToCloudflare(file: File, metadata: UploadMetadata): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"

  let customFilename = file.name

  if (metadata.type === "main" && metadata.productId)
    customFilename = `${metadata.productId}.${ext}`

  if (metadata.type === "variation" && metadata.productId && metadata.variation) {
    const slug = metadata.variation.toLowerCase().replace(/\s+/g, "-")
    customFilename = `${metadata.productId}-${slug}.${ext}`
  }

  const renamedFile = new File([file], customFilename, { type: file.type })

  const formData = new FormData()
  formData.append("file", renamedFile)
  formData.append(
    "metadata",
    JSON.stringify({
      ...metadata,
      filename: customFilename,
      uploadDate: new Date().toISOString()
    })
  )

  const res = await fetch("https://imagens.bjeslee19.workers.dev/upload", {
    method: "POST",
    body: formData
  })

  const raw = await res.text()
  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = raw
  }

  if (!res.ok) throw new Error(JSON.stringify(data))
  if (!data?.imageId) throw new Error("Cloudflare não retornou o imageId.")

  return data.imageId
}

export async function deleteCloudflareImage(imageId: string): Promise<void> {
  if (!imageId || imageId.startsWith("http")) return

  await fetch("https://imagens.bjeslee19.workers.dev/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId })
  })
}

export async function deleteMultipleImages(imageIds: string[]): Promise<void> {
  const valid = imageIds.filter(id => id && !id.startsWith("http"))

  if (valid.length === 0) return

  await fetch("https://imagens.bjeslee19.workers.dev/delete-multiple", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageIds: valid })
  })
}
