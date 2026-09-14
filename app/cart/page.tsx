import { CartPageContent } from '@/components/store/cart-page-content';
import { StoreFooter } from '@/components/store/store-footer';
import { StoreHeader } from '@/components/store/store-header';
import { getStoreShellData } from '@/server/storefront';

export const metadata = {
  title: 'Your Cart | BLACKSHARK',
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const store = await getStoreShellData();
  return (
    <div className="min-h-screen bg-[#03060c]">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-cyan-300 focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950"
      >
        Skip to cart
      </a>
      <StoreHeader categories={store.categories} />
      <CartPageContent />
      <StoreFooter categories={store.categories} />
    </div>
  );
}
