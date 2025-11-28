import React from "react";

// PUBLIC_INTERFACE
export default function Sidebar({ categories = [], active, onSelect }) {
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="sidebar-card">
        <h3 style={{ margin: 0, marginBottom: 8 }}>Categories</h3>
        <div style={{ display: "grid", gap: 6 }}>
          {categories.length === 0 && (
            <div className="empty-state">No categories</div>
          )}
          {categories.map((c) => (
            <div
              key={c.tag}
              className="category"
              aria-current={active === c.tag ? "true" : "false"}
              onClick={() => onSelect(c.tag === active ? "" : c.tag)}
            >
              <span style={{ fontWeight: 600, color: active === c.tag ? "var(--primary)" : "inherit" }}>
                #{c.tag}
              </span>
              <span className="count">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
