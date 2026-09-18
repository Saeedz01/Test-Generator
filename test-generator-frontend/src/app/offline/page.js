import { StatusPage } from "@/components/shared";

export const metadata = {
  title: "Offline",
  robots: { index: false },
};

/**
 * Service-worker document fallback (next.config.mjs → fallbacks.document).
 * Static, so it is precached and renders without the network.
 */
export default function OfflinePage() {
  return (
    <StatusPage
      eyebrow="Offline"
      title="You're offline"
      description="This page isn't available without a connection. Reconnect and reload to continue — your selected questions are kept on this device."
    />
  );
}
