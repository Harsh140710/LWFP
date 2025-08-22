import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { OtpCode } from "../models/otp.models.js";

const EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 3);

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateNumericOtp = (len = 6) => {
  const min = 10 ** (len - 1);
  const max = 10 ** len - 1;
  return Math.floor(min + Math.random() * (max - min));
};

const sendOtpEmail = async ({ email, purpose }) => {
  const code = String(generateNumericOtp(6));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + EXP_MIN * 60 * 1000);

  await OtpCode.findOneAndUpdate(
    { email, purpose },
    {
      codeHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0
    },
    { upsert: true, new: true }
  );

  // await transporter.sendMail({
  //   from: process.env.EMAIL_USER,
  //   to: email,
  //   subject: "Your OTP Code",
  //   text: `Your OTP code is: ${code}`,
  // });

  await transporter.sendMail({
  from: `"Luxora" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your Luxora OTP Verification Code",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 12px; max-width: 500px; margin: auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.1);">
      <h2 style="text-align:center; color:#111;">Luxora</h2>
      <p style="font-size: 16px; color:#333;">Dear Valued Customer,</p>
      <p style="font-size: 16px; color:#333;">Use the following One-Time Password (OTP) to complete your verification:</p>
      
      <div style="text-align:center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #111; letter-spacing: 5px;">${code}</span>
      </div>

      <p style="font-size: 14px; color:#555;">⚠️ This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
      <p style="font-size: 14px; color:#555;">If you didn’t request this, please ignore this email.</p>
      
      <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;">
      <p style="text-align:center; font-size:12px; color:#999;">© ${new Date().getFullYear()} Luxora. All rights reserved.</p>
    </div>
  `,
});


  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEBUG] OTP for ${email} (${purpose}): ${code}`);
  }

  return true;
};

const verifyOtpEmail = async ({ email, purpose, code }) => {
  const record = await OtpCode.findOne({ email, purpose });
  if (!record) return { ok: false, reason: "OTP not found" };

  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return { ok: false, reason: "OTP expired" };
  }

  if (record.attempts >= record.maxAttempts) {
    await record.deleteOne();
    return { ok: false, reason: "Too many attempts" };
  }

  const match = await bcrypt.compare(String(code), record.codeHash);
  if (!match) {
    record.attempts += 1;
    await record.save();
    return { ok: false, reason: "Invalid OTP" };
  }

  await record.deleteOne(); // one-time use
  return { ok: true };
};

export { sendOtpEmail, verifyOtpEmail };
