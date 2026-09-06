import { createBlankDocument } from "./bannerModel";
import { createResultTemplate } from "./templates/resultTemplate";
import { createClassResultTemplate } from "./templates/classResultTemplate";
import { createAdmissionTemplate } from "./templates/admissionTemplate";
import { createToppersTemplate } from "./templates/toppersTemplate";
import { createAdvertiseTemplate } from "./templates/advertiseTemplate";
import { createExamNewsTemplate } from "./templates/examNewsTemplate";
import { createAdmissionFlyerTemplate } from "./templates/admissionFlyerTemplate";
import { createPhotoBoardTemplate } from "./templates/photoBoardTemplate";
import { createDualResultTemplate } from "./templates/dualResultTemplate";

export const BANNER_TEMPLATES = [
  {
    id: "result",
    title: "Student result",
    description: "Congratulations post with round photo, score seal, and contact bar.",
    defaultPalette: "festive",
    create: createResultTemplate,
  },
  {
    id: "toppers",
    title: "Class stars",
    description: "Green institute header with science and commerce photo rows.",
    defaultPalette: "institute",
    create: createToppersTemplate,
  },
  {
    id: "photo-board",
    title: "Photo result board",
    description: "Maroon board, 12 class photos, score badges, and a featured topper.",
    defaultPalette: "board",
    create: createPhotoBoardTemplate,
  },
  {
    id: "dual-result",
    title: "Board result flyer",
    description: "Maroon header, featured 545 topper, and Class 9 / Class 10 score grids.",
    defaultPalette: "flyer",
    create: createDualResultTemplate,
  },
  {
    id: "class-result",
    title: "Class result",
    description: "Green-gold Punjab toppers sheet with twelve round photos.",
    defaultPalette: "cream",
    create: createClassResultTemplate,
  },
  {
    id: "admission",
    title: "School admission",
    description: "Round campus photo, year tag, and a We Offer list.",
    defaultPalette: "royal",
    create: createAdmissionTemplate,
  },
  {
    id: "advertise",
    title: "Enrol now",
    description: "Green split ad with student photo, heading, and enrol button.",
    defaultPalette: "institute",
    create: createAdvertiseTemplate,
  },
  {
    id: "exam-news",
    title: "Result announcement",
    description: "Green-gold BISE result poster with pass stats and campus photo.",
    defaultPalette: "announce",
    create: createExamNewsTemplate,
  },
  {
    id: "admission-flyer",
    title: "Admission flyer",
    description: "Maroon-gold admissions open flyer for Matric and Intermediate.",
    defaultPalette: "college",
    create: createAdmissionFlyerTemplate,
  },
];

export function getBannerTemplate(id) {
  return BANNER_TEMPLATES.find((item) => item.id === id) ?? null;
}

export function createBannerFromQuery({ templateId, formatId, paletteId }) {
  if (!templateId || templateId === "blank") {
    return createBlankDocument({ formatId, paletteId, name: "Blank banner" });
  }
  const template = getBannerTemplate(templateId);
  if (!template) {
    return createBlankDocument({ formatId, paletteId });
  }
  return template.create(formatId, paletteId || template.defaultPalette);
}
