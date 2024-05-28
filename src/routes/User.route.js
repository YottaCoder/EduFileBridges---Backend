import { Router } from "express";
import { registerUser } from "../controllers/User.controller.js";

const router = Router()

router.route("/").post(registerUser)



export { router };