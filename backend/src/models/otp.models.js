import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["register", "login", "forgot"],
    required: true
  },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 }
}, { timestamps: true });

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

export const OtpCode = mongoose.model("OtpCode", otpSchema);
