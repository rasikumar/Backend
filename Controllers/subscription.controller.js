import { Subscription } from "../Models/Subscription.js";
import { addMonths } from "../utils/dateUtils.js";

const planDuration = {
  basic: 1,
  premium: 3,
};

export const updateSubscription = async (req, res) => {
  try {
    const { selectedPlan } = req.body;
    const userId = req.user.id;

    if (!planDuration[selectedPlan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const newSubscription = new Subscription({
      user: userId,
      plan: selectedPlan,
      startedAt: new Date(),
      expiresAt: addMonths(new Date(), planDuration[selectedPlan]),
    });

    await newSubscription.save();

    res.status(201).json({
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Create Subscription Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
