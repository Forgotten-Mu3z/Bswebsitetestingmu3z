import {
  and,
  asc,
  count,
  desc,
  eq,
  isNotNull,
  like,
  lt,
  ne,
  or,
} from 'drizzle-orm';
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

function storeProductQuery() {
  return getDb()
    .select(storeProductFields)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id));
}

const published = and(
  eq(products.status, 'PUBLISHED'),
  eq(categories.enabled, true),
);

export async function getStoreShellData() {
  const db = getDb();
  const categoryRows = await db
    .select()
    .from(categories)
    .where(eq(categories.enabled, true))
    .orderBy(asc(categories.sortOrder));

  return { categories: categoryRows };
}

export async function getStorefrontData() {
  const db = getDb();
  const [
    shell,
    featuredRows,
    newestRows,
    dealRows,
    gamingPcRows,
    graphicsCardRows,
    processorRows,
    monitorRows,
    setupRows,
    brandRows,
  ] = await Promise.all([
    getStoreShellData(),
    storeProductQuery()
      .where(and(published, eq(products.featured, true)))
      .orderBy(desc(products.updatedAt))
      .limit(8),
    storeProductQuery()
      .where(published)
      .orderBy(desc(products.updatedAt))
      .limit(8),
    storeProductQuery()
      .where(
        and(
          published,
          isNotNull(products.salePriceBaisa),
          lt(products.salePriceBaisa, products.priceBaisa),
        ),
      )
      .orderBy(desc(products.updatedAt))
      .limit(8),
    storeProductQuery()
      .where(and(published, eq(categories.slug, 'gaming-pcs')))
      .orderBy(desc(products.updatedAt))
      .limit(4),
    storeProductQuery()
      .where(
        and(
          published,
          eq(categories.slug, 'pc-components'),
          like(products.shortDescription, 'Graphics Card ·%'),
        ),
      )
      .orderBy(desc(products.updatedAt))
      .limit(4),
    storeProductQuery()
      .where(
        and(
          published,
          eq(categories.slug, 'pc-components'),
          like(products.shortDescription, 'Processor ·%'),
        ),
      )
      .orderBy(desc(products.updatedAt))
      .limit(4),
    storeProductQuery()
      .where(and(published, eq(categories.slug, 'monitors')))
      .orderBy(desc(products.updatedAt))
      .limit(4),
    storeProductQuery()
      .where(
        and(
          published,
          or(
            eq(categories.slug, 'gaming-gear'),
            eq(categories.slug, 'consoles'),
          ),
        ),
      )
      .orderBy(desc(products.updatedAt))
      .limit(4),
    db
      .select({
        id: brands.id,
        slug: brands.slug,
        name: brands.name,
        productCount: count(products.id),
      })
      .from(brands)
      .innerJoin(products, eq(products.brandId, brands.id))
      .where(eq(products.status, 'PUBLISHED'))
      .groupBy(brands.id, brands.slug, brands.name)
      .orderBy(desc(count(products.id)), asc(brands.name))
      .limit(18),
  ]);

  return {
    ...shell,
    products: featuredRows.map(mapStoreProduct),
    newArrivals: newestRows.map(mapStoreProduct),
    deals: dealRows.map(mapStoreProduct),
    gamingPcs: gamingPcRows.map(mapStoreProduct),
    graphicsCards: graphicsCardRows.map(mapStoreProduct),
    processors: processorRows.map(mapStoreProduct),
    monitors: monitorRows.map(mapStoreProduct),
    setup: setupRows.map(mapStoreProduct),
    brands: brandRows,
  };
}

export async function getCategoryPage(slug: string) {
  const db = getDb();
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.enabled, true)))
    .limit(1);
  if (!category) return null;
  const [allCategories, categoryProducts] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(eq(categories.enabled, true))
      .orderBy(asc(categories.sortOrder)),
    storeProductQuery()
      .where(
        and(
          eq(products.categoryId, category.id),
          eq(products.status, 'PUBLISHED'),
          eq(categories.enabled, true),
        ),
      )
      .orderBy(desc(products.updatedAt)),
  ]);
  return {
    category,
    categories: allCategories,
    products: categoryProducts.map(mapStoreProduct),
  };
}

export async function getCategoryMetadata(slug: string) {
  const [category] = await getDb()
    .select({ name: categories.nameEn, slug: categories.slug })
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.enabled, true)))
    .limit(1);
  return category ?? null;
}

export async function getDealProducts() {
  const rows = await storeProductQuery()
    .where(
      and(
        published,
        isNotNull(products.salePriceBaisa),
        lt(products.salePriceBaisa, products.priceBaisa),
      ),
    )
    .orderBy(desc(products.updatedAt))
    .limit(60);
  return rows.map(mapStoreProduct);
}

export async function getRelatedProducts(
  categoryId: string,
  productId: string,
) {
  const rows = await storeProductQuery()
    .where(
      and(
        published,
        eq(products.categoryId, categoryId),
        ne(products.id, productId),
      ),
    )
    .orderBy(desc(products.featured), desc(products.updatedAt))
    .limit(4);
  return rows.map(mapStoreProduct);
}

export async function getPcBuilderData() {
  const db = getDb();
  const [categoryRows, productRows] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(eq(categories.enabled, true))
      .orderBy(asc(categories.sortOrder)),
    db
      .select({
        id: products.id,
        slug: products.slug,
        sku: products.sku,
        titleEn: products.titleEn,
        shortDescription: products.shortDescription,
        priceBaisa: products.priceBaisa,
        salePriceBaisa: products.salePriceBaisa,
        stockQuantity: products.stockQuantity,
        imageKey: products.imageKey,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(categories.slug, 'pc-components'),
          eq(categories.enabled, true),
          eq(products.status, 'PUBLISHED'),
        ),
      )
      .orderBy(asc(products.titleEn)),
  ]);

  return { categories: categoryRows, products: productRows };
}
