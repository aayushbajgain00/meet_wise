import React, { useState } from "react";
import { FaBell, FaAngleDown, FaSignOutAlt } from "react-icons/fa";
import "./topbar.css";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userInitial = (localStorage.getItem("mw_user_initial") || "A").slice(0, 1);

  const handleLogout = () => {
    localStorage.removeItem("mw_token");
    window.location.href = "/login";
  };

  return (
    <header className="mw-topbar" role="banner">
      {/* LEFT (spacer) */}
      <div className="mw-left" aria-hidden="true" />

      {/* CENTER (slogan) */}
      <div className="mw-center">
        <span className="mw-slogan">Never miss a word, Always stay wise</span>
      </div>

      {/* RIGHT (actions) */}
      <div className="mw-right">
        {/* Notifications */}
        <button className="icon-btn" title="Notifications" aria-label="Notifications">
          <FaBell />
          <span className="dot" />
        </button>

        {/* Profile */}
        <div className="avatar" title="Profile" aria-label="Profile">
          {userInitial}
        </div>

        {/* Logout */}
        <div className="logout">
          <button
            className="logout-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <FaSignOutAlt style={{ marginRight: 6 }} />
            Logout
            <FaAngleDown style={{ marginLeft: 6 }} />
          </button>
          {menuOpen && (
            <div className="logout-menu" role="menu">
              <button role="menuitem" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
