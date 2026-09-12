import Link from 'next/link';
import { StoreHeader } from '@/components/store/store-header';
import { CatalogCard } from '@/components/store/catalog-card';
import { CatalogForm } from '@/components/store/catalog-form';
import { searchCatalog } from '@/server/catalog';
import { getStorefrontData } from '@/server/storefront';

export const metadata = { title: 'Search Products | BLACKSHARK' };
export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.slice(0, 120) : '';
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';
  const stock = params.stock === '1';
  const [rows, store] = await Promise.all([searchCatalog(query, sort, stock), getStorefrontData()]);
  return <><StoreHeader categories={store.categories} /><main className="mx-auto max-w-[1440px] px-4 py-10 text-white sm:px-8">
    <h1 className="text-3xl font-black">Find Your Next Upgrade</h1>
    <CatalogForm key={`${query}:${sort}:${stock}`} query={query} sort={sort} stock={stock} />
    <p className="mb-5 text-slate-300">{rows.length} {rows.length === 1 ? 'product' : 'products'}{query ? ` matching “${query}”` : ''}{rows.length === 60 ? ' (first 60 results)' : ''}</p>
    {rows.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rows.map(({ product }) => <CatalogCard key={product.id} product={product} />)}</div> : <div className="rounded-xl border border-white/10 p-8"><h2 className="text-xl font-bold">No Products Found</h2><p className="mt-2 text-slate-300">Try a different name or SKU, or clear the stock filter.</p><Link href="/search" className="mt-5 inline-block text-cyan-300 underline">Browse all products</Link></div>}
  </main></>;
}
