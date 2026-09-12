# BLACKSHARK

BLACKSHARK is a mobile-first ecommerce storefront and catalog admin for gaming PCs, PC components, monitors, consoles and gaming gear in Oman.

## Current features

- Responsive storefront with product search and category browsing
- 47 PC-component listings with OMR pricing and part-type filters
- Product detail pages with stock and sale pricing
- Protected admin overview and product manager
- Add, edit, publish, hide and delete products
- Product-image uploads backed by R2-compatible storage
- D1/SQLite-compatible catalog, roles and audit log

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npx wrangler d1 execute blackshark-local --local --persist-to .wrangler/state --file drizzle/0000_absent_famine.sql
npx wrangler d1 execute blackshark-local --local --persist-to .wrangler/state --file db/seed.sql
npm run dev
```

Open `http://localhost:3000`. Local admin access is configured separately with `db/local-admin.sql` for the Sites preview identity.

## Verification

```bash
npm run build
npx tsc --noEmit
npm run lint
```

The production application requires server-side D1 and R2 bindings. GitHub Pages alone cannot run the database, image uploads or admin authentication.
