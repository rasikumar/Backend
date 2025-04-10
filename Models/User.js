import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: Number },
  password: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  profilePicture: { type: String, default: "" },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for OTP expiration cleanup (optional but recommended)
userSchema.index({ "otp.expiresAt": 1 }, { expireAfterSeconds: 0 });

export const userModal = mongoose.model("User", userSchema);
