import { and, asc, desc, eq, gt, like, or, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { brands, categories, products } from '@/db/schema';

export async function searchCatalog(
  query: string,
  sort: string,
  inStock: boolean,
) {
  const term = query.trim().slice(0, 120);
  const price = sql<number>`coalesce(${products.salePriceBaisa}, ${products.priceBaisa})`;
  return getDb()
    .select({
      product: products,
      category: categories.nameEn,
      brand: brands.name,
    })
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
          : desc(products.updatedAt),
    )
    .limit(60);
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
