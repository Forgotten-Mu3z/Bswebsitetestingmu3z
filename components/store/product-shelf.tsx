import { ArrowRight } from 'lucide-react';
import { CatalogCard } from './catalog-card';
import type { StoreProduct } from '@/lib/store-types';

export function ProductShelf({
  id,
  eyebrow,
  title,
  description,
  products,
  href,
  linkLabel = 'View all',
  tone = 'default',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  products: StoreProduct[];
  href?: string;
  linkLabel?: string;
  tone?: 'default' | 'raised';
}) {
  if (!products.length) return null;
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={
        tone === 'raised' ? 'border-y border-white/10 bg-[#07101a]' : ''
      }
    >
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            {eyebrow ? (
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={headingId}
              className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          {href ? (
            <a
              href={href}
              className="hidden min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 font-bold text-cyan-300 hover:bg-cyan-300/10 sm:flex"
            >
              {linkLabel} <ArrowRight className="size-4" />
            </a>
          ) : null}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <CatalogCard key={product.id} product={product} />
          ))}
        </div>
        {href ? (
          <a
            href={href}
            className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 font-bold text-cyan-300 hover:border-cyan-300/50 sm:hidden"
          >
            {linkLabel} <ArrowRight className="size-4" />
          </a>
        ) : null}
      </div>
    </section>
  );
}
