import { useEffect, useMemo, useState } from "react";
import "./meetingstatus.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const MOCK_MEETINGS = [
  {
    id: "mtg-1",
    title: "Meetwise ep1",
    date: "2025-09-18T23:45:00Z",
    durationMin: 5,
    status: "completed",
    participants: ["Ayush", "Joshan", "Aarav"],
  },
  {
    id: "mtg-2",
    title: "Meetwise ep1",
    date: "2025-09-18T23:45:00Z",
    durationMin: null,
    status: "ongoing",
    participants: ["Ayush", "Client"],
  },
  {
    id: "mtg-3",
    title: "Meetwise ep1",
    date: "2025-09-18T22:10:00Z",
    durationMin: null,
    status: "failed",
    participants: ["Ayush"],
  },
  {
    id: "mtg-4",
    title: "Meetwise ep1",
    date: "2025-09-18T21:00:00Z",
    durationMin: null,
    status: "failed",
    participants: ["Team"],
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ongoing", label: "In-progress" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "denied", label: "Denied" },
];

function Badge({ status }) {
  const cls = `mw-badge mw-${status || "scheduled"}`;
  const text =
    status === "ongoing"
      ? "Ongoing"
      : status === "processing"
      ? "Processing"
      : status
      ? status[0].toUpperCase() + status.slice(1)
      : "Scheduled";
  return <span className={cls}>{text}</span>;
}

function AvatarStack({ names = [] }) {
  const first = names.slice(0, 3);
  const extra = names.length - first.length;
  return (
    <div className="mw-avatars">
      {first.map((n) => (
        <div key={n} className="mw-avatar" title={n}>
          {n.trim().slice(0, 1).toUpperCase()}
        </div>
      ))}
      {extra > 0 && <div className="mw-avatar mw-avatar-extra">+{extra}</div>}
    </div>
  );
}

function Toolbar({ query, setQuery, status, setStatus }) {
  return (
    <div className="mw-toolbar">
      <div className="mw-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" strokeWidth="2" fill="none" />
          <path d="M21 21l-3.5-3.5" strokeWidth="2" fill="none" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or participant…"
          aria-label="Search meetings"
        />
      </div>
      <select
        className="mw-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function MeetingStatusPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (!API_BASE) throw new Error("No API configured; using mock.");
        const res = await fetch(`${API_BASE}/meetings/status`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (!cancelled) setMeetings(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          setMeetings(MOCK_MEETINGS);
          if (API_BASE) setError("Could not reach API. Showing demo data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...meetings]
      .filter((m) => {
        const matchesQ =
          !q ||
          (m.title || "").toLowerCase().includes(q) ||
          (m.participants || [])
            .join(" ")
            .toLowerCase()
            .includes(q);
        const matchesStatus =
          statusFilter === "all" || (m.status || "").toLowerCase() === statusFilter;
        return matchesQ && matchesStatus;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [meetings, query, statusFilter]);

  return (
    <div className="mw-container">
      <header className="mw-header">
        <h1>Meeting status</h1>
        <p className="mw-sub">Track meetings and see their current state.</p>
      </header>

      <Toolbar
        query={query}
        setQuery={setQuery}
        status={statusFilter}
        setStatus={setStatusFilter}
      />

      {error && <div className="mw-alert">{error}</div>}

      <div className="mw-card">
        <table className="mw-table" role="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Participants</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`sk-${i}`} className="mw-skel-row">
                  <td><div className="mw-skel w-40" /></td>
                  <td><div className="mw-skel w-28" /></td>
                  <td><div className="mw-skel w-16" /></td>
                  <td><div className="mw-skel w-20" /></td>
                  <td><div className="mw-skel w-28" /></td>
                  <td />
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="mw-empty">
                  No meetings match your filters.
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((m) => {
                const d = new Date(m.date);
                const dateStr = d.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const timeStr = d.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <tr key={m.id}>
                    <td className="mw-title">
                      <span className="mw-file-ic" aria-hidden="true">▮</span>
                      {m.title || "Untitled meeting"}
                    </td>
                    <td>
                      <div>{dateStr}</div>
                      <div className="mw-dim">{timeStr}</div>
                    </td>
                    <td>{m.durationMin ? `${m.durationMin} min` : "—"}</td>
                    <td><Badge status={(m.status || "").toLowerCase()} /></td>
                    <td><AvatarStack names={m.participants || []} /></td>
                    <td className="mw-actions">
                      <button
                        className="mw-btn"
                        onClick={() => alert(`Open details for ${m.title}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
