/* oxlint-disable next/no-html-link-for-pages -- Vinext Link currently emits RSC prefetch errors in the compiled Worker */
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { StoreHeader } from '@/components/store/store-header';
import { money } from '@/components/store/catalog-card';
import { getProduct } from '@/server/catalog';
import { getStorefrontData } from '@/server/storefront';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const row = await getProduct((await params).slug);
  return {
    title: row
      ? `${row.product.titleEn} | BLACKSHARK`
      : 'Product Not Found | BLACKSHARK',
    description: row?.product.shortDescription,
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
    getStorefrontData(),
  ]);
  if (!row) notFound();
  const { product, category, categorySlug, brand } = row;
  return (
    <>
      <StoreHeader categories={store.categories} />
      <main className="mx-auto max-w-[1440px] px-4 py-10 text-white sm:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap gap-2 text-sm text-cyan-300"
        >
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <a href={`/categories/${categorySlug}`}>{category}</a>
        </nav>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="grid aspect-square place-items-center rounded-2xl border border-white/10 bg-[#0b1420]">
            <Image
              src={product.imageKey ?? '/blackshark-logo.png'}
              alt={product.titleEn}
              width={500}
              height={500}
              priority
              unoptimized={product.imageKey?.startsWith('/api/')}
              className="h-3/4 w-3/4 object-contain"
            />
          </div>
          <div>
            <p className="text-cyan-300">{brand}</p>
            <h1 className="mt-3 text-balance text-3xl font-black sm:text-4xl">
              {product.titleEn}
            </h1>
            <p className="mt-4 text-sm text-slate-400">SKU: {product.sku}</p>
            <p className="mt-8 text-3xl font-bold tabular-nums">
              {money(product.salePriceBaisa ?? product.priceBaisa)}
            </p>
            {product.salePriceBaisa !== null &&
            product.salePriceBaisa < product.priceBaisa ? (
              <del className="text-slate-400">{money(product.priceBaisa)}</del>
            ) : null}
            <p className="mt-5 text-cyan-300">
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : 'Currently out of stock'}
            </p>
            <h2 className="mt-10 text-xl font-bold">About This Product</h2>
            <p className="mt-3 leading-7 text-slate-300">
              {product.shortDescription}
            </p>
            <a
              href={`/categories/${categorySlug}`}
              className="mt-8 inline-flex min-h-12 items-center rounded-xl border border-white/20 px-5 hover:border-cyan-300"
            >
              Browse {category}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
