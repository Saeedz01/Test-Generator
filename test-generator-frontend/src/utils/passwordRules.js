/**
 * Admin password rules, mirroring the backend (IsAdminPassword + length):
 * passwords are never trimmed, so spaces-only passwords and passwords with
 * leading/trailing whitespace are rejected instead of silently changed.
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

/** @returns {string} An error message, or "" when the password is valid. */
export function validateAdminPassword(value) {
  const password = String(value ?? "");
  if (!password) return "Enter a password.";
  if (!password.trim()) return "Password cannot be only spaces.";
  if (password !== password.trim()) {
    return "Password cannot start or end with a space.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return "";
}
