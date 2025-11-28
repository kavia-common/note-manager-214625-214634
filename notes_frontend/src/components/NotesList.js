import React from "react";

// PUBLIC_INTERFACE
export default function NotesList({ notes, activeId, onSelect, onDelete }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <strong>Notes</strong>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>{notes.length} items</span>
      </div>
      <div className="list" role="list">
        {notes.length === 0 && (
          <div className="empty-state">No notes found</div>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            role="listitem"
            className={`note-item ${activeId === n.id ? "active" : ""}`}
            onClick={() => onSelect(n.id)}
          >
            <div>
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-meta">
                {new Date(n.updatedAt).toLocaleString()}
              </div>
              <div className="note-tags">
                {(n.tags || []).map((t) => (
                  <span className="tag" key={t}>#{t}</span>
                ))}
              </div>
            </div>
            <div>
              <button
                className="btn ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.id);
                }}
                aria-label={`Delete ${n.title || "Untitled"}`}
                title="Delete note"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
