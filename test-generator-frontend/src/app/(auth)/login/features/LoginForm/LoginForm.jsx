"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button, Heading } from "@/components/ui";
import { BRAND_NAME, ROUTES } from "@/constants";
import { useLoginMutation, useSendOtpMutation } from "@/services/api/auth.api";
import { setUser } from "@/store/authSlice";

const RESEND_COOLDOWN_SECONDS = 30;

function toastApiError(error, fallback = "Invalid email or password") {
  const raw = error?.data?.message || error?.error;
  const message = Array.isArray(raw) ? raw[0] : raw;
  const looksTechnical =
    typeof message === "string" &&
    (/prisma|column|invocation|does not exist|database/i.test(message) ||
      message.length > 120);
  const text = looksTechnical
    ? "Sign-in is temporarily unavailable. Please try again."
    : message || fallback;
  // Server errors carry a request id; showing it lets an admin find the
  // matching entry in the server log.
  const reference = error?.data?.requestId;
  toast.error(
    reference ? `${text} (reference ${String(reference).slice(0, 8)})` : text,
  );
}

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [login, { isLoading }] = useLoginMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
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
        // Sent exactly as typed: passwords are never trimmed.
        password,
        ...(needsOtp ? { otp: otp.trim() } : {}),
      }).unwrap();

      if (result?.requiresOtp) {
        setNeedsOtp(true);
        setOtp("");
        setResendIn(RESEND_COOLDOWN_SECONDS);
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
      toastApiError(error);
    }
  };

  const onResendOtp = async () => {
    if (resendIn > 0 || isResending) return;
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      await sendOtp({
        email: email.trim(),
        // Sent exactly as typed: passwords are never trimmed.
        password,
      }).unwrap();
      setOtp("");
      setResendIn(RESEND_COOLDOWN_SECONDS);
      toast.success("A new 6-digit code was sent to your email");
    } catch (error) {
      toastApiError(error, "Could not resend the code. Please try again.");
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

        {needsOtp ? null : (
          <div className="-mt-2 flex justify-end">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-caption font-medium text-primary-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {needsOtp ? (
          <div className="space-y-2">
            <label className="block">
              <span className="text-caption font-medium text-neutral-600">
                Email code
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small tracking-[0.3em] outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
                required
                minLength={6}
                maxLength={6}
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <p className="text-caption text-neutral-500">
                Didn&apos;t get the code? Check spam, then resend.
              </p>
              <button
                type="button"
                onClick={onResendOtp}
                disabled={resendIn > 0 || isResending}
                className="shrink-0 text-caption font-medium text-primary-600 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                {isResending
                  ? "Sending…"
                  : resendIn > 0
                    ? `Resend in ${resendIn}s`
                    : "Resend OTP"}
              </button>
            </div>
          </div>
        ) : null}

        <Button type="submit" fullWidth loading={isLoading}>
          {needsOtp ? "Verify code" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
