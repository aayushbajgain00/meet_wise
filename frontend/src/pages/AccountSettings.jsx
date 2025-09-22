import React from "react";
import "./AccountSettings.css";

export default function AccountSettings() {
  return (
    <div className="account-settings-wrapper">
      <div className="account-settings-card">
        <div className="account-settings-title">Account Settings</div>

        {/* Email Section */}
        <div className="account-settings-section">
          <div className="account-settings-field">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email address" />
          </div>
          {/* Change Password Section */}
          <div className="account-settings-section">
            <div className="account-settings-subtitle">Change Password</div>
            <form>
              <div className="account-settings-field">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>
              <div className="account-settings-field">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="account-settings-field">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>
              <button type="submit" className="account-settings-save">
                Save
              </button>
            </form>
          </div>
        </div>

        {/* Two-Factor Authentication Section (New Style) */}
        <div className="account-settings-section account-settings-2fa-box">
          <div className="account-settings-2fa-title">
            Two-Factor Authentication (2FA)
          </div>
          <div className="account-settings-2fa-row2">
            <div>
              <div className="account-settings-2fa-method">
                Email One-Time Code
              </div>
              <div className="account-settings-2fa-desc2">
                A code will be sent to your email each time you log in.
              </div>
            </div>
            <span className="otp-status-disabled">Disable</span>
          </div>
          <button className="account-settings-2fa-enable">Enable</button>
        </div>

        {/* Subscription/Billing Section */}
        <div className="account-settings-section">
          <div className="account-settings-subtitle">Subscription & Billing</div>
          <div className="account-settings-field">
            <label>Current Plan</label>
            <input type="text" value="Free" readOnly />
          </div>
          <button className="account-settings-save account-settings-blue-btn">
            Manage Subscription
          </button>
        </div>

        <button
          className="account-settings-delete"
          style={{ marginTop: 40, alignSelf: "flex-end" }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
