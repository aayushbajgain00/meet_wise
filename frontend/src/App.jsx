import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public auth (no sidebar)
import UserLogin from "./auth/login";
import UserSignup from "./auth/signup";
import ResetPassword from "./auth/resetPassword.jsx";
import VerifyCode from "./auth/verifyCode.jsx";
import ResetConfirm from "./auth/resetConfirm.jsx";
import SetPassword from "./auth/setPassword.jsx";

// Shared layout (sidebar + outlet)
import Shell from "./layout/shell";

// Pages (match your filenames exactly)
import HomePage from "./pages/homepage.jsx";           // homepage.jsx (Dashboard)
import Meetings from "./pages/meetings";           // meetings.jsx
import MeetingStatus from "./pages/meetingstatus"; // meetingstatus.jsx
import Upload from "./pages/upload";               // upload.jsx
import Settings from "./pages/settings";           // settings.jsx (single page)

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/verify-code" element={<VerifyCode/>} />
        <Route path="/reset-confirm" element={<ResetConfirm/>} />
        <Route path="/set-password" element={<SetPassword/>} />

        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meeting-status" element={<MeetingStatus />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings/meeting" element={<Settings page="meeting" />} />
          <Route path="/settings/profile" element={<Settings page="profile" />} />
          <Route path="/settings/account" element={<Settings page="account" />} />
          <Route path="/settings" element={<Settings page="meeting" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
