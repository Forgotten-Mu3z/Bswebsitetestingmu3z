'use client';

import Image from 'next/image';
import {
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Fan,
  Gauge,
  HardDrive,
  MemoryStick,
  MessageCircle,
  MonitorUp,
  PackageCheck,
  ShieldCheck,
  Trash2,
  XCircle,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  builderSteps,
  getBuilderStep,
  getCompatibilityLabel,
  getStepRequirement,
  hasPrerequisite,
  isCompatible,
  normalizeSelections,
  type BuilderProduct,
  type BuilderSelections,
  type BuilderStep,
} from '@/lib/pc-builder';
import { missingProductImage } from '@/lib/product-images';

const omr = new Intl.NumberFormat('en-OM', {
  style: 'currency',
  currency: 'OMR',
  minimumFractionDigits: 3,
});

const stepIcons = {
  cpu: Cpu,
  motherboard: CircuitBoard,
  memory: MemoryStick,
  gpu: MonitorUp,
  storage: HardDrive,
  cooler: Fan,
  psu: Zap,
  case: Box,
} satisfies Record<BuilderStep, typeof Cpu>;

const storageKey = 'blackshark-pc-builder-v1';
const publicBuilderUrl =
  'https://blackshark-gaming-oman.xxgunone11.chatgpt.site/build';

function getPrice(product: BuilderProduct) {
  return product.salePriceBaisa ?? product.priceBaisa;
}

function getBuildParams(selections: BuilderSelections) {
  const params = new URLSearchParams();
  for (const { key } of builderSteps) {
    const productId = selections[key];
    if (productId) params.set(key, productId);
  }
  return params;
}

