'use client';

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { StoreProduct } from '@/lib/store-types';
import { useCommerce } from './commerce-provider';

export function ProductActions({ product }: { product: StoreProduct }) {
  const [quantity, setQuantity] = useState(1);
  const commerce = useCommerce();
  const wishlisted = commerce.isWishlisted(product.id);
  const inStock = product.stockQuantity > 0;

  return (
    <div className="mt-7 border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="product-quantity"
            className="mb-2 block text-sm font-bold"
          >
            Quantity
          </label>
          <Input
            id="product-quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={Math.max(1, product.stockQuantity)}
            value={quantity}
            disabled={!inStock}
            onChange={(event) => {
              const next = Number(event.target.value);
              setQuantity(
                Number.isFinite(next)
                  ? Math.max(
                      1,
                      Math.min(product.stockQuantity, Math.round(next)),
                    )
                  : 1,
              );
            }}
            className="h-12 w-24 text-center tabular-nums"
          />
        </div>
        <Button
          type="button"
          disabled={!inStock}
          onClick={() => commerce.addToCart(product, quantity)}
          className="h-12 flex-1 bg-cyan-300 px-5 font-black text-[#031019] hover:bg-cyan-200"
        >
          <ShoppingCart /> {inStock ? 'Add to cart' : 'Out of stock'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          onClick={() => commerce.toggleWishlist(product)}
          className={`size-12 border-white/15 bg-white/5 ${wishlisted ? 'text-cyan-300' : ''}`}
        >
          <Heart className={wishlisted ? 'fill-current' : ''} />
        </Button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Your cart is saved on this device. Checkout is not available yet.
      </p>
    </div>
  );
}
