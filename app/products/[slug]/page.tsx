/* oxlint-disable next/no-html-link-for-pages -- Vinext Link currently emits RSC prefetch errors in the compiled Worker */
import Image from 'next/image';
import { Check, PackageX } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ProductActions } from '@/components/store/product-actions';
import { ProductShelf } from '@/components/store/product-shelf';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import type { StoreProduct } from '@/lib/store-types';
import { money, productImageAlt } from '@/lib/store-types';
import { getProduct } from '@/server/catalog';
import { getRelatedProducts, getStoreShellData } from '@/server/storefront';

const siteUrl = 'https://blackshark-gaming-oman.xxgunone11.chatgpt.site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const row = await getProduct((await params).slug);
  return {
    title: row
      ? `${row.product.titleEn} | BLACKSHARK`
      : 'Product not found | BLACKSHARK',
    description: row?.product.shortDescription,
    alternates: {
      canonical: row ? `/products/${row.product.slug}` : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [row, store] = await Promise.all([
    getProduct(slug),
    getStoreShellData(),
  ]);
  if (!row) notFound();
  const { product, category, categorySlug, brand } = row;
  const related = await getRelatedProducts(product.categoryId, product.id);
  const storeProduct: StoreProduct = {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    titleEn: product.titleEn,
    shortDescription: product.shortDescription,
    priceBaisa: product.priceBaisa,
    salePriceBaisa: product.salePriceBaisa,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    imageKey: product.imageKey,
    featured: product.featured,
    brand,
    brandSlug: null,
    category,
    categorySlug,
    updatedAt: product.updatedAt.getTime(),
  };
  const hasSale =
    product.salePriceBaisa !== null &&
    product.salePriceBaisa < product.priceBaisa;
  const currentPrice = hasSale
    ? (product.salePriceBaisa as number)
    : product.priceBaisa;
  const discount = hasSale
    ? Math.round((1 - currentPrice / product.priceBaisa) * 100)
    : 0;
  const details = product.shortDescription.split(' · ').filter(Boolean);
  const imageUrl = product.imageKey
    ? product.imageKey.startsWith('http')
      ? product.imageKey
      : `${siteUrl}${product.imageKey}`
    : `${siteUrl}/blackshark-logo.png`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.titleEn,
    image: imageUrl,
    description: product.shortDescription,
    sku: product.sku,
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'OMR',
      price: (currentPrice / 1000).toFixed(3),
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-[#03060c] text-white">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to product
      </a>
      <StoreHeader categories={store.categories} />
      <main
        id="main-content"
        className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap gap-2 text-sm text-slate-400"
        >
          <a href="/" className="hover:text-cyan-300">
            Home
          </a>
          <span aria-hidden="true">/</span>
          <a
            href={`/categories/${categorySlug}`}
            className="hover:text-cyan-300"
          >
            {category}
          </a>
          <span aria-hidden="true">/</span>
          <span className="line-clamp-1 text-slate-300">{product.titleEn}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.9fr)] lg:gap-12">
          <div className="grid aspect-square max-h-[650px] place-items-center rounded-2xl border border-white/10 bg-[#08111c] p-8 sm:p-12">
            <Image
              src={product.imageKey ?? '/blackshark-logo.png'}
              alt={productImageAlt(storeProduct)}
              width={620}
              height={620}
              priority
              unoptimized={product.imageKey?.startsWith('/api/')}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="self-center">
            <p className="text-sm font-black uppercase tracking-[.16em] text-cyan-300">
              {brand ?? category}
            </p>
            <h1 className="mt-3 text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {product.titleEn}
            </h1>
            <p className="mt-3 text-sm text-slate-500">SKU: {product.sku}</p>
            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-black tabular-nums">
                {money(currentPrice)}
              </p>
              {hasSale ? (
                <>
                  <del className="text-lg tabular-nums text-slate-500">
                    {money(product.priceBaisa)}
                  </del>
                  <span className="rounded-full bg-cyan-300 px-2.5 py-1 text-xs font-black text-[#031019]">
                    {discount}% off
                  </span>
                </>
              ) : null}
            </div>
            <div
              className={`mt-5 flex items-center gap-2 text-sm font-bold ${product.stockQuantity > 0 ? 'text-emerald-300' : 'text-red-300'}`}
            >
              {product.stockQuantity > 0 ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <PackageX className="size-5" aria-hidden="true" />
              )}
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : 'Out of stock'}
            </div>
            <p className="mt-6 text-base leading-7 text-slate-300">
              {product.shortDescription}
            </p>
            <ProductActions product={storeProduct} />
          </div>
        </div>

        <section
          aria-labelledby="details-title"
          className="mt-12 grid gap-5 border-t border-white/10 pt-10 md:grid-cols-[.7fr_1.3fr]"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
              Product information
            </p>
            <h2 id="details-title" className="mt-2 text-2xl font-black">
              Details and specifications
            </h2>
          </div>
          <div>
            <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#08111c] px-5">
              <div className="grid grid-cols-[110px_1fr] gap-4 py-4">
                <dt className="text-sm text-slate-400">Brand</dt>
                <dd className="font-bold">{brand ?? 'Not listed'}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-4">
                <dt className="text-sm text-slate-400">Category</dt>
                <dd className="font-bold">{category}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-4">
                <dt className="text-sm text-slate-400">SKU</dt>
                <dd className="font-mono text-sm">{product.sku}</dd>
              </div>
            </dl>
            <h3 className="mt-6 font-bold">Catalog specifications</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-2 rounded-xl border border-white/10 bg-[#08111c] p-3 text-sm leading-6 text-slate-200"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-cyan-300"
                    aria-hidden="true"
                  />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <ProductShelf
        title="Related products"
        products={related}
        href={`/categories/${categorySlug}`}
        tone="raised"
      />
      <StoreFooter categories={store.categories} />
    </div>
  );
}
