import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Shell from "./component/shell.jsx";

// Public
import UserLogin from "./auth/login";
import UserSignup from "./auth/signup";
import LandingPage from "./pages/LandingPage.jsx";

// Shell pages
import HomePage from "./pages/homepage.jsx";
import AllMeetings from "./pages/allMeetings.jsx";
import AddLiveMeeting from "./pages/AddLiveMeeting.jsx";
import Upload from "./pages/upload.jsx";
import Settings from "./pages/settings.jsx";
import Transcripts from "./pages/Transcripts.jsx";
import Schedules from "./pages/Schedules.jsx";



import LiveMeeting from "./pages/LiveMeeting.jsx";
import ApiPing from "./pages/ApiPing.jsx";
import CreateZoomAndSchedule from "./pages/CreateZoomAndSchedule.jsx";

import ProfileSettings from "./pages/ProfileSetting.jsx";
import MeetingSettings from "./pages/MeetingSetting.jsx";
import AccountSettings from "./pages/AccountSetting.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />

      {/* Authenticated app routes */}
      <Route path="/app" element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="meetings" element={<AllMeetings />} />
        <Route path="meetings/new" element={<AddLiveMeeting />} />
        <Route path="meetings/live" element={<LiveMeeting />} />
        <Route path="transcripts" element={<Transcripts />} />
        <Route path="schedules" element={<Schedules />} />
        <Route path="upload" element={<Upload />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/profile" element={<ProfileSettings />} />
        <Route path="settings/meeting" element={<MeetingSettings />} />
        <Route path="settings/account" element={<AccountSettings />} />
        <Route path="ping" element={<ApiPing />} />
        <Route path="schedule" element={<CreateZoomAndSchedule />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
