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
import { StoreProvider } from "@/store/providers";
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
  title: "Test Generator",
  description: "Scalable platform for generating and managing academic tests",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
