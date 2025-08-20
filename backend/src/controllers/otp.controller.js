// controllers/otpEmail.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOtpEmail, verifyOtpEmail } from "../services/email.service.js";
import { User } from "../models/user.models.js";

const sendOtpEmailController = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;
  if (!email || !purpose) throw new ApiError(400, "email and purpose are required");

  await sendOtpEmail({ email, purpose });
  return res.status(200).json(new ApiResponse(200, null, "OTP sent"));
});

const verifyOtpEmailController = asyncHandler(async (req, res) => {
  const { email, purpose, code, username, password } = req.body;

  if (!email || !purpose || !code) {
    throw new ApiError(400, "email, purpose, code are required");
  }

  // verify OTP first
  const result = await verifyOtpEmail({ email, purpose, code });
  if (!result.ok) throw new ApiError(400, result.reason || "OTP verification failed");

  if (purpose === "register") {
    // Check if user already exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      if (existedUser) {
        throw new ApiError(400, "User already registered with this email");
      }

      // Update existing unverified user
      existedUser.username = username?.toLowerCase() || existedUser.username;
      existedUser.password = password || existedUser.password;
      existedUser.createdAt = new Date();
      await existedUser.save();

      return res
        .status(200)
        .json(new ApiResponse(200, existedUser, "User email verified & updated successfully"));
    }

    // Create new user if not exist
    const newUser = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      createdAt
    });

    return res
      .status(201)
      .json(new ApiResponse(200, newUser, "User registered successfully"));
  }

  // if purpose is login or forgot password
  return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});


export { sendOtpEmailController, verifyOtpEmailController };
