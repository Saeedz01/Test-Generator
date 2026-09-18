/**
 * Store listener that mirrors the selection slice into localStorage.
 * Keeps reducers pure; writes only on the client and only after the initial
 * `hydrateSelection` so a pre-hydration action can't overwrite saved data.
 */

import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  clearSelection,
  hydrateSelection,
} from "./selectionSlice";
import { clearSelectionState, saveSelectionState } from "./selectionStorage";

export function createSelectionPersistence() {
  const listener = createListenerMiddleware();
  let hydrated = false;

  listener.startListening({
    predicate: (action) =>
      typeof action?.type === "string" && action.type.startsWith("selection/"),
    effect: (action, listenerApi) => {
      if (hydrateSelection.match(action)) {
        hydrated = true;
        return;
      }
      if (!hydrated) return;
      if (clearSelection.match(action)) {
        clearSelectionState();
        return;
      }
      saveSelectionState(listenerApi.getState().selection);
    },
  });

  return listener.middleware;
}
