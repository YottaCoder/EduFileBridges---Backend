import dotenv from "dotenv";
import connectDB from "./db/Connect.js";

dotenv.config({
    path: "./.env"
});

connectDB()