/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { brands, categories, products } from '@/db/schema';
import { chatGPTSignInPath, getChatGPTUser } from '@/app/chatgpt-auth';
import { adminAccess } from '@/server/admin-access';
import { AdminProductManager } from '@/components/admin/admin-product-manager';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const identity = await getChatGPTUser();
  if (!identity)
    return <AdminGate message="Sign in with ChatGPT to manage the catalog." />;
  let accessMessage: string | null = null;
  try {
    await adminAccess();
  } catch (error) {
    accessMessage =
      error instanceof Error
        ? error.message
        : 'Your account does not have product-management access.';
  }
  if (accessMessage) return <AdminGate message={accessMessage} />;
  const db = getDb();
  let initialProducts: (typeof products.$inferSelect)[],
    allCategories: { id: string; nameEn: string }[],
    allBrands: { id: string; name: string }[];
  try {
    [initialProducts, allCategories, allBrands] = await Promise.all([
      db.select().from(products).orderBy(desc(products.createdAt)),
      db
        .select({ id: categories.id, nameEn: categories.nameEn })
        .from(categories)
        .where(eq(categories.enabled, true))
        .orderBy(categories.sortOrder),
      db
        .select({ id: brands.id, name: brands.name })
        .from(brands)
        .orderBy(brands.name),
    ]);
  } catch {
    return (
      <AdminGate message="The product catalog is temporarily unavailable. Try again in a moment." />
    );
  }
  return (
    <AdminProductManager
      initialProducts={initialProducts}
      categories={allCategories}
      brands={allBrands}
    />
  );
}

function AdminGate({ message }: { message: string }) {
  const needsSignIn = message.startsWith('Sign in');
  return (
    <main className="min-h-screen bg-[#03060c] px-4 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0b1420] p-8">
        <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-300">
          BLACKSHARK Admin
        </p>
        <h1 className="mt-3 text-3xl font-black">Product management</h1>
        <p role="alert" className="mt-4 leading-7 text-slate-300">
          {message}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {needsSignIn ? (
            <a
              target="_top"
              href={chatGPTSignInPath('/admin/products')}
              className="inline-flex min-h-11 items-center rounded-xl bg-cyan-300 px-5 font-bold text-[#04101b] hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Sign in to continue
            </a>
          ) : null}
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 font-bold text-white hover:border-cyan-300/50 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            Return to store
          </a>
        </div>
      </div>
    </main>
  );
}
