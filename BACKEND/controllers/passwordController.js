const SibApiV3Sdk = require("sib-api-v3-sdk");
const { User, ForgotPasswordRequest } = require("../models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// Logger
const { logError } = require("../utils/logger");

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const id = uuidv4();

    await ForgotPasswordRequest.create({
      id,
      userId: user.id,
      isActive: true,
    });

    const resetUrl = `http://localhost:5000/api/password/resetpassword/${id}`;

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Password Reset Request";
    sendSmtpEmail.sender = {
      name: "Expense Tracker",
      email: process.env.SENDINBLUE_SENDER_EMAIL,
    };

    sendSmtpEmail.to = [{ email, name: user.name }];

    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${user.name},</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn’t request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin-top: 30px;">
        <p style="color: #666; font-size: 12px;">Expense Tracker Team</p>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({
      message: "Password reset email sent!",
      success: true,
      resetId: id,
    });
  } catch (err) {
    console.error("Error in forgotpassword:", err);
    logError(err, req, res);

    return res.status(500).json({
      message: "Failed to send email",
      success: false,
    });
  }
};

// RESET PASSWORD FUNCTION
const resetpassword = async (req, res) => {
  const id = req.params.id;

  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id },
    });

    if (!forgotPasswordRequest) {
      return res.status(404).send(`
        <h2>Invalid Link</h2>
        <p>This reset link is invalid.</p>
      `);
    }

    if (!forgotPasswordRequest.isActive) {
      return res.status(400).send(`
        <h2>Link Already Used</h2>
        <p>This password reset link has already been used.</p>
        <p>Please request a new password reset.</p>
      `);
    }

    res.status(200).send(`
      <html>
        <body>
          <form action="/api/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New Password:</label><br/>
            <input name="newpassword" type="password" required minlength="6"/><br/><br/>
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Error in resetpassword:", err);
    logError(err, req, res);
    res.status(500).send("Server error");
  }
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    if (!newpassword || newpassword.length < 6) {
      return res.status(400).send(`
        <h2>Invalid Password</h2>
        <p>Password must be at least 6 characters</p>
      `);
    }

    const resetPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id: resetpasswordid },
    });

    if (!resetPasswordRequest) {
      return res.status(404).send("Invalid request");
    }

    if (!resetPasswordRequest.isActive) {
      return res.status(400).send(`
        <h2>Link Already Used</h2>
        <p>This password reset link has already been used.</p>
      `);
    }

    const user = await User.findOne({
      where: { id: resetPasswordRequest.userId },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const hash = await bcrypt.hash(newpassword, 10);
    await user.update({ password: hash });

    await resetPasswordRequest.update({ isActive: false });

    const loginUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    res.status(200).send(`
      <h2>Password Updated Successfully!</h2>
      <p>Your password has been changed.</p>
      <a href="${loginUrl}">Go to Login</a>
    `);
  } catch (error) {
    console.error("Error in updatepassword:", error);
    logError(error, req, res);
    res.status(500).send("Server error");
  }
};

module.exports = { forgotpassword, resetpassword, updatepassword };
