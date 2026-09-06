/**
 * Public footer — logo, navigation, social placeholders, copyright.
 */
import Link from "next/link";
import { Globe, MessageCircle, Share2 } from "lucide-react";
import { Container } from "@/components/ui";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { BRAND_NAME, ROUTES } from "@/constants";
import { footerNav } from "@/data/home";

const SOCIAL = [
  { label: "Community", href: "#", Icon: MessageCircle },
  { label: "Share", href: "#", Icon: Share2 },
  { label: "Website", href: "#", Icon: Globe },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container className="py-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:py-14 sm:pb-[max(3.5rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link
              href={ROUTES.HOME}
              className="inline-flex transition-opacity duration-150 hover:opacity-80"
            >
              <BrandLogo />
            </Link>
            <p className="mt-3 text-small text-neutral-600">
              A premium workspace for teachers to craft clear, balanced exams
              with confidence.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-caption font-semibold tracking-wide text-neutral-500 uppercase">
              Navigate
            </p>
            <ul className="mt-3 space-y-2">
              {footerNav.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-small text-neutral-700 transition-colors duration-150 hover:text-primary-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-caption font-semibold tracking-wide text-neutral-500 uppercase">
              Connect
            </p>
            <ul className="mt-3 flex items-center gap-2">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-0 text-neutral-600 transition-[color,border-color,background-color] duration-150 hover:border-primary-300 hover:text-primary-700"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-caption text-neutral-500 sm:text-left">
            © {year} {BRAND_NAME}. All rights reserved.
          </p>
          <Link
            href={ROUTES.LOGIN}
            className="text-center text-caption text-neutral-400 transition-colors duration-150 hover:text-neutral-600 sm:text-right"
          >
            Staff
          </Link>
        </div>
      </Container>
    </footer>
  );
}
