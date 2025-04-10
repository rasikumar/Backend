// models/SavingPlan.js
import mongoose from "mongoose";

const dailyEntrySchema = new mongoose.Schema({
  day: Number, // 1 to 365
  amount: Number,
  saved: {
    type: Boolean,
    default: false,
  },
  savedAt: Date,
});

const savingPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalGoal: {
      type: Number,
      default: 66795,
    },
    currentSaved: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    entries: [dailyEntrySchema],
  },
  { timestamps: true }
);

export const SavingPlan = mongoose.model("SavingPlan", savingPlanSchema);
