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
  {
    id: "arabic",
    label: "Cairo Arabic",
    value: 'var(--font-arabic), Cairo, sans-serif',
  },
  {
    id: "urdu",
    label: "Noto Nastaliq Urdu",
    value: 'var(--font-urdu), "Noto Nastaliq Urdu", serif',
  },
];

export function getBannerFont(id) {
  return BANNER_FONTS.find((item) => item.id === id) ?? BANNER_FONTS[0];
}
