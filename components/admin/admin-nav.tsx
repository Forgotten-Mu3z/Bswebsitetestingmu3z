/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
'use client';

import { ArrowUpRight, LayoutDashboard, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';

const destinations = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Admin navigation"
      className="flex min-w-max flex-wrap gap-2 text-sm font-bold"
    >
      {destinations.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 transition focus-visible:outline-2 focus-visible:outline-cyan-300 ${pathname === href ? 'bg-cyan-300 text-slate-950 shadow-[0_8px_24px_rgba(34,211,238,.16)]' : 'text-slate-300 hover:bg-white/10'}`}
        >
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </a>
      ))}
      <a
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-slate-300 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
      >
        View Store <ArrowUpRight aria-hidden="true" className="size-4" />
      </a>
    </nav>
  );
}
