/**
 * Auth page chrome — centered column for login / register / OTP.
 * @param {{ children: import("react").ReactNode }} props
 */
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ROUTES } from "@/constants";

export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      <Link
        href={ROUTES.HOME}
        className="mb-8 transition-opacity duration-150 hover:opacity-80"
      >
        <BrandLogo />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
