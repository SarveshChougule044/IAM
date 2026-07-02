// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // false for 587 (TLS STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify once at startup (not on every send)
transporter.verify((err, success) => {
  if (err) {
    console.error("EMAIL TRANSPORT VERIFY ERROR:", err.message);
  } else {
    console.log("Email transporter is ready:", success);
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", info.messageId);
    return info;
  } catch (err) {
    console.error("SEND EMAIL ERROR:", err.message);
    throw err;
  }
};

module.exports = sendEmail;