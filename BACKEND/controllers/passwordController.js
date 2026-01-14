const SibApiV3Sdk = require("sib-api-v3-sdk");
const { User, ForgotPasswordRequest } = require("../models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

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
      id: id,
      userId: user.id,
      isActive: true,
    });

    const resetUrl = `http://localhost:5000/api/password/resetpassword/${id}`;

    // Setup Sendinblue
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
    sendSmtpEmail.to = [{ email: email, name: user.name }];
    sendSmtpEmail.htmlContent = `
             <h2>Hello ${user.name},</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
        `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({
      message: "Password reset email sent!",
      success: true,
      resetId: id,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      message: "Failed to send email",
      success: false,
    });
  }
};
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

    // CHECK if link is still active
    if (!forgotPasswordRequest.isActive) {
      return res.status(400).send(`
                <h2>Link Already Used</h2>
                <p>This password reset link has already been used.</p>
                <p>Please request a new password reset.</p>
            `);
    }

    // DON'T set isActive to false here - only show the form
    res.status(200).send(`
            <html>
                <form action="/api/password/updatepassword/${id}" method="get">
                    <label for="newpassword">Enter New Password:</label>
                    <input name="newpassword" type="password" required minlength="6"/>
                    <button>Reset Password</button>
                </form>
            </html>
        `);
  } catch (err) {
    console.error(err);
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

    // Find the reset request
    const resetPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id: resetpasswordid },
    });

    if (!resetPasswordRequest) {
      return res.status(404).send("Invalid request");
    }

    // Check if still active
    if (!resetPasswordRequest.isActive) {
      return res.status(400).send(`
                <h2>Link Already Used</h2>
                <p>This password reset link has already been used.</p>
            `);
    }

    // Find the user
    const user = await User.findOne({
      where: { id: resetPasswordRequest.userId },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Hash the new password
    const saltRounds = 10;
    const hash = await bcrypt.hash(newpassword, saltRounds);

    // Update password in database
    await user.update({ password: hash });

    // NOW set isActive to false - AFTER password is updated
    await resetPasswordRequest.update({ isActive: false });

    res.status(200).send(`
            <h2> Password Updated Successfully!</h2>
            <p>Your password has been changed.</p>
            <a href="http://localhost:5173/">Go to Login</a>
        `);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};


module.exports = { forgotpassword, resetpassword, updatepassword };
