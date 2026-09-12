/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import { notFound } from 'next/navigation';
import { CatalogCard } from '@/components/store/catalog-card';
import { StoreHeader } from '@/components/store/store-header';
import { getCategoryPage } from '@/server/storefront';

const componentTypes = [
  { value: 'processors', label: 'Processors', prefixes: ['Processor'] },
  {
    value: 'graphics-cards',
    label: 'Graphics cards',
    prefixes: ['Graphics Card'],
  },
  {
    value: 'motherboards',
    label: 'Motherboards',
    prefixes: ['Motherboard'],
  },
  { value: 'memory', label: 'Memory', prefixes: ['Memory'] },
  { value: 'storage', label: 'Storage', prefixes: ['Storage'] },
  {
    value: 'power-supplies',
    label: 'Power supplies',
    prefixes: ['Power Supply'],
  },
  { value: 'cases', label: 'PC cases', prefixes: ['PC Case'] },
  {
    value: 'cpu-cooling',
    label: 'CPU cooling',
    prefixes: ['CPU Cooler'],
  },
  { value: 'case-fans', label: 'Case fans', prefixes: ['Case Fan'] },
  {
    value: 'networking',
    label: 'Networking',
    prefixes: ['Network Card'],
  },
  {
    value: 'capture-cards',
    label: 'Capture cards',
    prefixes: ['Capture Card'],
  },
  {
    value: 'build-accessories',
    label: 'Build accessories',
    prefixes: ['Thermal Compound', 'Riser Cable'],
  },
] as const;

function hasPrefix(description: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => description.startsWith(`${prefix} ·`));
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

  const requestedType = typeof query.type === 'string' ? query.type : '';
  const activeType =
    slug === 'pc-components'
      ? componentTypes.find((type) => type.value === requestedType)
      : undefined;
  const products = activeType
    ? data.products.filter((product) =>
        hasPrefix(product.shortDescription, activeType.prefixes),
      )
    : data.products;
  const isComponents = slug === 'pc-components';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to products
      </a>
      <StoreHeader categories={data.categories} />
      <main id="main-content" className="min-h-screen bg-[#03060c] text-white">
        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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

          <div className="mt-5 grid gap-5 border-b border-white/10 pb-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
                Build your setup
              </p>
              <h1 className="mt-2 text-balance text-4xl font-black sm:text-5xl lg:text-6xl">
                {data.category.nameEn}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                {isComponents
                  ? 'Browse a complete starter catalog of core PC parts and build accessories, priced in Omani rials.'
                  : `Explore BLACKSHARK-selected ${data.category.nameEn.toLowerCase()} available for Oman and the GCC.`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-bold text-emerald-300">
                {products.length}{' '}
                {products.length === 1 ? 'product' : 'products'}
              </span>
              {isComponents ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  OMR pricing
                </span>
              ) : null}
            </div>
          </div>

          {isComponents ? (
            <div className="mt-6">
              <p className="text-sm font-bold text-slate-200">
                Browse by part type
              </p>
              <nav
                aria-label="Filter PC components by type"
                className="-mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
              >
                <a
                  href="/categories/pc-components"
                  aria-current={!activeType ? 'page' : undefined}
                  className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${!activeType ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-300/60 hover:text-cyan-200'}`}
                >
                  All parts
                </a>
                {componentTypes.map((type) => (
                  <a
                    key={type.value}
                    href={`/categories/pc-components?type=${type.value}`}
                    aria-current={
                      activeType?.value === type.value ? 'page' : undefined
                    }
                    className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${activeType?.value === type.value ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-300/60 hover:text-cyan-200'}`}
                  >
                    {type.label}
                  </a>
                ))}
              </nav>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Prices are current Oman/GCC retail benchmarks and may change
                with stock and promotions. Admins can update every listing.
              </p>
            </div>
          ) : null}

          {products.length ? (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <CatalogCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a111d] p-8">
              <h2 className="text-xl font-bold">Products coming soon</h2>
              <p className="mt-2 text-slate-400">
                This department is live and ready for staff to publish its first
                products.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
