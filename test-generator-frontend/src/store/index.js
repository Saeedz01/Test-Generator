/**
 * =============================================================================
 * store/index.js
 * =============================================================================
 * Redux Toolkit store — selection slice today; RTK Query middleware later.
 */

import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./selectionSlice";
import adminContentReducer from "./adminContentSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      selection: selectionReducer,
      adminContent: adminContentReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export const store = makeStore();
