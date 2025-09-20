import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Middleware to verify JWT token
const verifyJWT = asyncHandler(async (req, _, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token || typeof token !== "string") {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken); // add this
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    console.log("User from DB:", user); // add this

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
};



export {
    isAdmin,
    verifyJWT,
}