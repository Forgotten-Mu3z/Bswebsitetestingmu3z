/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import { CatalogCard } from '@/components/store/catalog-card';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import { getDealProducts, getStoreShellData } from '@/server/storefront';

export const metadata = {
  title: 'Current Deals | BLACKSHARK',
  description:
    'Products with a current lower sale price in the BLACKSHARK catalog.',
  alternates: { canonical: '/deals' },
};

export default async function DealsPage() {
  const [products, store] = await Promise.all([
    getDealProducts(),
    getStoreShellData(),
  ]);
  return (
    <div className="min-h-screen bg-[#03060c] text-white">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to deals
      </a>
      <StoreHeader categories={store.categories} />
      <main
        id="main-content"
        className="mx-auto min-h-[60vh] max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8"
      >
        <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
          Current catalog savings
        </p>
        <h1 className="mt-2 text-4xl font-black sm:text-5xl">Deals</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">
          Only products with a sale price lower than the regular price are shown
          here.
        </p>
        {products.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <CatalogCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#08111c] p-8">
            <h2 className="text-xl font-bold">No deals are active</h2>
            <p className="mt-2 text-slate-400">
              Sale items will appear here when an admin adds a lower sale price.
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
