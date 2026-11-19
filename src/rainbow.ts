export const rainbowVividStops = ['#E44A7A', '#F1843E', '#F0BA38', '#44BC7B', '#28B1D6', '#8962D6'] as const
export const rainbowPastelStops = ['#F7D5E2', '#FCE1CE', '#F8EFC7', '#D0EFE2', '#CDE6FA', '#E4D8F8'] as const
export const rainbowGradient = `linear-gradient(90deg in srgb, ${rainbowVividStops.join(', ')})`
export const rainbowBorder = `linear-gradient(135deg in srgb, ${rainbowVividStops.join(', ')})`
export const rainbowPastelWash = `linear-gradient(115deg in srgb, ${rainbowPastelStops.join(', ')})`
export const rainbowSurface = `linear-gradient(110deg in srgb, ${rainbowVividStops.map((color) =>
  `color-mix(in srgb, ${color} 22%, var(--surface-solid))`,
).join(', ')})`
