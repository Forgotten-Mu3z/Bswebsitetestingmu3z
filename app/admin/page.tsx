/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import { AlertTriangle, Boxes, Eye, FilePenLine } from 'lucide-react';
import { getBinding } from '@/db';
import { adminAccess } from '@/server/admin-access';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const allowed = await adminAccess().then(
    () => true,
    () => false,
  );
  if (!allowed) return null;

  const db = getBinding();
  const data = await Promise.all([
    db
      .prepare(
        `SELECT count(*) AS total, sum(status = 'PUBLISHED') AS published, sum(status = 'DRAFT') AS drafts, sum(stock_quantity <= low_stock_threshold) AS lowStock FROM products`,
      )
      .first<Record<string, number>>(),
    db
      .prepare(
        `SELECT p.title_en, p.sku, p.stock_quantity FROM products p WHERE stock_quantity <= low_stock_threshold ORDER BY stock_quantity, title_en LIMIT 8`,
      )
      .all<{ title_en: string; sku: string; stock_quantity: number }>(),
    db
      .prepare(
        `SELECT a.action, a.created_at, u.display_name AS actor FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id WHERE a.resource_type = 'product' ORDER BY a.created_at DESC LIMIT 8`,
      )
      .all<{ action: string; created_at: number; actor: string | null }>(),
  ]).catch(() => null);

  if (!data)
    return (
      <main className="p-8" role="alert">
        The catalog is temporarily unavailable. Reload to try again.
      </main>
    );

  const [counts, lowStock, activity] = data;
  const stats = [
    { label: 'Total products', count: counts?.total, icon: Boxes },
    { label: 'Published', count: counts?.published, icon: Eye },
    { label: 'Drafts', count: counts?.drafts, icon: FilePenLine },
    { label: 'Low stock', count: counts?.lowStock, icon: AlertTriangle },
  ];

  return (
    <main
      id="main-content"
      className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,.11),transparent_30%),#03060c] px-4 py-10 sm:px-8"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-300">
              Store management
            </p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Overview</h1>
            <p className="mt-3 text-slate-400">
              Keep the BLACKSHARK catalog healthy and ready for customers.
            </p>
          </div>
          <a
            href="/admin/products"
            className="inline-flex min-h-12 items-center rounded-xl bg-cyan-300 px-5 font-bold text-slate-950 shadow-[0_10px_40px_rgba(34,211,238,.14)] hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-white"
          >
            Manage Products →
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, count, icon: Icon }, index) => (
            <section
              key={label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1420]/95 p-5 shadow-lg shadow-black/20"
            >
              <div
                className={`absolute inset-x-0 top-0 h-0.5 ${index === 3 ? 'bg-amber-300' : 'bg-cyan-300'}`}
              />
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm text-slate-400">{label}</h2>
                <Icon
                  aria-hidden="true"
                  className={`size-5 ${index === 3 ? 'text-amber-300' : 'text-cyan-300'}`}
                />
              </div>
              <p className="mt-4 text-4xl font-black tabular-nums">
                {count || 0}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-[#0b1420]/95 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-300/10 text-amber-300">
                <AlertTriangle aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                  Inventory
                </p>
                <h2 className="text-xl font-black">Stock attention</h2>
              </div>
            </div>
            {lowStock.results.length ? (
              <ul className="mt-5 divide-y divide-white/10">
                {lowStock.results.map((item) => (
                  <li
                    key={item.sku}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-bold">{item.title_en}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.sku}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-300/10 px-3 py-1 text-sm font-bold text-amber-300">
                      {item.stock_quantity} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-slate-400">
                All products are above their low-stock threshold.
              </p>
            )}
            <a
              href="/admin/products"
              className="mt-5 inline-flex min-h-11 items-center font-bold text-cyan-300 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Update Inventory →
            </a>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0b1420]/95 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                <Boxes aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
                  Audit trail
                </p>
                <h2 className="text-xl font-black">Recent product activity</h2>
              </div>
            </div>
            {activity.results.length ? (
              <ul className="mt-5 divide-y divide-white/10">
                {activity.results.map((item, index) => (
                  <li
                    key={`${item.created_at}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-2 py-3"
                  >
                    <div>
                      <p className="font-bold">
                        {item.action === 'products.create'
                          ? 'Product added'
                          : item.action === 'products.delete'
                            ? 'Product deleted'
                            : 'Product updated'}
                      </p>
                      <p className="text-sm text-slate-400">
                        {item.actor ?? 'Staff member'}
                      </p>
                    </div>
                    <time
                      className="text-sm text-slate-400"
                      dateTime={new Date(item.created_at * 1000).toISOString()}
                    >
                      {new Intl.DateTimeFormat('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'Asia/Muscat',
                      }).format(new Date(item.created_at * 1000))}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-slate-400">
                Product changes will appear here.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
