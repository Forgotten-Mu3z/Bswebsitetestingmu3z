/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
/* oxlint-disable react/react-compiler -- hydration intentionally restores device-local cart state after mount */
'use client';

import Image from 'next/image';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { StoreProduct } from '@/lib/store-types';
import {
  money,
  productImageAlt,
  productPrice,
  productSpecs,
} from '@/lib/store-types';
import { missingProductImage, resolveProductImage } from '@/lib/product-images';

type CartLine = { product: StoreProduct; quantity: number };

type CommerceContextValue = {
  cart: CartLine[];
  cartCount: number;
  wishlist: StoreProduct[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: StoreProduct) => void;
  isWishlisted: (productId: string) => boolean;
  openCart: () => void;
  openWishlist: () => void;
  showQuickView: (product: StoreProduct) => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);
const CART_KEY = 'blackshark-cart-v1';
const WISHLIST_KEY = 'blackshark-wishlist-v1';

function isStoreProduct(value: unknown): value is StoreProduct {
  if (!value || typeof value !== 'object') return false;
  const product = value as Partial<StoreProduct>;
  return (
    typeof product.id === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.titleEn === 'string' &&
    typeof product.priceBaisa === 'number' &&
    typeof product.stockQuantity === 'number'
  );
}

function readCart(): CartLine[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    return Array.isArray(value)
      ? value
          .filter((line): line is CartLine =>
            Boolean(
              line &&
              typeof line === 'object' &&
              isStoreProduct((line as CartLine).product) &&
              Number.isInteger((line as CartLine).quantity) &&
              (line as CartLine).quantity > 0,
            ),
          )
          .map((line) => ({
            ...line,
            product: {
              ...line.product,
              imageKey: resolveProductImage(
                line.product.slug,
                line.product.imageKey,
              ),
            },
          }))
      : [];
  } catch {
    return [];
  }
}

