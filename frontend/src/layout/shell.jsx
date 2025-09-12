import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";
import Topbar from "../component/topbar";
import "./shell.css";

export default function Shell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
