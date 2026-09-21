"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import {
  useConfirmResetPasswordMutation,
  useForgotPasswordMutation,
} from "@/services/api/auth.api";
import { PASSWORD_MAX_LENGTH, validateAdminPassword } from "@/utils";

/** Matches the backend's per-account cooldown between reset emails. */
const RESEND_COOLDOWN_SECONDS = 60;
const CODE_LENGTH = 8;

const inputClass =
  "mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30";

function apiMessage(error, fallback) {
  const raw = error?.data?.message || error?.error;
  const message = Array.isArray(raw) ? raw[0] : raw;
  if (typeof message !== "string" || message.length > 160) return fallback;
  return message || fallback;
}

/**
 * Admin password recovery (admins are the only accounts with passwords):
 * request a code by email, then set a new password with it.
 */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [resendIn, setResendIn] = useState(0);
  const [done, setDone] = useState(false);

  const [requestCode, { isLoading: isRequesting }] = useForgotPasswordMutation();
  const [confirmReset, { isLoading: isConfirming }] =
    useConfirmResetPasswordMutation();

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const sendCode = async (event) => {
    event?.preventDefault();
    const address = email.trim();
    if (!address) {
      setErrors({ email: "Enter the email address of your admin account." });
      return;
    }

    try {
      await requestCode({ email: address }).unwrap();
      // The response is deliberately the same whether or not the account
      // exists, so the wording must not promise an email.
      toast.success("If that account exists, a reset code is on its way");
      setErrors({});
      setStep("code");
      setResendIn(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(
        apiMessage(error, "Could not request a reset code. Please try again."),
      );
    }
  };

  const submitNewPassword = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/^\d{8}$/.test(code)) {
      nextErrors.code = `Enter the ${CODE_LENGTH}-digit code from the email.`;
    }
    const passwordError = validateAdminPassword(password);
    if (passwordError) nextErrors.password = passwordError;
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Both passwords must match.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await confirmReset({
        email: email.trim(),
        token: code,
        // Sent exactly as typed: passwords are never trimmed.
        newPassword: password,
      }).unwrap();
      setDone(true);
      toast.success("Password updated — sign in with your new password");
      setTimeout(() => router.push(ROUTES.LOGIN), 1500);
    } catch (error) {
      const message = apiMessage(
        error,
        "Could not reset the password. Request a new code and try again.",
      );
      setErrors({ code: message });
      toast.error(message);
    }
  };

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-xs sm:p-8">
        <Heading level="h2">Password updated</Heading>
        <p className="mt-2 text-small text-neutral-600">
          You have been signed out everywhere. Sign in with your new password.
        </p>
        <Link
          href={ROUTES.LOGIN}
          className="mt-6 inline-block text-small font-medium text-primary-600 hover:underline"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-xs sm:p-8">
      <Heading level="h2">Reset your password</Heading>
      <p className="mt-2 text-small text-neutral-600">
        {step === "email"
          ? "Enter your admin email address and we'll send you an 8-digit reset code."
          : `Enter the ${CODE_LENGTH}-digit code sent to ${email.trim()} and choose a new password.`}
      </p>

      {step === "email" ? (
        <form className="mt-6 space-y-4" onSubmit={sendCode} noValidate>
          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "forgot-email-error" : undefined}
            />
            {errors.email ? (
              <span
                id="forgot-email-error"
                role="alert"
                className="mt-1 block text-caption text-error-600"
              >
                {errors.email}
              </span>
            ) : null}
          </label>

          <Button type="submit" fullWidth loading={isRequesting}>
            Send reset code
          </Button>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={submitNewPassword} noValidate>
          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Reset code
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))
              }
              className={`${inputClass} tracking-[0.3em]`}
              required
              aria-invalid={errors.code ? true : undefined}
              aria-describedby={errors.code ? "forgot-code-error" : undefined}
            />
            {errors.code ? (
              <span
                id="forgot-code-error"
                role="alert"
                className="mt-1 block text-caption text-error-600"
              >
                {errors.code}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              New password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: validateAdminPassword(e.target.value),
                  }));
                }
              }}
              className={inputClass}
              required
              maxLength={PASSWORD_MAX_LENGTH}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="forgot-password-hint"
            />
            <span
              id="forgot-password-hint"
              role={errors.password ? "alert" : undefined}
              className={
                errors.password
                  ? "mt-1 block text-caption text-error-600"
                  : "mt-1 block text-caption text-neutral-500"
              }
            >
              {errors.password ||
                "At least 8 characters. Spaces are allowed inside, not at the start or end."}
            </span>
          </label>

          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Confirm new password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              required
              maxLength={PASSWORD_MAX_LENGTH}
              aria-invalid={errors.confirmPassword ? true : undefined}
              aria-describedby={
                errors.confirmPassword ? "forgot-confirm-error" : undefined
              }
            />
            {errors.confirmPassword ? (
              <span
                id="forgot-confirm-error"
                role="alert"
                className="mt-1 block text-caption text-error-600"
              >
                {errors.confirmPassword}
              </span>
            ) : null}
          </label>

          <Button type="submit" fullWidth loading={isConfirming}>
            Set new password
          </Button>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setErrors({});
              }}
              className="text-caption font-medium text-neutral-600 hover:underline"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={sendCode}
              disabled={resendIn > 0 || isRequesting}
              className="text-caption font-medium text-primary-600 disabled:cursor-not-allowed disabled:text-neutral-400"
            >
              {isRequesting
                ? "Sending…"
                : resendIn > 0
                  ? `Resend in ${resendIn}s`
                  : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-caption text-neutral-500">
        Remembered it?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
