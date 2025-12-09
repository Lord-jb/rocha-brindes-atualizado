import { Show } from 'solid-js';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function ProductCard(props: Props) {
  return (
    <a
      href={`/produto/${props.product.slug}`}
      class="card group"
    >
      {/* Imagem */}
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <Show
          when={props.product.main_image_url}
          fallback={
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          }
        >
          <img
            src={props.product.main_thumb_url || props.product.main_image_url!}
            alt={props.product.name}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Show>

        {/* Badge Destaque */}
        <Show when={props.product.featured}>
          <span class="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Destaque
          </span>
        </Show>
      </div>

      {/* Info */}
      <div class="card-body">
        <h3 class="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {props.product.name}
        </h3>

        <Show when={props.product.description}>
          <p class="text-sm text-gray-600 line-clamp-2 mt-1">
            {props.product.description}
          </p>
        </Show>

        <Show when={props.product.price > 0}>
          <div class="mt-3">
            <span class="text-xl font-bold text-primary-500">
              {formatPrice(props.product.price)}
            </span>
            <span class="text-sm text-gray-500 ml-1">/ un</span>
          </div>
        </Show>

        <button class="btn btn-primary w-full mt-4">
          Ver Detalhes
        </button>
      </div>
    </a>
  );
}
