import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser } from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { uploadMarksheet } from "../controllers/User.Marksheet.controller.js";
import { sendOTP } from "../controllers/User.OTP.Controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

//Seccured Routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/getUserData").post(getCurrentUser)

router.route("/send-OTP").post(sendOTP);

//Marksheet Router
router.route("/Marksheet/Upload").post(
    verifyJWT,
    uploadMarksheet
)

export { router };