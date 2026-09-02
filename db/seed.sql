INSERT OR IGNORE INTO categories (id, slug, name_en, name_ar, sort_order, enabled) VALUES
('cat-pc', 'pc-components', 'PC Components', 'مكونات الكمبيوتر', 1, 1),
('cat-builds', 'gaming-pcs', 'Gaming PCs', 'أجهزة كمبيوتر للألعاب', 2, 1),
('cat-gear', 'gaming-gear', 'Gaming Gear', 'معدات الألعاب', 3, 1),
('cat-monitor', 'monitors', 'Monitors', 'شاشات', 4, 1),
('cat-console', 'consoles', 'Consoles', 'أجهزة الألعاب', 5, 1),
('cat-digital', 'digital-cards', 'Digital Cards', 'بطاقات رقمية', 6, 1);

INSERT OR IGNORE INTO brands (id, slug, name, description) VALUES
('brand-blackshark', 'blackshark', 'BLACKSHARK', 'Performance gaming systems and selected hardware.');

INSERT OR IGNORE INTO products (id, slug, sku, title_en, title_ar, short_description, category_id, brand_id, price_baisa, sale_price_baisa, stock_quantity, low_stock_threshold, status, featured, image_key, created_at, updated_at) VALUES
('prod-5080pc', 'blackshark-rtx-5080-gaming-pc', 'BS-PC-5080', 'BLACKSHARK RTX 5080 Gaming PC', 'كمبيوتر بلاك شارك RTX 5080 للألعاب', 'Flagship 4K gaming performance.', 'cat-builds', 'brand-blackshark', 1499000, 1399000, 4, 2, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch()),
('prod-5070pc', 'blackshark-rtx-5070-gaming-pc', 'BS-PC-5070', 'BLACKSHARK RTX 5070 Gaming PC', 'كمبيوتر بلاك شارك RTX 5070 للألعاب', 'High-refresh QHD gaming system.', 'cat-builds', 'brand-blackshark', 999000, 949000, 7, 2, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch()),
('prod-monitor', 'blackshark-240hz-gaming-monitor', 'BS-MON-240', 'BLACKSHARK 27-inch 240Hz Monitor', 'شاشة بلاك شارك 27 بوصة 240 هرتز', 'Fast IPS display for competitive play.', 'cat-monitor', 'brand-blackshark', 189000, NULL, 12, 3, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch()),
('prod-headset', 'blackshark-pro-gaming-headset', 'BS-AUD-PRO', 'BLACKSHARK Pro Gaming Headset', 'سماعة بلاك شارك الاحترافية', 'Clear positional audio and all-day comfort.', 'cat-gear', 'brand-blackshark', 39000, 34000, 18, 4, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch());

INSERT OR IGNORE INTO announcements (id, text_en, text_ar, link, enabled) VALUES ('announcement-launch', 'Free delivery in Oman on orders over OMR 50', 'توصيل مجاني داخل عُمان للطلبات فوق 50 ريال', '#featured', 1);

INSERT OR IGNORE INTO roles (id, name, is_system) VALUES
('role-owner', 'OWNER', 1), ('role-admin', 'ADMIN', 1), ('role-product', 'PRODUCT_MANAGER', 1), ('role-order', 'ORDER_MANAGER', 1), ('role-content', 'CONTENT_MANAGER', 1), ('role-support', 'SUPPORT_STAFF', 1), ('role-customer', 'CUSTOMER', 1);

INSERT OR IGNORE INTO permissions (id, key, description) VALUES
('perm-products-view', 'products.view', 'View product administration'), ('perm-products-create', 'products.create', 'Create products'), ('perm-products-edit', 'products.edit', 'Edit products'), ('perm-products-delete', 'products.delete', 'Delete products'), ('perm-products-publish', 'products.publish', 'Publish products'), ('perm-inventory-edit', 'inventory.edit', 'Change inventory'), ('perm-orders-view', 'orders.view', 'View orders'), ('perm-orders-edit', 'orders.edit', 'Update orders'), ('perm-orders-refund', 'orders.refund', 'Issue refunds'), ('perm-staff-change-role', 'staff.change_role', 'Change staff roles'), ('perm-settings-edit', 'settings.edit', 'Edit store settings'), ('perm-payments-configure', 'payments.configure', 'Configure payment providers');
