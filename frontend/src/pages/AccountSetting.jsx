import React, { useState } from "react";
import "./AccountSetting.css";

// ✅ Reusable Password Input
function PasswordInput({ label, value, onChange, show, setShow, placeholder }) {
  return (
    <div className="as-input-group">
      <label className="as-label">{label}</label>
      <div className="as-input-box">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="as-input"
          required
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

// ✅ Main Component
export default function AccountSetting() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notification, setNotification] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setNotification("");

    if (newPassword !== confirmPassword) {
      setNotification("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotification(data.error || data.message || "Failed to change password");
        return;
      }

      setNotification("Password changed successfully ✅");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setNotification("Network error");
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setDeleting(true);
    setNotification("");

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setNotification(data.error || data.message || "Failed to delete account");
        setDeleting(false);
        return;
      }

      setNotification("Account deleted successfully ✅");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setNotification("Network error");
      setDeleting(false);
    }
  }

  return (
    <div className="as-bg">
      <div className="as-wrapper">
        <div className="as-container">
          <div className="as-header-box">
            <h1 className="as-header">Account Settings</h1>
          </div>

          {/* ✅ Password Change Section */}
          <form className="as-form" onSubmit={handleSubmit}>
            <h2 className="as-form-title">Change your password</h2>

            <PasswordInput
              label="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              setShow={setShowPassword}
              placeholder="Enter current password"
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              show={showNewPassword}
              setShow={setShowNewPassword}
              placeholder="Enter new password"
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Confirm new password"
            />

            {confirmPassword && confirmPassword !== newPassword && (
              <div className="as-error">Passwords do not match</div>
            )}

            {notification && !notification.includes("deleted") && (
              <div
                className={
                  notification.includes("successfully") ? "as-success" : "as-error"
                }
              >
                {notification}
              </div>
            )}

            <button type="submit" className="as-set-btn">
              Set Password
            </button>
          </form>

          {/* ✅ Delete Account Section */}
          <div className="as-delete-section">
            <h2 className="as-delete-title">Delete Account</h2>
            <p className="as-delete-desc">
              You're going to delete your <span className="as-delete-bold">ACCOUNT</span>
            </p>

            {notification.includes("deleted") && (
              <div className="as-success">{notification}</div>
            )}

            <div className="as-delete-btns">
              <button className="as-btn-no" type="button">
                No
              </button>
              <button
                className="as-btn-yes"
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
