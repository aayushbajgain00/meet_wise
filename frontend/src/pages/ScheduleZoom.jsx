import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { parseZoomLink } from "./zoomHelpers";

export default function ScheduleZoom() {
  // form
  const [meetingName, setMeetingName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [whenLocal, setWhenLocal] = useState(""); // <input type="datetime-local" />
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // list
  const [items, setItems] = useState([]);

  const disabled = useMemo(
    () => saving || !meetingLink.trim() || !whenLocal,
    [saving, meetingLink, whenLocal]
  );

  const toUtcIso = (localValue) => {
    // localValue like "2025-09-22T15:51"
    const d = new Date(localValue);
    // convert local to UTC ISO
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  };

  const load = async () => {
    try {
      const { data } = await api.get("/scheduler");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load schedules", e);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(t);
  }, []);

  const onSchedule = async () => {
    setError("");
    const parsed = parseZoomLink(meetingLink);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    try {
      setSaving(true);
      const scheduledTime = toUtcIso(whenLocal);

      await api.post("/scheduler/schedule", {
        meetingId: parsed.meetingId,
        password: parsed.pwd,
        topic: meetingName || "Untitled",
        scheduledTime,
        autoJoin: true,
      });

      setMeetingName("");
      setMeetingLink("");
      setWhenLocal("");
      await load();
      alert("✅ Scheduled! The bot will auto-join at the scheduled time.");
    } catch (e) {
      console.error(e);
      setError("Could not schedule. Check backend URL/CORS and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Schedule a Zoom Meeting</h2>

      <div className="space-y-3 bg-white shadow p-4 rounded">
        <label className="block">
          <span className="text-sm">Meeting name (optional)</span>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="Daily standup"
          />
        </label>

        <label className="block">
          <span className="text-sm">Zoom link (or numeric ID)</span>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/123456789?pwd=abc123"
          />
        </label>

        <label className="block">
          <span className="text-sm">When (your local time)</span>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={whenLocal}
            onChange={(e) => setWhenLocal(e.target.value)}
          />
          <small className="text-gray-500">
            We’ll store this in UTC on the server.
          </small>
        </label>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          disabled={disabled}
          onClick={onSchedule}
        >
          {saving ? "Scheduling..." : "Schedule"}
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Scheduled</h3>
      <div className="bg-white shadow rounded divide-y">
        {items.length === 0 && (
          <div className="p-4 text-gray-500">No scheduled meetings.</div>
        )}
        {items.map((m) => (
          <div key={m._id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{m.topic || "(Untitled)"}</div>
              <div className="text-sm text-gray-600">
                #{m.meetingId} · {new Date(m.scheduledTime).toLocaleString()}
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                m.status === "scheduled"
                  ? "bg-yellow-100 text-yellow-800"
                  : m.status === "joining"
                  ? "bg-blue-100 text-blue-800"
                  : m.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {m.status || "scheduled"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
