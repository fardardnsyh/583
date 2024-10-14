// Reusable template function
const emailTemplate = (title: string, message: string, otp: string, buttonColor: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <div style="text-align: center;">
            <h2 style="color: #333;">${title}</h2>
            <p style="color: #555;">${message}</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; color: #ffffff; background-color: ${buttonColor}; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p style="color: #555;">This code is valid for the next 15 minutes.</p>
        <p style="color: #555;">If you did not request this, please ignore this email.</p>
        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999;">Thank you for using our service!</p>
            <p style="color: #999;">&mdash; The Team, GhostMessage</p>
        </div>
    </div>
    `;
};

// Template for email verification
export const VerifyEmailText = (otp: string) => {
    return emailTemplate(
        "Welcome to Our Service!",
        "We're excited to have you on board. To get started, please verify your email address using the code below.",
        otp,
        "#4CAF50"
    );
};

// Template for password reset
export const resetPasswordText = (otp: string) => {
    return emailTemplate(
        "Password Reset Request",
        "We received a request to reset your password. Please use the code below to verify your request.",
        otp,
        "#FF5722"
    );
};
