/**
 * =============================================================================
 * app/
 * =============================================================================
 * Next.js App Router entry — routing, layouts, and metadata ONLY.
 *
 * Keep this layer thin:
 * - Compose feature components and shared layouts.
 * - Do not put business logic, API calls, or domain state here.
 * - Mount `StoreProvider` once at the root for Redux / RTK Query.
 *
 * ROUTE GROUPS (parentheses do not appear in the URL)
 * - (marketing)/  → public landing and marketing pages
 * - (auth)/       → login, register, password flows
 * - (dashboard)/  → authenticated product surface
 *
 * Path aliases: import shared code via `@/` (see tsconfig / jsconfig).
 * =============================================================================
 */

import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { THEME_BOOT_SCRIPT } from "@/components/shared/ThemeProvider/themeBootScript";
import { StoreProvider } from "@/store/providers";
import { BRAND_NAME } from "@/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s · ${BRAND_NAME}`,
  },
  description:
    "Testora helps teachers assemble balanced exam papers from chapter-wise MCQs, short, and long questions.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip">
        <ThemeProvider>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
