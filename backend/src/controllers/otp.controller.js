import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOtpEmail, verifyOtpEmail } from "../services/email.service.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

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
  const { email, code, purpose } = req.body;

  if (!email || !code) {
    throw new ApiError(400, "Email and code are required");
  }

  const result = await verifyOtpEmail({ email, purpose, code });
  if (!result.ok) throw new ApiError(400, result.reason || "OTP verification failed");

  // Don't create a user here, just verify OTP
  let user = null;
  if (purpose === "register") {
    user = await User.findOne({ email }); // optional, might not exist yet
  } else if (purpose === "forgot") {
    user = await User.findOne({ email });
  }

  // generate JWT only if user exists (for login/forgot), otherwise just send OTP verified
  const token = user
    ? jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })
    : null;

  return res.status(200).json(
    new ApiResponse(200, { user, token }, "OTP verified successfully")
  );
});


export { sendOtpEmailController, verifyOtpEmailController };
