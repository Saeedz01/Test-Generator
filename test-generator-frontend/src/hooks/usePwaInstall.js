"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const mediaStandalone = window.matchMedia?.(
    "(display-mode: standalone)",
  ).matches;
  const iosStandalone = Boolean(window.navigator?.standalone);
  return Boolean(mediaStandalone || iosStandalone);
}

function detectIosDevice() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function subscribeDisplayMode(onStoreChange) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia?.("(display-mode: standalone)");
  media?.addEventListener?.("change", onStoreChange);
  window.addEventListener("appinstalled", onStoreChange);
  return () => {
    media?.removeEventListener?.("change", onStoreChange);
    window.removeEventListener("appinstalled", onStoreChange);
  };
}

/**
 * Shared PWA install detection for Chromium (beforeinstallprompt) and iOS Safari.
 * Safe for Next.js App Router SSR — browser APIs run only after mount.
 */
export function usePwaInstall() {
  const isStandalone = useSyncExternalStore(
    subscribeDisplayMode,
    isStandaloneDisplay,
    () => false,
  );
  const isIos = useSyncExternalStore(
    () => () => {},
    detectIosDevice,
    () => false,
  );
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installOutcome, setInstallOutcome] = useState(null);

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setInstallOutcome("accepted");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canNativeInstall = Boolean(deferredPrompt) && !isStandalone;
  const canShowIosHelp = isIos && !isStandalone;
  // Show on mobile UI whenever the app is not already installed.
  // Native prompt / iOS instructions are chosen on click.
  const canShowInstall = ready && !isStandalone;

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return { ok: false, reason: "unavailable" };
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallOutcome(choice.outcome);

    return { ok: true, outcome: choice.outcome };
  }, [deferredPrompt]);

  return {
    ready,
    isStandalone,
    isIos,
    canNativeInstall,
    canShowIosHelp,
    canShowInstall,
    installOutcome,
    promptInstall,
  };
}
