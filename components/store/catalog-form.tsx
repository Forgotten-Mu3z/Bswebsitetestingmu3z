'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export function CatalogForm({ query, sort, stock }: { query: string; sort: string; stock: boolean }) {
  return (
    <form action="/search" className="my-8 flex flex-wrap items-end gap-4">
      <div className="min-w-0 flex-1 basis-64"><label htmlFor="catalog-query" className="mb-2 block">Product, brand, category or SKU</label><Input id="catalog-query" name="q" defaultValue={query} maxLength={120} autoComplete="off" className="h-12" /></div>
      <div><label htmlFor="sort" className="mb-2 block">Sort by</label><select id="sort" name="sort" defaultValue={sort} className="h-12 rounded-lg border border-white/20 bg-[#0b1420] px-3"><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
      <label className="flex min-h-12 items-center gap-2"><input type="checkbox" name="stock" value="1" defaultChecked={stock} />In stock only</label>
      <Button type="submit" className="h-12 px-6">Search</Button>
    </form>
  );
}
