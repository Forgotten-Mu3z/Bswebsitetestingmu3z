/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import { notFound } from 'next/navigation';
import { CatalogCard } from '@/components/store/catalog-card';
import { CatalogFilters } from '@/components/store/catalog-filters';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import { hasProductPrefix, PC_COMPONENT_TYPES } from '@/lib/catalog';
import { productPrice } from '@/lib/store-types';
import { getCategoryMetadata, getCategoryPage } from '@/server/storefront';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const category = await getCategoryMetadata((await params).slug);
  return {
    title: category
      ? `${category.name} | BLACKSHARK`
      : 'Category not found | BLACKSHARK',
    description: category
      ? `Browse published ${category.name.toLowerCase()} with current BLACKSHARK catalog prices and stock.`
      : undefined,
    alternates: category
      ? { canonical: `/categories/${category.slug}` }
      : undefined,
  };
}

function stringParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

function priceParam(value: string) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0
    ? Math.round(number * 1000)
    : null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const data = await getCategoryPage(slug);
  if (!data) notFound();

  const values = {
    type: stringParam(query.type),
    brand: stringParam(query.brand),
    stock: query.stock === '1',
    sale: query.sale === '1',
    min: stringParam(query.min),
    max: stringParam(query.max),
    sort: stringParam(query.sort) || 'featured',
  };
  const activeType =
    slug === 'pc-components'
      ? PC_COMPONENT_TYPES.find((type) => type.value === values.type)
      : undefined;
  const minPrice = priceParam(values.min);
  const maxPrice = priceParam(values.max);
  const brandOptions = Array.from(
    new Map(
      data.products
        .filter((product) => product.brandSlug && product.brand)
        .map((product) => [
          product.brandSlug as string,
          { slug: product.brandSlug as string, name: product.brand as string },
        ]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const visibleProducts = data.products
    .filter((product) =>
      activeType
        ? hasProductPrefix(product.shortDescription, activeType.prefixes)
        : true,
    )
    .filter((product) => !values.brand || product.brandSlug === values.brand)
    .filter((product) => !values.stock || product.stockQuantity > 0)
    .filter(
      (product) =>
        !values.sale ||
        (product.salePriceBaisa !== null &&
          product.salePriceBaisa < product.priceBaisa),
    )
    .filter((product) => minPrice === null || productPrice(product) >= minPrice)
    .filter((product) => maxPrice === null || productPrice(product) <= maxPrice)
    .sort((a, b) => {
      if (values.sort === 'price-low') return productPrice(a) - productPrice(b);
      if (values.sort === 'price-high')
        return productPrice(b) - productPrice(a);
      if (values.sort === 'name') return a.titleEn.localeCompare(b.titleEn);
      if (values.sort === 'newest') return b.updatedAt - a.updatedAt;
      return (
        Number(b.featured) - Number(a.featured) || b.updatedAt - a.updatedAt
      );
    });
  const pageSize = 24;
  const requestedPage = Math.max(
    1,
    Number.parseInt(stringParam(query.page), 10) || 1,
  );
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const currentPage = Math.min(requestedPage, pageCount);
  const pageProducts = visibleProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const isComponents = slug === 'pc-components';
  const action = `/categories/${slug}`;
  const clearHref = activeType ? `${action}?type=${activeType.value}` : action;

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (values.type) params.set('type', values.type);
    if (values.brand) params.set('brand', values.brand);
    if (values.min) params.set('min', values.min);
    if (values.max) params.set('max', values.max);
    if (values.stock) params.set('stock', '1');
    if (values.sale) params.set('sale', '1');
    if (values.sort && values.sort !== 'featured')
      params.set('sort', values.sort);
    if (page > 1) params.set('page', String(page));
    const suffix = params.toString();
    return suffix ? `${action}?${suffix}` : action;
  }

  return (
    <div className="min-h-screen bg-[#03060c] text-white">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to products
      </a>
      <StoreHeader categories={data.categories} />
      <main
        id="main-content"
        className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <a
            href="/"
            className="rounded-sm hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          >
            Home
          </a>
          <span aria-hidden="true"> / </span>
          <span>{data.category.nameEn}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
              Shop products
            </p>
            <h1 className="mt-2 text-balance text-4xl font-black sm:text-5xl">
              {data.category.nameEn}
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              {isComponents
                ? 'Find the parts you need. Filter by type, brand, price, sale, or stock.'
                : `Browse published ${data.category.nameEn.toLowerCase()} with current catalog prices and stock.`}
            </p>
          </div>
          <p
            className="rounded-full border border-white/12 bg-white/5 px-3 py-2 text-sm font-bold text-slate-200"
            aria-live="polite"
          >
            {visibleProducts.length}{' '}
            {visibleProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {isComponents ? (
          <nav
            aria-label="PC component types"
            className="-mx-4 mt-6 flex snap-x gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
          >
            <a
              href="/categories/pc-components"
              aria-current={!activeType ? 'page' : undefined}
              className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-bold ${!activeType ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-300/60'}`}
            >
              All parts
            </a>
            {PC_COMPONENT_TYPES.map((type) => (
              <a
                key={type.value}
                href={`/categories/pc-components?type=${type.value}`}
                aria-current={
                  activeType?.value === type.value ? 'page' : undefined
                }
                className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-bold ${activeType?.value === type.value ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-300/60'}`}
              >
                {type.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="mt-7 grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <CatalogFilters
            action={action}
            brands={brandOptions}
            values={values}
            clearHref={clearHref}
          />
          {visibleProducts.length ? (
            <div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {pageProducts.map((product) => (
                  <CatalogCard key={product.id} product={product} />
                ))}
              </div>
              {pageCount > 1 ? (
                <nav
                  aria-label="Product pages"
                  className="mt-8 flex items-center justify-center gap-3"
                >
                  {currentPage > 1 ? (
                    <a
                      href={pageHref(currentPage - 1)}
                      className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 font-bold hover:border-cyan-300/50"
                    >
                      Previous
                    </a>
                  ) : null}
                  <span className="text-sm text-slate-300">
                    Page {currentPage} of {pageCount}
                  </span>
                  {currentPage < pageCount ? (
                    <a
                      href={pageHref(currentPage + 1)}
                      className="inline-flex min-h-11 items-center rounded-lg bg-cyan-300 px-4 font-black text-[#031019] hover:bg-cyan-200"
                    >
                      Next
                    </a>
                  ) : null}
                </nav>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#0a111d] p-8">
              <h2 className="text-xl font-bold">No products match</h2>
              <p className="mt-2 text-slate-400">
                Clear a filter or choose a different range.
              </p>
              <a
                href={clearHref}
                className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-cyan-300 px-4 font-black text-[#031019]"
              >
                Clear filters
              </a>
            </div>
          )}
        </div>
      </main>
      <StoreFooter categories={data.categories} />
    </div>
  );
}
