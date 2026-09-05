import { createBlankDocument } from "./bannerModel";
import { createResultTemplate } from "./templates/resultTemplate";
import { createClassResultTemplate } from "./templates/classResultTemplate";
import { createAdmissionTemplate } from "./templates/admissionTemplate";
import { createToppersTemplate } from "./templates/toppersTemplate";
import { createAdvertiseTemplate } from "./templates/advertiseTemplate";
import { createExamNewsTemplate } from "./templates/examNewsTemplate";
import { createAdmissionFlyerTemplate } from "./templates/admissionFlyerTemplate";

export const BANNER_TEMPLATES = [
  {
    id: "result",
    title: "Student result",
    description: "Congratulations post with round photo, score seal, and contact bar.",
    defaultPalette: "festive",
    create: createResultTemplate,
  },
  {
    id: "class-result",
    title: "Class result",
    description: "Sixteen round photos with names and marks on a cream exam sheet.",
    defaultPalette: "cream",
    create: createClassResultTemplate,
  },
  {
    id: "toppers",
    title: "Class stars",
    description: "Green institute header with science and commerce photo rows.",
    defaultPalette: "institute",
    create: createToppersTemplate,
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
    description: "Breaking-news result poster with bold color blocks.",
    defaultPalette: "announce",
    create: createExamNewsTemplate,
  },
  {
    id: "admission-flyer",
    title: "Admission flyer",
    description: "Photo header, two-column flyer, and register-now ribbon.",
    defaultPalette: "royal",
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
