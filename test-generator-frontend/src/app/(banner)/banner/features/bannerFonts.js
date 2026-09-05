export const BANNER_FONTS = [
  {
    id: "jakarta",
    label: "Plus Jakarta Sans",
    value: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
  },
  {
    id: "playfair",
    label: "Playfair Display",
    value: 'var(--font-playfair), "Playfair Display", serif',
  },
  {
    id: "mono",
    label: "Geist Mono",
    value: 'var(--font-geist-mono), ui-monospace, monospace',
  },
  {
    id: "script",
    label: "Great Vibes",
    value: 'var(--font-script), "Great Vibes", cursive',
  },
];

export function getBannerFont(id) {
  return BANNER_FONTS.find((item) => item.id === id) ?? BANNER_FONTS[0];
}
