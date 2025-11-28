import React from "react";
import "./theme.css";
import "./App.css"; // keep existing to retain theme-toggle if needed
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import Toast from "./components/Toast";
import { NotesAPI } from "./services/api";
import { LocalStore } from "./services/localStore";
import { getQueryParams, setQueryParams } from "./utils/router";

// PUBLIC_INTERFACE
export default function App() {
  const api = React.useRef(new NotesAPI()).current;
  const local = React.useRef(new LocalStore()).current;

  const [notes, setNotes] = React.useState([]);
  const [activeId, setActiveId] = React.useState(null);
  const [active, setActive] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState("");

  // Keep active in sync with URL
  React.useEffect(() => {
    function onChange() {
      const { noteId } = getQueryParams();
      setActiveId(noteId || null);
    }
    onChange();
    window.addEventListener("popstate", onChange);
    window.addEventListener("querychange", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("querychange", onChange);
    };
  }, []);

  // Fetch notes
  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setToast(`Error loading notes: ${e.message}`);
      // fallback to local
      setNotes(local.list());
    } finally {
      setLoading(false);
    }
  }, [api, local]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  // Compute categories/tags
  const categories = React.useMemo(() => local.tagsWithCounts(), [notes, local]);

  // Compute active note
  React.useEffect(() => {
    if (!activeId && notes[0]?.id) {
      setActiveId(notes[0].id);
      setQueryParams({ noteId: notes[0].id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  React.useEffect(() => {
    setActive(notes.find(n => n.id === activeId) || null);
  }, [activeId, notes]);

  // Filter notes by query and category
  const filtered = React.useMemo(() => {
    let list = notes;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(n =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q) ||
        (n.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (active && active.tags) {
      // no-op
    }
    return list;
  }, [notes, query]);

  const filteredByCategory = React.useMemo(() => {
    const params = getQueryParams();
    const cat = params.tag || "";
    if (!cat) return filtered;
    return filtered.filter(n => (n.tags || []).includes(cat));
  }, [filtered]);

  // Handlers
  const handleCreate = async () => {
    try {
      const created = await api.createNote({ title: "New Note", content: "", tags: [] });
      await refresh();
      setActiveId(created.id);
      setQueryParams({ noteId: created.id });
      setToast("Note created");
    } catch (e) {
      setToast(`Create failed: ${e.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.deleteNote(id);
      await refresh();
      const remaining = notes.filter(n => n.id !== id);
      const nextId = remaining[0]?.id || null;
      setActiveId(nextId);
      setQueryParams({ noteId: nextId || "" });
      setToast("Note deleted");
    } catch (e) {
      setToast(`Delete failed: ${e.message}`);
    }
  };

  const updateActive = (patch) => {
    setActive(prev => ({ ...(prev || {}), ...patch }));
  };

  const handleSave = async () => {
    if (!active) return;
    try {
      const updated = await api.updateNote(active.id, {
        title: active.title,
        content: active.content,
        tags: active.tags || [],
      });
      await refresh();
      setActiveId(updated.id);
      setQueryParams({ noteId: updated.id });
      setToast("Saved");
    } catch (e) {
      setToast(`Save failed: ${e.message}`);
    }
  };

  const handleSelectNote = (id) => {
    setActiveId(id);
    setQueryParams({ noteId: id });
  };

  const handleSelectCategory = (tag) => {
    setQueryParams({ tag: tag || "" });
  };

  const editorNote = active
    ? active
    : null;

  const editorHandlers = editorNote
    ? {
        onChange: (content) => updateActive({ content }),
        onTitleChange: (title) => updateActive({ title }),
        onTagAdd: (tag) => {
          const tags = new Set([...(editorNote.tags || []), tag]);
          updateActive({ tags: Array.from(tags) });
        },
        onTagRemove: (tag) => {
          const tags = (editorNote.tags || []).filter((t) => t !== tag);
          updateActive({ tags });
        },
        onSave: handleSave,
      }
    : {
        onChange: () => {},
        onTitleChange: () => {},
        onTagAdd: () => {},
        onTagRemove: () => {},
        onSave: () => {},
      };

  return (
    <div className="app-shell">
      <Header query={query} onQueryChange={setQuery} onCreate={handleCreate} />
      <Sidebar
        categories={categories}
        active={getQueryParams().tag || ""}
        onSelect={handleSelectCategory}
      />
      <main className="main">
        <NotesList
          notes={filteredByCategory}
          activeId={activeId}
          onSelect={handleSelectNote}
          onDelete={handleDelete}
        />
        <NoteEditor note={editorNote} {...editorHandlers} />
      </main>
      {loading && <div className="toast">Loading…</div>}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
