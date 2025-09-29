// src/model/user.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/** Embedded sub-document to store a user's Zoom OAuth tokens */
const ZoomAuthSchema = new mongoose.Schema(
  {
    accessToken: { type: String },             // short-lived access token
    refreshToken: { type: String },            // long-lived refresh token
    expiresAt: { type: Date },                 // when accessToken expires
    scope: { type: String },                   // granted scopes (space-delimited)
    zoomUserId: { type: String },              // Zoom's user id for this user (optional)
    accountId: { type: String },               // Zoom account id (optional)
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // your existing fields
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String }, // only for "local" auth users

    authProvider: {
      type: String,
      enum: ["local", "microsoft", "google"],
      default: "local",
    },

    microsoftId: { type: String },
    googleId: { type: String, index: true },
    picture: { type: String },
    isVerified: { type: Boolean, default: false },

    // NEW: Zoom OAuth credentials saved per app user
    zoomAuth: ZoomAuthSchema,
  },
  { timestamps: true }
);

/** Hash password when it changes (for local accounts). */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/** Compare a plaintext password with the stored hash. */
userSchema.methods.matchPassword = function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
