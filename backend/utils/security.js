// backend/utils/security.js
import crypto from "crypto";

// Validate email, password, and optional name
export const validateAuthInput = (email, password, name = null) => {
  if (typeof email !== "string" || typeof password !== "string") return false;
  if (name !== null && typeof name !== "string") return false;

  const forbidden = /['"${};]/; // prevent injection characters
  if (forbidden.test(email) || forbidden.test(password) || (name && forbidden.test(name))) return false;

  return true;
};

// Generate secure 6-digit verification code
export const generateSecureCode = (length = 6) => {
  return crypto.randomInt(0, 10 ** length).toString().padStart(length, "0");
};

// Hash tokens for password reset
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
