import { NavLink } from "react-router-dom";
import { FaHome, FaVideo, FaListUl, FaUpload, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./sidebar.css";
import { useState } from "react";

const mainItems = [
  { to: "/",              label: "Home",           icon: <FaHome />,   exact: true },
  { to: "/meetings",      label: "Meetings",       icon: <FaVideo /> },
  { to: "/meeting-status",label: "Meeting Status", icon: <FaListUl /> },
  { to: "/upload",        label: "Upload",         icon: <FaUpload /> },
];

const settingsSubItems = [
  { to: "/settings/meeting", label: "Meeting Settings" },
  { to: "/settings/profile", label: "Profile Settings" },
  { to: "/settings/account", label: "Account Settings" },
];

export default function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <a href="/" className="sidebar-logo" aria-label="Go to Home">
        <img src="/meetwise-logo.png" alt="Meetwise Logo" className="sidebar-logo-img" />
      </a>

      <nav className="sidebar-nav" aria-label="Primary">
        {mainItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.exact}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="icon">{it.icon}</span>
            <span className="label">{it.label}</span>
          </NavLink>
        ))}

        {/* Settings accordion */}
        <div
          className={`sidebar-link sidebar-settings-parent${settingsOpen ? " open" : ""}`}
          onClick={() => setSettingsOpen((open) => !open)}
          tabIndex={0}
          role="button"
          aria-expanded={settingsOpen}
        >
          <span className="icon"><FaCog /></span>
          <span className="label">Settings</span>
          <span className="sidebar-settings-arrow">
            {settingsOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </div>
        {settingsOpen && (
          <div className="sidebar-settings-subitems">
            {settingsSubItems.map((sub) => (
              <NavLink
                key={sub.to}
                to={sub.to}
                className={({ isActive }) => `sidebar-link sidebar-settings-subitem${isActive ? " active" : ""}`}
                style={{ fontSize: 15 }}
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">© 2025 Meetwise</div>
    </aside>
  );
}
