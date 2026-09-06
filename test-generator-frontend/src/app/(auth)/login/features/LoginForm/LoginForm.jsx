"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button, Heading } from "@/components/ui";
import { BRAND_NAME, ROUTES } from "@/constants";
import { useLoginMutation } from "@/services/api/auth.api";
import { setUser } from "@/store/authSlice";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    if (needsOtp && otp.trim().length !== 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }

    try {
      const result = await login({
        email: email.trim(),
        password: password.trim(),
        ...(needsOtp ? { otp: otp.trim() } : {}),
      }).unwrap();

      if (result?.requiresOtp) {
        setNeedsOtp(true);
        setOtp("");
        toast.success("Enter the 6-digit code sent to your email");
        return;
      }

      dispatch(setUser(result));
      toast.success(`Signed in as ${result.name || result.email}`);

      if (result.role === "super_admin") {
        router.push(ROUTES.ADMIN_ADMINS);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Invalid email or password",
      );
    }
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-xs sm:p-8">
      <Heading level="h2">Sign in</Heading>
      <p className="mt-2 text-small text-neutral-600">
        Access the {BRAND_NAME} admin dashboard to manage classes, books,
        chapters, and questions.
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
            readOnly={needsOtp}
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
            readOnly={needsOtp}
          />
        </label>

        {needsOtp ? (
          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Email code
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small tracking-[0.3em] outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
              required
              minLength={6}
              maxLength={6}
            />
          </label>
        ) : null}

        <Button type="submit" fullWidth loading={isLoading}>
          {needsOtp ? "Verify code" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
