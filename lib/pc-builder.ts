export type BuilderProduct = {
  id: string;
  slug: string;
  sku: string;
  titleEn: string;
  shortDescription: string;
  priceBaisa: number;
  salePriceBaisa: number | null;
  stockQuantity: number;
  imageKey: string | null;
};

export type BuilderStep =
  | 'cpu'
  | 'motherboard'
  | 'memory'
  | 'gpu'
  | 'storage'
  | 'cooler'
  | 'psu'
  | 'case';

export type BuilderSelections = Partial<Record<BuilderStep, string>>;

export const builderSteps: Array<{
  key: BuilderStep;
  label: string;
  shortLabel: string;
  description: string;
  prefix: string;
}> = [
  {
    key: 'cpu',
    label: 'Processor',
    shortLabel: 'CPU',
    description: 'Sets the platform and motherboard socket.',
    prefix: 'Processor',
  },
  {
    key: 'motherboard',
    label: 'Motherboard',
    shortLabel: 'Board',
    description: 'Matched to your processor socket.',
    prefix: 'Motherboard',
  },
  {
    key: 'memory',
    label: 'Memory',
    shortLabel: 'RAM',
    description: 'Matched to your motherboard’s DDR generation.',
    prefix: 'Memory',
  },
  {
    key: 'gpu',
    label: 'Graphics Card',
    shortLabel: 'GPU',
    description: 'Choose the performance level for your games.',
    prefix: 'Graphics Card',
  },
  {
    key: 'storage',
    label: 'Storage',
    shortLabel: 'Storage',
    description: 'Fast space for Windows, games, and files.',
    prefix: 'Storage',
  },
  {
    key: 'cooler',
    label: 'CPU Cooler',
    shortLabel: 'Cooler',
    description: 'Cooling for sustained processor performance.',
    prefix: 'CPU Cooler',
  },
  {
    key: 'psu',
    label: 'Power Supply',
    shortLabel: 'Power',
    description: 'Wattage checked against your graphics card.',
    prefix: 'Power Supply',
  },
  {
    key: 'case',
    label: 'PC Case',
    shortLabel: 'Case',
    description: 'Sized to fit your selected motherboard.',
    prefix: 'PC Case',
  },
];

export function getBuilderStep(product: BuilderProduct): BuilderStep | null {
  const step = builderSteps.find(({ prefix }) =>
    product.shortDescription.startsWith(`${prefix} ·`),
  );
  return step?.key ?? null;
}

export function getSocket(product: BuilderProduct) {
  const text = `${product.titleEn} ${product.shortDescription}`.toUpperCase();
  if (/LGA\s*1851/.test(text) || text.includes('CORE ULTRA')) return 'LGA 1851';
  if (/LGA\s*1700/.test(text) || /CORE I[3579]-1[234]\d{3}/.test(text)) {
    return 'LGA 1700';
  }
  if (text.includes('AM5') || /RYZEN [3579] [789]\d{3}/.test(text))
    return 'AM5';
  if (text.includes('AM4')) return 'AM4';
  return null;
}

export function getMemoryType(product: BuilderProduct) {
  const text = `${product.titleEn} ${product.shortDescription}`.toUpperCase();
  if (text.includes('DDR5')) return 'DDR5';
  if (text.includes('DDR4')) return 'DDR4';
  return null;
}

export function getFormFactor(product: BuilderProduct) {
  const text = `${product.titleEn} ${product.shortDescription}`.toUpperCase();
  if (text.includes('MINI-ITX') || text.includes('MINI ITX')) return 'Mini-ITX';
  if (text.includes('MICRO-ATX') || text.includes('MATX')) return 'Micro-ATX';
  if (text.includes('ATX')) return 'ATX';
  return null;
}

export function getWattage(product: BuilderProduct) {
  const match = `${product.titleEn} ${product.shortDescription}`.match(
    /\b(\d{3,4})\s*W\b/i,
  );
  return match ? Number(match[1]) : null;
}

export function getRecommendedWattage(product: BuilderProduct) {
  const text = `${product.titleEn} ${product.shortDescription}`.toUpperCase();
  if (text.includes('RTX 5090')) return 1000;
  if (text.includes('RTX 5080') || text.includes('RX 9070 XT')) return 850;
  if (text.includes('RTX 5070') || text.includes('RX 9070')) return 750;
  if (text.includes('RTX 5060')) return 650;
  return 650;
}

