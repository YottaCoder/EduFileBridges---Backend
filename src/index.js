import dotenv from "dotenv";
import connectDB from "./db/Connect.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
});

app.get("/", (req, res) => {
    res.send("Hello");
})

app.get("/api/v1/User/register", (req, res) => {
    res.send("Register page")
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is runiing at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection Failed !!!", err);
})