import React from "react";
import "./MeetingSetting.css";

export default function MeetingSetting() {
  return (
    <div className="meeting-settings-card">
      <div className="meeting-settings-title">Meeting Settings</div>
      <div className="meeting-settings-section">
        <div className="meeting-settings-subtitle">Meeting Language</div>
        <p>LANGUAGE USED TO TRANSCRIBE YOUR MEETINGS</p>
        <input type="text" placeholder="English(Global)" style={{ width: "300px" }} />
      </div>
      <div className="meeting-settings-section">
        <div className="meeting-settings-subtitle" style={{ marginTop: 0 }}>Autojoin Settings</div>
        <p>MEETINGS FIREFLIES WILL JOIN</p>
        <input type="text" placeholder="All meetings with web-conf link" style={{ width: "300px" }} />
      </div>
    </div>
  );
}
