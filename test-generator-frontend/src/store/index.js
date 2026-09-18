/**
 * =============================================================================
 * store/index.js
 * =============================================================================
 * Redux Toolkit store — selection + auth; RTK Query for API data.
 */

import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./selectionSlice";
import authReducer from "./authSlice";
import { createSelectionPersistence } from "./selectionPersistence";
import { SplitApiSettings } from "../services/SplitApiSetting";
// Ensure RTK Query endpoints are injected into the store.
import "../services/api/classes.api";
import "../services/api/books.api";
import "../services/api/chapters.api";
import "../services/api/questions.api";
import "../services/api/admin.api";
import "../services/api/auth.api";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      selection: selectionReducer,
      [SplitApiSettings.reducerPath]: SplitApiSettings.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(createSelectionPersistence())
        .concat(SplitApiSettings.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
}
