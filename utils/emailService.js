import transporter from "../Config/emailConfig.js";
import { getOtpTemplate } from "../templates/otpTemplate.js";
import { welcomeTemplate } from "../templates/welcomeTemplate.js";

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

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  // console.log("Email send result:", info);
};

export const welcomeMessage = async (to, subject, name) => {
  const html = welcomeTemplate(name);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};
