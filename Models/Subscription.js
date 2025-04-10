// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["free", "basic", "premium"],
    required: true,
    default: "free",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  notified75: {
    type: Boolean,
    default: false,
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
