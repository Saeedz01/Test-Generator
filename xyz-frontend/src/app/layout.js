import { Geist, Geist_Mono } from "next/font/google";
import { MainShell } from "@/components/layout/main-shell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Punjab Test Studio",
    template: "%s · Punjab Test Studio",
  },
  description:
    "Build PCTB-style practice worksheets: pick Punjab textbook lanes, assemble MCQs / short / long cues, export PDF.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <MainShell>{children}</MainShell>
      </body>
    </html>
  );
}
