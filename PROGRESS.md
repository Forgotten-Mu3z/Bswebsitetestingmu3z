# BLACKSHARK implementation status

Updated 2026-09-12. This is an unfinished development store, not production ready.

## Catalog continuation

Added database-backed product details and search, English/Arabic matching, SKU/brand/category matching, effective-price sorting, stock filter, empty results, mobile search navigation and Ctrl/Cmd+K navigation to search. Queries only expose published products in enabled categories. No database migration was necessary.

Added 46 editable PC-component listings across processors, graphics cards, motherboards, memory, storage, power supplies, cases, CPU cooling, case fans, networking, capture cards and build accessories. Prices are stored in baisa and displayed as three-decimal OMR amounts, based on Oman/GCC retailer listings checked on 2026-09-11. The PC Components page now has URL-backed part-type filters, clickable product cards, accessible focus states and a two-column mobile catalog. Placeholder logo art is used until licensed product photography is uploaded through the admin panel.

Changed: server/catalog.ts; components/store/catalog-card.tsx, catalog-form.tsx, search-shortcut.tsx, store-header.tsx; app/search/page.tsx, products/[slug]/page.tsx, favicon.ico/route.ts.

Verification: TypeScript, application lint and production build passed. Playwright Chromium tested product title/price/stock, SKU and Arabic search, empty-result recovery, ascending price sort, in-stock filtering, Ctrl+K, mobile search, and no document overflow across 320/375/390/430/768/1024/1440/1920 on product and search routes. Screenshots are under output/playwright. Fixed client-component boundary, stale query on filter reset, and favicon 404. Sites build helper failed to locate npm on Windows; direct existing npm build succeeded.

## Outstanding work

Phase 1 is NOT fully complete: auth helpers and schema exist but no complete customer/staff authentication flow, owner bootstrap, permissions matrix, or bypass tests have passed. Role grants are not seeded. Audit storage alone does not implement audit event recording or immutability enforcement.

Phase 2 is partial: the protected `/admin/products` catalog manager supports create, edit, publish/hide, regular and sale pricing, stock and low-stock threshold updates, image uploads and confirmation-protected deletion. Product images are previewed before save, validated by size, MIME type and file signature, stored in R2, served through a content-addressed endpoint, and removed from storage when replaced or deleted. The polished admin overview and responsive product manager use clear status, inventory and audit views. Product changes use D1 transactions with audit rows, permission checks, same-origin checks, validation, duplicate protection and stale-edit protection. A multi-image gallery, variants, advanced filters, autocomplete and pagination remain. `db/local-admin.sql` grants only the local preview identity access; production staff still need an explicit account/role bootstrap.

Cart, wishlist, compare, checkout, payments, orders, admin workflows, CMS, PC Builder and full Arabic/RTL/currency support remain. Existing header account/wishlist/cart buttons and deals/build links are unfinished. Product purchase controls will be added with real cart persistence.

The current starter uses Vinext, D1/Drizzle and Sites identity helpers, not the originally requested PostgreSQL/Prisma/Auth.js architecture. This difference has not been resolved and must not be represented as completion of the original database/auth requirements.

The Sites project is registered but has no saved or published version. No deployment was performed in this continuation. Existing scaffold dependency audit findings are unresolved.

Latest verification: TypeScript, targeted lint and the production build pass. Playwright Chromium verified 47 rendered PC-component cards, mobile part-type filtering (8 graphics cards), component-card navigation to a real product page, an actual admin sale-price and low-stock-threshold edit followed by restoration, zero console errors and no horizontal overflow at 390px or 1440px. Screenshots are in `output/playwright/pc-components-mobile.png`, `output/playwright/pc-components-desktop.png` and `output/playwright/admin-products-mobile-components.png`. Earlier admin image-upload, create/delete and server validation checks also remain passing.

Next: finish authentication/authorization foundation and product image gallery, then connect persistent cart and checkout with transaction and permission tests.
