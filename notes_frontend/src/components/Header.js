import React from "react";

// PUBLIC_INTERFACE
export default function Header({ query, onQueryChange, onCreate }) {
  return (
    <header className="header" role="banner">
      <div className="brand" aria-label="Notes">
        <div className="brand-badge" aria-hidden="true" />
        <div>Ocean Notes</div>
      </div>
      <div className="header-actions">
        <div className="search" role="search">
          <span className="icon" aria-hidden="true">🔎</span>
          <input
            aria-label="Search notes"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <button className="btn" onClick={onCreate} aria-label="Create note">New Note</button>
      </div>
    </header>
  );
}
