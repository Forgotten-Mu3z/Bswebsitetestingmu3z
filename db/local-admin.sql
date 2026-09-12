-- LOCAL PREVIEW ONLY. Never include this file in production migrations or seed data.
INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at)
VALUES ('local_seedy', 'seedy@sites.test', 'Local preview admin', unixepoch(), unixepoch());
INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES ('local_seedy', 'role-admin');
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('OWNER', 'ADMIN', 'PRODUCT_MANAGER')
AND p.key IN ('products.view','products.create','products.edit','products.delete','products.publish','inventory.edit');
