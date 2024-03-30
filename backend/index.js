require("dotenv").config();
const express = require("express")
const cors = require("cors");
const connectDB = require("./config/db")
const router = require("./routes/user.routes")
// require("./cron/cronJob")

const port = process.env.PORT;

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://auto-birthday-greets.vercel.app"],
    credentials: true
}))
app.use(express.json())

connectDB();


app.get("/", (req, res) => {
    res.send("Birthday Remainder Server Running...")
})

app.use("/birthday", router)

app.listen(port, (err) => {
    if (err) console.log("Server Error", err);
    console.log(`Server Running on port ${port}`);
})





