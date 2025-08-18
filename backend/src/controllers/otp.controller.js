import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOtp, verifyOtp } from "../services/otp.service.js";
import { User } from "../models/user.models.js";

const sendOtpController = asyncHandler(async (req, res) => {
  const { phone, purpose } = req.body; // purpose: register | login | forgot
  if (!phone || !purpose) throw new ApiError(400, "phone and purpose are required");

  await sendOtp({ phone, purpose });
  return res.status(200).json(new ApiResponse(200, null, "OTP sent"));
});

const verifyOtpController = asyncHandler(async (req, res) => {
  const { phone, purpose, code } = req.body;
  if (!phone || !purpose || !code) throw new ApiError(400, "phone, purpose, code are required");

  const result = await verifyOtp({ phone, purpose, code });
  if (!result.ok) throw new ApiError(400, result.reason || "OTP verification failed");

  // Optional: mark verified on REGISTER purpose
  if (purpose === "register") {
    await User.findOneAndUpdate({ phoneNumber: phone }, {
      $set: { isPhoneVerified: true, phoneVerifiedAt: new Date() }
    });
  }

  return res.status(200).json(new ApiResponse(200, { mfa: purpose === "login" ? "ok" : undefined }, "OTP verified"));
});

export { sendOtpController, verifyOtpController }