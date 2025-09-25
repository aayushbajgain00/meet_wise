import React, { useState } from "react";
import { parseZoomLink, buildZoomJoinTargets, openZoom } from "./zoomHelpers";

export default function AddLiveMeeting({ userName = "Aayush" }) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [language, setLanguage] = useState("English (Global)");
  const [error, setError] = useState("");

  const handleStart = () => {
    setError("");
    const parsed = parseZoomLink(meetingLink);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    const { appUrl, webUrl } = buildZoomJoinTargets({
      meetingId: parsed.meetingId,
      pwd: parsed.pwd,
      displayName: userName,
    });
    openZoom(appUrl, webUrl);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-semibold mb-4">Add to Live Meeting</h2>

      <label className="block mb-3">
        <span className="text-sm">Meeting Name (optional)</span>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm">Zoom meeting link or ID</span>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </label>

      <label className="block mb-4">
        <span className="text-sm">Meeting language</span>
        <select
          className="w-full border p-2 rounded"
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
        className="w-full bg-blue-600 text-white py-2 rounded"
        onClick={handleStart}
      >
        Start Capturing
      </button>
    </div>
  );
}
