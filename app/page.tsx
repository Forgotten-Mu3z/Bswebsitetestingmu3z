/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Boxes,
  Cable,
  Cpu,
  Gamepad2,
  Monitor,
  PackageCheck,
  SearchCheck,
  Settings2,
  Wrench,
} from 'lucide-react';
import { ProductShelf } from '@/components/store/product-shelf';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import { getStorefrontData } from '@/server/storefront';

const categoryIcons: Record<string, LucideIcon> = {
  'pc-components': Cpu,
  'gaming-pcs': Boxes,
  'gaming-gear': Cable,
  monitors: Monitor,
  consoles: Gamepad2,
  'digital-cards': PackageCheck,
};

export default async function Home() {
  const store = await getStorefrontData();
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#03060c] text-white">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-cyan-300 px-4 py-3 font-bold text-[#04101b] focus:fixed focus:left-4 focus:top-4 focus:not-sr-only"
      >
        Skip to main content
      </a>
      <StoreHeader categories={store.categories} />

      <main id="main-content">
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_30%,rgba(34,211,238,.18),transparent_31%),linear-gradient(125deg,#03060c_0%,#091725_58%,#04101a_100%)]" />
          <div className="store-grid absolute inset-0 -z-10 opacity-25" />
          <div className="mx-auto grid min-h-[450px] max-w-[1440px] items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">
                BLACKSHARK Gaming Oman
              </p>
              <h1 className="mt-4 text-balance text-4xl font-black leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-7xl">
                Power your next setup.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Shop gaming PCs, core components, monitors, consoles, and gear.
                See current catalog prices and stock before you choose.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/categories/gaming-pcs"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-black text-[#031019] shadow-[0_0_24px_rgba(34,211,238,.2)] hover:bg-cyan-200"
                >
                  Shop gaming PCs <ArrowRight className="size-4" />
                </a>
                <a
                  href="/categories/pc-components"
                  className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold hover:border-cyan-300/60 hover:bg-white/10"
                >
                  Shop components
                </a>
              </div>
            </div>
            <div className="relative mx-auto hidden w-full max-w-sm md:block">
              <div className="absolute inset-8 rounded-full bg-cyan-400/20 blur-3xl" />
              <Image
                src="/blackshark-logo.png"
                alt="BLACKSHARK BS Gaming logo"
                width={440}
                height={440}
                priority
                className="relative w-full rounded-[1.75rem] border border-cyan-300/20 shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="departments-title"
          className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14"
        >
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
                Start here
              </p>
              <h2
                id="departments-title"
                className="mt-2 text-2xl font-black sm:text-3xl"
              >
                Shop by category
              </h2>
            </div>
            <a
              href="/search"
              className="hidden min-h-11 items-center gap-2 px-3 font-bold text-cyan-300 hover:text-cyan-200 sm:flex"
            >
              All products <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {store.categories.map((category) => {
              const CategoryIcon = categoryIcons[category.slug] ?? Boxes;
              return (
                <a
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group min-h-36 rounded-2xl border border-white/10 bg-[#0a111d] p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/45"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <CategoryIcon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-bold leading-5 group-hover:text-cyan-200">
                    {category.nameEn}
                  </h3>
                  <span className="mt-2 block text-xs text-slate-500">
                    Browse products
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Shop highlights"
          className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-4 sm:px-6 md:grid-cols-3 lg:px-8"
        >
          <a
            href="/build"
            className="group relative min-h-52 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#0b2435,#08111d)] p-6 hover:border-cyan-300/60"
          >
            <Wrench className="size-8 text-cyan-300" aria-hidden="true" />
            <h2 className="mt-7 text-2xl font-black">Build your PC</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
              Choose parts step by step. The builder checks the compatibility
              details stored in the catalog.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-300">
              Start a build{' '}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </a>
          <a
            href="/categories/pc-components?type=graphics-cards"
            className="group relative min-h-52 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#151324,#07101a)] p-6 hover:border-cyan-300/50"
          >
            <Cpu className="size-8 text-cyan-300" aria-hidden="true" />
            <h2 className="mt-7 text-2xl font-black">Upgrade your graphics</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
              Compare the graphics cards that are currently published in the
              store.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-300">
              Shop graphics cards{' '}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </a>
          <a
            href="/categories/monitors"
            className="group relative min-h-52 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#10202a,#07101a)] p-6 hover:border-cyan-300/50"
          >
            <Monitor className="size-8 text-cyan-300" aria-hidden="true" />
            <h2 className="mt-7 text-2xl font-black">Find your display</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
              Browse gaming monitors with clear prices and stock status.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-300">
              Shop monitors{' '}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </a>
        </section>

        <ProductShelf
          id="new-arrivals"
          eyebrow="Recently updated"
          title="New arrivals"
          description="The latest published products in the BLACKSHARK catalog."
          products={store.newArrivals}
          href="/search?sort=newest"
        />
        <ProductShelf
          id="featured"
          eyebrow="Selected in the catalog"
          title="Featured products"
          products={store.products}
          href="/search?sort=featured"
          tone="raised"
        />
        <ProductShelf
          id="deals"
          eyebrow="Current price reductions"
          title="Deals"
          description="Only products with a lower sale price appear here."
          products={store.deals}
          href="/deals"
          linkLabel="View all deals"
        />
        <ProductShelf
          title="Gaming PCs"
          products={store.gamingPcs}
          href="/categories/gaming-pcs"
        />
        <ProductShelf
          title="Graphics cards"
          products={store.graphicsCards}
          href="/categories/pc-components?type=graphics-cards"
          tone="raised"
        />
        <ProductShelf
          title="Processors"
          products={store.processors}
          href="/categories/pc-components?type=processors"
        />
        <ProductShelf
          title="Gaming monitors"
          products={store.monitors}
          href="/categories/monitors"
          tone="raised"
        />
        <ProductShelf
          title="Complete your setup"
          products={store.setup}
          href="/categories/gaming-gear"
        />

        {store.brands.length ? (
          <section
            aria-labelledby="brands-title"
            className="border-t border-white/10 bg-[#07101a]"
          >
            <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
                Published products
              </p>
              <h2
                id="brands-title"
                className="mt-2 text-2xl font-black sm:text-3xl"
              >
                Shop by brand
              </h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {store.brands.map((brand) => (
                  <a
                    key={brand.id}
                    href={`/search?q=${encodeURIComponent(brand.name)}`}
                    className="inline-flex min-h-12 items-center rounded-xl border border-white/10 bg-white/5 px-4 font-bold text-slate-200 hover:border-cyan-300/50 hover:text-cyan-300"
                  >
                    {brand.name}
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section
          aria-label="Store tools"
          className="mx-auto grid max-w-[1440px] gap-4 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8"
        >
          {[
            [
              Settings2,
              'Compatibility checks',
              'The PC builder checks listed socket, memory, case, and power details.',
            ],
            [
              SearchCheck,
              'Clear stock status',
              'Product pages show the stock quantity stored in the catalog.',
            ],
            [
              PackageCheck,
              'OMR catalog prices',
              'Regular and sale prices come directly from the product catalog.',
            ],
          ].map(([Icon, title, copy]) => {
            const ToolIcon = Icon as LucideIcon;
            return (
              <div
                key={String(title)}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#080f19] p-5"
              >
                <ToolIcon
                  className="mt-1 size-6 shrink-0 text-cyan-300"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-bold">{String(title)}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {String(copy)}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <StoreFooter categories={store.categories} />
    </div>
  );
}
