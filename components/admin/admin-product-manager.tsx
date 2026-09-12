/* oxlint-disable next/no-html-link-for-pages -- plain anchors avoid a Vinext RSC prefetch failure in the Worker build */
'use client';

import Image from 'next/image';
import {
  CheckCircle2,
  ImagePlus,
  PackageSearch,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ChangeEvent,
  type ComponentProps,
} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Product = {
  id: string;
  slug: string;
  sku: string;
  titleEn: string;
  titleAr: string;
  shortDescription: string;
  categoryId: string;
  brandId: string | null;
  priceBaisa: number;
  salePriceBaisa: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  featured: boolean;
  imageKey: string | null;
  createdAt: Date | number;
  updatedAt: Date | number;
};
type Option = { id: string; nameEn?: string; name?: string };
type FormValues = {
  id?: string;
  version?: string;
  title_en: string;
  title_ar: string;
  slug: string;
  sku: string;
  short_description: string;
  category_id: string;
  brand_id: string;
  price: string;
  sale_price: string;
  stock_quantity: string;
  low_stock_threshold: string;
  status: Product['status'];
  featured: boolean;
  image_key: string;
};
type ApiResult = {
  error?: string;
  field?: string;
  message?: string;
  product?: Product;
  url?: string;
};
type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<'form'>['onSubmit']>
>[0];

const maxImageSize = 5 * 1024 * 1024;
const acceptedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);
const fieldClass =
  'min-h-11 rounded-xl border border-white/15 bg-[#07101d] px-3 text-base font-normal text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-wait disabled:opacity-60';
const omr = new Intl.NumberFormat('en-OM', {
  style: 'currency',
  currency: 'OMR',
  minimumFractionDigits: 3,
});

const emptyForm = (category = ''): FormValues => ({
  title_en: '',
  title_ar: '',
  slug: '',
  sku: '',
  short_description: '',
  category_id: category,
  brand_id: '',
  price: '',
  sale_price: '',
  stock_quantity: '0',
  low_stock_threshold: '3',
  status: 'DRAFT',
  featured: false,
  image_key: '/blackshark-logo.png',
});
const versionOf = (product: Product) =>
  String(new Date(product.updatedAt).getTime());
const toForm = (product: Product): FormValues => ({
  id: product.id,
  version: versionOf(product),
  title_en: product.titleEn,
  title_ar: product.titleAr,
  slug: product.slug,
  sku: product.sku,
  short_description: product.shortDescription,
  category_id: product.categoryId,
  brand_id: product.brandId ?? '',
  price: (product.priceBaisa / 1000).toFixed(3),
  sale_price:
    product.salePriceBaisa === null
      ? ''
      : (product.salePriceBaisa / 1000).toFixed(3),
  stock_quantity: String(product.stockQuantity),
  low_stock_threshold: String(product.lowStockThreshold),
  status: product.status,
  featured: product.featured,
  image_key: product.imageKey ?? '/blackshark-logo.png',
});
async function responseJson(response: Response): Promise<ApiResult> {
  return (await response.json()) as ApiResult;
}

