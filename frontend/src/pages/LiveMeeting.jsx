import React, { useState } from "react";
import api from "../lib/api";

export default function AddLiveMeeting({ userName = "Aayush" }) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [language, setLanguage] = useState("English (Global)");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Function to trigger backend bot
  const handleStart = async () => {
    setError("");
    setSuccess("");

    if (!meetingLink.trim()) {
      setError("Please enter a valid Microsoft Teams meeting link.");
      return;
    }

    if (!meetingLink.includes("teams.microsoft.com")) {
      setError("This is not a valid Teams meeting link.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/teams/meetings/join", {
        meetingUrl: meetingLink,
        meetingName: meetingName || "Live Meeting",
        language,
      });
      console.log("Bot response:", data);
      setSuccess("🤖 MeetWise Bot is joining and recording your Teams meeting!");
    } catch (err) {
      console.error("Join meeting error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to start the bot. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Add Microsoft Teams Live Meeting
      </h2>

      <label className="block">
        <span className="text-sm">Meeting Name (optional)</span>
        <input
          type="text"
          className="w-full border rounded p-2 mt-1"
          placeholder="e.g. Project Sync"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm">Microsoft Teams Meeting Link</span>
        <input
          type="text"
          className="w-full border rounded p-2 mt-1"
          placeholder="Paste your Teams meeting link here"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
        />
      </label>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded">
          {success}
        </div>
      )}

      <label className="block">
        <span className="text-sm">Meeting Language</span>
        <select
          className="w-full border rounded p-2 mt-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English (Global)</option>
          <option>English (US)</option>
          <option>English (UK)</option>
          <option>Nepali</option>
          <option>Hindi</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </label>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        onClick={handleStart}
        disabled={loading}
      >
        {loading ? "Starting Bot..." : "Join Meeting with Bot"}
      </button>
    </div>
  );
}
