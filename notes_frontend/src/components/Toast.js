import React from "react";

// PUBLIC_INTERFACE
export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button
        className="btn ghost"
        onClick={onClose}
        style={{ marginLeft: 10, color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
        aria-label="Close notification"
      >
        Close
      </button>
    </div>
  );
}
