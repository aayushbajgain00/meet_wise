import React, { createContext, useContext, useState, useCallback } from "react";

// Context
const ToastCtx = createContext(null);

// ✅ Correctly named hook (camelCase, starts with "use")
export function useToast() {
  return useContext(ToastCtx);
}

// ✅ Correctly PascalCased component
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "grid",
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#111",
              color: "#fff",
              opacity: 0.95,
              minWidth: 220,
            }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
