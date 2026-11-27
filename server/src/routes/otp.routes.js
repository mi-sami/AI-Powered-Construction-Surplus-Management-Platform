const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

// POST /api/otp/send
router.post("/send", async (req, res) => {
  const { email, name, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required." });
  }

  try {
    const mailOptions = {
      from: `"Surplus Exchange" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Surplus Exchange Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e9d5ff; border-radius: 12px; background-color: #faf8ff;">
          <h2 style="color: #5b21b6; margin-bottom: 8px;">Surplus Exchange</h2>
          <p style="color: #374151; font-size: 14px;">Hello <strong>${name || "User"}</strong>,</p>
          <p style="color: #4b5563; font-size: 14px;">Use the following 6-digit verification code to complete your account registration:</p>
          <div style="margin: 20px 0; padding: 14px; text-align: center; background: linear-gradient(90deg, #5b21b6, #7c3aed); color: #ffffff; font-size: 26px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 12px;">This code will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Verification email sent successfully!" });
  } catch (error) {
    console.error("SMTP Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email via SMTP.",
    });
  }
});

module.exports = router;