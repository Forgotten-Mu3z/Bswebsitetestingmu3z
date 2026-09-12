import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { PcBuilder } from '@/components/store/pc-builder';
import { StoreHeader } from '@/components/store/store-header';
import { getPcBuilderData } from '@/server/storefront';

export const metadata: Metadata = {
  title: 'Build Your PC | BLACKSHARK',
  description:
    'Choose compatible PC components and build a gaming PC with live OMR pricing.',
};

export default async function BuildPage() {
  const { categories, products } = await getPcBuilderData();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to PC builder
      </a>
      <StoreHeader categories={categories} />
      <main
        id="main-content"
        className="min-h-screen overflow-x-hidden bg-[#03060c] pb-28 text-white lg:pb-16"
      >
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_82%_10%,rgba(34,211,238,.14),transparent_30%),linear-gradient(180deg,#07111c_0%,#03060c_100%)]">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-11 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
              <a
                href="/"
                className="rounded-sm hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
              >
                Home
              </a>
              <span aria-hidden="true"> / </span>
              <span>PC Builder</span>
            </nav>
            <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-300">
                  Compatibility-Checked Builder
                </p>
                <h1 className="mt-2 text-balance text-4xl font-black tracking-[-.035em] sm:text-5xl lg:text-6xl">
                  Build Your PC
                </h1>
                <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg">
                  Start with a processor. BLACKSHARK will show matching
                  motherboards, RAM, cases, and power supplies as you build.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-emerald-200">
                  <ShieldCheck aria-hidden="true" className="size-4" />{' '}
                  Compatibility on
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  OMR pricing
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <PcBuilder products={products} />
        </div>
      </main>
    </>
  );
}
