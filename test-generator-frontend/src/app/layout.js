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
import { SITE_URL } from "@/constants/site";
import "./globals.css";

const SITE_DESCRIPTION =
  "Testora helps teachers build exam papers from a chapter-wise question bank: pick MCQs, short and long questions, set marks and time, and print or download a ready test paper in English or Urdu.";

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
  // Absolute URLs for canonicals, Open Graph and the sitemap. Falls back to
  // localhost only in development (see constants/site.js).
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    default: `${BRAND_NAME} — Chapter-wise question bank and test paper generator`,
    template: `%s · ${BRAND_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — Chapter-wise question bank and test paper generator`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Chapter-wise question bank and test paper generator`,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#587b2a" },
    { media: "(prefers-color-scheme: dark)", color: "#587b2a" },
  ],
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
