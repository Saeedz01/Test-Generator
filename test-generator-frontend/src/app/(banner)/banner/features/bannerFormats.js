export const BANNER_FORMATS = [
  { id: "ig-post", label: "Instagram Post", width: 1080, height: 1080 },
  { id: "ig-story", label: "Instagram Story", width: 1080, height: 1920 },
  { id: "landscape", label: "Landscape", width: 1920, height: 1080 },
  { id: "whatsapp", label: "WhatsApp Square", width: 1080, height: 1080 },
];

export function getBannerFormat(id) {
  return BANNER_FORMATS.find((item) => item.id === id) ?? BANNER_FORMATS[0];
}
