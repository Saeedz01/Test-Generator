"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
} from "./themeBootScript";

const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === THEME_DARK
      ? THEME_DARK
      : THEME_LIGHT;
  } catch {
    return THEME_LIGHT;
  }
}

function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === THEME_DARK) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function subscribeTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getThemeSnapshot() {
  return readStoredTheme();
}

function getServerSnapshot() {
  return THEME_LIGHT;
}

function writeTheme(theme) {
  const resolved = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, resolved);
  } catch {
    // Private mode / quota — class still applies for this session.
  }
  applyThemeClass(resolved);
  emit();
}

const ThemeContext = createContext({
  theme: THEME_LIGHT,
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * Light/dark chrome theme. Default is light; does not follow OS preference.
 */
export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((next) => {
    writeTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    writeTheme(readStoredTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
