import React, { useMemo, useState } from "react";

const toMilliseconds = (value) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  return 0;
};

const formatTimestamp = (ms = 0) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")];
  if (hours) {
    parts.unshift(hours.toString());
  }
  return parts.join(":");
};

const normalizeSegments = (segments = []) =>
  segments.map((segment, index) => {
    const startMs = toMilliseconds(segment.startMs ?? segment.start ?? 0);
    const endMs = toMilliseconds(segment.endMs ?? segment.end ?? 0);
    return {
      ...segment,
      startMs,
      endMs,
      key: segment.id || `${startMs}-${endMs}-${index}`,
    };
  });

export default function TranscriptViewer({ text, segments, metadata }) {
  const [view, setView] = useState(Array.isArray(segments) && segments.length ? "segments" : "full");

  const normalizedSegments = useMemo(() => normalizeSegments(segments), [segments]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          {metadata?.name && <span className="font-semibold text-slate-700">{metadata.name}</span>}
          {metadata?.mimeType && ` • ${metadata.mimeType}`}
        </div>
        {normalizedSegments.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setView("segments")}
              className={`rounded-full border px-3 py-1 ${
                view === "segments" ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-600"
              }`}
            >
              Segments
            </button>
            <button
              type="button"
              onClick={() => setView("full")}
              className={`rounded-full border px-3 py-1 ${
                view === "full" ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-600"
              }`}
            >
              Full Text
            </button>
          </div>
        )}
      </div>

      {view === "segments" && normalizedSegments.length ? (
        <div className="space-y-3">
          {normalizedSegments.map((segment) => (
            <div key={segment.key} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {formatTimestamp(segment.startMs)} → {formatTimestamp(segment.endMs)}
              </p>
              <p className="mt-1 text-sm text-slate-700">{segment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700">
          {text || "Transcript text will appear here once ready."}
        </div>
      )}
    </div>
  );
}
