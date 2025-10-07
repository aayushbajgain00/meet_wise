// src/model/user.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/** Embedded sub-document for Zoom OAuth tokens */
const ZoomAuthSchema = new mongoose.Schema(
  {
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    scope: { type: String },
    zoomUserId: { type: String },
    accountId: { type: String },
  },
  { _id: false }
);

/** Embedded sub-document for Microsoft OAuth tokens */
const MicrosoftAuthSchema = new mongoose.Schema(
  {
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    scope: { type: String },
    tokenType: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
<<<<<<< Updated upstream
    // your existing fields
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String }, // only for "local" auth users

=======
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
>>>>>>> Stashed changes
    authProvider: {
      type: String,
      enum: ["local", "microsoft", "google"],
      default: "local",
    },
    microsoftId: { type: String },
    googleId: { type: String, index: true },
    picture: { type: String },
    isVerified: { type: Boolean, default: false },
<<<<<<< Updated upstream

    // NEW: Zoom OAuth credentials saved per app user
    zoomAuth: ZoomAuthSchema,
=======
    username: { type: String },
    bio: { type: String },
    photo: { type: String },
    language: { type: String },
    timezone: { type: String },

    // ✅ OAuth sub-documents
    zoomAuth: ZoomAuthSchema,
    microsoftAuth: MicrosoftAuthSchema,
>>>>>>> Stashed changes
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