export function AdminProductManager({
  initialProducts,
  categories,
  brands,
}: {
  initialProducts: Product[];
  categories: Option[];
  brands: Option[];
}) {
  const [items, setItems] = useState(initialProducts);
  const [form, setForm] = useState<FormValues>(() =>
    emptyForm(categories[0]?.id),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : form.image_key),
    [form.image_key, imageFile],
  );
  useEffect(() => {
    if (!imagePreview.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? items.filter((item) =>
          `${item.titleEn} ${item.sku}`.toLowerCase().includes(term),
        )
      : items;
  }, [items, query]);
  const editing = Boolean(form.id);
  const update = (key: keyof FormValues, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  const resetForm = () => {
    setForm(emptyForm(categories[0]?.id));
    setImageFile(null);
  };
  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setNotice('');
    if (!acceptedImageTypes.has(file.type)) {
      setError('Use a JPG, PNG, WebP, or AVIF image.');
      return;
    }
    if (!file.size || file.size > maxImageSize) {
      setError('Product images must be between 1 byte and 5 MB.');
      return;
    }
    setError('');
    setImageFile(file);
  };

  const discardUploadedImage = async (url: string) => {
    await fetch('/api/admin/product-images', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    }).catch(() => undefined);
  };

  const submit = (event: FormSubmitEvent) => {
    event.preventDefault();
    setNotice('');
    setError('');
    startTransition(async () => {
      let uploadedUrl: string | null = null;
      try {
        if (imageFile) {
          const imageBody = new FormData();
          imageBody.append('image', imageFile);
          const uploadResponse = await fetch('/api/admin/product-images', {
            method: 'POST',
            body: imageBody,
          });
          const uploadResult = await responseJson(uploadResponse);
          if (!uploadResponse.ok || !uploadResult.url)
            throw new Error(
              uploadResult.error ?? 'Unable to upload the image.',
            );
          uploadedUrl = uploadResult.url;
        }

        const response = await fetch('/api/admin/products', {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...form,
            image_key: uploadedUrl ?? form.image_key,
          }),
        });
        const result = await responseJson(response);
        if (!response.ok) {
          if (result.field)
            document.getElementsByName(result.field)[0]?.focus();
          throw new Error(result.error ?? 'Unable to save product.');
        }
        if (!result.product)
          throw new Error('Saved. Reload to see the updated catalog.');
        const saved = result.product;
        setItems((current) => [
          saved,
          ...current.filter((item) => item.id !== saved.id),
        ]);
        resetForm();
        setNotice(
          uploadedUrl
            ? 'Product and image saved. It is ready in the catalog.'
            : (result.message ?? 'Product saved.'),
        );
      } catch (reason) {
        if (uploadedUrl) await discardUploadedImage(uploadedUrl);
        setError(
          reason instanceof Error ? reason.message : 'Unable to save product.',
        );
      }
    });
  };
  const remove = (product: Product) => {
    setNotice('');
    setError('');
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/products', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: product.id, version: versionOf(product) }),
        });
        const result = await responseJson(response);
        if (!response.ok)
          throw new Error(result.error ?? 'Unable to delete product.');
        setItems((current) => current.filter((item) => item.id !== product.id));
        setDeleteTarget(null);
        if (form.id === product.id) resetForm();
        setNotice(result.message ?? 'Product deleted.');
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to delete product.',
        );
      }
    });
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,.11),transparent_30%),#03060c] px-4 py-8 text-white sm:px-8 sm:py-10"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <a
              href="/admin"
              className="text-sm font-bold text-cyan-300 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              ← Admin overview
            </a>
            <p className="mt-6 text-sm font-black uppercase tracking-[.2em] text-cyan-300">
              Catalog control
            </p>
            <h1 className="mt-2 text-4xl font-black text-balance sm:text-5xl">
              Products
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Add product photos and details, control stock, and choose exactly
              what appears in the storefront.
            </p>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,.08)]">
            {items.length} products
          </span>
        </div>

        <div aria-live="polite" className="min-h-16 pt-5">
          {notice ? (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-emerald-200">
              <CheckCircle2 aria-hidden="true" className="size-5 shrink-0" />
              {notice}
            </p>
          ) : null}
          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200"
            >
              {error}
            </p>
          ) : null}
        </div>

        <section className="mt-3 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
          <form
            onSubmit={submit}
            className="order-1 min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1420]/95 shadow-2xl shadow-black/30"
            autoComplete="off"
            aria-label={editing ? 'Edit product' : 'Add product'}
          >
            <div className="border-b border-white/10 bg-gradient-to-r from-cyan-300/10 to-transparent p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">
                    {editing ? 'Editing catalog item' : 'New catalog item'}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {editing
                      ? form.title_en || 'Edit product'
                      : 'Add a product'}
                  </h2>
                </div>
                {editing ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={resetForm}
                    className="min-h-11 rounded-lg px-3 text-sm font-bold text-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300"
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-7 p-5 sm:p-7">
              <fieldset
                disabled={pending}
                className="grid gap-4 sm:grid-cols-2"
              >
                <legend className="mb-4 text-base font-black text-white sm:col-span-2">
                  Product details
                </legend>
                {(
                  [
                    ['title_en', 'Product name (English)', 'text'],
                    ['title_ar', 'Product name (Arabic)', 'text'],
                    ['slug', 'URL slug', 'text'],
                    ['sku', 'SKU', 'text'],
                    ['price', 'Price (OMR)', 'number'],
                    ['sale_price', 'Sale price (OMR, optional)', 'number'],
                    ['stock_quantity', 'Stock quantity', 'number'],
                    [
                      'low_stock_threshold',
                      'Low-stock warning level',
                      'number',
                    ],
                  ] as const
                ).map(([key, label, type]) => (
                  <label
                    key={key}
                    className="grid gap-1.5 text-sm font-bold text-slate-200"
                  >
                    {label}
                    <input
                      step={
                        type === 'number'
                          ? ['stock_quantity', 'low_stock_threshold'].includes(
                              key,
                            )
                            ? '1'
                            : '0.001'
                          : undefined
                      }
                      min={type === 'number' ? '0' : undefined}
                      name={key}
                      type={type}
                      inputMode={
                        type === 'number'
                          ? ['stock_quantity', 'low_stock_threshold'].includes(
                              key,
                            )
                            ? 'numeric'
                            : 'decimal'
                          : undefined
                      }
                      value={form[key] as string}
                      onChange={(event) => update(key, event.target.value)}
                      placeholder={
                        key === 'slug' ? 'blackshark-next-product' : undefined
                      }
                      required={!['sale_price', 'title_ar'].includes(key)}
                      className={fieldClass}
                    />
                  </label>
                ))}
                <label className="grid gap-1.5 text-sm font-bold text-slate-200 sm:col-span-2">
                  Short description
                  <textarea
                    name="short_description"
                    value={form.short_description}
                    onChange={(event) =>
                      update('short_description', event.target.value)
                    }
                    required
                    rows={4}
                    className={`${fieldClass} resize-y py-2.5`}
                  />
                </label>
              </fieldset>

              <fieldset
                disabled={pending}
                className="grid gap-4 sm:grid-cols-2"
              >
                <legend className="mb-4 text-base font-black text-white sm:col-span-2">
                  Organization and visibility
                </legend>
                <label className="grid gap-1.5 text-sm font-bold text-slate-200">
                  Category
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={(event) =>
                      update('category_id', event.target.value)
                    }
                    required
                    className={fieldClass}
                  >
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nameEn}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-200">
                  Brand
                  <select
                    name="brand_id"
                    value={form.brand_id}
                    onChange={(event) => update('brand_id', event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">No brand</option>
                    {brands.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-200">
                  Visibility
                  <select
                    name="status"
                    value={form.status}
                    onChange={(event) =>
                      update('status', event.target.value as Product['status'])
                    }
                    className={fieldClass}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </label>
                <label className="flex min-h-11 items-center gap-3 self-end rounded-xl border border-white/10 bg-[#07101d] px-3 text-sm font-bold text-slate-200">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={(event) =>
                      update('featured', event.target.checked)
                    }
                    className="size-5 accent-cyan-300"
                  />
                  Feature on home page
                </label>
              </fieldset>

              <fieldset disabled={pending}>
                <legend className="mb-4 text-base font-black text-white">
                  Product photo
                </legend>
                <div className="grid gap-4 rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[.04] p-4 sm:grid-cols-[180px_1fr] sm:items-center">
                  <div className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#03060c]">
                    <Image
                      src={imagePreview}
                      alt={`${form.title_en || 'Product'} preview`}
                      width={320}
                      height={320}
                      unoptimized={
                        imagePreview.startsWith('blob:') ||
                        imagePreview.startsWith('/api/')
                      }
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                  <div>
                    <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                      <ImagePlus aria-hidden="true" className="size-5" />
                    </div>
                    <p className="font-bold">Choose the product’s main image</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      JPG, PNG, WebP, or AVIF. Maximum 5 MB. A square image
                      works best across the store.
                    </p>
                    <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-cyan-300/40 px-4 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/10 focus-within:outline-2 focus-within:outline-cyan-300">
                      <Upload aria-hidden="true" className="size-4" />
                      {imageFile ? 'Choose a different image' : 'Upload image'}
                      <input
                        name="product_image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={chooseImage}
                        className="sr-only"
                      />
                    </label>
                    {imageFile ? (
                      <p className="mt-3 break-all text-xs text-emerald-300">
                        Ready to upload: {imageFile.name}
                      </p>
                    ) : null}
                  </div>
                </div>
              </fieldset>

              <button
                disabled={pending}
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 font-black text-[#04101b] shadow-[0_10px_40px_rgba(34,211,238,.14)] transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-white"
              >
                {pending
                  ? imageFile
                    ? 'Uploading image and saving…'
                    : 'Saving…'
                  : editing
                    ? 'Save changes'
                    : 'Add product'}
              </button>
            </div>
          </form>

          <section className="order-2 min-w-0 rounded-3xl border border-white/10 bg-[#0b1420]/95 p-5 shadow-2xl shadow-black/20 xl:sticky xl:top-32">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-cyan-300">
                  Live inventory
                </p>
                <h2 className="mt-1 text-xl font-black">Current catalog</h2>
              </div>
              <label className="sr-only" htmlFor="admin-product-filter">
                Filter products
              </label>
              <input
                id="admin-product-filter"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter…"
                className="min-h-10 w-32 rounded-xl border border-white/15 bg-[#07101d] px-3 text-sm text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Showing {filtered.length} of {items.length}
            </p>
            <div className="mt-4 grid max-h-[60vh] gap-3 overflow-y-auto pr-1 xl:max-h-[calc(100vh-16rem)]">
              {filtered.length ? (
                filtered.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-white/10 bg-[#07101d] p-3 transition hover:border-cyan-300/25"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#03060c]">
                        <Image
                          src={product.imageKey ?? '/blackshark-logo.png'}
                          alt=""
                          width={96}
                          height={96}
                          unoptimized={product.imageKey?.startsWith('/api/')}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="break-words font-bold leading-5">
                            {product.titleEn}
                          </h3>
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${product.status === 'PUBLISHED' ? 'bg-emerald-400/10 text-emerald-300' : product.status === 'HIDDEN' ? 'bg-amber-400/10 text-amber-300' : 'bg-white/10 text-slate-300'}`}
                          >
                            {product.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                          {product.sku}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {omr.format(
                            (product.salePriceBaisa ?? product.priceBaisa) /
                              1000,
                          )}{' '}
                          · {product.stockQuantity} in stock
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        disabled={pending}
                        type="button"
                        onClick={() => {
                          setForm(toForm(product));
                          setImageFile(null);
                          setError('');
                          setNotice('');
                          window.scrollTo({
                            top: 0,
                            behavior: window.matchMedia(
                              '(prefers-reduced-motion: reduce)',
                            ).matches
                              ? 'auto'
                              : 'smooth',
                          });
                        }}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-300/40 px-3 text-sm font-bold text-cyan-200 hover:bg-cyan-300/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
                      >
                        <Pencil aria-hidden="true" className="size-4" /> Edit
                      </button>
                      <button
                        disabled={pending}
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-400/40 px-3 text-sm font-bold text-red-200 hover:bg-red-400/10 focus-visible:outline-2 focus-visible:outline-red-300"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 p-7 text-center text-sm text-slate-400">
                  <PackageSearch
                    aria-hidden="true"
                    className="mx-auto mb-3 size-8 text-slate-500"
                  />
                  No products match this filter.
                </div>
              )}
            </div>
          </section>
        </section>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !pending) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="border border-red-300/20 bg-[#0b1420] text-white">
          <AlertDialogTitle>Delete this product?</AlertDialogTitle>
          <AlertDialogDescription className="break-words text-slate-300">
            “{deleteTarget?.titleEn}” and its uploaded image will be permanently
            removed. You can set visibility to Hidden instead to keep its
            details.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              Keep Product
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              className="bg-red-500 text-white hover:bg-red-400"
              onClick={() => {
                if (deleteTarget) remove(deleteTarget);
              }}
            >
              {pending ? 'Deleting…' : 'Delete Product'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
