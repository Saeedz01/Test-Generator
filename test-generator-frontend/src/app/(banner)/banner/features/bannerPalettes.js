export const BANNER_PALETTES = [
  {
    id: "olive",
    label: "Testora Olive",
    roles: {
      canvas: "#142010",
      surface: "#24361c",
      text: "#f4f4f0",
      muted: "#c8d0b8",
      accent: "#7aab3c",
      accentText: "#ffffff",
    },
  },
  {
    id: "gold",
    label: "Results Gold",
    roles: {
      canvas: "#1a1408",
      surface: "#2c2414",
      text: "#faf6ea",
      muted: "#d4c8a8",
      accent: "#c4a24a",
      accentText: "#1a1408",
    },
  },
  {
    id: "navy",
    label: "Admission Navy",
    roles: {
      canvas: "#0e1824",
      surface: "#1a2a3c",
      text: "#f2f6fa",
      muted: "#b4c4d4",
      accent: "#3b7cb8",
      accentText: "#ffffff",
    },
  },
  {
    id: "crimson",
    label: "Achievement Crimson",
    roles: {
      canvas: "#1c1010",
      surface: "#321818",
      text: "#faf2f2",
      muted: "#d4b8b8",
      accent: "#c45c5c",
      accentText: "#ffffff",
    },
  },
  {
    id: "paper",
    label: "Paper Light",
    roles: {
      canvas: "#f7f7f5",
      surface: "#ffffff",
      text: "#1a1a18",
      muted: "#5c5c55",
      accent: "#587b2a",
      accentText: "#ffffff",
    },
  },
  {
    id: "festive",
    label: "Festive Red",
    roles: {
      canvas: "#ffffff",
      surface: "#d01224",
      text: "#141414",
      muted: "#4a4a4a",
      accent: "#c9a227",
      accentText: "#ffffff",
    },
  },
  {
    id: "institute",
    label: "Institute Green",
    roles: {
      canvas: "#ffffff",
      surface: "#1b5e20",
      text: "#16325c",
      muted: "#4a5560",
      accent: "#c9a227",
      accentText: "#ffffff",
    },
  },
  {
    id: "cream",
    label: "Exam Cream",
    roles: {
      canvas: "#f3ead6",
      surface: "#ffffff",
      text: "#4a3728",
      muted: "#6d5c4d",
      accent: "#1e4d9c",
      accentText: "#ffffff",
    },
  },
  {
    id: "royal",
    label: "Admission Royal",
    roles: {
      canvas: "#ffffff",
      surface: "#1e4db7",
      text: "#1e4db7",
      muted: "#5c5c5c",
      accent: "#f39200",
      accentText: "#ffffff",
    },
  },
  {
    id: "announce",
    label: "News Announce",
    roles: {
      canvas: "#071a42",
      surface: "#0e3a8c",
      text: "#ffffff",
      muted: "#c5d4f0",
      accent: "#f5c518",
      accentText: "#071a42",
    },
  },
];

export function getBannerPalette(id) {
  return BANNER_PALETTES.find((item) => item.id === id) ?? BANNER_PALETTES[0];
}

export function resolveRoleColor(paletteId, role, fallback) {
  const palette = getBannerPalette(paletteId);
  if (role && palette.roles[role]) return palette.roles[role];
  return fallback || palette.roles.text;
}
