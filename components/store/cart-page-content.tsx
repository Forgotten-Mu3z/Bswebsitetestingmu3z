/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommerce } from './commerce-provider';
import { money, productPrice } from '@/lib/store-types';

export function CartPageContent() {
  const commerce = useCommerce();
  const subtotal = commerce.cart.reduce(
    (total, line) => total + productPrice(line.product) * line.quantity,
    0,
  );

  return (
    <main
      id="main-content"
      className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 text-white sm:px-6 lg:px-8"
    >
      <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
        Saved on this device
      </p>
      <h1 className="mt-2 text-4xl font-black">Your cart</h1>
      {!commerce.cart.length ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#08111c] p-8 text-center">
          <ShoppingCart className="mx-auto size-10 text-slate-500" />
          <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-slate-400">
            Browse the catalog and add a product.
          </p>
          <a
            href="/search"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-cyan-300 px-5 font-black text-[#031019] hover:bg-cyan-200"
          >
            Browse products
          </a>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#08111c] px-4 sm:px-6">
            {commerce.cart.map((line) => (
              <li
                key={line.product.id}
                className="grid grid-cols-[72px_1fr] gap-4 py-5 sm:grid-cols-[100px_1fr_auto] sm:items-center"
              >
                <Image
                  src={line.product.imageKey ?? '/blackshark-logo.png'}
                  alt=""
                  width={100}
                  height={100}
                  unoptimized={line.product.imageKey?.startsWith('/api/')}
                  className="size-18 rounded-xl bg-black/30 object-contain p-2 sm:size-25"
                />
                <div className="min-w-0">
                  <a
                    href={`/products/${line.product.slug}`}
                    className="line-clamp-2 font-bold hover:text-cyan-300"
                  >
                    {line.product.titleEn}
                  </a>
                  <p className="mt-1 text-sm tabular-nums text-cyan-200">
                    {money(productPrice(line.product))} each
                  </p>
                  <div className="mt-3 flex items-center gap-1 sm:hidden">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="size-11"
                      aria-label="Decrease quantity"
                      disabled={line.quantity <= 1}
                      onClick={() =>
                        commerce.updateQuantity(
                          line.product.id,
                          line.quantity - 1,
                        )
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="min-w-9 text-center tabular-nums">
                      {line.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="size-11"
                      aria-label="Increase quantity"
                      disabled={line.quantity >= line.product.stockQuantity}
                      onClick={() =>
                        commerce.updateQuantity(
                          line.product.id,
                          line.quantity + 1,
                        )
                      }
                    >
                      <Plus />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto size-11 text-red-300"
                      aria-label={`Remove ${line.product.titleEn}`}
                      onClick={() => commerce.removeFromCart(line.product.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="font-black tabular-nums">
                    {money(productPrice(line.product) * line.quantity)}
                  </p>
                  <div className="mt-3 flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="size-11"
                      aria-label="Decrease quantity"
                      disabled={line.quantity <= 1}
                      onClick={() =>
                        commerce.updateQuantity(
                          line.product.id,
                          line.quantity - 1,
                        )
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="min-w-9 text-center tabular-nums">
                      {line.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="size-11"
                      aria-label="Increase quantity"
                      disabled={line.quantity >= line.product.stockQuantity}
                      onClick={() =>
                        commerce.updateQuantity(
                          line.product.id,
                          line.quantity + 1,
                        )
                      }
                    >
                      <Plus />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-11 text-red-300"
                      aria-label={`Remove ${line.product.titleEn}`}
                      onClick={() => commerce.removeFromCart(line.product.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="self-start rounded-2xl border border-white/10 bg-[#08111c] p-5 lg:sticky lg:top-36">
            <h2 className="text-xl font-black">Order summary</h2>
            <div className="mt-5 flex justify-between border-t border-white/10 pt-5 font-bold">
              <span>Subtotal</span>
              <span className="tabular-nums" aria-live="polite">
                {money(subtotal)}
              </span>
            </div>
            <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/8 p-3 text-sm leading-6 text-amber-100">
              Checkout is not available yet. Payment and delivery rules must be
              confirmed before it can be added.
            </p>
            <a
              href="/search"
              className="mt-4 flex min-h-11 items-center justify-center rounded-lg border border-white/15 font-bold hover:border-cyan-300/50"
            >
              Continue shopping
            </a>
          </aside>
        </div>
      )}
    </main>
  );
}
