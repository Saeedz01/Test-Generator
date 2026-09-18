/**
 * =============================================================================
 * store/providers.jsx
 * =============================================================================
 * Client Redux Provider for the App Router tree.
 */

"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { makeStore } from "./index";
import { hydrateSelection } from "./selectionSlice";

export function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    storeRef.current?.dispatch(hydrateSelection());
  }, []);

  return (
    <Provider store={storeRef.current}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: "10px",
            border: "1px solid var(--color-border-default)",
            background: "var(--color-surface-default)",
            color: "var(--color-text-primary)",
            fontSize: "14px",
          },
        }}
      />
    </Provider>
  );
}
