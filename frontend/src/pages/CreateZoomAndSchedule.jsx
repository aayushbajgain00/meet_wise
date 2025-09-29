import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";

function getUserId() {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed._id || parsed.userId || null;
  } catch {
    return null;
  }
}
function readUser() {
  try {
    const raw = localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function refreshUserSummary(id) {
  const { data } = await api.get(`/api/user/${id}/summary`);
  const u = readUser();
  if (u && (u._id === id || u.userId === id)) {
    localStorage.setItem("userInfo", JSON.stringify({ ...u, ...data }));
  }
  return data;
}

export default function CreateZoomAndSchedule() {
  const userId = getUserId();

  const defaultTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const [topic, setTopic] = useState("Team Sync");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(30);
  const [timezone, setTimezone] = useState(defaultTz);

  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [zoomConnected, setZoomConnected] = useState(() => {
    const u = readUser();
    return !!u?.zoomExpiresAt && new Date(u.zoomExpiresAt).getTime() > Date.now();
  });

  const popupRef = useRef(null);
  const pollRef = useRef(null);

  // Keep local zoomConnected fresh
  useEffect(() => {
    if (!userId) return;
    refreshUserSummary(userId)
      .then((u) => {
        const connected = !!u?.zoomExpiresAt && new Date(u.zoomExpiresAt).getTime() > Date.now();
        setZoomConnected(connected);
      })
      .catch(() => {});
  }, [userId]);

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      if (!popupRef.current || popupRef.current.closed) {
        clearInterval(pollRef.current);
      }
      try {
        const u = await refreshUserSummary(userId);
        const connected = !!u?.zoomExpiresAt && new Date(u.zoomExpiresAt).getTime() > Date.now();
        if (connected) {
          setZoomConnected(true);
          if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
          clearInterval(pollRef.current);
        }
      } catch {}
    }, 2000);
  };

  const openZoomConnect = () => {
    if (!userId) return setError("You must be logged in first.");
    if (zoomConnected) return; // already connected
    const url = `${api.defaults.baseURL}/zoom/oauth/start?app_user_id=${encodeURIComponent(
      userId
    )}&return_to=${encodeURIComponent(window.location.href)}`;
    popupRef.current = window.open(url, "zoom-oauth", "width=520,height=650");
    startPolling();
  };

  const tryCreate = async () => {
    setError("");
    setResult(null);
    if (!userId) return setError("No user found in localStorage. Please log in again.");

    // Combine local date+time -> UTC ISO (what Zoom API expects)
    const localDateTime = new Date(`${date}T${time}:00`);
    const startIsoUtc = localDateTime.toISOString();

    const body = {
      topic: topic.trim(),
      start_time: startIsoUtc,
      duration: Number(duration) || 30,
      timezone,
    };

    setCreating(true);
    try {
      const { data } = await api.post(
        "/zoom/meetings/create-and-schedule",
        body,
        { headers: { "X-User-Id": userId } }
      );
      setResult(data);
    } catch (e) {
      const reason =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e.message ||
        "Failed to create meeting";
      setError(reason);
      const msg = reason.toLowerCase();
      if (msg.includes("scope") || msg.includes("connect") || msg.includes("unauthorized")) {
        openZoomConnect();
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Create Zoom meeting & schedule bot</h2>

      {!userId && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          Please log in first. No <code>userInfo</code> found in localStorage.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <label className="block">
          <span className="text-sm">Topic</span>
          <input className="w-full border rounded p-2" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Date</span>
            <input type="date" className="w-full border rounded p-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm">Time</span>
            <input type="time" className="w-full border rounded p-2" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Duration (minutes)</span>
            <input type="number" min={5} step={5} className="w-full border rounded p-2"
                   value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>

          <label className="block">
            <span className="text-sm">Timezone (for display)</span>
            <input className="w-full border rounded p-2" value={timezone} onChange={(e) => setTimezone(e.target.value)} list="tz-list" />
            <datalist id="tz-list">
              <option value={defaultTz} />
              <option value="UTC" />
              <option value="Australia/Darwin" />
              <option value="America/Los_Angeles" />
              <option value="Europe/London" />
              <option value="Asia/Kathmandu" />
            </datalist>
          </label>
        </div>

        <div className="flex gap-2">
          <button onClick={tryCreate} disabled={creating || !userId} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
            {creating ? "Creating..." : "Create + Schedule"}
          </button>

          <button type="button" onClick={openZoomConnect} disabled={zoomConnected}
                  className="px-4 py-2 rounded border">
            {zoomConnected ? "Zoom Connected" : "Connect Zoom"}
          </button>

          {popupRef.current && !popupRef.current.closed && (
            <button type="button" onClick={() => { try { popupRef.current.close(); } catch {} }} className="px-4 py-2 rounded border">
              Close OAuth window
            </button>
          )}

          <button type="button" onClick={tryCreate} className="px-4 py-2 rounded border">
            I’ve connected — try again
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      {result && (
        <div className="p-3 bg-green-50 border border-green-200 rounded space-y-1">
          <div className="font-medium">Created & scheduled ✅</div>
          <div><b>Meeting #</b> {result?.zoom?.id}</div>
          <div>
            <b>Join URL</b>:{" "}
            <a className="text-blue-600 underline" href={result?.zoom?.join_url} target="_blank" rel="noreferrer">
              {result?.zoom?.join_url}
            </a>
          </div>
          <div><b>Start time</b>: {result?.zoom?.start_time} ({result?.zoom?.timezone})</div>
        </div>
      )}
    </div>
  );
}
