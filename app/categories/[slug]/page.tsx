import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StoreHeader } from '@/components/store/store-header';
import { getCategoryPage } from '@/server/storefront';

const omr = new Intl.NumberFormat('en-OM', { style: 'currency', currency: 'OMR', minimumFractionDigits: 3 });

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryPage(slug);
  if (!data) notFound();
  return <main className="min-h-screen bg-[#03060c] text-white"><StoreHeader categories={data.categories} /><section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8"><nav aria-label="Breadcrumb" className="text-sm text-slate-400"><Link href="/" className="hover:text-cyan-300">Home</Link><span aria-hidden="true"> / </span><span>{data.category.nameEn}</span></nav><h1 className="mt-6 text-balance text-4xl font-black sm:text-6xl">{data.category.nameEn}</h1><p className="mt-4 max-w-2xl text-lg text-slate-400">Explore BLACKSHARK-selected {data.category.nameEn.toLowerCase()} available for Oman and the GCC.</p>{data.products.length ? <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{data.products.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1420]"><div className="grid aspect-square place-items-center bg-[#09111d]"><Image src={product.imageKey ?? '/blackshark-logo.png'} alt="" width={220} height={220} className="h-3/5 w-3/5 rounded-2xl object-cover" /></div><div className="p-5"><p className="text-xs font-bold text-cyan-300">{product.sku}</p><h2 className="mt-2 font-bold">{product.titleEn}</h2><p className="mt-4 font-black tabular-nums">{omr.format((product.salePriceBaisa ?? product.priceBaisa) / 1000)}</p></div></article>)}</div> : <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a111d] p-8"><h2 className="text-xl font-bold">Products Coming Soon</h2><p className="mt-2 text-slate-400">This department is live and ready for staff to publish its first products.</p></div>}</section></main>;
}
