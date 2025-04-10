import cron from "node-cron";
import { getUsedPercentage } from "../utils/dateUtils.js";
import { sendSubscriptionAlert } from "../utils/emailService.js";
import { Subscription } from "../Models/Subscription.js";

cron.schedule("0 9 * * *", async () => {
  const subscriptions = await Subscription.find({ isActive: true }).populate(
    "user"
  );

  for (const sub of subscriptions) {
    const used = getUsedPercentage(sub.startedAt, sub.expiresAt);
    if (used >= 0.75 && !sub.notified75) {
      await sendSubscriptionAlert(sub.user, sub.plan);
      sub.notified75 = true;
      await sub.save();
    }
  }
});
