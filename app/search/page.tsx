/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import { CatalogCard } from '@/components/store/catalog-card';
import { CatalogForm } from '@/components/store/catalog-form';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import { searchCatalog } from '@/server/catalog';
import { getStoreShellData } from '@/server/storefront';

export const metadata = {
  title: 'Search Products | BLACKSHARK',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.slice(0, 120) : '';
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';
  const stock = params.stock === '1';
  const [products, store] = await Promise.all([
    searchCatalog(query, sort, stock),
    getStoreShellData(),
  ]);
  return (
    <div className="min-h-screen bg-[#03060c] text-white">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to search
      </a>
      <StoreHeader categories={store.categories} />
      <main
        id="main-content"
        className="mx-auto min-h-[60vh] max-w-[1440px] px-4 py-9 sm:px-6 lg:px-8"
      >
        <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
          Product catalog
        </p>
        <h1 className="mt-2 text-4xl font-black">Search products</h1>
        <CatalogForm
          key={`${query}:${sort}:${stock}`}
          query={query}
          sort={sort}
          stock={stock}
        />
        <p className="mb-5 text-sm text-slate-300" aria-live="polite">
          {products.length} {products.length === 1 ? 'product' : 'products'}
          {query ? ` matching “${query}”` : ''}
          {products.length === 60 ? ' (first 60 results)' : ''}
        </p>
        {products.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <CatalogCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#08111c] p-8">
            <h2 className="text-xl font-bold">No products found</h2>
            <p className="mt-2 text-slate-300">
              Try a shorter search or clear the stock filter.
            </p>
            <a
              href="/search"
              className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-cyan-300 px-4 font-black text-[#031019]"
            >
              Browse all products
            </a>
          </div>
        )}
      </main>
      <StoreFooter categories={store.categories} />
    </div>
  );
}
