import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "./ProfileSetting.css";

export default function ProfileSetting() {
  // State for each field
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("(GMT-05:00) Eastern Time");
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setUsername(data.username || "");
        // Split name into first and last if possible
        if (data.name) {
          const [first, ...rest] = data.name.split(" ");
          setFirstName(first || "");
          setLastName(rest.join(" ") || "");
        }
        setBio(data.bio || "");
        setPhotoUrl(data.photo || "");
        setLanguage(data.language || "English");
        setTimezone(data.timezone || "(GMT-05:00) Eastern Time");
        setEmail(data.email || "");
      } catch {
        setMessage("Failed to load profile");
      }
    }
    fetchProfile();
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    // Combine first and last name for backend
    const name = `${firstName} ${lastName}`.trim();
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          name,
          bio,
          photo: photoUrl,
          language,
          timezone,
          email
        })
      });
      if (res.ok) setMessage("Profile updated!");
      else setMessage("Update failed");
    } catch {
      setMessage("Update failed");
    }
  }

  return (
    <div className="ps-bg">
      <div className="ps-container">
        <div className="ps-header-box">
          <h1 className="ps-header">Profile&nbsp; Settings</h1>
        </div>
        <div className="ps-card">
          <form className="profile-form" onSubmit={handleSubmit}>
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

            {/* Email  */}
            <div className="profile-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="profile-form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="janesmith"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
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
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            {/* Language */}
            <div className="profile-form-group">
              <label htmlFor="language">Language</label>
              <select id="language" name="language" value={language} onChange={e => setLanguage(e.target.value)}>
                <option>English</option>
                {/* Add more languages as needed */}
              </select>
            </div>

            {/* Time Zone */}
            <div className="profile-form-group">
              <label htmlFor="timezone">Time Zone</label>
              <select id="timezone" name="timezone" value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option>(GMT-05:00) Eastern Time</option>
                <option>(GMT-08:00) Pacific Time</option>
                <option>(GMT+01:00) Central European Time</option>
                {/* Add more timezones as needed */}
              </select>
            </div>

            {/* Actions */}
            <div className="profile-actions">
              <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
            {message && <div style={{ marginTop: 10 }}>{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
