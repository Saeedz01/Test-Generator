/** Subject lane colors — opaque flats for interactive cards & pills. */

const THEMES = {
  Science: { stripe: "#0f766e", tagBg: "#ccfbf1", tagText: "#064e3b" },
  Core: { stripe: "#1d4ed8", tagBg: "#dbeafe", tagText: "#1e3a8a" },
  Language: { stripe: "#7c3aed", tagBg: "#ede9fe", tagText: "#4c1d95" },
  "Social studies": { stripe: "#b45309", tagBg: "#fef3c7", tagText: "#78350f" },
  "Religious studies": { stripe: "#047857", tagBg: "#d1fae5", tagText: "#065f46" },
  ICT: { stripe: "#0369a1", tagBg: "#e0f2fe", tagText: "#0c4a6e" },
  "Pre-engineering": { stripe: "#0e7490", tagBg: "#cffafe", tagText: "#134e4a" },
  "Pre-medical": { stripe: "#15803d", tagBg: "#dcfce7", tagText: "#14532d" },
  General: { stripe: "#475569", tagBg: "#e2e8f0", tagText: "#0f172a" },
};

/**
 * @param {string | undefined} category
 */
export function categorySurface(category) {
  const theme = THEMES[category ?? "General"] ?? THEMES.General;
  return { label: category ?? "General", ...theme };
}