function readWishlist(): StoreProduct[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) ?? '[]',
    );
    return Array.isArray(value)
      ? value.filter(isStoreProduct).map((product) => ({
          ...product,
          imageKey: resolveProductImage(product.slug, product.imageKey),
        }))
      : [];
  } catch {
    return [];
  }
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<StoreProduct[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickView, setQuickView] = useState<StoreProduct | null>(null);

  useEffect(() => {
    setCart(readCart());
    setWishlist(readWishlist());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [ready, wishlist]);

  const value = useMemo<CommerceContextValue>(
    () => ({
      cart,
      cartCount: cart.reduce((total, line) => total + line.quantity, 0),
      wishlist,
      addToCart(product, quantity = 1) {
        if (product.stockQuantity < 1) return;
        setCart((current) => {
          const existing = current.find(
            (line) => line.product.id === product.id,
          );
          const nextQuantity = Math.min(
            product.stockQuantity,
            (existing?.quantity ?? 0) + Math.max(1, quantity),
          );
          return existing
            ? current.map((line) =>
                line.product.id === product.id
                  ? { product, quantity: nextQuantity }
                  : line,
              )
            : [...current, { product, quantity: nextQuantity }];
        });
        setCartOpen(true);
      },
      updateQuantity(productId, quantity) {
        setCart((current) =>
          current.map((line) =>
            line.product.id === productId
              ? {
                  ...line,
                  quantity: Math.max(
                    1,
                    Math.min(line.product.stockQuantity, quantity),
                  ),
                }
              : line,
          ),
        );
      },
      removeFromCart(productId) {
        setCart((current) =>
          current.filter((line) => line.product.id !== productId),
        );
      },
      toggleWishlist(product) {
        setWishlist((current) =>
          current.some((item) => item.id === product.id)
            ? current.filter((item) => item.id !== product.id)
            : [...current, product],
        );
      },
      isWishlisted(productId) {
        return wishlist.some((item) => item.id === productId);
      },
      openCart: () => setCartOpen(true),
      openWishlist: () => setWishlistOpen(true),
      showQuickView: setQuickView,
    }),
    [cart, wishlist],
  );

  const subtotal = cart.reduce(
    (total, line) => total + productPrice(line.product) * line.quantity,
    0,
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-[92vw] border-cyan-300/20 bg-[#07101a] text-white sm:max-w-md">
          <SheetHeader className="border-b border-white/10">
            <SheetTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="size-5 text-cyan-300" /> Your cart
            </SheetTitle>
            <SheetDescription>Items are saved on this device.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4">
            {cart.length ? (
              <ul className="divide-y divide-white/10">
                {cart.map((line) => (
                  <li key={line.product.id} className="flex gap-3 py-4">
                    <Image
                      src={line.product.imageKey ?? missingProductImage}
                      alt=""
                      width={72}
                      height={72}
                      unoptimized={line.product.imageKey?.startsWith('/api/')}
                      className="size-18 rounded-xl bg-black/30 object-contain p-2"
                    />
                    <div className="min-w-0 flex-1">
                      <a
                        href={`/products/${line.product.slug}`}
                        className="line-clamp-2 font-bold hover:text-cyan-300"
                      >
                        {line.product.titleEn}
                      </a>
                      <p className="mt-1 text-sm tabular-nums text-cyan-200">
                        {money(productPrice(line.product))}
                      </p>
                      <div className="mt-3 flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="size-11"
                          aria-label={`Decrease ${line.product.titleEn} quantity`}
                          onClick={() =>
                            value.updateQuantity(
                              line.product.id,
                              line.quantity - 1,
                            )
                          }
                          disabled={line.quantity <= 1}
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
                          aria-label={`Increase ${line.product.titleEn} quantity`}
                          onClick={() =>
                            value.updateQuantity(
                              line.product.id,
                              line.quantity + 1,
                            )
                          }
                          disabled={line.quantity >= line.product.stockQuantity}
                        >
                          <Plus />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="ml-auto size-11 text-red-300"
                          aria-label={`Remove ${line.product.titleEn} from cart`}
                          onClick={() => value.removeFromCart(line.product.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid min-h-64 place-items-center text-center">
                <div>
                  <ShoppingCart className="mx-auto size-9 text-slate-500" />
                  <p className="mt-4 font-bold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Add a product to see it here.
                  </p>
                </div>
              </div>
            )}
          </div>
          {cart.length ? (
            <div className="border-t border-white/10 p-4">
              <div className="mb-4 flex justify-between text-base font-black">
                <span>Subtotal</span>
                <span className="tabular-nums">{money(subtotal)}</span>
              </div>
              <a
                href="/cart"
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-cyan-300 px-5 font-black text-[#031019] hover:bg-cyan-200"
              >
                View cart
              </a>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
        <SheetContent className="w-[92vw] border-cyan-300/20 bg-[#07101a] text-white sm:max-w-md">
          <SheetHeader className="border-b border-white/10">
            <SheetTitle className="flex items-center gap-2 text-white">
              <Heart className="size-5 text-cyan-300" /> Wishlist
            </SheetTitle>
            <SheetDescription>
              Saved products stay on this device.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4">
            {wishlist.length ? (
              <ul className="divide-y divide-white/10">
                {wishlist.map((product) => (
                  <li key={product.id} className="flex gap-3 py-4">
                    <Image
                      src={product.imageKey ?? missingProductImage}
                      alt=""
                      width={72}
                      height={72}
                      unoptimized={product.imageKey?.startsWith('/api/')}
                      className="size-18 rounded-xl bg-black/30 object-contain p-2"
                    />
                    <div className="min-w-0 flex-1">
                      <a
                        href={`/products/${product.slug}`}
                        className="line-clamp-2 font-bold hover:text-cyan-300"
                      >
                        {product.titleEn}
                      </a>
                      <p className="mt-1 text-sm tabular-nums text-cyan-200">
                        {money(productPrice(product))}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          className="h-11 bg-cyan-300 px-3 font-bold text-[#031019] hover:bg-cyan-200"
                          disabled={product.stockQuantity < 1}
                          onClick={() => value.addToCart(product)}
                        >
                          Add to cart
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-lg"
                          className="size-11"
                          aria-label={`Remove ${product.titleEn} from wishlist`}
                          onClick={() => value.toggleWishlist(product)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid min-h-64 place-items-center text-center">
                <div>
                  <Heart className="mx-auto size-9 text-slate-500" />
                  <p className="mt-4 font-bold">Your wishlist is empty</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Save products to compare later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(quickView)}
        onOpenChange={(open) => !open && setQuickView(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-cyan-300/20 bg-[#08121e] p-0 text-white sm:max-w-2xl">
          {quickView ? (
            <div className="grid sm:grid-cols-2">
              <div className="grid min-h-64 place-items-center bg-black/25 p-8">
                <Image
                  src={quickView.imageKey ?? missingProductImage}
                  alt={productImageAlt(quickView)}
                  width={360}
                  height={360}
                  unoptimized={quickView.imageKey?.startsWith('/api/')}
                  className="max-h-72 w-full object-contain"
                />
              </div>
              <div className="p-6">
                <DialogHeader>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">
                    {quickView.brand ?? quickView.category}
                  </p>
                  <DialogTitle className="pr-8 text-xl leading-7 text-white">
                    {quickView.titleEn}
                  </DialogTitle>
                  <DialogDescription className="text-slate-300">
                    {productSpecs(quickView.shortDescription)}
                  </DialogDescription>
                </DialogHeader>
                <p className="mt-6 text-2xl font-black tabular-nums">
                  {money(productPrice(quickView))}
                </p>
                <p
                  className={`mt-2 text-sm font-bold ${quickView.stockQuantity > 0 ? 'text-emerald-300' : 'text-red-300'}`}
                >
                  {quickView.stockQuantity > 0 ? 'In stock' : 'Out of stock'}
                </p>
                <div className="mt-6 grid gap-2">
                  <Button
                    type="button"
                    className="h-12 bg-cyan-300 font-black text-[#031019] hover:bg-cyan-200"
                    disabled={quickView.stockQuantity < 1}
                    onClick={() => value.addToCart(quickView)}
                  >
                    Add to cart
                  </Button>
                  <a
                    href={`/products/${quickView.slug}`}
                    className="flex min-h-12 items-center justify-center rounded-lg border border-white/15 font-bold hover:border-cyan-300/50"
                  >
                    View product details
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const value = useContext(CommerceContext);
  if (!value)
    throw new Error('useCommerce must be used inside CommerceProvider');
  return value;
}
