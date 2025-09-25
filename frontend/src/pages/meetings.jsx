// Meetings.jsx (Zoom-only modal -> auto-join)
import React, { useMemo, useState } from "react";
import {
  FaHashtag,
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaPlus,
  FaVideo,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import "./meetings.css";

/* ===========================
   Zoom-only helpers
=========================== */

// Name source: prop/localStorage/fallback
const getDisplayName = (fallback = "Aayush") => {
  try {
    const s = localStorage.getItem("userName");
    return (s && s.trim()) || fallback;
  } catch {
    return fallback;
  }
};

// Extract {meetingId, pwd} from common Zoom link shapes
// Accepts:
// - https://zoom.us/j/123456789?pwd=abc123
// - https://us02web.zoom.us/j/123456789?pwd=abc123
// - https://zoom.us/wc/123456789/join?pwd=abc123
// - https://zoom.us/s/123456789  (short link)
// If the user pastes just digits, we treat it as the meeting ID.
function parseZoomLink(raw) {
  const val = (raw || "").trim();
  if (!val) return { error: "Paste a Zoom meeting link." };

  // numeric only -> treat as ID
  if (/^\d{7,}$/.test(val)) return { meetingId: val, pwd: "" };

  let u;
  try {
    u = new URL(val);
  } catch {
    return { error: "Invalid URL. It must start with http(s)://" };
  }

  const host = u.hostname.toLowerCase();
  if (!/(\.?)zoom\.us$/.test(host) && !/\.zoom\.us$/.test(host)) {
    return { error: "Please provide a Zoom link (zoom.us)." };
  }

  let meetingId = "";
  let pwd = u.searchParams.get("pwd") || "";

  // /wc/{id}/join
  const wcJoin = u.pathname.match(/\/wc\/(\d+)\/join/i);
  if (wcJoin) meetingId = wcJoin[1];

  // /j/{id}
  const jMatch = u.pathname.match(/\/j\/(\d+)/i);
  if (jMatch) meetingId = jMatch[1];

  // /s/{id}
  const sMatch = u.pathname.match(/\/s\/(\d+)/i);
  if (sMatch) meetingId = sMatch[1];

  if (!meetingId) {
    // Last resort: if the path ends with numbers
    const tail = u.pathname.match(/(\d+)$/);
    if (tail) meetingId = tail[1];
  }

  if (!meetingId) {
    return { error: "Could not find a meeting ID in this Zoom link." };
  }
  return { meetingId, pwd };
}

// Build app + web URLs for Zoom join
function buildZoomJoinTargets({ meetingId, pwd, displayName }) {
  const id = encodeURIComponent(meetingId);
  const app =
    `zoommtg://zoom.us/join?action=join&confno=${id}` +
    (pwd ? `&pwd=${encodeURIComponent(pwd)}` : "");

  // Web client goes straight to the join UI (not the marketing site)
  const baseWeb = `https://zoom.us/wc/${id}/join`;
  const qs = new URLSearchParams();
  if (pwd) qs.set("pwd", pwd);
  if (displayName) qs.set("uname", displayName);
  const web = `${baseWeb}${qs.toString() ? `?${qs.toString()}` : ""}`;

  return { appUrl: app, webUrl: web };
}

// Try Zoom app first; fall back to web client
function openZoom(appUrl, webUrl) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    setTimeout(() => (window.location.href = webUrl), 1200);
    return;
  }

  window.location.href = appUrl;
  setTimeout(() => (window.location.href = webUrl), 1200);
}

