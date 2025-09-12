import React from "react";

export default function ConsentModal({ open, onAccept, onDecline, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.35)", display:"grid", placeItems:"center", zIndex:1000 }}>
      <div className="card" style={{ width:520 }}>
        <h3>Recording Consent</h3>
        <p>We’ll notify all participants that recording is starting. Anyone can opt out.</p>
        <label style={{ display:"flex", gap:8, alignItems:"center", marginTop:10 }}>
          <input type="checkbox" defaultChecked />
          Send email notifications to invitees
        </label>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
          <button className="btn" onClick={onDecline}>Decline</button>
          <button className="btn" onClick={onAccept}>I Agree & Start</button>
        </div>
      </div>
    </div>
  );
}
