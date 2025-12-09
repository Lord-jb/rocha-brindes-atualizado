import { createSignal, For, Show } from 'solid-js';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-solid';
import type { ProductImage } from '@/types';

interface Props {
  mainImage: string | null;
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery(props: Props) {
  // Build images array with main image first
  const allImages = () => {
    const imgs = [];
    if (props.mainImage) {
      imgs.push({ id: 'main', url: props.mainImage, alt: props.productName, order_index: 0 });
    }
    imgs.push(...props.images);
    return imgs;
  };

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isZoomed, setIsZoomed] = createSignal(false);

  const images = allImages();
  const currentImage = () => images[currentIndex()];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Fallback image if no images available
  const placeholderImage = 'https://placehold.co/600x600/f3f4f6/9ca3af?text=Sem+Imagem';

  return (
    <div class="space-y-4">
      {/* Main Image */}
      <div class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
        <img
          src={currentImage()?.url || placeholderImage}
          alt={currentImage()?.alt || props.productName}
          class="w-full h-full object-cover"
        />

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          class="absolute top-4 right-4 p-2 bg-white/90 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Ampliar imagem"
        >
          <ZoomIn size={20} class="text-gray-700" />
        </button>

        {/* Navigation Arrows (only if multiple images) */}
        <Show when={images.length > 1}>
          <button
            onClick={prevImage}
            class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={24} class="text-gray-700" />
          </button>
          <button
            onClick={nextImage}
            class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={24} class="text-gray-700" />
          </button>
        </Show>

        {/* Image Counter */}
        <Show when={images.length > 1}>
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
            {currentIndex() + 1} / {images.length}
          </div>
        </Show>
      </div>

      {/* Thumbnails */}
      <Show when={images.length > 1}>
        <div class="grid grid-cols-4 gap-2">
          <For each={images}>
            {(image, index) => (
              <button
                onClick={() => selectImage(index())}
                class={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex() === index()
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${props.productName} - Imagem ${index() + 1}`}
                  class="w-full h-full object-cover"
                />
              </button>
            )}
          </For>
        </div>
      </Show>

      {/* Zoom Modal */}
      <Show when={isZoomed()}>
        <div
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            class="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setIsZoomed(false)}
            aria-label="Fechar"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={currentImage()?.url || placeholderImage}
            alt={currentImage()?.alt || props.productName}
            class="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation in zoom modal */}
          <Show when={images.length > 1}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              class="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              class="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={32} />
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}
