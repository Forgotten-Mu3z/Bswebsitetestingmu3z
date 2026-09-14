'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type FilterValues = {
  brand: string;
  stock: boolean;
  sale: boolean;
  min: string;
  max: string;
  sort: string;
  type: string;
};

type BrandOption = { slug: string; name: string };

function FilterFields({
  idPrefix,
  action,
  brands,
  values,
  clearHref,
}: {
  idPrefix: string;
  action: string;
  brands: BrandOption[];
  values: FilterValues;
  clearHref: string;
}) {
  return (
    <form action={action} className="grid gap-5">
      {values.type ? (
        <input type="hidden" name="type" value={values.type} />
      ) : null}
      <div>
        <label
          htmlFor={`${idPrefix}-brand`}
          className="mb-2 block text-sm font-bold"
        >
          Brand
        </label>
        <select
          id={`${idPrefix}-brand`}
          name="brand"
          defaultValue={values.brand}
          className="h-11 w-full rounded-lg border border-white/15 bg-[#0b1420] px-3 text-sm text-white focus-visible:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/30"
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand.slug} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${idPrefix}-min`}
            className="mb-2 block text-sm font-bold"
          >
            Min price
          </label>
          <Input
            id={`${idPrefix}-min`}
            name="min"
            type="number"
            min="0"
            step="0.001"
            inputMode="decimal"
            defaultValue={values.min}
            placeholder="OMR"
            className="h-11"
          />
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-max`}
            className="mb-2 block text-sm font-bold"
          >
            Max price
          </label>
          <Input
            id={`${idPrefix}-max`}
            name="max"
            type="number"
            min="0"
            step="0.001"
            inputMode="decimal"
            defaultValue={values.max}
            placeholder="OMR"
            className="h-11"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-sort`}
          className="mb-2 block text-sm font-bold"
        >
          Sort by
        </label>
        <select
          id={`${idPrefix}-sort`}
          name="sort"
          defaultValue={values.sort}
          className="h-11 w-full rounded-lg border border-white/15 bg-[#0b1420] px-3 text-sm text-white focus-visible:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/30"
        >
          <option value="featured">Featured first</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="name">Name</option>
        </select>
      </div>
      <fieldset className="grid gap-3">
        <legend className="mb-1 text-sm font-bold">Availability</legend>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 text-sm">
          <input
            type="checkbox"
            name="stock"
            value="1"
            defaultChecked={values.stock}
            className="size-4 accent-cyan-300"
          />
          In stock only
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 text-sm">
          <input
            type="checkbox"
            name="sale"
            value="1"
            defaultChecked={values.sale}
            className="size-4 accent-cyan-300"
          />
          Sale items only
        </label>
      </fieldset>
      <Button
        type="submit"
        className="h-11 bg-cyan-300 font-black text-[#031019] hover:bg-cyan-200"
      >
        Apply filters
      </Button>
      <a
        href={clearHref}
        className="flex min-h-11 items-center justify-center rounded-lg border border-white/15 text-sm font-bold text-slate-300 hover:border-cyan-300/40 hover:text-white"
      >
        Clear filters
      </a>
    </form>
  );
}

export function CatalogFilters({
  action,
  brands,
  values,
  clearHref,
}: {
  action: string;
  brands: BrandOption[];
  values: FilterValues;
  clearHref: string;
}) {
  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-white/15 bg-white/5"
              />
            }
          >
            <SlidersHorizontal /> Filter and sort
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[90vw] overflow-y-auto border-cyan-300/20 bg-[#07101a] text-white sm:max-w-sm"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Filter products</SheetTitle>
              <SheetDescription>Choose what you want to see.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-8">
              <FilterFields
                idPrefix="mobile-filter"
                action={action}
                brands={brands}
                values={values}
                clearHref={clearHref}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <aside
        aria-label="Product filters"
        className="hidden self-start rounded-2xl border border-white/10 bg-[#08111c] p-5 lg:block lg:sticky lg:top-36"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black">
          <SlidersHorizontal className="size-5 text-cyan-300" /> Filter and sort
        </h2>
        <FilterFields
          idPrefix="desktop-filter"
          action={action}
          brands={brands}
          values={values}
          clearHref={clearHref}
        />
      </aside>
    </>
  );
}
