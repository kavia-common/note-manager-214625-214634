/**
 * Safe JSON parse
 */
function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

const NS = "notes_app_v1";

/**
 * PUBLIC_INTERFACE
 * getItem
 * Get a value from localStorage for the notes app namespace.
 */
export function getItem(key, fallback = null) {
  const raw = window.localStorage.getItem(`${NS}:${key}`);
  if (raw == null) return fallback;
  return safeParse(raw, fallback);
}

/**
 * PUBLIC_INTERFACE
 * setItem
 * Set a value in localStorage for the notes app namespace.
 */
export function setItem(key, value) {
  window.localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
}

/**
 * PUBLIC_INTERFACE
 * removeItem
 * Remove a value from localStorage for the notes app namespace.
 */
export function removeItem(key) {
  window.localStorage.removeItem(`${NS}:${key}`);
}
