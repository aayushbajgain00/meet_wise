import React, { useState } from "react";
import { FaBell, FaUpload } from "react-icons/fa";
import "./topbar.css";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const userInitial = (localStorage.getItem("mw_user_initial") || "M").slice(0, 1);

  const handleLogout = () => {
    localStorage.removeItem("mw_token");
    window.location.href = "/login";
  };

  return (
    <header className="mw-topbar" role="banner">
      {/* Centered slogan */}
      <div className="mw-center">
        <span className="mw-slogan">Never miss a word, Always stay wise</span>
      </div>

      {/* Right: Bell • Upload • Avatar • Logout */}
      <div className="mw-right">
        <button className="icon-btn" aria-label="Notifications" title="Notifications">
          <FaBell />
          <span className="dot" />
        </button>

        <a className="btn upload-link" href="/upload">
          <FaUpload style={{ marginRight: 6 }} /> Upload
        </a>

        <div className="avatar" title="Profile">{userInitial}</div>

        <div className="logout">
          <button
            className="btn outline"
            onClick={() => setOpen(v => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            Logout ▾
          </button>
          {open && (
            <div className="logout-menu" role="menu">
              <button role="menuitem" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
