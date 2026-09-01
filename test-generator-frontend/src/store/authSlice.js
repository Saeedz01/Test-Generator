import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.initialized = true;
    },
    clearUser(state) {
      state.user = null;
      state.initialized = true;
    },
    setInitialized(state) {
      state.initialized = true;
    },
  },
});

export const { setUser, clearUser, setInitialized } = authSlice.actions;
export const selectAuthUser = (state) => state.auth.user;
export const selectIsSuperAdmin = (state) =>
  state.auth.user?.role === "super_admin";
export const selectAuthInitialized = (state) => state.auth.initialized;

export default authSlice.reducer;
