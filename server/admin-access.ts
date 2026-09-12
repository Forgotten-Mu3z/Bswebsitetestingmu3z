import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getBinding } from '@/db';

export class AdminError extends Error {
  constructor(
    message: string,
    public status = 400,
    public field?: string,
  ) {
    super(message);
  }
}

export async function adminAccess() {
  const identity = await getChatGPTUser();
  if (!identity) throw new AdminError('Sign in to manage products.', 401);
  const db = getBinding();
  const readGrants = () =>
    db
      .prepare(`SELECT DISTINCT p.key FROM users u
    JOIN user_roles ur ON ur.user_id = u.id JOIN roles r ON r.id = ur.role_id
    JOIN role_permissions rp ON rp.role_id = r.id JOIN permissions p ON p.id = rp.permission_id
    WHERE u.id = ? AND u.suspended_at IS NULL AND r.name IN ('OWNER','ADMIN','PRODUCT_MANAGER')`)
      .bind(identity.userId)
      .all<{ key: string }>();
  let result = await readGrants();
  let grants = result.results.map((row) => row.key);

  // The deployed owner ID lives in the hosting environment, never in source.
  // On first use, bootstrap only that exact authenticated account as OWNER.
  if (
    !grants.includes('products.view') &&
    env.ADMIN_USER_ID === identity.userId
  ) {
    const now = Math.floor(Date.now() / 1000);
    await db.batch([
      db
        .prepare(`INSERT INTO users (id, email, display_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET email = excluded.email, display_name = excluded.display_name, updated_at = excluded.updated_at`)
        .bind(identity.userId, identity.email, identity.displayName, now, now),
      db
        .prepare(`INSERT OR IGNORE INTO user_roles (user_id, role_id)
        SELECT ?, id FROM roles WHERE name = 'OWNER'`)
        .bind(identity.userId),
    ]);
    result = await readGrants();
    grants = result.results.map((row) => row.key);
  }
  if (!grants.includes('products.view'))
    throw new AdminError(
      'Your account does not have product-management access.',
      403,
    );
  return { identity, grants };
}

export function need(grants: string[], permission: string) {
  if (!grants.includes(permission))
    throw new AdminError('You do not have permission for this change.', 403);
}

export function sameOrigin(request: Request) {
  if (
    request.headers.get('origin') !== new URL(request.url).origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    throw new AdminError(
      'Request blocked. Reload this page and try again.',
      403,
    );
}

export function adminFailure(error: unknown) {
  if (error instanceof AdminError)
    return Response.json(
      { error: error.message, field: error.field },
      { status: error.status, headers: { 'Cache-Control': 'no-store' } },
    );
  console.error('Product administration failed', error);
  return Response.json(
    {
      error:
        'Unable to save right now. Your changes are still in the form; please try again.',
    },
    { status: 503 },
  );
}
