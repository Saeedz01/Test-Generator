/**
 * Homepage marketing fixtures — UI demo only.
 */

import { ROUTES } from "@/constants";

export const homeQuote = {
  text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  attribution: "Malcolm X",
};


export const featuredClasses = [
  {
    id: "feat-9",
    name: "9th",
    subtitle: "Secondary foundation",
    booksCount: 8,
    icon: "graduation",
    href: "/classes/class-9/books",
  },
  {
    id: "feat-10",
    name: "10th",
    subtitle: "Board preparation",
    booksCount: 10,
    icon: "book",
    href: "/classes/class-10/books",
  },
  {
    id: "feat-11",
    name: "11th",
    subtitle: "Pre-college track",
    booksCount: 12,
    icon: "flask",
    href: "/classes/class-11/books",
  },
  {
    id: "feat-12",
    name: "12th",
    subtitle: "Final secondary year",
    booksCount: 14,
    icon: "graduation",
    href: "/classes/class-12/books",
  },
  {
    id: "feat-ics",
    name: "ICS",
    subtitle: "Computer science group",
    booksCount: 9,
    icon: "laptop",
    href: "/classes/class-ics/books",
  },
  {
    id: "feat-icom",
    name: "ICOM",
    subtitle: "Commerce group",
    booksCount: 7,
    icon: "briefcase",
    href: "/classes/class-icom/books",
  },
  {
    id: "feat-fa",
    name: "FA",
    subtitle: "Arts & humanities",
    booksCount: 6,
    icon: "palette",
    href: "/classes/class-fa/books",
  },
];


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
