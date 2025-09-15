import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import fs from "fs";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // console.log("Using secrets:", process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);
  // console.log("Expiries:", process.env.ACCESS_TOKEN_EXPIRY, process.env.REFRESH_TOKEN_EXPIRY);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // console.log("AccessToken:", accessToken);
  // console.log("RefreshToken:", refreshToken);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, username, password, phoneNumber } = req.body;

  if ([firstname, email, username, password, phoneNumber].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(401, "Password is too short !");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }, { phoneNumber }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists!");
  }

  let avatarUrl = "";
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (avatarLocalPath && fs.existsSync(avatarLocalPath)) {
    try {
      const uploaded = await uploadOnCloudinary(avatarLocalPath);
      avatarUrl = uploaded?.secure_url || "";
      fs.unlinkSync(avatarLocalPath);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw new ApiError(500, "Failed to upload avatar!");
    }
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      fullname: { firstname, lastname },
      email,
      password,
      phoneNumber,
      avatar: avatarUrl,
    });

    let accessToken, refreshToken;
    try { 
      ({ accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id));
      console.log("Inside generateAccessAndRefreshToken, userId:", user._id);
    } catch (err) {
        console.error("Token generation failed:", err);
      throw new ApiError(500, "Failed to generate tokens!");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          201,
          { user: createdUser, accessToken, refreshToken },
          "User registered successfully."
        )
      );
  } catch (error) {
    console.error("User Creation Failed:", error);
    throw new ApiError(500, error.message || "Something went wrong while registering USER!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Return safe user info (without password & refreshToken)
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully."
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: (process.env.NODE_ENV === "production")
  };

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully!"))


})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email:email });
  if (!user) throw new ApiError(404, "User not found");

  const otp = generateOTP(email);
  await sendOTP(email, otp);

  return res.status(200).json(new ApiResponse(200, null, "OTP sent for password reset"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!verifyOTP(email, otp)) throw new ApiError(400, "Invalid OTP");

  const user = await User.findOne({ email:email });
  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized - No user found in request");
  }

  const user = await User.findById(userId).select(
    "-password -refreshToken" // exclude sensitive fields
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    throw new ApiError(400, "Firstname, lastname and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: { firstname, lastname },
        email: email.toLowerCase(),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully"));
});

const changeAvatar = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path;

  if(!avatarLocalPath) {
    throw new ApiError(400, "File is Required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if(!avatar.url) {
    throw new ApiError(500, "Something went wrong while uploading image")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar is Updated Successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid REFRESH Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid REFRESH Token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token Refreshed Successfully"
        )
      );
      
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token"
    );
  }
});

export {
    generateAccessAndRefreshToken,
    registerUser,
    refreshAccessToken,
    loginUser,
    logOut,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateAccountDetails,
    changeAvatar,
}