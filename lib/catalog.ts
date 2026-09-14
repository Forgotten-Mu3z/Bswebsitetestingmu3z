export const PC_COMPONENT_TYPES = [
  { value: 'processors', label: 'Processors', prefixes: ['Processor'] },
  {
    value: 'graphics-cards',
    label: 'Graphics cards',
    prefixes: ['Graphics Card'],
  },
  {
    value: 'motherboards',
    label: 'Motherboards',
    prefixes: ['Motherboard'],
  },
  { value: 'memory', label: 'Memory', prefixes: ['Memory'] },
  { value: 'storage', label: 'Storage', prefixes: ['Storage'] },
  {
    value: 'power-supplies',
    label: 'Power supplies',
    prefixes: ['Power Supply'],
  },
  { value: 'cases', label: 'PC cases', prefixes: ['PC Case'] },
  {
    value: 'cpu-cooling',
    label: 'CPU cooling',
    prefixes: ['CPU Cooler'],
  },
  { value: 'case-fans', label: 'Case fans', prefixes: ['Case Fan'] },
  {
    value: 'networking',
    label: 'Networking',
    prefixes: ['Network Card'],
  },
  {
    value: 'capture-cards',
    label: 'Capture cards',
    prefixes: ['Capture Card'],
  },
  {
    value: 'build-accessories',
    label: 'Build accessories',
    prefixes: ['Thermal Compound', 'Riser Cable'],
  },
] as const;

export function hasProductPrefix(
  description: string,
  prefixes: readonly string[],
) {
  return prefixes.some((prefix) => description.startsWith(`${prefix} ·`));
}
