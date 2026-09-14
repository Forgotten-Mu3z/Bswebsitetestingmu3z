import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CatalogForm({
  query,
  sort,
  stock,
}: {
  query: string;
  sort: string;
  stock: boolean;
}) {
  return (
    <form
      action="/search"
      className="my-7 grid gap-4 rounded-2xl border border-white/10 bg-[#08111c] p-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-end"
    >
      <div className="min-w-0">
        <label htmlFor="catalog-query" className="mb-2 block text-sm font-bold">
          Search the catalog
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="catalog-query"
            name="q"
            defaultValue={query}
            maxLength={120}
            autoComplete="off"
            placeholder="Product, brand, category, or SKU"
            className="h-12 pl-11"
          />
        </div>
      </div>
      <div>
        <label htmlFor="catalog-sort" className="mb-2 block text-sm font-bold">
          Sort by
        </label>
        <select
          id="catalog-sort"
          name="sort"
          defaultValue={sort}
          className="h-12 w-full rounded-lg border border-white/20 bg-[#0b1420] px-3 text-white focus-visible:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/30 md:w-48"
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured first</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 text-sm font-bold">
        <input
          type="checkbox"
          name="stock"
          value="1"
          defaultChecked={stock}
          className="size-4 accent-cyan-300"
        />{' '}
        In stock only
      </label>
      <Button
        type="submit"
        className="h-12 bg-cyan-300 px-6 font-black text-[#031019] hover:bg-cyan-200"
      >
        Search
      </Button>
    </form>
  );
}
