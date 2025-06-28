import React from "react";

const Notification = ({ message, type = "info", onClose }) => {
  if (!message) return null;
  return (
    <div
      style={{
        background: type === "error" ? "#fee2e2" : "#d1fae5",
        color: type === "error" ? "#b91c1c" : "#065f46",
        border: `1px solid ${type === "error" ? "#fecaca" : "#6ee7b7"}`,
        padding: "12px 20px",
        borderRadius: 8,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 500,
        fontSize: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        zIndex: 1000,
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: 16,
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;
