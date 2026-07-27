/**
 * =============================================================================
 * store/index.js
 * =============================================================================
 * Redux Toolkit store — selection slice today; RTK Query middleware later.
 */

import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./selectionSlice";
import adminContentReducer from "./adminContentSlice";
import { SplitApiSettings } from "../services/SplitApiSetting";
// Ensure RTK Query endpoints are injected into the store.
import "../services/api/classes.api";
import "../services/api/books.api";

export function makeStore() {
  return configureStore({
    reducer: {
      selection: selectionReducer,
      adminContent: adminContentReducer,
      [SplitApiSettings.reducerPath]: SplitApiSettings.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(SplitApiSettings.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
}

export const store = makeStore();
