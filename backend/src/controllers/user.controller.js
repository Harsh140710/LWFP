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
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User Not Found...!");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens...!"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, username, password, phoneNumber } = req.body;

  if ([firstname, email, username, password, phoneNumber].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  if(password.length !== 6) {
    throw new ApiError(401, "Password is too short !")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists!");
  }

  let avatarUrl = "";
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (avatarLocalPath && fs.existsSync(avatarLocalPath)) {
    try {
      const uploaded = await uploadOnCloudinary(avatarLocalPath);
      avatarUrl = uploaded?.secure_url || "";
      fs.unlinkSync(avatarLocalPath); // cleanup local file
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
      avatar: avatarUrl, // only saved if uploaded
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering USER!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(201)
      .json(new ApiResponse(200, {user:createdUser, accessToken, refreshToken}, "User registered successfully"));
  } catch (error) { 
    console.error("User Creation Failed:", error);
    throw new ApiError(500, error.message || "Something went wrong while registering USER!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // Get login credentials from request body
  const { email, username, password } = req.body;

  //validation
  if (!email) {
    throw new ApiError(400, "Email is Required..");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Not Found..");
  }

  // validate password

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credantials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUSer = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUSer) {
    throw new ApiError(500, "User is not logged in...");
  }

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
        { user: loggedInUSer, accessToken, refreshToken },
        "User logged in sucessfully..!"
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
    secure: (process.env.NODE_ENV = "production")
  };

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully!"))


})

const forgotPassword = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user) throw new ApiError(404, "User not found");

  const otp = generateOTP(phone);
  await sendOTP(phone, otp);

  return res.status(200).json(new ApiResponse(200, null, "OTP sent for password reset"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  if (!verifyOTP(phone, otp)) throw new ApiError(400, "Invalid OTP");

  const user = await User.findOne({ phone });
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
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(404, "Fullname and email are required");
  }

  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      fullname,
      email: email.toLowerCase(),
    },
  }).select("-password -refreshToken");

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