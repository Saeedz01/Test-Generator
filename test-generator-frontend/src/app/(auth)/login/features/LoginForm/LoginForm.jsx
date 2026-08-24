"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";

/**
 * Admin login form — frontend-only auth stub (no signup).
 * Later: wire to NestJS auth + RTK Query.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@testgenerator.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    // Simulated auth — replace with API login later
    await new Promise((resolve) => setTimeout(resolve, 450));
    setLoading(false);
    toast.success("Signed in as admin");
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-8 shadow-xs">
      <Heading level="h2">Sign in</Heading>
      <p className="mt-2 text-small text-neutral-600">
        Access the admin dashboard to manage classes, books, chapters, and
        questions.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-caption font-medium text-neutral-600">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
            required
          />
        </label>

        <label className="block">
          <span className="text-caption font-medium text-neutral-600">
            Password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
            required
          />
        </label>

        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-caption text-neutral-500">
        Browse content without signing in?{" "}
        <Link
          href={ROUTES.CLASSES}
          className="font-semibold text-primary-700 hover:text-primary-800"
        >
          View classes
        </Link>
      </p>
    </div>
  );
}
