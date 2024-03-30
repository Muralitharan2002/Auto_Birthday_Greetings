const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name: String,
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: String,
})

const user = mongoose.model("user", userSchema);

const birthSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    birth_list: [
        {
            profileUrl: {
                type: String,
                required: true,
                validate: {
                    validator: (profileUrl) => {
                        const urlRgex = /^https?:\/\/[^\s]+[\/\?\+\#&\=%.\-]*$/;
                        console.log(urlRgex.test(profileUrl))
                        return urlRgex.test(profileUrl);
                    },
                    message: "Invalid url"
                }
            },
            personName: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true
                // unique: false
            },
            dob: {
                type: Date,
                // required: true
            },
            day2go: Number,
            status: String,
            createdAt: Date
        }

    ]
})

const list = mongoose.model("birth_list", birthSchema);

const sessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "user"
    },
    token: {
        type: String,
        required: true
    },
    expireStatus: {
        type: String
    }
})

const session = mongoose.model("userSession", sessionSchema);

const ManageCoupon = new mongoose.Schema({
    PersonId: {
        type: mongoose.Types.ObjectId
    },
    coupon: String,
    expireTime: Date
})

const coupon = mongoose.model("manageCoupon", ManageCoupon);


module.exports = { user, list, session, coupon };