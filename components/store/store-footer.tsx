/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
type Category = { id: string; slug: string; nameEn: string };

export function StoreFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="border-t border-white/10 bg-[#040912] text-slate-300">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <a
            href="/"
            className="text-lg font-black tracking-[.14em] text-white"
          >
            BLACK<span className="text-cyan-300">SHARK</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Gaming PCs, components, monitors, consoles, and gaming gear in one
            clear catalog.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-white">Shop</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <a
                  href={`/categories/${category.slug}`}
                  className="hover:text-cyan-300"
                >
                  {category.nameEn}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-white">Tools</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/build" className="hover:text-cyan-300">
                Build your PC
              </a>
            </li>
            <li>
              <a href="/search" className="hover:text-cyan-300">
                Search products
              </a>
            </li>
            <li>
              <a href="/deals" className="hover:text-cyan-300">
                Deals
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-cyan-300">
                Cart
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-white">Store management</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Authorized staff can update products, prices, stock, and images.
          </p>
          <a
            href="/admin"
            className="mt-4 inline-flex min-h-11 items-center font-bold text-cyan-300 hover:text-cyan-200"
          >
            Open admin panel
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BLACKSHARK
      </div>
      {/* TODO: Add owner-approved contact and legal policy pages when the business details and policy text are supplied. */}
    </footer>
  );
}
