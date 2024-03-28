require("dotenv").config()
const mongoose = require("mongoose")

const connetDB = () => {
    const url = process.env.DATABASE_URL

    mongoose.connect(url);

    const db = mongoose.connection

    db.once("connected", () => {
        console.log("Database Connected")
    })

    db.on("error", (err) => {
        console.log("Database Connected Error", err)
    })

}

module.exports = connetDB