import { and, asc, desc, eq, gt, like, or, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { brands, categories, products } from '@/db/schema';
import type { StoreProduct } from '@/lib/store-types';

const storeProductFields = {
  id: products.id,
  slug: products.slug,
  sku: products.sku,
  titleEn: products.titleEn,
  shortDescription: products.shortDescription,
  priceBaisa: products.priceBaisa,
  salePriceBaisa: products.salePriceBaisa,
  stockQuantity: products.stockQuantity,
  lowStockThreshold: products.lowStockThreshold,
  imageKey: products.imageKey,
  featured: products.featured,
  brand: brands.name,
  brandSlug: brands.slug,
  category: categories.nameEn,
  categorySlug: categories.slug,
  updatedAt: products.updatedAt,
};

function mapStoreProduct(
  row: Omit<StoreProduct, 'updatedAt'> & { updatedAt: Date },
): StoreProduct {
  return { ...row, updatedAt: row.updatedAt.getTime() };
}

export async function searchCatalog(
  query: string,
  sort: string,
  inStock: boolean,
) {
  const term = query.trim().slice(0, 120);
  const price = sql<number>`coalesce(${products.salePriceBaisa}, ${products.priceBaisa})`;
  const rows = await getDb()
    .select(storeProductFields)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.status, 'PUBLISHED'),
        eq(categories.enabled, true),
        inStock ? gt(products.stockQuantity, 0) : undefined,
        term
          ? or(
              like(products.titleEn, `%${term}%`),
              like(products.titleAr, `%${term}%`),
              like(products.sku, `%${term}%`),
              like(products.shortDescription, `%${term}%`),
              like(categories.nameEn, `%${term}%`),
              like(categories.nameAr, `%${term}%`),
              like(brands.name, `%${term}%`),
            )
          : undefined,
      ),
    )
    .orderBy(
      sort === 'price-low'
        ? asc(price)
        : sort === 'price-high'
          ? desc(price)
          : sort === 'featured'
            ? desc(products.featured)
            : desc(products.updatedAt),
      desc(products.updatedAt),
    )
    .limit(60);
  return rows.map(mapStoreProduct);
}

export async function getSearchSuggestions(query: string) {
  const term = query.trim().slice(0, 80);
  if (term.length < 2) return [];
  const rows = await getDb()
    .select(storeProductFields)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.status, 'PUBLISHED'),
        eq(categories.enabled, true),
        or(
          like(products.titleEn, `%${term}%`),
          like(products.sku, `%${term}%`),
          like(products.shortDescription, `%${term}%`),
          like(categories.nameEn, `%${term}%`),
          like(brands.name, `%${term}%`),
        ),
      ),
    )
    .orderBy(desc(products.featured), desc(products.updatedAt))
    .limit(6);
  return rows.map(mapStoreProduct);
}

export async function getProduct(slug: string) {
  const [row] = await getDb()
    .select({
      product: products,
      category: categories.nameEn,
      categorySlug: categories.slug,
      brand: brands.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.slug, slug),
        eq(products.status, 'PUBLISHED'),
        eq(categories.enabled, true),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function getSitemapEntries() {
  const db = getDb();
  const [productRows, categoryRows] = await Promise.all([
    db
      .select({ slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(eq(products.status, 'PUBLISHED'), eq(categories.enabled, true)),
      ),
    db
      .select({ slug: categories.slug })
      .from(categories)
      .where(eq(categories.enabled, true)),
  ]);
  return { products: productRows, categories: categoryRows };
}
