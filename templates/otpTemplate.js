export const getOtpTemplate = (otp) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #333;">🔐 Password Reset OTP</h2>
          <p style="font-size: 16px; color: #555;">
            Hello, <br><br>
            Your OTP for password change is:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; background-color: #007BFF; color: white; font-size: 24px; letter-spacing: 5px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP is valid for <strong>10 minutes</strong>. If you didn’t request a password change, you can safely ignore this email.
          </p>
          <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 30px;">
            — Piggy365 Team
          </p>
        </div>
      </div>
    `;
};
