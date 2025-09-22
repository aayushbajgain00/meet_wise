import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "./ProfileSetting.css";

export default function ProfileSetting() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      setMenuOpen(false);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handlePhotoClick() {
    setMenuOpen((v) => !v);
  }

  function removePhoto() {
    setPhotoUrl("");
    setMenuOpen(false);
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  return (
    <div className="profile-settings-container">
      <form className="profile-form card">
        <div className="profile-form-title">Profile Settings</div>
        {/* Photo row with contextual menu */}
        <div className="profile-row">
          <div className="photo-wrapper" ref={menuRef}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile Preview"
                className="profile-photo-preview clickable"
                onClick={handlePhotoClick}
              />
            ) : (
              <div
                className="profile-photo-placeholder clickable"
                onClick={handlePhotoClick}
              >
                <FaUser className="profile-photo-icon" />
              </div>
            )}
            {menuOpen && (
              <div className="photo-menu">
                <button
                  type="button"
                  className="photo-menu-item"
                  onClick={openFilePicker}
                >
                  {photoUrl ? "Change photo" : "Upload photo"}
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    className="photo-menu-item destructive"
                    onClick={removePhoto}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </div>
        </div>

        {/* Username */}
        <div className="profile-form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="janesmith"
          />
        </div>

        {/* Name row */}
        <div className="profile-form-row">
          <div className="profile-form-group">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="profile-form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="A short description about yourself"
            rows={3}
          />
        </div>

        {/* Language */}
        <div className="profile-form-group">
          <label htmlFor="language">Language</label>
          <select id="language" name="language">
            <option>English</option>
          </select>
        </div>

        {/* Time Zone */}
        <div className="profile-form-group">
          <label htmlFor="timezone">Time Zone</label>
          <select id="timezone" name="timezone">
            <option>(GMT-05:00) Eastern Time</option>
            <option>(GMT-08:00) Pacific Time</option>
            <option>(GMT+01:00) Central European Time</option>
          </select>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button type="button" className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
