import { and, asc, desc, eq, gt, isNull, lt, or } from 'drizzle-orm';
import { getDb } from '@/db';
import { announcements, categories, products } from '@/db/schema';

export async function getStorefrontData() {
  const db = getDb(); const now = new Date();
  const [categoryRows, productRows, announcementRows] = await Promise.all([
    db.select().from(categories).where(eq(categories.enabled, true)).orderBy(asc(categories.sortOrder)),
    db.select().from(products).where(and(eq(products.status, 'PUBLISHED'), eq(products.featured, true))).orderBy(desc(products.updatedAt)).limit(8),
    db.select().from(announcements).where(and(eq(announcements.enabled, true), or(isNull(announcements.startsAt), lt(announcements.startsAt, now)), or(isNull(announcements.endsAt), gt(announcements.endsAt, now)))).limit(1),
  ]);
  return { categories: categoryRows, products: productRows, announcement: announcementRows[0] ?? null };
}

export async function getCategoryPage(slug: string) {
  const db = getDb();
  const [category] = await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.enabled, true))).limit(1);
  if (!category) return null;
  const [allCategories, categoryProducts] = await Promise.all([
    db.select().from(categories).where(eq(categories.enabled, true)).orderBy(asc(categories.sortOrder)),
    db.select().from(products).where(and(eq(products.categoryId, category.id), eq(products.status, 'PUBLISHED'))).orderBy(desc(products.updatedAt)),
  ]);
  return { category, categories: allCategories, products: categoryProducts };
}
