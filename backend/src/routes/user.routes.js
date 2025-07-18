import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser,refreshAccessToken,loginUser,changeCurrentPassword,getCurrentUser,updateAccountDetails,changeAvatar, logOut } from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

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
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/changeAvatar").patch(verifyJWT, upload.single("avatar"), changeAvatar)


export default router;