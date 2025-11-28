/**
 * LocalStore provides CRUD with persistence to localStorage.
 * Also seeds sample data on first run for preview.
 */
import { getItem, setItem } from "../utils/storage";

const KEY = "notes";
const TAGS_KEY = "tags";

function nowISO() { return new Date().toISOString(); }
function uid() { return Math.random().toString(36).slice(2, 10); }

function initialSeed() {
  const sample = [
    {
      id: uid(),
      title: "Welcome to Notes",
      content: "This is your first note. Use the editor to write in Markdown.\n\n- Ocean Professional theme\n- Smooth transitions\n- LocalStorage fallback",
      tags: ["getting-started", "info"],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
    {
      id: uid(),
      title: "Project Ideas",
      content: "1. Build a REST backend\n2. Add search highlighting\n3. Support attachments",
      tags: ["ideas", "work"],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
  ];
  const tags = ["getting-started", "info", "ideas", "work", "personal"];
  return { sample, tags };
}

// PUBLIC_INTERFACE
export class LocalStore {
  constructor() {
    const existing = getItem(KEY);
    if (!existing) {
      const { sample, tags } = initialSeed();
      setItem(KEY, sample);
      setItem(TAGS_KEY, tags);
    }
  }

  // PUBLIC_INTERFACE
  list() {
    const items = getItem(KEY, []);
    // sort by updatedAt desc
    return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  // PUBLIC_INTERFACE
  get(id) {
    const items = getItem(KEY, []);
    return items.find(n => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  create(payload) {
    const items = getItem(KEY, []);
    const note = {
      id: uid(),
      title: payload.title || "Untitled",
      content: payload.content || "",
      tags: payload.tags || [],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    items.unshift(note);
    setItem(KEY, items);
    return note;
  }

  // PUBLIC_INTERFACE
  update(id, payload) {
    const items = getItem(KEY, []);
    const idx = items.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const updated = {
      ...items[idx],
      ...payload,
      updatedAt: nowISO(),
    };
    items[idx] = updated;
    setItem(KEY, items);
    return updated;
  }

  // PUBLIC_INTERFACE
  delete(id) {
    const items = getItem(KEY, []);
    const next = items.filter(n => n.id !== id);
    setItem(KEY, next);
    return { ok: true };
  }

  // PUBLIC_INTERFACE
  tagsWithCounts() {
    const tags = getItem(TAGS_KEY, []);
    const items = getItem(KEY, []);
    const counts = {};
    items.forEach(n => (n.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return tags.map(t => ({ tag: t, count: counts[t] || 0 }));
  }
}
