/**
 * API service that prefers REST using REACT_APP_API_BASE (or same-origin),
 * and falls back to localStorage if REST is unavailable.
 */
import { LocalStore } from "./localStore";

// Resolve API base precedence: window.__NOTES_API_BASE__ > env > same-origin
const envBase = (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) || "";
const externalBase = typeof window !== "undefined" && window.__NOTES_API_BASE__;
const SAME_ORIGIN = "";
const API_BASE = (externalBase || envBase || SAME_ORIGIN).replace(/\/+$/, "");

// Helpers
async function jsonOrError(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return {};
}

async function tryFetch(path, options) {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
      ...options,
    });
    return await jsonOrError(res);
  } catch (e) {
    throw e;
  }
}

// PUBLIC_INTERFACE
export class NotesAPI {
  /**
   * Attempts REST; on failure, uses LocalStore.
   * Consumers do not need to handle fallback themselves.
   */
  constructor() {
    this.store = new LocalStore();
  }

  // PUBLIC_INTERFACE
  async listNotes() {
    // Try REST
    if (API_BASE) {
      try {
        return await tryFetch("/notes", { method: "GET" });
      } catch {
        // fall back silently
      }
    }
    return this.store.list();
  }

  // PUBLIC_INTERFACE
  async getNote(id) {
    if (API_BASE) {
      try {
        return await tryFetch(`/notes/${id}`, { method: "GET" });
      } catch {
        // fall back
      }
    }
    return this.store.get(id);
  }

  // PUBLIC_INTERFACE
  async createNote(payload) {
    if (API_BASE) {
      try {
        return await tryFetch(`/notes`, { method: "POST", body: JSON.stringify(payload) });
      } catch {
        // fall back
      }
    }
    return this.store.create(payload);
  }

  // PUBLIC_INTERFACE
  async updateNote(id, payload) {
    if (API_BASE) {
      try {
        return await tryFetch(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } catch {
        // fall back
      }
    }
    return this.store.update(id, payload);
  }

  // PUBLIC_INTERFACE
  async deleteNote(id) {
    if (API_BASE) {
      try {
        return await tryFetch(`/notes/${id}`, { method: "DELETE" });
      } catch {
        // fall back
      }
    }
    return this.store.delete(id);
  }
}
