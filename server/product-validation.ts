export class ProductValidationError extends Error {
  constructor(
    message: string,
    public field: string,
  ) {
    super(message);
  }
}
export function validateProduct(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ProductValidationError('Invalid product.', 'title_en');
  const v = value as Record<string, unknown>;
  const text = (key: string, max: number, required = true) => {
    if (
      typeof v[key] !== 'string' ||
      (v[key] as string).trim().length > max ||
      (required && !(v[key] as string).trim())
    )
      throw new ProductValidationError(
        `Enter ${key.replaceAll('_', ' ')} (up to ${max} characters).`,
        key,
      );
    return (v[key] as string).trim();
  };
  const money = (key: string, optional = false) => {
    const raw = text(key, 12, !optional);
    if (!raw && optional) return null;
    if (!/^\d{1,6}(\.\d{1,3})?$/.test(raw))
      throw new ProductValidationError(
        'Use a non-negative OMR amount with up to 3 decimal places.',
        key,
      );
    return Math.round(Number(raw) * 1000);
  };
  const title_en = text('title_en', 180),
    title_ar = text('title_ar', 180, false);
  const slug = text('slug', 180),
    sku = text('sku', 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new ProductValidationError(
      'Use lowercase letters, numbers, and single hyphens.',
      'slug',
    );
  const price_baisa = money('price')!;
  const sale_price_baisa = money('sale_price', true);
  if (sale_price_baisa !== null && sale_price_baisa >= price_baisa)
    throw new ProductValidationError(
      'Sale price must be lower than regular price.',
      'sale_price',
    );
  const stock = text('stock_quantity', 7);
  if (!/^\d{1,6}$/.test(stock))
    throw new ProductValidationError(
      'Enter a whole stock quantity from 0 to 999999.',
      'stock_quantity',
    );
  const lowStockThreshold = text('low_stock_threshold', 7);
  if (!/^\d{1,6}$/.test(lowStockThreshold))
    throw new ProductValidationError(
      'Enter a whole low-stock threshold from 0 to 999999.',
      'low_stock_threshold',
    );
  const status = text('status', 12);
  if (!['DRAFT', 'HIDDEN', 'PUBLISHED'].includes(status))
    throw new ProductValidationError('Select a valid status.', 'status');
  const image_key = text('image_key', 160, false) || null;
  if (
    image_key &&
    image_key !== '/blackshark-logo.png' &&
    !/^\/api\/product-images\/[a-f0-9-]{36}$/.test(image_key)
  )
    throw new ProductValidationError(
      'Upload a product image using the image field.',
      'image_key',
    );
  if (typeof v.featured !== 'boolean')
    throw new ProductValidationError(
      'Select a valid featured setting.',
      'featured',
    );
  return {
    title_en,
    title_ar,
    slug,
    sku,
    short_description: text('short_description', 3000),
    category_id: text('category_id', 80),
    brand_id: text('brand_id', 80, false) || null,
    price_baisa,
    sale_price_baisa,
    stock_quantity: Number(stock),
    low_stock_threshold: Number(lowStockThreshold),
    status,
    featured: v.featured ? 1 : 0,
    image_key,
  };
}
