/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
'use client';

import Image from 'next/image';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommerce } from './commerce-provider';
import { missingProductImage } from '@/lib/product-images';
import type { StoreProduct } from '@/lib/store-types';
import {
  money,
  productImageAlt,
  productPrice,
  productSpecs,
  productType,
} from '@/lib/store-types';

export { money } from '@/lib/store-types';

export function CatalogCard({ product }: { product: StoreProduct }) {
  const commerce = useCommerce();
  const wishlisted = commerce.isWishlisted(product.id);
  const currentPrice = productPrice(product);
  const hasSale = currentPrice < product.priceBaisa;
  const discount = hasSale
    ? Math.round((1 - currentPrice / product.priceBaisa) * 100)
    : 0;
  const type = productType(product.shortDescription);
  const specs = productSpecs(product.shortDescription);
  const lowStock =
    product.stockQuantity > 0 &&
    product.stockQuantity <= product.lowStockThreshold;

  return (
    <article
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1420] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/45 hover:shadow-[0_18px_50px_rgba(0,0,0,.3)]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '430px' }}
    >
      <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-3.25rem)] flex-wrap gap-1.5 sm:left-3 sm:top-3">
        {hasSale ? (
          <span className="rounded-full bg-cyan-300 px-2 py-1 text-[10px] font-black text-[#031019]">
            {discount}% off
          </span>
        ) : null}
        {lowStock ? (
          <span className="rounded-full bg-amber-300 px-2 py-1 text-[10px] font-black text-amber-950">
            Low stock
          </span>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label={
          wishlisted
            ? `Remove ${product.titleEn} from wishlist`
            : `Add ${product.titleEn} to wishlist`
        }
        aria-pressed={wishlisted}
        onClick={() => commerce.toggleWishlist(product)}
        className={`absolute right-2 top-2 z-10 size-11 rounded-full bg-[#050a11]/80 backdrop-blur-sm sm:right-3 sm:top-3 ${wishlisted ? 'text-cyan-300' : 'text-slate-300'}`}
      >
        <Heart className={wishlisted ? 'fill-current' : ''} />
      </Button>
      <a
        href={`/products/${product.slug}`}
        className="m-2 grid aspect-square place-items-center overflow-hidden rounded-xl bg-[#060b12] p-5 outline-none ring-cyan-300 focus-visible:ring-2 sm:m-3 sm:p-7"
      >
        <Image
          src={product.imageKey ?? missingProductImage}
          alt={productImageAlt(product)}
          width={320}
          height={320}
          unoptimized={product.imageKey?.startsWith('/api/')}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      </a>
      <div className="flex flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
        <p className="truncate text-[10px] font-black uppercase tracking-[.14em] text-cyan-300 sm:text-xs">
          {product.brand ?? product.category}
        </p>
        <a
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white outline-none hover:text-cyan-200 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-cyan-300 sm:min-h-12 sm:text-base sm:leading-6"
        >
          {product.titleEn}
        </a>
        <p className="mt-2 line-clamp-2 hidden text-xs leading-5 text-slate-400 sm:block">
          {type ? `${type} · ` : ''}
          {specs}
        </p>
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="font-black tabular-nums text-white sm:text-lg">
              {money(currentPrice)}
            </p>
            {hasSale ? (
              <del className="text-[11px] tabular-nums text-slate-500 sm:text-sm">
                {money(product.priceBaisa)}
              </del>
            ) : null}
          </div>
          <p
            className={`mt-1.5 text-xs font-bold ${product.stockQuantity > 0 ? 'text-emerald-300' : 'text-red-300'}`}
          >
            {product.stockQuantity > 0 ? 'In stock' : 'Out of stock'}
          </p>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <Button
              type="button"
              onClick={() => commerce.addToCart(product)}
              disabled={product.stockQuantity < 1}
              className="h-11 min-w-0 bg-cyan-300 px-2 font-black text-[#031019] hover:bg-cyan-200 sm:px-4"
            >
              <ShoppingCart />
              <span className="truncate">Add to cart</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="size-11 border-white/15 bg-white/5"
              aria-label={`Quick view ${product.titleEn}`}
              onClick={() => commerce.showQuickView(product)}
            >
              <Eye />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
