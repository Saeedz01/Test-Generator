/**
 * Homepage marketing fixtures — UI demo only.
 */

export const homeQuote = {
  text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  attribution: "Malcolm X",
};

export interface FeaturedClassCard {
  id: string;
  name: string;
  subtitle: string;
  booksCount: number;
  /** lucide icon name key resolved in the feature component */
  icon:
    | "graduation"
    | "book"
    | "flask"
    | "calculator"
    | "laptop"
    | "briefcase"
    | "palette";
  href: string;
}

export const featuredClasses: FeaturedClassCard[] = [
  {
    id: "feat-9",
    name: "9th",
    subtitle: "Secondary foundation",
    booksCount: 8,
    icon: "graduation",
    href: "/dashboard/classes/class-9/books",
  },
  {
    id: "feat-10",
    name: "10th",
    subtitle: "Board preparation",
    booksCount: 10,
    icon: "book",
    href: "/dashboard/classes/class-10/books",
  },
  {
    id: "feat-11",
    name: "11th",
    subtitle: "Pre-college track",
    booksCount: 12,
    icon: "flask",
    href: "/dashboard/classes/class-11/books",
  },
  {
    id: "feat-12",
    name: "12th",
    subtitle: "Final secondary year",
    booksCount: 14,
    icon: "graduation",
    href: "/dashboard/classes/class-12/books",
  },
  {
    id: "feat-ics",
    name: "ICS",
    subtitle: "Computer science group",
    booksCount: 9,
    icon: "laptop",
    href: "/dashboard/classes/class-ics/books",
  },
  {
    id: "feat-icom",
    name: "ICOM",
    subtitle: "Commerce group",
    booksCount: 7,
    icon: "briefcase",
    href: "/dashboard/classes/class-icom/books",
  },
  {
    id: "feat-fa",
    name: "FA",
    subtitle: "Arts & humanities",
    booksCount: 6,
    icon: "palette",
    href: "/dashboard/classes/class-fa/books",
  },
];

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "layers" | "file" | "list" | "mouse" | "search";
}

export const platformFeatures: PlatformFeature[] = [
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

export interface HomeStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export const homeStats: HomeStat[] = [
  { id: "stat-classes", label: "Classes", value: 7 },
  { id: "stat-books", label: "Books", value: 48 },
  { id: "stat-chapters", label: "Chapters", value: 320 },
  { id: "stat-questions", label: "Questions", value: 4500, suffix: "+" },
];

export const footerNav = [
  { label: "Classes", href: "/dashboard/classes" },
  { label: "Generate Test", href: "/dashboard" },
  { label: "Sign in", href: "/login" },
  { label: "Create account", href: "/register" },
];
