import { getChatGPTUser } from '@/app/chatgpt-auth';
import { getBinding } from '@/db';

export class AdminError extends Error {
  constructor(message: string, public status = 400, public field?: string) { super(message); }
}

export async function adminAccess() {
  const identity = await getChatGPTUser();
  if (!identity) throw new AdminError('Sign in to manage products.', 401);
  const result = await getBinding().prepare(`SELECT DISTINCT p.key FROM users u
    JOIN user_roles ur ON ur.user_id = u.id JOIN roles r ON r.id = ur.role_id
    JOIN role_permissions rp ON rp.role_id = r.id JOIN permissions p ON p.id = rp.permission_id
    WHERE u.id = ? AND u.suspended_at IS NULL AND r.name IN ('OWNER','ADMIN','PRODUCT_MANAGER')`)
    .bind(identity.userId).all<{key: string}>();
  const grants = result.results.map(row => row.key);
  if (!grants.includes('products.view')) throw new AdminError('Your account does not have product-management access.', 403);
  return { identity, grants };
}

export function need(grants: string[], permission: string) {
  if (!grants.includes(permission)) throw new AdminError('You do not have permission for this change.', 403);
}

export function sameOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site')
    throw new AdminError('Request blocked. Reload this page and try again.', 403);
}

export function adminFailure(error: unknown) {
  if (error instanceof AdminError) return Response.json({ error: error.message, field: error.field }, { status: error.status, headers: { 'Cache-Control': 'no-store' } });
  console.error('Product administration failed', error);
  return Response.json({ error: 'Unable to save right now. Your changes are still in the form; please try again.' }, { status: 503 });
}
