import { getBinding, getFileBucket } from '@/db';
import {
  adminAccess,
  AdminError,
  adminFailure,
  need,
  sameOrigin,
} from '@/server/admin-access';
import {
  ProductValidationError,
  validateProduct,
} from '@/server/product-validation';

export const dynamic = 'force-dynamic';
const uploadedImage = /^\/api\/product-images\/([a-f0-9-]{36})$/;

async function removeReplacedImage(
  previous: string | null,
  replacement: string | null,
) {
  const id = previous?.match(uploadedImage)?.[1];
  if (!id || previous === replacement) return;
  try {
    await getFileBucket().delete(`products/${id}`);
  } catch (error) {
    console.error('Unable to remove replaced product image', error);
  }
}

function toProduct(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    slug: String(row.slug),
    sku: String(row.sku),
    titleEn: String(row.title_en),
    titleAr: String(row.title_ar),
    shortDescription: String(row.short_description),
    categoryId: String(row.category_id),
    brandId: typeof row.brand_id === 'string' ? row.brand_id : null,
    priceBaisa: Number(row.price_baisa),
    salePriceBaisa:
      row.sale_price_baisa === null ? null : Number(row.sale_price_baisa),
    stockQuantity: Number(row.stock_quantity),
    lowStockThreshold: Number(row.low_stock_threshold),
    status: String(row.status),
    featured: Boolean(row.featured),
    imageKey: typeof row.image_key === 'string' ? row.image_key : null,
    createdAt: Number(row.created_at) * 1000,
    updatedAt: Number(row.updated_at) * 1000,
  };
}
export async function GET(request: Request) {
  try {
    await adminAccess();
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') ?? '').slice(0, 120);
    const page = Math.max(
      1,
      Math.min(100000, Number(url.searchParams.get('page')) || 1),
    );
    const db = getBinding();
    const where = `WHERE title_en LIKE ? OR sku LIKE ?`;
    const [rows, count] = await Promise.all([
      db
        .prepare(
          `SELECT * FROM products ${where} ORDER BY created_at DESC, id LIMIT 30 OFFSET ?`,
        )
        .bind(`%${q}%`, `%${q}%`, (Math.floor(page) - 1) * 30)
        .all(),
      db
        .prepare(`SELECT count(*) AS total FROM products ${where}`)
        .bind(`%${q}%`, `%${q}%`)
        .first<{ total: number }>(),
    ]);
    return Response.json(
      {
        products: rows.results.map((row) =>
          toProduct(row as Record<string, unknown>),
        ),
        total: count?.total ?? 0,
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    return adminFailure(error);
  }
}

async function mutate(request: Request) {
  try {
    sameOrigin(request);
    const { identity, grants } = await adminAccess();
    if (!request.headers.get('content-type')?.includes('application/json'))
      throw new AdminError('Send product details as JSON.', 415);
    const raw = await request.text();
    if (raw.length > 20000)
      throw new AdminError('Product details are too large.', 413);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new AdminError('Invalid product details.');
    }
    const db = getBinding();
    const id = request.method === 'POST' ? crypto.randomUUID() : body?.id;
    if (typeof id !== 'string' || id.length > 80)
      throw new AdminError('Invalid product ID.');
    const oldRow =
      request.method === 'POST'
        ? null
        : await db
            .prepare('SELECT * FROM products WHERE id = ?')
            .bind(id)
            .first<Record<string, unknown>>();
    const old = oldRow ? toProduct(oldRow) : null;
    if (request.method !== 'POST' && !old)
      throw new AdminError(
        'This product no longer exists. Reload the list.',
        404,
      );
    // A snapshot token rejects stale edits without needing a schema migration.
    if (old && body.version !== String(old.updatedAt))
      throw new AdminError(
        'Another admin changed this product. Close the editor and reopen it before saving.',
        409,
      );
    const deleting = request.method === 'DELETE';
    need(
      grants,
      deleting
        ? 'products.delete'
        : request.method === 'POST'
          ? 'products.create'
          : 'products.edit',
    );
    let data;
    if (!deleting) {
      data = validateProduct(body);
      if (data.status === 'PUBLISHED' || old?.status === 'PUBLISHED')
        need(grants, 'products.publish');
      if (!old || data.stock_quantity !== old.stockQuantity)
        need(grants, 'inventory.edit');
      const [category, brand, duplicate] = await Promise.all([
        db
          .prepare('SELECT id FROM categories WHERE id = ?')
          .bind(data.category_id)
          .first(),
        data.brand_id
          ? db
              .prepare('SELECT id FROM brands WHERE id = ?')
              .bind(data.brand_id)
              .first()
          : Promise.resolve(true),
        db
          .prepare(
            'SELECT sku, slug FROM products WHERE id != ? AND (sku = ? OR slug = ?)',
          )
          .bind(id, data.sku, data.slug)
          .first<{ sku: string; slug: string }>(),
      ]);
      if (!category)
        throw new AdminError(
          'Select an existing category.',
          400,
          'category_id',
        );
      if (!brand)
        throw new AdminError('Select an existing brand.', 400, 'brand_id');
      if (duplicate)
        throw new AdminError(
          'This SKU or URL slug is already used by another product.',
          409,
          duplicate.sku === data.sku ? 'sku' : 'slug',
        );
    }
    const now = Date.now();
    const nextUpdated = Math.max(
      Math.floor(now / 1000),
      old ? old.updatedAt / 1000 + 1 : 0,
    );
    const action = deleting
      ? 'products.delete'
      : old
        ? 'products.edit'
        : 'products.create';
    const audit = db
      .prepare(
        `INSERT INTO audit_logs (id, actor_user_id, action, resource_type, resource_id, old_value, new_value, created_at) SELECT ?, ?, ?, 'product', ?, ?, ?, ? WHERE changes() = 1`,
      )
      .bind(
        crypto.randomUUID(),
        identity.userId,
        action,
        id,
        old ? JSON.stringify(old) : null,
        data ? JSON.stringify(data) : null,
        Math.floor(now / 1000),
      );
    // D1 batches are atomic: the audit record and catalog change succeed together.
    let statement;
    if (deleting)
      statement = db
        .prepare('DELETE FROM products WHERE id = ? AND updated_at = ?')
        .bind(id, old!.updatedAt / 1000);
    else {
      const fields = Object.keys(data!),
        values = Object.values(data!);
      statement = old
        ? db
            .prepare(
              `UPDATE products SET ${fields.map((key) => `${key} = ?`).join(', ')}, updated_at = ? WHERE id = ? AND updated_at = ?`,
            )
            .bind(...values, nextUpdated, id, old.updatedAt / 1000)
        : db
            .prepare(
              `INSERT INTO products (id, ${fields.join(', ')}, created_at, updated_at) VALUES (?, ${fields.map(() => '?').join(', ')}, ?, ?)`,
            )
            .bind(
              id,
              ...values,
              Math.floor(now / 1000),
              Math.floor(now / 1000),
            );
    }
    const results = await db.batch([statement, audit]);
    if (results[0].meta.changes !== 1)
      throw new AdminError(
        'Another admin changed this product. Reload before trying again.',
        409,
      );
    const saved = deleting
      ? null
      : await db
          .prepare('SELECT * FROM products WHERE id = ?')
          .bind(id)
          .first<Record<string, unknown>>();
    await removeReplacedImage(
      old?.imageKey ?? null,
      deleting ? null : (data?.image_key ?? null),
    );
    return Response.json(
      {
        id,
        product: saved ? toProduct(saved) : undefined,
        message: deleting ? 'Product deleted.' : 'Product saved.',
      },
      { status: request.method === 'POST' ? 201 : 200 },
    );
  } catch (error) {
    if (error instanceof ProductValidationError)
      return adminFailure(new AdminError(error.message, 400, error.field));
    if (String(error).includes('UNIQUE constraint'))
      return adminFailure(
        new AdminError('This SKU or URL slug is already in use.', 409, 'sku'),
      );
    return adminFailure(error);
  }
}
export const POST = mutate;
export const PATCH = mutate;
export const DELETE = mutate;
