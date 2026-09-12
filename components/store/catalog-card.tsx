/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import Image from 'next/image';
import type { products } from '@/db/schema';

const omr = new Intl.NumberFormat('en-OM', {
  style: 'currency',
  currency: 'OMR',
  minimumFractionDigits: 3,
});

export const money = (value: number) => omr.format(value / 1000);

export function CatalogCard({
  product,
}: {
  product: typeof products.$inferSelect;
}) {
  const type = product.shortDescription.split(' · ')[0];
  return (
    <article
      className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1420] transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:shadow-[0_18px_50px_rgba(0,0,0,.3)]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '430px' }}
    >
      <a
        href={`/products/${product.slug}`}
        className="flex h-full flex-col p-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-300 sm:p-5"
      >
        <div className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-[#060b12]">
          <Image
            src={product.imageKey ?? '/blackshark-logo.png'}
            alt={product.titleEn}
            width={320}
            height={320}
            unoptimized={product.imageKey?.startsWith('/api/')}
            className="h-3/5 w-3/5 object-contain transition duration-300 group-hover:scale-105"
          />
        </div>
        {type && type !== product.shortDescription ? (
          <p className="mt-3 w-fit rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 sm:mt-4">
            {type}
          </p>
        ) : null}
        <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
          {product.sku}
        </p>
        <h2 className="mt-1.5 text-sm font-bold leading-5 text-balance sm:text-base sm:leading-6">
          {product.titleEn}
        </h2>
        <div className="mt-auto pt-4">
          <p className="font-black tabular-nums text-white sm:text-lg">
            {money(product.salePriceBaisa ?? product.priceBaisa)}
          </p>
          {product.salePriceBaisa !== null &&
          product.salePriceBaisa < product.priceBaisa ? (
            <del className="block text-xs tabular-nums text-slate-500 sm:text-sm">
              {money(product.priceBaisa)}
            </del>
          ) : null}
          <p
            className={`mt-2 text-xs font-bold sm:text-sm ${product.stockQuantity > 0 ? 'text-emerald-300' : 'text-red-300'}`}
          >
            {product.stockQuantity > 0 ? 'In stock' : 'Out of stock'}
          </p>
        </div>
      </a>
    </article>
  );
}
