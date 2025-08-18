import twilio from "twilio";
import bcrypt from "bcrypt";
import { OtpCode } from "../models/otp.models.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 5);

const generateNumericOtp = (len = 6) => {
  const min = 10 ** (len - 1);
  const max = (10 ** len) - 1;
  return Math.floor(min + Math.random() * (max - min));
};

const sendOtp = async ({ phone, purpose }) => {
  const code = String(generateNumericOtp(6));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + EXP_MIN * 60 * 1000);

  await OtpCode.findOneAndUpdate(
    { phone, purpose },
    { codeHash, expiresAt, attempts: 0, maxAttempts: Number(process.env.OTP_ATTEMPTS || 3) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${phone}`,
      contentSid: process.env.TWILIO_CONTENT_SID,
      contentVariables: JSON.stringify({ "1": code }),
    });
  } catch (err) {
    console.error("Twilio send error:", err.message);
    throw new Error("Failed to send OTP, please try again later.");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEBUG] OTP for ${phone} (${purpose}): ${code}`);
  }

  return true;
};

const verifyOtp = async ({ phone, purpose, code }) => {
  const record = await OtpCode.findOne({ phone, purpose });
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

export { sendOtp, verifyOtp }