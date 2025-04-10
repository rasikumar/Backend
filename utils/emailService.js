import transporter from "../Config/emailConfig.js";
import { getOtpTemplate } from "../templates/otpTemplate.js";

export const sendSubscriptionAlert = async (user, plan) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "75% of your plan is used!",
    text: `Hi ${user.name}, your ${plan} plan is 75% used. Consider renewing it soon.`,
  });
};

export const sendOTPMail = async (to, subject, otp) => {
  const html = getOtpTemplate(otp);
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  console.log("Email send result:", info);
};
