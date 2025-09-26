import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "./component/shell.jsx";

// Public (no sidebar)
import UserLogin from "./auth/login";
import UserSignup from "./auth/signup";

// Pages
import HomePage from "./pages/homepage.jsx";

import AllMeetings from "./pages/Allmeeting.jsx";
import AddLiveMeeting from "./pages/AddLiveMeeting.jsx";
import Upload from "./pages/upload.jsx";
import Settings from "./pages/settings.jsx";
import Transcripts from "./pages/Transcripts.jsx";
import Schedules from "./pages/Schedules.jsx";
import MeetingSetting from "./pages/MeetingSetting.jsx";
import ProfileSetting from "./pages/ProfileSetting.jsx";
import AccountSetting from "./pages/AccountSetting.jsx";


export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />

      {/* App routes inside Shell */}
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/meetings" element={<AllMeetings />} />
        <Route path="/meetings/live" element={<AddLiveMeeting />} />
        <Route path="/transcripts" element={<Transcripts />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/settings" element={<Settings />} />
  <Route path="/settings/profile" element={<ProfileSetting />} />
  <Route path="/settings/meeting" element={<MeetingSetting />} />
  <Route path="/settings/account" element={<AccountSetting />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
