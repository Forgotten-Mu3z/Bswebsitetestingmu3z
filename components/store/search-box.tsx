/* oxlint-disable jsx-a11y/prefer-tag-over-role -- the ARIA combobox pattern needs roles on custom suggestion elements */
'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { missingProductImage } from '@/lib/product-images';
import type { StoreProduct } from '@/lib/store-types';
import { money, productImageAlt, productPrice } from '@/lib/store-types';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const inputId = useId();
  const listId = `${inputId}-suggestions`;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StoreProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search-suggestions?q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );
        if (!response.ok) return;
        const data = (await response.json()) as { products?: StoreProduct[] };
        setResults(data.products ?? []);
        setOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setResults([]);
      }
    }, 180);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1,
      );
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      window.location.href = `/products/${results[activeIndex].slug}`;
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <search className="relative w-full">
      <form action="/search">
        <label htmlFor={inputId} className="sr-only">
          Search products, brands, categories, or SKU
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          />
          <Input
            id={inputId}
            name="q"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              if (nextQuery.trim().length < 2) {
                setResults([]);
                setOpen(false);
              }
            }}
            onFocus={() => results.length && setOpen(true)}
            onBlur={() => {
              blurTimer.current = setTimeout(() => setOpen(false), 120);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open && results.length > 0}
            aria-controls={listId}
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
            }
            autoComplete="off"
            maxLength={120}
            placeholder={
              compact
                ? 'Search products'
                : 'Search products, brands, categories, or SKU'
            }
            className={`${compact ? 'h-11' : 'h-12'} rounded-xl border-white/15 bg-white/7 pl-11 pr-4 text-base text-white placeholder:text-slate-400 focus-visible:border-cyan-300 md:text-sm`}
          />
        </div>
      </form>
      {open && results.length ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Product suggestions"
          className="absolute left-0 right-0 top-[calc(100%+.5rem)] z-50 overflow-hidden rounded-xl border border-cyan-300/20 bg-[#091522] shadow-2xl"
        >
          {results.map((product, index) => (
            <a
              key={product.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              href={`/products/${product.slug}`}
              onMouseDown={() => {
                if (blurTimer.current) clearTimeout(blurTimer.current);
              }}
              className={`flex min-h-16 items-center gap-3 border-b border-white/8 px-3 py-2 last:border-0 hover:bg-cyan-300/10 ${activeIndex === index ? 'bg-cyan-300/10' : ''}`}
            >
              <Image
                src={product.imageKey ?? missingProductImage}
                alt={productImageAlt(product)}
                width={48}
                height={48}
                unoptimized={product.imageKey?.startsWith('/api/')}
                className="size-12 rounded-lg bg-black/30 object-contain p-1"
              />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 block text-sm font-bold text-white">
                  {product.titleEn}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {product.brand ?? product.category}
                </span>
              </span>
              <span className="text-sm font-black tabular-nums text-cyan-200">
                {money(productPrice(product))}
              </span>
            </a>
          ))}
          <a
            href={`/search?q=${encodeURIComponent(query)}`}
            className="flex min-h-11 items-center justify-center bg-white/5 px-4 text-sm font-bold text-cyan-300 hover:bg-white/10"
          >
            See all results
          </a>
        </div>
      ) : null}
    </search>
  );
}
