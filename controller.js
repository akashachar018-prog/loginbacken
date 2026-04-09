const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// In-memory OTP store
const otpStore = new Map();

// Create transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// SEND OTP
const sendEmailOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("📨 OTP:", otp); // DEBUG

  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  });

  try {
    await transporter.sendMail({
      from: `"AgriAI" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your AgriAI Access Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`
    });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("❌ Mail error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// VERIFY OTP
const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore.get(email);

  console.log("Stored:", data);

  if (!data) {
    return res.status(400).json({ error: "No OTP found" });
  }

  if (data.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if (data.expires < Date.now()) {
    return res.status(400).json({ error: "OTP expired" });
  }

  const token = jwt.sign(
    { id: email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  otpStore.delete(email);

  res.status(200).json({
    message: "Login successful",
    token
  });
};

// ✅ EXPORT CORRECTLY
module.exports = {
  sendEmailOTP,
  verifyOTP
};