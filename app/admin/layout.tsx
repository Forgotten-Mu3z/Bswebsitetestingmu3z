/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
import Image from 'next/image';
import { AdminNav } from '@/components/admin/admin-nav';
import { chatGPTSignInPath, chatGPTSignOutPath } from '@/app/chatgpt-auth';
import { adminAccess, AdminError } from '@/server/admin-access';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin | BLACKSHARK',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await adminAccess().catch((error: unknown) =>
    error instanceof AdminError
      ? error
      : new AdminError(
          'The admin panel is temporarily unavailable. Please try again.',
          503,
        ),
  );

  if (access instanceof AdminError)
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.14),transparent_38%),#03060c] px-4 text-white">
        <section className="w-full max-w-lg rounded-3xl border border-cyan-300/20 bg-[#0b1420]/95 p-8 shadow-2xl shadow-black/40">
          <Image
            src="/blackshark-logo.png"
            alt="BS Gaming"
            width={72}
            height={72}
            className="mb-6 rounded-2xl ring-1 ring-cyan-300/20"
          />
          <p className="text-sm font-bold tracking-widest text-cyan-300">
            BLACKSHARK
          </p>
          <h1 className="mt-2 text-3xl font-black">Admin Panel</h1>
          <p role="alert" className="mt-4 leading-7 text-slate-300">
            {access.message}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {access.status === 401 ? (
              <a
                href={chatGPTSignInPath('/admin')}
                target="_top"
                className="inline-flex min-h-11 items-center rounded-xl bg-cyan-300 px-5 font-bold text-[#04101b] hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-white"
              >
                Sign in to continue
              </a>
            ) : null}
            <a
              href="/"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 font-bold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Back to Store
            </a>
          </div>
        </section>
      </main>
    );

  return (
    <div className="min-h-screen bg-[#03060c] text-white">
      <header className="sticky top-0 z-40 border-t-2 border-cyan-300 border-b border-white/10 bg-[#050a12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <a
            href="/admin"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <Image
              src="/blackshark-logo.png"
              alt=""
              width={48}
              height={48}
              className="rounded-xl ring-1 ring-cyan-300/20"
            />
            <span className="font-black tracking-widest">
              BLACKSHARK
              <span className="block text-[10px] tracking-[.2em] text-cyan-300">
                ADMIN PANEL
              </span>
            </span>
          </a>
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <span className="hidden max-w-48 truncate text-slate-400 sm:block">
              {access.identity.displayName}
            </span>
            <a
              href={chatGPTSignOutPath('/admin')}
              target="_top"
              className="shrink-0 rounded-xl border border-white/15 px-4 py-3 font-bold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Sign Out
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-[1440px] overflow-x-auto px-4 pb-3 sm:px-8">
          <AdminNav />
        </div>
      </header>
      {children}
    </div>
  );
}
