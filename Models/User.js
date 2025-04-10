// models/User.js
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const userModal = mongoose.model("User", userSchema);
