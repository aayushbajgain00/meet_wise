


import React, { useState } from "react";
import "./AccountSetting.css";

function PasswordInput({ label, value, onChange, show, setShow, placeholder }) {
  return (
    <div className="as-input-row">
      <label className="as-label">{label}</label>
      <div className="as-input-wrapper">
        <input
          type={show ? "text" : "password"}
          className="as-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="as-eye-btn"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

export default function AccountSetting() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="as-bg">
      <div className="as-container">
        <div className="as-header-box">
          <h1 className="as-header">Account&nbsp; Settings</h1>
        </div>
        <div className="as-card">
          <form className="as-form">
            <h2 className="as-form-title">Change your password</h2>
            <div className="as-input-group">
              <PasswordInput
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                show={showPassword}
                setShow={setShowPassword}
                placeholder="Password"
              />
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                show={showNewPassword}
                setShow={setShowNewPassword}
                placeholder="New Password"
              />
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                placeholder="Confirm Password"
              />
            </div>
            <button
              type="submit"
              className="as-set-btn"
            >
              Set Password
            </button>
          </form>
          <div className="as-delete-section">
            <h2 className="as-delete-title">Delete Account</h2>
            <p className="as-delete-desc">You're going to delete the <span className="as-delete-bold">"ACCOUNT"</span></p>
            <div className="as-delete-btns">
              <button className="as-btn-no">No</button>
              <button className="as-btn-yes">Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
