import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { permissions, rolePermissions, roles, userRoles, users } from '@/db/schema';
import { getChatGPTUser, requireChatGPTUser } from '@/app/chatgpt-auth';

export class ForbiddenError extends Error { readonly status = 403; constructor(message = 'Forbidden') { super(message); this.name = 'ForbiddenError'; } }
export async function requireUser(returnTo = '/') { const identity = await requireChatGPTUser(returnTo); const [record] = await getDb().select().from(users).where(eq(users.id, identity.userId)).limit(1); if (record?.suspendedAt) throw new ForbiddenError('Account suspended'); return identity; }
export async function requirePermission(permissionKey: string) { const identity = await requireUser('/admin'); const [grant] = await getDb().select({ key: permissions.key }).from(userRoles).innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId)).innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id)).where(and(eq(userRoles.userId, identity.userId), eq(permissions.key, permissionKey))).limit(1); if (!grant) throw new ForbiddenError(); return identity; }
export async function requireRole(roleName: string) { const identity = await requireUser('/admin'); const [grant] = await getDb().select({ name: roles.name }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(and(eq(userRoles.userId, identity.userId), eq(roles.name, roleName))).limit(1); if (!grant) throw new ForbiddenError(); return identity; }
export function requireOwner() { return requireRole('OWNER'); }
export async function optionalUser() { return getChatGPTUser(); }
