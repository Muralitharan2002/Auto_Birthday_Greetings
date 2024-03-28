require("dotenv").config()
const jwt = require("jsonwebtoken")
const { session } = require("../model/user.model")

const auth = async (req, res, next) => {
    const token = req.header("x-secure-auth")
    // console.log(token)
    if (token) {
        await session.findOne({ token })
            .then(async (found) => {
                // console.log(found)
                if (found && found.expireStatus !== "yes") {
                    await jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
                        if (err) return res.status(401).json({ message: "token verification error", status: "error", Error: err.message })

                        req.data = data;
                        next()
                    })
                }

                if (!found) return res.status(401).json({ message: "session expired", status: "error" })
            })
            .catch((err) => {
                return res.status(500).json({ message: "Error while fetching token", status: "error", Error: err.message })
            })
    }

    if (!token) return res.status(404).json({ message: "token not found in header", status: "error" })
}

module.exports = auth;