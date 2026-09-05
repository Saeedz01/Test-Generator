/**
 * Cross-page shared components (chrome + multi-route widgets).
 * Page-specific UI belongs in that page's features/ folder.
 */
export { BrandLogo, BrandMark } from "./BrandLogo";
export { ThemeProvider, useTheme } from "./ThemeProvider";
export { ThemeToggle } from "./ThemeToggle";
export { default as Header } from "./Header/Header";
export { default as Footer } from "./Footer/Footer";
export { default as AuthShell } from "./AuthShell/AuthShell";
export { default as BrowseShell } from "./BrowseShell/BrowseShell";
export { default as DashboardShell } from "./DashboardShell/DashboardShell";
export { default as AdminSidebar } from "./AdminSidebar/AdminSidebar";
export { ChapterSidebar } from "./ChapterSidebar/ChapterSidebar";
export { ChapterSwitcher } from "./ChapterSidebar/ChapterSwitcher";
export { Breadcrumb } from "./Breadcrumb";
export {
  CardGridSkeleton,
  QuestionListSkeleton,
  PageHeaderSkeleton,
} from "./BrowseSkeletons/BrowseSkeletons";

