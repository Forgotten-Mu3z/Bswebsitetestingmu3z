/* oxlint-disable next/no-html-link-for-pages -- Vinext Link currently emits RSC prefetch errors in the compiled Worker */
'use client';

import Image from 'next/image';
import {
  ChevronDown,
  Heart,
  Menu,
  ShoppingCart,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PC_COMPONENT_TYPES } from '@/lib/catalog';
import { useCommerce } from './commerce-provider';
import { SearchBox } from './search-box';
import { SearchShortcut } from './search-shortcut';

type Category = { id: string; slug: string; nameEn: string };

export function StoreHeader({ categories }: { categories: Category[] }) {
  const commerce = useCommerce();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050913]/95 text-white shadow-[0_8px_30px_rgba(0,0,0,.18)] backdrop-blur-xl">
      <SearchShortcut />
      <div className="mx-auto flex h-17 max-w-[1440px] items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                aria-label="Open navigation menu"
                variant="ghost"
                size="icon-lg"
                className="size-11 lg:hidden"
              />
            }
          >
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[88vw] overscroll-contain border-cyan-400/20 bg-[#07101d] text-white sm:max-w-sm"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Shop BLACKSHARK</SheetTitle>
              <SheetDescription>Browse all store departments.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="grid gap-1 px-4 pb-6">
              <a href="/build" className="rounded-lg bg-cyan-300 px-3 py-3 font-black text-[#031019]">Build your PC</a>
              {categories.map((category) => (
                <a key={category.id} href={`/categories/${category.slug}`} className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-cyan-400/10 focus-visible:outline-2 focus-visible:outline-cyan-300">
                  {category.nameEn}
                </a>
              ))}
              <details className="group rounded-lg">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-lg px-3 font-semibold hover:bg-white/5 [&::-webkit-details-marker]:hidden">
                  PC component types
                  <ChevronDown className="size-4 transition group-open:rotate-180" />
                </summary>
                <div className="grid pl-3">
                  {PC_COMPONENT_TYPES.map((type) => (
                    <a key={type.value} href={`/categories/pc-components?type=${type.value}`} className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:text-cyan-300">
                      {type.label}
                    </a>
                  ))}
                </div>
              </details>
              <a href="/deals" className="rounded-lg px-3 py-3 font-semibold text-cyan-300">Deals</a>
              <a href="/admin" className="rounded-lg px-3 py-3 font-semibold text-slate-300">Admin panel</a>
            </nav>
          </SheetContent>
        </Sheet>

        <a href="/" aria-label="BLACKSHARK home" className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
          <Image src="/blackshark-logo.png" alt="BLACKSHARK BS Gaming logo" width={54} height={54} priority className="size-11 rounded-xl sm:size-13" />
          <span className="hidden text-lg font-black tracking-[0.12em] text-white sm:block">BLACK<span className="text-cyan-300">SHARK</span></span>
        </a>

        <div className="mx-auto hidden max-w-2xl flex-1 md:block"><SearchBox /></div>

        <nav aria-label="Customer tools" className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Button type="button" aria-label={`Wishlist, ${commerce.wishlist.length} items`} variant="ghost" size="icon-lg" className="relative size-11" onClick={commerce.openWishlist}>
            <Heart />
            {commerce.wishlist.length ? <span className="absolute right-0 top-0 grid min-w-5 place-items-center rounded-full bg-cyan-300 px-1 text-[10px] font-black text-[#031019]">{commerce.wishlist.length}</span> : null}
          </Button>
          <a href="/admin" aria-label="Admin account" title="Admin account" className="hidden size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300 sm:inline-flex"><UserRound /></a>
          <Button type="button" aria-label={`Cart, ${commerce.cartCount} items`} variant="ghost" size="icon-lg" className="relative size-11" onClick={commerce.openCart}>
            <ShoppingCart />
            {commerce.cartCount ? <span className="absolute right-0 top-0 grid min-w-5 place-items-center rounded-full bg-cyan-300 px-1 text-[10px] font-black text-[#031019]">{commerce.cartCount}</span> : null}
          </Button>
        </nav>
      </div>

      <div className="px-4 pb-3 md:hidden"><SearchBox compact /></div>

      <nav aria-label="Product departments" className="hidden border-t border-white/6 lg:block">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-6 px-8 text-sm font-bold text-slate-300">
          <details className="group relative h-full">
            <summary className="flex h-full cursor-pointer list-none items-center gap-2 rounded-md px-3 text-white hover:bg-white/5 [&::-webkit-details-marker]:hidden">
              All categories <ChevronDown className="size-4 transition group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 top-[calc(100%+.5rem)] z-50 grid w-[720px] grid-cols-[.9fr_1.3fr_.8fr] gap-7 rounded-2xl border border-cyan-300/20 bg-[#08131f] p-6 shadow-2xl">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Departments</p>
                <div className="mt-3 grid gap-1">
                  {categories.map((category) => <a key={category.id} href={`/categories/${category.slug}`} className="rounded-lg px-2 py-2 hover:bg-white/6 hover:text-cyan-300">{category.nameEn}</a>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">PC components</p>
                <div className="mt-3 grid grid-cols-2 gap-1">
                  {PC_COMPONENT_TYPES.map((type) => <a key={type.value} href={`/categories/pc-components?type=${type.value}`} className="rounded-lg px-2 py-2 hover:bg-white/6 hover:text-cyan-300">{type.label}</a>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Tools</p>
                <div className="mt-3 grid gap-1">
                  <a href="/build" className="rounded-lg bg-cyan-300/10 px-3 py-3 text-cyan-200 hover:bg-cyan-300/15">Build your PC</a>
                  <a href="/deals" className="rounded-lg px-3 py-3 hover:bg-white/6 hover:text-cyan-300">Deals</a>
                  <a href="/search" className="rounded-lg px-3 py-3 hover:bg-white/6 hover:text-cyan-300">All products</a>
                </div>
              </div>
            </div>
          </details>
          {categories.slice(0, 5).map((category) => <a key={category.id} href={`/categories/${category.slug}`} className="whitespace-nowrap hover:text-cyan-300">{category.nameEn}</a>)}
          <a href="/build" className="whitespace-nowrap text-cyan-200 hover:text-cyan-300">Build your PC</a>
          <a href="/deals" className="ml-auto whitespace-nowrap text-cyan-300">Deals</a>
        </div>
      </nav>
    </header>
  );
}
