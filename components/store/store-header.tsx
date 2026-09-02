'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingCart, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
type Category = { id: string; slug: string; nameEn: string };
export function StoreHeader({ categories }: { categories: Category[] }) {
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050913]/95 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
      <Sheet><SheetTrigger render={<Button aria-label="Open navigation menu" variant="ghost" size="icon-lg" className="lg:hidden" />}><Menu aria-hidden="true" /></SheetTrigger><SheetContent side="left" className="overscroll-contain border-cyan-400/20 bg-[#07101d] text-white"><SheetHeader><SheetTitle className="text-white">Shop BLACKSHARK</SheetTitle><SheetDescription>Browse our gaming departments.</SheetDescription></SheetHeader><nav aria-label="Mobile navigation" className="grid gap-1 px-4">{categories.map((category) => <Link key={category.id} href={`/categories/${category.slug}`} className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-cyan-400/10 focus-visible:outline-2 focus-visible:outline-cyan-300">{category.nameEn}</Link>)}<Link href="/deals" className="rounded-lg px-3 py-3 font-semibold text-cyan-300">Deals</Link></nav></SheetContent></Sheet>
      <Link href="/" aria-label="BLACKSHARK home" className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-cyan-300"><Image src="/blackshark-logo.png" alt="BS Gaming shark logo" width={56} height={56} priority className="rounded-xl" /><span className="hidden text-lg font-black tracking-[0.14em] text-white sm:block">BLACK<span className="text-cyan-300">SHARK</span></span></Link>
      <search className="mx-auto hidden max-w-2xl flex-1 md:flex"><form action="/search" className="w-full"><label htmlFor="site-search" className="sr-only">Search products, brands, categories, or SKU</label><div className="relative w-full"><Search aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input id="site-search" name="q" autoComplete="off" placeholder="Search PCs, components, gaming gear…" className="h-12 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-slate-500" /></div></form></search>
      <nav aria-label="Customer tools" className="ml-auto flex items-center gap-1"><Button aria-label="Search" variant="ghost" size="icon-lg" className="md:hidden"><Search /></Button><Button aria-label="Wishlist" variant="ghost" size="icon-lg" className="hidden sm:inline-flex"><Heart /></Button><Button aria-label="Account" variant="ghost" size="icon-lg"><UserRound /></Button><Button aria-label="Cart, 0 items" variant="ghost" size="icon-lg" className="relative"><ShoppingCart /><span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-cyan-300 text-[10px] font-black text-[#04101b]">0</span></Button></nav>
    </div>
    <nav aria-label="Product departments" className="hidden border-t border-white/5 lg:block"><div className="mx-auto flex max-w-[1440px] items-center gap-7 overflow-x-auto px-8 py-3 text-sm font-bold text-slate-300">{categories.map((category) => <Link key={category.id} href={`/categories/${category.slug}`} className="whitespace-nowrap transition-colors hover:text-cyan-300">{category.nameEn}</Link>)}<Link href="/deals" className="ml-auto whitespace-nowrap text-cyan-300">Flash Deals</Link></div></nav>
  </header>;
}
