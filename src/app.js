import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({limit:"24kb"}))
app.use(express.urlencoded({extended: true, limit: "24kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes

import { router as userRouter } from "./routes/User.route.js";

//routes declaration

app.use("/api/v1/User", userRouter)

app.user("/api/v1/user", userRouter)


export { app };