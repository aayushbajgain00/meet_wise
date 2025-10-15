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
// import AddLiveMeeting from "./pages/AddLiveMeeting.jsx";
import LiveMeeting from "./pages/LiveMeeting.jsx";
import Upload from "./pages/upload.jsx";
import Settings from "./pages/settings.jsx";
import Transcripts from "./pages/Transcripts.jsx";
import Schedules from "./pages/Schedules.jsx";


import ProfileSetting from "./pages/ProfileSetting.jsx";
import AccountSetting from "./pages/AccountSetting.jsx";
import LiveMeeting from "./pages/LiveMeeting.jsx";
import ApiPing from "./pages/ApiPing.jsx";
import CreateZoomAndSchedule from "./pages/CreateZoomAndSchedule.jsx";
import CreateTeamsAndSchedule from "./pages/CreateTeamsAndSchedule.jsx";

// Settings subpages
import ProfileSetting from "./pages/ProfileSetting.jsx";
import MeetingSetting from "./pages/MeetingSetting.jsx";
import AccountSetting from "./pages/AccountSettings.jsx";

import Recordings from "./pages/Recordings";

const ProfileSettings = () => <div className="text-xl font-semibold">Profile Settings</div>;
const AccountSettings = () => <div className="text-xl font-semibold">Account Settings</div>;

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
        <Route path="settings/profile" element={<ProfileSetting />} />
        <Route path="settings/account" element={<AccountSetting />} />
        <Route path="ping" element={<ApiPing />} />
        <Route path="schedule" element={<CreateZoomAndSchedule />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
