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
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { profile, setProfile } = useOutletContext();

  const session = JSON.parse(localStorage.getItem("userInfo"));
  const userId = session?._id;

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

        const [first, ...rest] = (data.name || "").split(" ");
        setForm({
          email: data.email || "",
          username: data.username || "",
          firstName: first || "",
          lastName: rest.join(" "),
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setForm({ ...form, photo: preview });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = `${form.firstName} ${form.lastName}`.trim();

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("username", form.username);
      formData.append("name", name);
      formData.append("bio", form.bio);
      formData.append("language", form.language);
      formData.append("timezone", form.timezone);
      if (photoFile) formData.append("photo", photoFile);

      const res = await fetch(`/api/user/profile?id=${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setProfile(updated);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Update failed");
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo */}
        <div className="flex items-center gap-4">
          {form.photo ? (
            <img
              src={form.photo.startsWith("/uploads") ? `${form.photo}` : form.photo}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <FaUser className="w-16 h-16 text-gray-400" />
          )}

          <input
            type="file"
            accept="image/*"
            id="photo-upload"
            className="hidden"
            onChange={handleFileChange}
          />

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
            disabled
            className="border p-2 w-full rounded bg-gray-100"
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
