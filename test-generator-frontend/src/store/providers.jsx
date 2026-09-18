/**
 * =============================================================================
 * store/providers.jsx
 * =============================================================================
 * Client Redux Provider for the App Router tree.
 */

"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { makeStore } from "./index";
import { hydrateSelection } from "./selectionSlice";
import { loadSelectionState } from "./selectionStorage";

export function StoreProvider({ children }) {
  // Lazy initializer: one store per mounted provider (per request on the server).
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(hydrateSelection(loadSelectionState()));
  }, [store]);

  return (
    <Provider store={store}>
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
