import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser,refreshAccessToken,loginUser,forgotPassword, resetPassword,getCurrentUser,updateAccountDetails,changeAvatar, logOut } from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { sendOtpEmailController, verifyOtpEmailController } from '../controllers/otp.controller.js'

const router = Router();

// unsecured routes

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// secured routes
router.route("/logout").post(verifyJWT, logOut)
router.route("/change-password").patch(verifyJWT, forgotPassword)
router.route("/reset-password").patch(resetPassword)
router.route("/profile").get(verifyJWT, getCurrentUser)
router.route("/updateAccount").patch(verifyJWT, updateAccountDetails)
router.route("/changeAvatar").patch(verifyJWT, upload.single("avatar"), changeAvatar)
router.post("/otp/email/send", sendOtpEmailController);
router.post("/otp/email/verify", verifyOtpEmailController);

export default router;