function ProductPicker({
  step,
  products,
  selectedId,
  onSelect,
}: {
  step: BuilderStep;
  products: BuilderProduct[];
  selectedId?: string;
  onSelect: (productId: string) => void;
}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-amber-300/25 bg-amber-300/8 p-5 text-amber-100">
        <h3 className="font-bold">No compatible parts are listed yet</h3>
        <p className="mt-2 leading-6 text-amber-100/75">
          Choose a different earlier component or check again after the catalog
          is updated.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {products.map((product) => {
        const isSelected = product.id === selectedId;
        const isUnavailable = product.stockQuantity < 1;
        return (
          <button
            key={product.id}
            type="button"
            disabled={isUnavailable}
            onClick={() => onSelect(product.id)}
            aria-label={`Select ${product.titleEn}`}
            aria-pressed={isSelected}
            className="group min-w-0 rounded-2xl border border-white/10 bg-[#0a1420] p-3 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-[#0d1a28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-45 aria-pressed:border-cyan-300 aria-pressed:bg-cyan-300/10"
          >
            <div className="flex min-w-0 gap-3">
              <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#050a11]">
                <Image
                  src={product.imageKey ?? missingProductImage}
                  alt=""
                  width={80}
                  height={80}
                  unoptimized={product.imageKey?.startsWith('/api/')}
                  className="size-14 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 break-words font-bold leading-5 text-white">
                    {product.titleEn}
                  </p>
                  {isSelected ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-5 shrink-0 text-cyan-300"
                    />
                  ) : null}
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {product.sku}
                </p>
                <p className="mt-2 text-xs font-bold text-cyan-300">
                  {getCompatibilityLabel(step, product)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/8 pt-3">
              <span className="font-black tabular-nums text-white">
                {omr.format(getPrice(product) / 1000)}
              </span>
              <span
                className={
                  isUnavailable
                    ? 'text-xs font-bold text-red-300'
                    : 'text-xs font-bold text-emerald-300'
                }
              >
                {isUnavailable
                  ? 'Out of stock'
                  : `${product.stockQuantity} in stock`}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function PcBuilder({ products }: { products: BuilderProduct[] }) {
  const [selections, setSelections] = useState<BuilderSelections>({});
  const [activeStep, setActiveStep] = useState<BuilderStep | null>(null);
  const [notice, setNotice] = useState('');
  const [hasLoadedSavedBuild, setHasLoadedSavedBuild] = useState(false);

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const productsByStep = useMemo(() => {
    const grouped = new Map<BuilderStep, BuilderProduct[]>();
    for (const step of builderSteps) grouped.set(step.key, []);
    for (const product of products) {
      const step = getBuilderStep(product);
      if (step) grouped.get(step)?.push(product);
    }
    return grouped;
  }, [products]);

  /* oxlint-disable react/react-compiler -- Restore URL/local browser state after hydration. */
  useEffect(() => {
    try {
      const sharedParams = new URLSearchParams(window.location.search);
      const hasSharedBuild = builderSteps.some(({ key }) =>
        sharedParams.has(key),
      );

      if (hasSharedBuild) {
        const sharedSelections: BuilderSelections = {};
        for (const { key } of builderSteps) {
          const productId = sharedParams.get(key);
          if (productId && productsById.has(productId)) {
            sharedSelections[key] = productId;
          }
        }
        setSelections(normalizeSelections(sharedSelections, productsById));
        return;
      }

      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          version?: number;
          selections?: BuilderSelections;
        };
        if (parsed.version === 1 && parsed.selections) {
          const availableSelections = Object.fromEntries(
            Object.entries(parsed.selections).filter(
              ([, id]) => id && productsById.has(id),
            ),
          ) as BuilderSelections;
          setSelections(normalizeSelections(availableSelections, productsById));
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedSavedBuild(true);
    }
  }, [productsById]);
  /* oxlint-enable react/react-compiler */

  useEffect(() => {
    if (!hasLoadedSavedBuild) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, selections }),
    );

    const params = new URLSearchParams(window.location.search);
    for (const { key } of builderSteps) params.delete(key);
    const buildParams = getBuildParams(selections);
    buildParams.forEach((value, key) => params.set(key, value));
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    );
  }, [hasLoadedSavedBuild, selections]);

  const selectedProducts = builderSteps.flatMap(({ key }) => {
    const id = selections[key];
    const product = id ? productsById.get(id) : undefined;
    return product ? [product] : [];
  });
  const completedCount = selectedProducts.length;
  const totalBaisa = selectedProducts.reduce(
    (sum, product) => sum + getPrice(product),
    0,
  );
  const buildComplete = completedCount === builderSteps.length;
  const sharedBuildUrl = `${publicBuilderUrl}?${getBuildParams(selections)}`;
  const shareMessage = [
    'BLACKSHARK PC Build',
    '',
    ...builderSteps.map(({ key, label }) => {
      const productId = selections[key];
      const product = productId ? productsById.get(productId) : undefined;
      return `${label}: ${product?.titleEn ?? 'Not selected'}`;
    }),
    '',
    `Estimated total: ${omr.format(totalBaisa / 1000)}`,
    '',
    `View this build: ${sharedBuildUrl}`,
  ].join('\n');
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  const activeDefinition = activeStep
    ? builderSteps.find(({ key }) => key === activeStep)
    : undefined;
  const availableProducts = activeStep
    ? (productsByStep.get(activeStep) ?? []).filter((product) =>
        isCompatible(activeStep, product, selections, productsById),
      )
    : [];

  function chooseProduct(step: BuilderStep, productId: string) {
    const proposed = { ...selections, [step]: productId };
    const normalized = normalizeSelections(proposed, productsById);
    const removed = builderSteps
      .filter(({ key }) => selections[key] && !normalized[key])
      .map(({ label }) => label);
    setSelections(normalized);
    setActiveStep(null);
    setNotice(
      removed.length
        ? `${removed.join(' and ')} removed because the new choice changed compatibility.`
        : `${builderSteps.find(({ key }) => key === step)?.label ?? 'Component'} added to your build.`,
    );
  }

  function removeProduct(step: BuilderStep) {
    const next = { ...selections };
    delete next[step];
    const normalized = normalizeSelections(next, productsById);
    const removed = builderSteps
      .filter(({ key }) => selections[key] && !normalized[key])
      .map(({ label }) => label);
    setSelections(normalized);
    setNotice(`${removed.join(' and ')} removed.`);
  }

  function openPicker(step: BuilderStep) {
    if (!hasPrerequisite(step, selections)) return;
    setActiveStep(step);
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section aria-labelledby="parts-heading" className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[.18em] text-cyan-300">
                Your parts
              </p>
              <h2
                id="parts-heading"
                className="mt-1 text-2xl font-black text-white sm:text-3xl"
              >
                Choose one part at a time
              </h2>
            </div>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-slate-300 sm:inline-flex">
              {completedCount}/{builderSteps.length} selected
            </span>
          </div>

          <div
            aria-live="polite"
            className="mt-4 min-h-6 text-sm font-semibold text-cyan-200"
          >
            {notice}
          </div>

          <div className="mt-2 grid gap-3">
            {builderSteps.map((step, index) => {
              const Icon = stepIcons[step.key];
              const selectedId = selections[step.key];
              const selected = selectedId
                ? productsById.get(selectedId)
                : undefined;
              const canChoose = hasPrerequisite(step.key, selections);
              const requirement = getStepRequirement(
                step.key,
                selections,
                productsById,
              );
              return (
                <article
                  key={step.key}
                  className={`min-w-0 rounded-2xl border p-4 transition-[border-color,background-color] sm:p-5 ${selected ? 'border-emerald-300/25 bg-emerald-300/[.055]' : 'border-white/10 bg-[#08111c]'}`}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-xl ${selected ? 'bg-emerald-300/12 text-emerald-300' : 'bg-cyan-300/10 text-cyan-300'}`}
                    >
                      {selected ? (
                        <Check aria-hidden="true" className="size-5" />
                      ) : (
                        <Icon aria-hidden="true" className="size-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-xs font-black uppercase tracking-[.16em] text-slate-500">
                          Step {index + 1}
                        </p>
                        {requirement ? (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-bold text-slate-400">
                            {requirement}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-1 text-lg font-black text-white">
                        {step.label}
                      </h3>
                      {selected ? (
                        <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl bg-black/20 p-3">
                          <Image
                            src={selected.imageKey ?? missingProductImage}
                            alt=""
                            width={52}
                            height={52}
                            unoptimized={selected.imageKey?.startsWith('/api/')}
                            className="size-13 shrink-0 rounded-lg object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 break-words font-bold leading-5 text-white">
                              {selected.titleEn}
                            </p>
                            <p className="mt-1 text-xs font-bold text-cyan-300">
                              {getCompatibilityLabel(step.key, selected)}
                            </p>
                            <p className="mt-1 font-black tabular-nums text-white">
                              {omr.format(getPrice(selected) / 1000)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 sm:justify-end">
                    {selected ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeProduct(step.key)}
                        aria-label={`Remove ${step.label}`}
                        className="h-11 px-3 text-slate-300 hover:bg-red-300/10 hover:text-red-200"
                      >
                        <Trash2 aria-hidden="true" />
                        Remove
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      disabled={!canChoose}
                      onClick={() => openPicker(step.key)}
                      className="h-11 flex-1 bg-cyan-300 px-4 font-black text-[#03101a] hover:bg-cyan-200 sm:flex-none"
                    >
                      {selected
                        ? 'Change'
                        : canChoose
                          ? `Choose ${step.shortLabel}`
                          : requirement}
                      {canChoose ? <ChevronRight aria-hidden="true" /> : null}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside
          id="build-summary"
          aria-labelledby="summary-heading"
          className="scroll-mt-28 rounded-3xl border border-cyan-300/20 bg-[linear-gradient(145deg,rgba(16,39,55,.94),rgba(5,11,18,.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,.35)] lg:sticky lg:top-28"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-cyan-300 text-[#03101a]">
              <Gauge aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-cyan-300">
                Build check
              </p>
              <h2
                id="summary-heading"
                className="text-xl font-black text-white"
              >
                Build Summary
              </h2>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-sm font-medium text-white">
              <span>
                {buildComplete ? 'All core parts selected' : 'Build progress'}
              </span>
              <span className="tabular-nums text-slate-400">
                {completedCount}/{builderSteps.length}
              </span>
            </div>
            <progress
              aria-label="Build progress"
              aria-valuetext={`${completedCount} of ${builderSteps.length} parts selected`}
              max={builderSteps.length}
              value={completedCount}
              className="mt-3 block h-1 w-full appearance-none overflow-hidden rounded-full bg-white/10 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-cyan-300 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-cyan-300"
            />
          </div>

          <div
            className={`mt-5 rounded-2xl border p-4 ${buildComplete ? 'border-emerald-300/25 bg-emerald-300/8' : 'border-white/10 bg-white/[.035]'}`}
          >
            <div className="flex items-start gap-3">
              {buildComplete ? (
                <PackageCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-emerald-300"
                />
              ) : (
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-cyan-300"
                />
              )}
              <div>
                <p className="font-bold text-white">
                  {buildComplete
                    ? 'Your core build is ready'
                    : 'Compatibility checks are on'}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {buildComplete
                    ? 'The selected socket, memory, case size, and PSU wattage work together.'
                    : 'Only parts that fit your earlier choices are shown.'}
                </p>
              </div>
            </div>
          </div>

          <ol className="mt-5 space-y-2" aria-label="Selected components">
            {builderSteps.map((step) => {
              const product = selections[step.key]
                ? productsById.get(selections[step.key] as string)
                : undefined;
              return (
                <li
                  key={step.key}
                  className="flex min-w-0 items-center justify-between gap-3 text-sm"
                >
                  <span className="text-slate-400">{step.shortLabel}</span>
                  <span
                    className={`min-w-0 truncate text-right font-semibold ${product ? 'text-slate-100' : 'text-slate-600'}`}
                  >
                    {product?.titleEn ?? 'Not selected'}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-400">
                  Estimated total
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Based on current store prices
                </p>
              </div>
              <p className="text-2xl font-black tabular-nums text-white">
                {omr.format(totalBaisa / 1000)}
              </p>
            </div>
            {buildComplete ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share completed PC build on WhatsApp"
                className="mt-5 inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-black text-[#03130a] transition-colors hover:bg-[#20bd5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cffaa]"
              >
                <MessageCircle aria-hidden="true" className="size-5" />
                Share on WhatsApp
              </a>
            ) : null}
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <XCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Compatibility is based on the specifications listed for each
            product. Confirm case clearance and cooler mounting before purchase.
          </p>
        </aside>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-cyan-300/20 bg-[#050a12]/95 px-4 pt-3 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400">
              {completedCount}/{builderSteps.length} parts · Total
            </p>
            <p className="truncate text-lg font-black tabular-nums text-white">
              {omr.format(totalBaisa / 1000)}
            </p>
          </div>
          {buildComplete ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share completed PC build on WhatsApp"
              className="inline-flex min-h-11 shrink-0 touch-manipulation items-center gap-2 rounded-xl bg-[#25D366] px-4 font-black text-[#03130a] hover:bg-[#20bd5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cffaa]"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Share Build
            </a>
          ) : (
            <a
              href="#build-summary"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-cyan-300 px-4 font-black text-[#03101a] hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"
            >
              View Summary
              <ChevronRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(activeStep)}
        onOpenChange={(open) => {
          if (!open) setActiveStep(null);
        }}
      >
        <DialogContent className="max-h-[min(88dvh,800px)] max-w-4xl gap-0 overflow-hidden border-cyan-300/20 bg-[#050b13] p-0 text-white sm:max-w-4xl">
          <DialogHeader className="border-b border-white/10 px-5 py-5 pr-14 sm:px-6">
            <DialogTitle className="text-balance text-xl font-black sm:text-2xl">
              Choose {activeDefinition?.label ?? 'a Component'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {activeStep
                ? (getStepRequirement(activeStep, selections, productsById) ??
                  activeDefinition?.description)
                : ''}
              {' · '}
              {availableProducts.length} compatible{' '}
              {availableProducts.length === 1 ? 'option' : 'options'}
            </DialogDescription>
          </DialogHeader>
          <div className="overscroll-contain overflow-y-auto p-4 sm:p-6">
            {activeStep ? (
              <ProductPicker
                step={activeStep}
                products={availableProducts}
                selectedId={selections[activeStep]}
                onSelect={(productId) => chooseProduct(activeStep, productId)}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
