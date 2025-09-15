// controllers/otpEmail.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOtpEmail, verifyOtpEmail } from "../services/email.service.js";
import { User } from "../models/user.models.js";

const sendOtpEmailController = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const existedUser = await User.findOne({ email });

  if (purpose === "register" && existedUser) {
    throw new ApiError(409, "User already exists!");
  }

  if (purpose === "forgot" && !existedUser) {
    throw new ApiError(404, "User not found!");
  }

  await sendOtpEmail({ email, purpose });
  return res.status(200).json(new ApiResponse(200, null, "OTP sent"));
});


const verifyOtpEmailController = asyncHandler(async (req, res) => {
  const { email, code, purpose, username, password } = req.body; // ✅ include purpose

  if (!email || !code) {
    throw new ApiError(400, "Email and code are required");
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
      throw new ApiError(400, "User already registered with this email");
    }

    // Create new user if not exist
    const newUser = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      fullname: fullname || "",     // default empty if not provided
      phoneNumber: phoneNumber || ""
    });


    return res
      .status(201)
      .json(new ApiResponse(200, newUser, "User registered successfully"));
  }

  if (purpose === "forgot") {
    // ✅ OTP verified for forgot password
    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP verified successfully for forgot password"));
  }

  // if purpose is login
  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
});



export { sendOtpEmailController, verifyOtpEmailController };
