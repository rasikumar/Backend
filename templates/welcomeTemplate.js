export const welcomeTemplate = (name) => {
  return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05); text-align: center;">
          <img src="https://yourdomain.com/piggy365-logo.png" alt="Piggy365" style="width: 100px; margin-bottom: 20px;" />
          <h1 style="color: #1e293b; font-size: 26px; margin-bottom: 10px;">Welcome to Piggy365!</h1>
          <p style="font-size: 16px; color: #475569;">
            You’ve successfully joined <strong style="color: #0ea5e9;">${name}</strong>
          </p>
          <p style="font-size: 16px; color: #475569;">Your journey to smarter savings starts here 🎉</p>
          <div style="margin: 30px 0;">
            <a href="https://yourdomain.com/dashboard" style="background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 14px; color: #94a3b8;">
            Need help? Reach out anytime at <a href="mailto:support@piggy365.com" style="color: #0ea5e9;">support@piggy365.com</a>
          </p>
        </div>
      </div>
    `;
};
