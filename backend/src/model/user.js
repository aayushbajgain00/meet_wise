import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    authProvider: {
      type: String,
      enum: ["local", "microsoft", "google"],
      default: "local",
    },
    microsoftId: String,
    googleId: { type: String, index: true },
    picture: String,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
