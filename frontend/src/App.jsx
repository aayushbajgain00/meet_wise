<<<<<<< Updated upstream
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public auth (no sidebar)
import UserLogin from "./auth/login";
import UserSignup from "./auth/signup";
=======
import React from "react";
import { Routes, Route } from "react-router-dom";
import Shell from "./component/shell.jsx";

// your existing pages
import HomePage from "./pages/homepage.jsx";
import Meetings from "./pages/meetings.jsx";
import Upload from "./pages/upload.jsx";
import Settings from "./pages/settings.jsx";
>>>>>>> Stashed changes

// add these two simple pages if you don't have them (see step 3)
import Transcripts from "./pages/Transcripts.jsx";
import Schedules from "./pages/Schedules.jsx";

export default function App() {
  return (
<<<<<<< Updated upstream
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />

        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meeting-status" element={<MeetingStatus />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
=======
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/transcripts" element={<Transcripts />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* If you have a separate login screen, put it outside Shell */}
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
>>>>>>> Stashed changes
  );
}
