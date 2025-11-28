import React, { useMemo } from "react";
import { renderMarkdown } from "../utils/markdown";

// PUBLIC_INTERFACE
export default function NoteEditor({
  note,
  onChange,
  onSave,
  onTitleChange,
  onTagAdd,
  onTagRemove,
}) {
  const [showPreview, setShowPreview] = React.useState(true);
  const previewHTML = useMemo(() => renderMarkdown(note?.content || ""), [note?.content]);

  if (!note) {
    return (
      <div className="panel">
        <div className="panel-header">
          <strong>Editor</strong>
        </div>
        <div className="empty-state">Select a note to start editing</div>
      </div>
    );
  }

  return (
    <div className="panel editor" aria-label="Note editor">
      <div className="panel-header">
        <input
          value={note.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "10px",
            padding: "8px 10px",
            width: "60%",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button className="btn secondary" onClick={onSave}>Save</button>
        </div>
      </div>
      <div className="editor-toolbar">
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {(note.tags || []).map((t) => (
            <span key={t} className="tag">
              #{t}
              <button
                className="btn ghost"
                style={{ marginLeft: 6, padding: "2px 6px" }}
                onClick={() => onTagRemove(t)}
                aria-label={`Remove tag ${t}`}
              >
                ✕
              </button>
            </span>
          ))}
          <TagAdder onAdd={onTagAdd} />
        </div>
      </div>
      <div className="editor-body">
        <textarea
          aria-label="Note content"
          value={note.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your note here in Markdown..."
        />
        {showPreview && (
          <div className="preview" dangerouslySetInnerHTML={{ __html: previewHTML }} />
        )}
      </div>
    </div>
  );
}

function TagAdder({ onAdd }) {
  const [val, setVal] = React.useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); const v = val.trim(); if (v) { onAdd(v); setVal(""); } }}
      style={{ display: "flex", gap: 6 }}
      aria-label="Add tag"
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add tag"
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "10px",
          padding: "6px 10px",
          outline: "none",
        }}
      />
      <button className="btn" type="submit">Add</button>
    </form>
  );
}
