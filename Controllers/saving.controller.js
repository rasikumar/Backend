import { SavingPlan } from "../Models/Savings.js";
import { userModal } from "../Models/User.js";

export const getAllProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const plan = await SavingPlan.findOne({ user: userId });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const savedEntries = plan.entries.filter((entry) => entry.saved);
    const pendingEntries = plan.entries.filter((entry) => !entry.saved);

    const totalSaved = savedEntries.reduce(
      (acc, entry) => acc + entry.amount,
      0
    );
    const totalDaysSaved = savedEntries.length;
    const totalDaysPending = pendingEntries.length;
    const totalGoal = plan.totalGoal;

    const percentageSaved = ((totalSaved / totalGoal) * 100).toFixed(2); // Client attraction 🎯

    res.status(200).json({
      totalSaved,
      totalDaysSaved,
      totalDaysPending,
      totalGoal,
      percentageSaved,
      savedEntries,
      pendingEntries,
    });
  } catch (err) {
    console.error("Progress error:", err);
    res.status(500).json({ error: "Could not fetch progress" });
  }
};

export const getAllUsersProgress = async (req, res) => {
  try {
    // Check if logged-in user is admin
    const currentUser = await userModal.findById(req.user.id);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Fetch all users with role 'user'
    const users = await userModal.find({ role: "user" });

    const allProgress = [];

    for (const user of users) {
      const plan = await SavingPlan.findOne({ user: user._id });

      if (!plan) {
        allProgress.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          hasPlan: false,
          message: "No saving plan found",
        });
        continue;
      }

      const savedEntries = plan.entries.filter((entry) => entry.saved);
      const totalSaved = savedEntries.reduce(
        (acc, entry) => acc + entry.amount,
        0
      );
      const totalDaysSaved = savedEntries.length;
      const totalDaysPending = 365 - totalDaysSaved;
      const percentageSaved = ((totalSaved / plan.totalGoal) * 100).toFixed(2);

      allProgress.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        totalSaved,
        totalDaysSaved,
        totalDaysPending,
        percentageSaved,
        hasPlan: true,
      });
    }

    res.status(200).json(allProgress);
  } catch (err) {
    console.error("Error fetching all users' progress:", err);
    res.status(500).json({ error: "Could not fetch users' progress" });
  }
};

export const markDayAsSaved = async (req, res) => {
  try {
    const userId = req.user.id;
    const { day } = req.body;

    if (!day || day < 1 || day > 365) {
      return res.status(400).json({ error: "Day must be between 1 and 365" });
    }

    const plan = await SavingPlan.findOne({ user: userId });
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const entry = plan.entries.find((e) => e.day === day);
    if (!entry) {
      return res.status(404).json({ error: `Day ${day} not found` });
    }

    if (entry.saved) {
      return res.status(400).json({ error: `Day ${day} already saved` });
    }

    entry.saved = true;
    entry.savedAt = new Date();
    plan.currentSaved += entry.amount;

    await plan.save();

    res
      .status(200)
      .json({ message: `Day ${day} saved (₹${entry.amount})`, plan });
  } catch (err) {
    res.status(500).json({ error: "Could not mark day as saved" });
  }
};
