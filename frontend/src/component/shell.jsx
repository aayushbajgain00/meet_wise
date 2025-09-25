import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome, FaVideo, FaRegFileAlt, FaCalendarAlt,
  FaCog, FaSignOutAlt, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { useMsal } from "@azure/msal-react";

/* ---------------- Topbar ---------------- */
function Topbar() {
  return (
    <header className="relative bg-white">
      <div className="mx-auto flex h-24 max-w-[1280px] items-center px-4 sm:px-6">
        <a href="/" className="flex items-center">
          <img
            src="/meetwise-logo.png"
            alt="Meetwise"
            className="h-45 w-auto object-contain -ml-1"
          />
        </a>

        {/* Centered slogan */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-center text-[20px] sm:text-[22px] md:text-[26px] font-semibold text-[#4F83E0]">
            Never miss a word, Always stay wise
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full bg-[#93c5fd]" />
    </header>
  );
}

/* ---------------- Shell (Sidebar + Main) ---------------- */
export default function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { instance, accounts } = useMsal();

  // Name from MSAL → localStorage → fallback
  const activeAcc = instance.getActiveAccount?.() || accounts?.[0];
  const profileName =
    activeAcc?.name ||
    activeAcc?.idTokenClaims?.name ||
    localStorage.getItem("mw_user_name") ||
    "User";
  const userInitial = (profileName || "U").slice(0, 1).toUpperCase();

  // Dropdown open state – auto-open on route
  const [meetingsOpen, setMeetingsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    setMeetingsOpen(location.pathname.startsWith("/meetings"));
    setSettingsOpen(location.pathname.startsWith("/settings"));
  }, [location.pathname]);

  // Tailwind utility groups
  const activePill =
    "relative bg-white ring-1 ring-[#cfe0ff] text-[#0f3d8d] shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1.5 before:rounded-r-full before:bg-[#4F83E0]";
  const baseRow =
    "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors font-semibold text-[#111827] hover:bg-white/70";

  const ParentRow = ({ icon, label, open, setOpen, controlsId, isActive }) => (
    <button
      type="button"
      className={`${baseRow} w-full justify-between ${isActive ? activePill : ""}`}
      aria-expanded={open}
      aria-controls={controlsId}
      onClick={() => setOpen((v) => !v)}
    >
      <span className="flex items-center gap-3">
        <span className="text-[18px] text-[#232B3B]">{icon}</span>
        <span>{label}</span>
      </span>
      <span className="text-[#232B3B]">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
  );

  const ChildLink = ({ to, label }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "ml-10 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
          isActive ? activePill : "hover:bg-white/70 text-[#111827]",
        ].join(" ")
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#cfe0ff]" />
      <span>{label}</span>
    </NavLink>
  );

  const meetingsActive = location.pathname.startsWith("/meetings");
  const settingsActive = location.pathname.startsWith("/settings");

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      <div className="mx-auto grid max-w-[1280px] grid-cols-[280px_1fr] gap-4 px-2 sm:px-4 h-[calc(100vh-96px)]">
        {/* Sidebar */}
        <aside className="px-3 pt-3">
          <div className="sticky top-3 w-[260px] h-full">
            <div className="flex flex-col h-full rounded-3xl border border-[#eee] bg-[#f5f3f3]/60 p-3 shadow-sm">
              {/* Profile */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#4F83E0] font-bold text-white">
                    {userInitial}
                  </div>
                  <div className="max-w-[150px] truncate text-sm font-semibold">
                    {profileName}
                  </div>
                </div>
                <span aria-hidden className="h-6 w-6" />
              </div>

              <div className="mb-2 h-px w-full bg-[#eaeaea]" />

              {/* Scrollable nav area */}
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col gap-1 pr-1">
                  {/* Dashboard */}
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      [baseRow, isActive ? activePill : ""].join(" ")
                    }
                  >
                    <span className="text-[18px] text-[#232B3B]"><FaHome /></span>
                    <span>Dashboard</span>
                  </NavLink>

                  {/* Meetings dropdown */}
                  <div className="rounded-xl px-1 py-1">
                    <ParentRow
                      icon={<FaVideo />}
                      label="Meetings"
                      open={meetingsOpen}
                      setOpen={setMeetingsOpen}
                      controlsId="meetings-submenu"
                      isActive={meetingsActive}
                    />
                    {meetingsOpen && (
                      <div id="meetings-submenu" className="mt-1 flex flex-col gap-1">
                        <ChildLink to="/meetings" label="All meetings" />
                        <ChildLink to="/meetings/live" label="Add to Live meeting" />
                      </div>
                    )}
                  </div>

                  {/* Transcripts */}
                  <NavLink
                    to="/transcripts"
                    end
                    className={({ isActive }) =>
                      [baseRow, isActive ? activePill : ""].join(" ")
                    }
                  >
                    <span className="text-[18px] text-[#232B3B]"><FaRegFileAlt /></span>
                    <span>Transcripts</span>
                  </NavLink>

                  {/* Schedules */}
                  <NavLink
                    to="/schedules"
                    end
                    className={({ isActive }) =>
                      [baseRow, isActive ? activePill : ""].join(" ")
                    }
                  >
                    <span className="text-[18px] text-[#232B3B]"><FaCalendarAlt /></span>
                    <span>Schedules</span>
                  </NavLink>

                  <div className="my-2 h-px w-full bg-[#eaeaea]" />

                  {/* Settings dropdown */}
                  <div className="rounded-xl px-1 py-1">
                    <ParentRow
                      icon={<FaCog />}
                      label="Settings"
                      open={settingsOpen}
                      setOpen={setSettingsOpen}
                      controlsId="settings-submenu"
                      isActive={settingsActive}
                    />
                    {settingsOpen && (
                      <div id="settings-submenu" className="mt-1 flex flex-col gap-1">
                        <ChildLink to="/settings/profile" label="Profile Settings" />
                        <ChildLink to="/settings/meeting" label="Meetings Settings" />
                        <ChildLink to="/settings/account" label="Account Settings" />
                      </div>
                    )}
                  </div>
                </nav>
              </div>

              {/* Logout pinned at bottom */}
              <div className="pt-2 border-t border-[#eaeaea]">
                <button
                  onClick={() => {
                    localStorage.removeItem("mw_token");
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-[#d24a43] hover:bg-white/70"
                >
                  <span className="text-[18px]"><FaSignOutAlt /></span>
                  <span>Logout </span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main routed content */}
        <main className="flex-1 h-full py-6 px-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
