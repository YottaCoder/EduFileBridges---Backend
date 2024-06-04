import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

//Seccured Routes
router.route("/logout").post(verifyJWT, logoutUser);


export { router };