// src/pages/ProfileSetting.jsx
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";


export default function ProfileSetting() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
    photo: "",
    language: "English",
    timezone: "(GMT-05:00) Eastern Time",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
   let profile, setProfile;
   try {
     ({ profile, setProfile } = useOutletContext() || {});
   } catch (e) {
     profile = undefined;
     setProfile = undefined;
   }

  // Get logged in user from localStorage
  const session = JSON.parse(localStorage.getItem("userInfo"));
  const userId = session?._id;

  // Load user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setMessage("⚠️ Not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/profile?id=${userId}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();

        // Split full name into first + last
        let firstName = "";
        let lastName = "";
        if (data.name) {
          const [first, ...rest] = data.name.split(" ");
          firstName = first;
          lastName = rest.join(" ");
        }

        setForm({
          email: data.email || session?.email || "",
          username: data.username || "",
          firstName,
          lastName,
          bio: data.bio || "",
          photo: data.photo || "",
          language: data.language || "English",
          timezone: data.timezone || "(GMT-05:00) Eastern Time",
        });
      } catch (err) {
        console.error(err);
        setMessage("❌ Could not load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = `${form.firstName} ${form.lastName}`.trim();
    try {
      const res = await fetch(`/api/user/profile?id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name }),
      });
      const updated = await res.json();
  if (setProfile) setProfile(updated); // update Shell sidebar if available
      setMessage("✅ Profile updated!");
    } catch (err) {
      setMessage("❌ Update failed");
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo */}
        {/* Photo */}
<div className="flex items-center gap-4">

  {form.photo ? (
    <img
      src={form.photo}
      alt="profile"
      className="w-28 h-28 rounded-full object-cover" // 112px x 112px
    />
  ) : (
    <FaUser className="w-28 h-28 text-gray-400" />
  )}

  {/* Hidden file input */}
  <input
    type="file"
    accept="image/*"
    id="photo-upload"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert("Photo must be less than 10MB");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm({ ...form, photo: reader.result }); // base64 preview
        };
        reader.readAsDataURL(file);
      }
    }}
  />

  {/* Button to trigger file input */}
  <button
    type="button"
    onClick={() => document.getElementById("photo-upload").click()}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    {form.photo ? "Change Photo" : "Upload Photo"}
  </button>
</div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Name */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            className="border p-2 w-full rounded"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Language */}
        <div>
          <label className="block mb-1">Language</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block mb-1">Timezone</label>
          <select
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>(GMT-05:00) Eastern Time</option>
            <option>(GMT-08:00) Pacific Time</option>
            <option>(GMT+01:00) Central European Time</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}