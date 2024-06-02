import { Router } from "express";
import { registerUser, loginUser } from "../controllers/User.controller.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").get(loginUser);

export { router };