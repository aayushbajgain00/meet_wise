import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "./component/shell.jsx";
import ScheduleZoom from "./pages/ScheduleZoom.jsx";

// Public (no sidebar)
import UserLogin from "./auth/login";
import UserSignup from "./auth/signup";

// Pages
import HomePage from "./pages/homepage.jsx";
import Upload from "./pages/upload.jsx";
import Settings from "./pages/settings.jsx";
import Transcripts from "./pages/Transcripts.jsx";
import Schedules from "./pages/Schedules.jsx";
import AllMeetings from "./pages/allMeetings.jsx";
import LiveMeeting from "./pages/LiveMeeting.jsx";
import ApiPing from "./pages/ApiPing.jsx";
import CreateZoomAndSchedule from "./pages/CreateZoomAndSchedule";

<<<<<<< Updated upstream

import AllMeetings from "./pages/allMeetings.jsx";
import LiveMeeting from "./pages/LiveMeeting.jsx";


const ProfileSettings = () => <div className="text-xl font-semibold">Profile Settings</div>;
const MeetingSettings = () => <div className="text-xl font-semibold">Meetings Settings</div>;
const AccountSettings = () => <div className="text-xl font-semibold">Account Settings</div>;
=======
import ProfileSettings from "./pages/ProfileSetting.jsx";
import MeetingSettings from "./pages/MeetingSetting.jsx";
import AccountSettings from "./pages/AccountSetting.jsx";
import CreateTeamsAndSchedule from "./pages/CreateTeamsAndSchedule.jsx";
>>>>>>> Stashed changes

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />

<<<<<<< Updated upstream
      {/* App routes inside Shell */}
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/meetings" element={<AllMeetings />} />
        <Route path="/meetings/live" element={<AddLiveMeeting />} />
        <Route path="/meetings/live" element={<LiveMeeting />} />
        <Route path="/transcripts" element={<Transcripts />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile" element={<ProfileSettings />} />
        <Route path="/settings/meeting" element={<MeetingSettings />} />
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/ping" element={<ApiPing />} />
        {/* <Route path="/schedule" element={<ScheduleZoom />} /> */}
        <Route path="/schedule" element={<CreateZoomAndSchedule />} />
=======
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
        <Route path="teams" element={<CreateTeamsAndSchedule />} />
>>>>>>> Stashed changes
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
