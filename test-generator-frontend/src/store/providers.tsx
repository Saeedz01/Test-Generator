/**
 * =============================================================================
 * store/providers.tsx
 * =============================================================================
 * Client-side Redux Provider for the Next.js App Router.
 *
 * Mount once in `app/layout.js` so Server Components remain the default and
 * client trees under this provider can use `useDispatch` / RTK Query hooks.
 *
 * Implementation (Provider + store instance) will be added when RTK is wired.
 * Passthrough for now — architecture only, no store logic yet.
 * =============================================================================
 */

"use client";

import type { ReactNode } from "react";

type StoreProviderProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  return children;
}
