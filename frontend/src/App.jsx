// /src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout (with sidebar + header)
import Shell from "./component/shell.jsx";

// Public routes (no shell)
import UserLogin from "./auth/login";
import UserSignup from "./auth/signup";
import LandingPage from "./pages/LandingPage.jsx";

// Core pages
import HomePage from "./pages/homepage.jsx";
import AllMeetings from "./pages/allMeetings.jsx";
// import AddLiveMeeting from "./pages/AddLiveMeeting.jsx";
import LiveMeeting from "./pages/LiveMeeting.jsx";
import Upload from "./pages/upload.jsx";
import Settings from "./pages/settings.jsx";
import Transcripts from "./pages/Transcripts.jsx";
import Schedules from "./pages/Schedules.jsx";
import ApiPing from "./pages/ApiPing.jsx";

// Meeting scheduling pages
import CreateZoomAndSchedule from "./pages/CreateZoomAndSchedule.jsx";
import CreateTeamsAndSchedule from "./pages/CreateTeamsAndSchedule.jsx";

// Settings subpages
import ProfileSetting from "./pages/ProfileSetting.jsx";
import MeetingSetting from "./pages/MeetingSetting.jsx";
import AccountSetting from "./pages/AccountSetting.jsx";

import Recordings from "./pages/Recordings";


export default function App() {
  return (
    <Routes>
      {/*  Public routes (no shell) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />

      {/*  Authenticated app routes inside the Shell */}
      <Route path="/app" element={<Shell />}>
        {/* Default index route */}
        <Route index element={<HomePage />} />

        {/* Meetings */}
        <Route path="meetings" element={<AllMeetings />} />
        <Route path="meetings/live" element={<LiveMeeting />} />

        {/* Transcripts & schedules */}
        <Route path="transcripts" element={<Transcripts />} />
        <Route path="schedules" element={<Schedules />} />

        {/* Upload */}
        <Route path="upload" element={<Upload />} />
        {/* Settings routes */}
        <Route path="settings" element={<Settings />} />
        <Route path="settings/profile" element={<ProfileSetting />} />
        <Route path="settings/meeting" element={<MeetingSetting />} />
        <Route path="settings/account" element={<AccountSetting />} />
        <Route path="ping" element={<ApiPing />} />
        <Route path="schedule" element={<CreateZoomAndSchedule />} />
        <Route path="teams" element={<CreateTeamsAndSchedule />} />
        <Route path="/app/recordings" element={<Recordings />} />

      </Route>

      {/* 🚫 Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
