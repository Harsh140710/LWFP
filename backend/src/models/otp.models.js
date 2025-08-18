import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  phone: { type: String, required: true, index: true },
  purpose: { 
    type: String, 
    enum: ["register", "login", "forgot"], 
    required: true 
  },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: Number(process.env.OTP_ATTEMPTS || 5) },
}, { timestamps: true });

// Unique per phone + purpose
otpSchema.index({ phone: 1, purpose: 1 }, { unique: true });

// Auto delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpCode = mongoose.model("OtpCode", otpSchema);
