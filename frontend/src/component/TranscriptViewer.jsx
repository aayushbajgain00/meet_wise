import React, { useMemo, useState } from "react";

const groupSegmentsBySpeaker = (segments = []) => {
  if (!Array.isArray(segments) || segments.length === 0) return [];
  const grouped = [];
  segments.forEach((segment) => {
    const speaker = segment.speaker || "Speaker";
    if (!grouped[speaker]) grouped[speaker] = [];
    grouped[speaker].push(segment);
  });
  return Object.entries(grouped).map(([speaker, segs]) => ({ speaker, segments: segs }));
};

export default function TranscriptViewer({ text, segments, metadata }) {
  const [view, setView] = useState(segments?.length ? "segments" : "full");

  const groupedSegments = useMemo(() => groupSegmentsBySpeaker(segments), [segments]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          {metadata?.name && <span className="font-semibold text-slate-700">{metadata.name}</span>} {metadata?.mimeType && `• ${metadata.mimeType}`}
        </div>
        {segments?.length ? (
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setView("segments")}
              className={`rounded-full border px-3 py-1 ${view === "segments" ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-600"}`}
            >
              Segmented
            </button>
            <button
              type="button"
              onClick={() => setView("full")}
              className={`rounded-full border px-3 py-1 ${view === "full" ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-600"}`}
            >
              Full Text
            </button>
          </div>
        ) : null}
      </div>

      {view === "segments" && segments?.length ? (
        <div className="space-y-4">
          {groupedSegments.map(({ speaker, segments: speakerSegments }) => (
            <div key={speaker} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">{speaker}</p>
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                {speakerSegments.map((segment) => (
                  <div key={`${segment.start}-${segment.end}`}>
                    <p>{segment.text}</p>
                    {segment.start != null && segment.end != null && (
                      <p className="text-xs text-slate-400">
                        {segment.start.toFixed?.(2) || segment.start}s - {segment.end.toFixed?.(2) || segment.end}s
                      </p>
                    )}
                  </div>
                ))}
              </div>
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
