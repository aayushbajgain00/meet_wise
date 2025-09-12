import { NavLink } from "react-router-dom";
import { FaHome, FaVideo, FaListUl, FaUpload, FaCog } from "react-icons/fa";
import "./sidebar.css";

const items = [
  { to: "/",              label: "Home",           icon: <FaHome />,   exact: true },
  { to: "/meetings",      label: "Meetings",       icon: <FaVideo /> },
  { to: "/meeting-status",label: "Meeting Status", icon: <FaListUl /> },
  { to: "/upload",        label: "Upload",         icon: <FaUpload /> },
  { to: "/settings",      label: "Settings",       icon: <FaCog /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ✅ Uses public asset */}
      <a href="/" className="sidebar-logo" aria-label="Go to Home">
        <img src="/meetwise-logo.png" alt="Meetwise Logo" className="sidebar-logo-img" />
      </a>

      <nav className="sidebar-nav" aria-label="Primary">
        {items.map((it) => (
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
      </nav>

      <div className="sidebar-footer">© 2025 Meetwise</div>
    </aside>
  );
}
