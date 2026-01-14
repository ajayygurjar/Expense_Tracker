const SibApiV3Sdk = require('sib-api-v3-sdk');
const { User } = require('../models');

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false 
            });
        }

        // Setup Sendinblue
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = 'Password Reset Request';
        sendSmtpEmail.sender = { 
            name: 'Expense Tracker',
            email: process.env.SENDINBLUE_SENDER_EMAIL 
        };
        sendSmtpEmail.to = [{ email: email, name: user.name }];
        sendSmtpEmail.htmlContent = `
            <h2>Hello ${user.name},</h2>
            <p>You requested to reset your password.</p>
            <p>This is a dummy email for password reset.</p>
            <p>Thank you!</p>
        `;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        return res.status(200).json({
            message: 'Password reset email sent!',
            success: true
        });

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ 
            message: 'Failed to send email',
            success: false 
        });
    }
};

module.exports = { forgotpassword };