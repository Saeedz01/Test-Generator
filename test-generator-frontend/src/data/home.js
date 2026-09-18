/**
 * Homepage marketing fixtures — UI demo only.
 */

import { ROUTES } from "@/constants";

export const homeQuote = {
  text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  attribution: "Malcolm X",
};


export const platformFeatures = [
  {
    id: "feat-smart",
    title: "Smart Test Generation",
    description:
      "Compose balanced papers in minutes with intelligent chapter mixing.",
    icon: "sparkles",
  },
  {
    id: "feat-chapter",
    title: "Chapter-wise Questions",
    description:
      "Drill into any chapter and pull precisely the coverage you need.",
    icon: "layers",
  },

  {
    id: "feat-pdf",
    title: "PDF Export",
    description:
      "Export clean, print-ready papers with consistent formatting.",
    icon: "file",
  },
  {
    id: "feat-types",
    title: "MCQs, Short & Long Questions",
    description:
      "Cover every assessment style from objective to essay responses.",
    icon: "list",
  },
  {
    id: "feat-select",
    title: "Instant Selection",
    description:
      "Pick questions quickly with filters that feel effortless to use.",
    icon: "mouse",
  },
  {
    id: "feat-search",
    title: "Fast Search",
    description:
      "Find topics, chapters, and stems across your entire library.",
    icon: "search",
  },
];


export const homeStats = [
  {
    id: "stat-classes",
    label: "Classes",
    value: "Your grades",
  },
  {
    id: "stat-books",
    label: "Books",
    value: "Subject banks",
  },
  {
    id: "stat-papers",
    label: "Papers",
    value: "Print-ready PDFs",
  },
  {
    id: "stat-library",
    label: "Library",
    value: "Grows with you",
  },
];

export const footerNav = [
  { label: "Classes", href: ROUTES.CLASSES },
  { label: "Banner Designer", href: ROUTES.BANNER },
  { label: "About", href: ROUTES.ABOUT },
];
