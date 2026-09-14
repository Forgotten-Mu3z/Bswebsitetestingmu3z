export type StoreProduct = {
  id: string;
  slug: string;
  sku: string;
  titleEn: string;
  shortDescription: string;
  priceBaisa: number;
  salePriceBaisa: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  imageKey: string | null;
  featured: boolean;
  brand: string | null;
  brandSlug: string | null;
  category: string;
  categorySlug: string;
  updatedAt: number;
};

const omr = new Intl.NumberFormat('en-OM', {
  style: 'currency',
  currency: 'OMR',
  minimumFractionDigits: 3,
});

export function money(value: number) {
  return omr.format(value / 1000);
}

export function productPrice(product: StoreProduct) {
  return product.salePriceBaisa !== null &&
    product.salePriceBaisa < product.priceBaisa
    ? product.salePriceBaisa
    : product.priceBaisa;
}

export function productType(description: string) {
  const [type] = description.split(' · ');
  return type === description ? '' : type;
}

export function productSpecs(description: string) {
  const parts = description.split(' · ');
  return parts.length > 1 ? parts.slice(1).join(' · ') : description;
}

export function productImageAlt(product: StoreProduct) {
  return !product.imageKey || product.imageKey === '/blackshark-logo.png'
    ? `BLACKSHARK logo placeholder for ${product.titleEn}`
    : product.titleEn;
}
