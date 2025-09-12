import React from "react";
import {
  FaHashtag,
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaPlus,
  FaVideo,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import "./meetings.css";

// 🔧 Put your real meeting info here (or load from env)
const ZOOM_CONF_NO = "123456789";          // meeting ID
const ZOOM_PWD = "abc123";                 // password (optional)

// Deep link into the Zoom desktop app
const ZOOM_APP_URL = "zoommtg://zoom.us/";
const ZOOM_WEB_URL = "https://zoom.us/start";


export default function Meetings() {
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

  // 👉 Handler to open Zoom (app first, then web)
  const handleAddLiveMeeting = () => {
    // Try Zoom app deep link
    const win = window.open(ZOOM_APP_URL, "_self"); // _self avoids popup blockers
    // If the protocol is blocked or app missing, jump to web after a short delay
    setTimeout(() => {
      // Some browsers won't return a window reference with _self; just navigate.
      window.location.href = ZOOM_WEB_URL;
    }, 1200);
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
                className={["channel-link", c.active && "active"]
                  .filter(Boolean)
                  .join(" ")}
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
              <button className="ghost" type="button" onClick={handleAddLiveMeeting}>
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
    </div>
  );
}
