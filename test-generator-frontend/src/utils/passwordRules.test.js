import { describe, expect, it } from "vitest";
import { validateAdminPassword } from "./passwordRules";

describe("validateAdminPassword", () => {
  it("accepts passwords with inner spaces", () => {
    expect(validateAdminPassword("correct horse battery")).toBe("");
  });

  it.each([
    ["", "Enter a password."],
    ["        ", "Password cannot be only spaces."],
    [" leading-space", "Password cannot start or end with a space."],
    ["trailing-space ", "Password cannot start or end with a space."],
    ["short", "Password must be at least 8 characters."],
    ["x".repeat(73), "Password must be at most 72 characters."],
  ])("rejects %j", (value, message) => {
    expect(validateAdminPassword(value)).toBe(message);
  });
});