export function getCompatibilityLabel(
  step: BuilderStep,
  product: BuilderProduct,
) {
  if (step === 'cpu') return getSocket(product) ?? 'Socket not listed';
  if (step === 'motherboard') {
    return [getSocket(product), getMemoryType(product), getFormFactor(product)]
      .filter(Boolean)
      .join(' · ');
  }
  if (step === 'memory')
    return getMemoryType(product) ?? 'Memory type not listed';
  if (step === 'gpu')
    return `${getRecommendedWattage(product)}W PSU recommended`;
  if (step === 'psu')
    return getWattage(product)
      ? `${getWattage(product)}W`
      : 'Wattage not listed';
  if (step === 'case') return getFormFactor(product) ?? 'Case size not listed';
  if (step === 'cooler') return 'Modern desktop sockets';
  return product.shortDescription.split(' · ')[1] ?? product.sku;
}

function caseFitsMotherboard(
  pcCase: BuilderProduct,
  motherboard: BuilderProduct,
) {
  const boardSize = getFormFactor(motherboard);
  const caseSize = getFormFactor(pcCase);
  if (!boardSize || !caseSize) return true;
  if (caseSize === 'ATX') return true;
  if (caseSize === 'Micro-ATX') return boardSize !== 'ATX';
  return boardSize === 'Mini-ITX';
}

export function isCompatible(
  step: BuilderStep,
  candidate: BuilderProduct,
  selections: BuilderSelections,
  productsById: Map<string, BuilderProduct>,
) {
  const cpu = selections.cpu ? productsById.get(selections.cpu) : undefined;
  const motherboard = selections.motherboard
    ? productsById.get(selections.motherboard)
    : undefined;
  const gpu = selections.gpu ? productsById.get(selections.gpu) : undefined;

  if (step === 'motherboard' && cpu) {
    const cpuSocket = getSocket(cpu);
    return Boolean(cpuSocket && cpuSocket === getSocket(candidate));
  }

  if (step === 'memory' && motherboard) {
    const memoryType = getMemoryType(motherboard);
    return Boolean(memoryType && memoryType === getMemoryType(candidate));
  }

  if (step === 'case' && motherboard) {
    return caseFitsMotherboard(candidate, motherboard);
  }

  if (step === 'psu' && gpu) {
    const wattage = getWattage(candidate);
    return Boolean(wattage && wattage >= getRecommendedWattage(gpu));
  }

  if (step === 'cooler' && cpu) {
    const text =
      `${candidate.titleEn} ${candidate.shortDescription}`.toUpperCase();
    const listedSockets = ['AM4', 'AM5', 'LGA 1700', 'LGA 1851'].filter(
      (socket) => text.includes(socket),
    );
    return (
      listedSockets.length === 0 || listedSockets.includes(getSocket(cpu) ?? '')
    );
  }

  return true;
}

export function getStepRequirement(
  step: BuilderStep,
  selections: BuilderSelections,
  productsById: Map<string, BuilderProduct>,
) {
  if (step === 'motherboard') {
    const cpu = selections.cpu ? productsById.get(selections.cpu) : undefined;
    return cpu
      ? `${getSocket(cpu) ?? 'Matching'} socket only`
      : 'Choose a CPU first';
  }
  if (step === 'memory') {
    const board = selections.motherboard
      ? productsById.get(selections.motherboard)
      : undefined;
    return board
      ? `${getMemoryType(board) ?? 'Matching'} memory only`
      : 'Choose a motherboard first';
  }
  if (step === 'psu') {
    const gpu = selections.gpu ? productsById.get(selections.gpu) : undefined;
    return gpu
      ? `${getRecommendedWattage(gpu)}W or higher`
      : 'Choose a graphics card first';
  }
  if (step === 'case')
    return selections.motherboard
      ? 'Compatible sizes only'
      : 'Choose a motherboard first';
  if (step === 'cooler')
    return selections.cpu ? 'Compatible mounting only' : 'Choose a CPU first';
  return null;
}

export function hasPrerequisite(
  step: BuilderStep,
  selections: BuilderSelections,
) {
  if (step === 'motherboard' || step === 'cooler')
    return Boolean(selections.cpu);
  if (step === 'memory' || step === 'case')
    return Boolean(selections.motherboard);
  if (step === 'psu') return Boolean(selections.gpu);
  return true;
}

export function normalizeSelections(
  selections: BuilderSelections,
  productsById: Map<string, BuilderProduct>,
) {
  const next = { ...selections };
  const dependentOrder: BuilderStep[] = [
    'motherboard',
    'memory',
    'cooler',
    'psu',
    'case',
  ];

  for (const step of dependentOrder) {
    const productId = next[step];
    const product = productId ? productsById.get(productId) : undefined;
    if (
      !product ||
      !hasPrerequisite(step, next) ||
      !isCompatible(step, product, next, productsById)
    ) {
      delete next[step];
    }
  }

  return next;
}