/* ===========================
   Modal (Zoom-only)
=========================== */
function ZoomAddModal({ open, onClose, onStart, defaultLanguage = "English (Global)" }) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [language, setLanguage] = useState(defaultLanguage);
  const [error, setError] = useState("");

  const disabled = useMemo(() => meetingLink.trim().length === 0, [meetingLink]);

  const handleStart = () => {
    setError("");
    const parsed = parseZoomLink(meetingLink);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    onStart({ meetingName: meetingName.trim(), parsed, language });
  };

  if (!open) return null;

  return (
    <div className="mw-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mw-modal">
        <div className="mw-modal-header">
          <h3>Add to live meeting</h3>
          <button className="mw-icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>

        <div className="mw-modal-body">
          <label className="mw-field">
            <span className="mw-label">Name your meeting <span className="mw-optional">(Optional)</span></span>
            <input
              type="text"
              placeholder="E.g. Product team sync"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </label>

          <label className="mw-field">
            <span className="mw-label">Zoom meeting link (or ID)</span>
            <input
              type="text"
              placeholder="Paste Zoom link (or just the meeting ID)"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
            />
            <small className="mw-help">Examples: https://zoom.us/j/123456789?pwd=abc123</small>
            {error && <div className="mw-error">{error}</div>}
          </label>

          <label className="mw-field">
            <span className="mw-label">Meeting language</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English (Global)</option>
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Nepali</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </label>
        </div>

        <div className="mw-modal-footer">
          <button className="mw-btn ghost" onClick={onClose}>Cancel</button>
          <button className="mw-btn primary" disabled={disabled} onClick={handleStart}>
            Start Capturing
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   Page
=========================== */
export default function Meetings({ userName = "Aayush" }) {
  const [showModal, setShowModal] = useState(false);

  const channels = [
    { id: "mine", label: "My Meetings", active: true },
    { id: "all", label: "All Meetings", active: false },
    { id: "shared", label: "Shared With Me", active: false },
  ];

  const meetings = [
    {
      id: 1,
      title: "Fireflies AI Platform Quick Overview",
      owner: "Fred Fireflies",
      date: "Thu, Aug 08 2024",
      time: "04:07 PM",
      duration: "8 mins",
    },
  ];

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // When user clicks Start Capturing in the modal
  const handleStart = ({ meetingName, parsed /* {meetingId,pwd} */, language }) => {
    const displayName = (userName || getDisplayName("Aayush")).trim();

    // (optional) send to backend before joining
    // await api.post("/jobs", { meetingName, meetingId: parsed.meetingId, language });

    const { appUrl, webUrl } = buildZoomJoinTargets({
      meetingId: parsed.meetingId,
      pwd: parsed.pwd,
      displayName,
    });

    openZoom(appUrl, webUrl);
    setShowModal(false);
  };

  return (
    <div className="meetings-page">
      {/* Top bar */}
      <header className="meetings-topbar">
        <div className="brand-space" />
        <div className="global-search">
          <FiSearch className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by title or keyword"
            aria-label="Search meetings globally"
          />
        </div>

        <div className="topbar-right">
          <div className="badge">3 Free meetings</div>
          <button className="upgrade-btn" type="button">
            Upgrade
          </button>
          <img
            className="avatar"
            src="https://i.pravatar.cc/40?img=13"
            alt="User avatar"
          />
        </div>
      </header>

      <div className="meetings-body">
        {/* LEFT: channels */}
        <aside className="channels-rail" aria-label="Channels">
          <nav className="channels">
            {channels.map((c) => (
              <a
                key={c.id}
                href="#"
                className={["channel-link", c.active && "active"].filter(Boolean).join(" ")}
              >
                <FaHashtag className="channel-hash" />
                <span>{c.label}</span>
              </a>
            ))}

            <div className="channels-divider">All channels</div>

            <button className="new-channel" type="button">
              <FaPlus />
              <span>Channel</span>
            </button>
          </nav>
        </aside>

        {/* MIDDLE: list */}
        <section className="meetings-list">
          <div className="list-header">
            <h2>Meetings</h2>
            <div className="list-search">
              <FiSearch className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by title or keyword"
                aria-label="Search meetings in list"
              />
            </div>
          </div>

          <ul className="cards">
            {meetings.map((m) => (
              <li key={m.id} className="meeting-card">
                <div className="left">
                  <div className="logo">F</div>
                  <div className="meta">
                    <a href="#" className="title">
                      {m.title}
                    </a>
                    <div className="owner">{m.owner}</div>
                  </div>
                </div>
                <div className="right">
                  <div className="date">
                    <FaCalendarAlt />
                    <span>{m.date}</span>
                  </div>
                  <div className="time">
                    <FaVideo />
                    <span>{m.time}</span>
                  </div>
                  <div className="duration">{m.duration}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT: empty state */}
        <section className="meeting-empty">
          <div className="empty-card">
            <div className="skeleton" aria-hidden="true" />
            <h3>Transcribe your first meeting</h3>
            <p>
              Schedule your calendar event by inviting Meetwise, transcribe a
              live meeting or upload media.
            </p>

            <div className="cta-row">
              <button className="ghost primary" type="button">
                <FaCalendarAlt />
                <span>Schedule</span>
              </button>
              <button className="ghost" type="button" onClick={handleOpenModal}>
                <FaVideo />
                <span>Add to live meeting</span>
              </button>
              <button className="ghost" type="button">
                <FaCloudUploadAlt />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Zoom-only modal */}
      <ZoomAddModal open={showModal} onClose={handleCloseModal} onStart={handleStart} />
    </div>
  );
}

/* ===========================
   Add these styles to meetings.css
=========================== */
/* Modal base */
