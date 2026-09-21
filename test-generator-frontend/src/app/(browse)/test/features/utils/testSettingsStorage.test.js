import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_TEST_SETTINGS,
  loadTestSettings,
  rememberInstitute,
  saveTestSettings,
  storageErrorMessage,
} from "./testSettingsStorage";

function stubStorage(setItem) {
  const store = new Map();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: setItem ?? ((key, value) => store.set(key, value)),
    },
  });
  return store;
}

afterEach(() => vi.unstubAllGlobals());

describe("saveTestSettings", () => {
  it("reports success and stores the settings", () => {
    const store = stubStorage();
    expect(saveTestSettings(DEFAULT_TEST_SETTINGS)).toEqual({ ok: true });
    expect(JSON.parse(store.get("tg_test_settings")).paperLanguage).toBe("en");
  });

  it("reports a full quota instead of throwing", () => {
    stubStorage(() => {
      const error = new Error("quota");
      error.name = "QuotaExceededError";
      throw error;
    });

    expect(saveTestSettings(DEFAULT_TEST_SETTINGS)).toEqual({
      ok: false,
      reason: "full",
    });
    expect(storageErrorMessage("full")).toMatch(/storage is full/i);
  });

  it("reports blocked storage instead of throwing", () => {
    stubStorage(() => {
      throw new Error("access denied");
    });

    expect(saveTestSettings(DEFAULT_TEST_SETTINGS)).toEqual({
      ok: false,
      reason: "unavailable",
    });
    expect(storageErrorMessage("unavailable")).toMatch(/not allowing/i);
  });

  it("keeps working in memory when rememberInstitute cannot persist", () => {
    stubStorage(() => {
      throw new Error("nope");
    });
    expect(() => rememberInstitute("City School")).not.toThrow();
    expect(rememberInstitute("City School")).toEqual(["City School"]);
  });

  it("falls back to defaults when storage is unreadable", () => {
    vi.stubGlobal("window", {});
    expect(loadTestSettings()).toEqual(DEFAULT_TEST_SETTINGS);
  });
});
