
import React from "react";
import "./MeetingSetting.css";

export default function MeetingSetting() {
  return (
    <div className="ms-container">
      <div className="ms-header-box">
        <h1 className="ms-header">Meeting Settings</h1>
      </div>
      <div className="ms-section">
        <h2 className="ms-section-title">Meeting Language</h2>
        <div className="ms-label">LANGUAGE&nbsp; USED TO TRANSCRIBE YOUR MEETINGS</div>
        <div className="ms-desc">Select the language spoken during your meetings to get transcripts and summaries in that language.</div>
        <div className="ms-input-row">
          <input className="ms-input" type="text" value="English(Global)" readOnly />
        </div>
      </div>
      <div className="ms-section">
        <h2 className="ms-section-title">Autojoin Settings</h2>
        <div className="ms-label">MEETINGS MEETWISE WILL JOIN</div>
        <div className="ms-desc">Auto-join calendar events</div>
        <div className="ms-input-row">
          <input className="ms-input" type="text" value="All meetings with web-conf link" readOnly />
        </div>
      </div>
    </div>
  );
}
