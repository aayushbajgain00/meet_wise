import React from "react";

export default function Modal({ title, children, onClose, actions }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">{children}</div>
        {actions && actions.length > 0 && (
          <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={action.className || "rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </footer>
        )}
      </div>
    </div>
  );
}
