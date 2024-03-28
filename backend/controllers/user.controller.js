require("dotenv").config()
const bcrypt = require("bcrypt")
const model = require("../model/user.model")
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const daystogo = require("../utils/daystogo.utils");
const cron = require("../cron/cronJob")


const createUser = async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        const exist = await model.user.findOne({ Email: Email })
        // console.log("found", exist)
        // console.log("found", !exist)
        if (!exist) {
            const hashPassword = await bcrypt.hash(Password, 10);
            await model.user.create({
                Name,
                Email,
                Password: hashPassword
            })
            return res.status(201).json({ message: "created", status: "success" })
        }

        return res.status(200).json({ message: "user already created", status: "warning" })
    } catch (err) {
        return res.status(500).json({ status: "Error", Error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const exist = await model.user.findOne({ Email })
        if (!exist) {
            return res.status(404).json({ message: "user not found", status: "warning" })
        }

        const match = await bcrypt.compare(Password, exist.Password);

        if (!match) return res.status(401).json({ message: "Invalid crendential", status: "warning" })

        const userSession = await model.session.findOne({ userId: exist._id })

        if (!userSession) {
            const token = jwt.sign({ id: exist._id }, process.env.SECRET_KEY)

            await model.session.create({
                userId: exist._id,
                token,
                expireStatus: "no"
            })
            return res.status(202).json({ message: "Login successfull", status: "success", token })
        } else if (userSession && userSession.expireStatus !== "yes") {
            return res.status(202).json({ message: "Login successfull", status: "success", token: userSession.token })
        } else {
            await model.session.updateOne({ _id: userSession._id }, { $set: { expireStatus: "no" } })

            return res.status(202).json({ message: "Login successfull", status: "success", token: userSession.token })
        }

    } catch (err) {
        res.status(500).json({ status: "Error", Error: err.message })
    }
}

const getuser = async (req, res) => {
    try {
        const id = req.data.id
        // console.log(id)

        const session = await model.session.findOne({ userId: id })

        if (session.expireStatus !== "yes") {
            const user = await model.user.findOne({ _id: id })
            if (user) {
                const Name = user.Name
                return res.status(200).json({ message: "user got", status: "success", Name })
            } else {
                return res.status(404).json({ message: "user not found", status: "error" })
            }
        } else {
            return res.status(200).json({ message: "session expired", status: "warning" })
        }

    } catch (err) {
        res.status(500).json({ message: "getuser process failed", status: "Error", Error: err.message })
    }


}

const birthnote = async (req, res) => {
    try {
        const id = req.data.id;
        const image = req.file?.path;
        // console.log("image", req.file?.path)
        const { Name, email, dob } = req.body;
        const dateofbirth = new Date(dob);
        // console.log(Name, email, dob)
        let defaultImage = "https://res.cloudinary.com/dr1behckb/image/upload/v1710751035/unkown.jpg-1710751033555-457842530.jpg"
        const authUser = await model.list.findOne({ ownerId: id })

        if (authUser) {

            const birthexist = await authUser.birth_list.find((list) => list.email === email);
            // console.log(birthexist)

            if (birthexist) {
                return res.json({ message: "Already Remainder Added", status: "warning" })
            } else {
                // console.log(Name)
                authUser.birth_list.push({
                    personName: Name,
                    profileUrl: image ? await uploadImage(image) : defaultImage,
                    email,
                    dob,
                    createdAt: new Date,
                    day2go: daystogo(dateofbirth),
                    status: "pending"
                })

                await authUser.save();

                return res.status(201).json({ message: "Remainder Added", status: "success" })
            }

        } else {
            await model.list.create({
                ownerId: id,
                birth_list: [{
                    personName: Name,
                    profileUrl: image ? await uploadImage(image) : defaultImage,
                    email,
                    dob,
                    createdAt: new Date,
                    day2go: daystogo(dateofbirth),
                    status: "pending"
                }]
            })

            return res.status(201).json({ message: "Remainder Added", status: "success" })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error in Birthnote process", status: "error", Error: err.message })
    }
}


const uploadImage = async (image) => {
    try {
        // if (!image) return res.status(204).json({ message: "empty image field", status: "warning" })
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true
        });

        // console.log(cloudinary.config())

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        try {
            const result = await cloudinary.uploader.upload(image, options);
            // console.log(result);
            return result.secure_url
        } catch (error) {
            console.error(error);
        }


    } catch (err) {
        console.log(err)
        // return res.status(500).json({ message: "image uploading process failed", status: "error", Error: err.message })
    }
}

const update = async (req, res) => {
    try {
        const id = req.data.id;
        const PersonId = req.query.target;
        const { Name, email, dob } = req.body;
        const image = req.file?.path;

        const authUser = await model.list.findOne({ ownerId: id });

        const allList = authUser.birth_list;

        if (Name || image || email || dob) {
            const target = await allList.find(item => item._id.toString() === PersonId);
            if (!target) return res.status(404).json({ message: "list not found", status: "error" });
            target.personName = Name ? Name : target.personName;
            target.profileUrl = image ? await uploadImage(image) : target.profileUrl;
            target.email = email ? email : target.email;

            if (dob) {
                target.dob = dob;
                const days = daystogo(dob);
                target.day2go = days;
                console.log("days", days)
                if (days > 0) {
                    target.status = "pending"
                }
            }
            target.dob = dob ? new Date(dob) : target.dob;

            await authUser.save();

            // console.log(authUser);
            return res.status(200).json({ message: "updated", status: "success1", authUser });
        }

        return res.status(200).json({ message: "No changes!", status: "success2", authUser });

    } catch (err) {
        return res.status(500).json({ message: "updating process failed", status: "error", Error: err.message });
    }

}


const RemoveRemainder = async (req, res) => {
    try {
        const id = req.data.id;
        const PersonId = req.query.target;

        const authUser = await model.list.findOne({ ownerId: id });

        const allList = authUser.birth_list;

        const target = await allList.findIndex(item => item._id === PersonId);

        if (target) {
            allList.splice(target, 1);
            await authUser.save();
            return res.status(200).json({ message: "Remainder Removed", status: "success" });
        }

        return res.status(200).json({ message: "Remainder not found", status: "warning" });

    } catch (err) {
        return res.status(500).json({ message: "Remove remainder process failed", status: "error", Error: err.message });
    }
}

const upcoming = async (req, res) => {
    try {
        const id = req.data.id;

        const user = await model.session.findOne({ userId: id });

        if (user.expireStatus !== "yes") {
            const target = await model.list.findOne({ ownerId: id });

            const Events = target.birth_list.filter(item => item.day2go !== 0)
            Events.sort((a, b) => a.day2go - b.day2go);

            // console.log(Events.sort((a, b) => a.day2go - b.day2go)
            // )

            if (Events) return res.status(200).json({ status: "success", Events });

            if (!Events) return res.status(404).json({ message: "upcomingEvents not found", status: "warning" });
        } else {
            return res.status(401).json({ message: "Session Expired", status: "Error" });
        }
    } catch (err) {
        return res.status(500).json({ message: "getting upcoming Events process failed", status: "error", Error: err.message });
    }

}

const today = async (req, res) => {
    try {
        const id = req.data.id;

        const user = await model.session.findOne({ userId: id });

        if (user.expireStatus !== "yes") {
            const target = await model.list.findOne({ ownerId: id });

            const Events = target.birth_list.filter(item => item.day2go === 0)
            // console.log(Events)

            if (Events) return res.status(200).json({ status: "success", Events });

            if (!Events) return res.status(404).json({ message: "todayEvents not found", status: "warning" });
        } else {
            return res.status(401).json({ message: "Session Expired", status: "Error" });
        }
    } catch (err) {
        return res.status(500).json({ message: "getting today Events process failed", status: "error", Error: err.message });
    }

}

const logout = async (req, res) => {
    try {
        const id = req.data.id;
        const session = await model.session.findOne({ userId: id });

        if (session.expireStatus === "no") {
            session.expireStatus = "yes";
            await session.save();

            return res.status(200).json({ message: "Logout successfully", status: "success" });
        }


        return res.status(200).json({ message: "Logout successfully", status: "success" });

    } catch (err) {
        return res.status(500).json({ message: "logout process failed", status: "error", Error: err.message });
    }
}

const cronjob_1 = (async (req, res) => {
    try {
        await cron.cron1();
        //   res.send('Cron job 1 executed successfully');
    } catch (error) {
        console.error('Error executing cron job 1', error);
        //   res.status(500).send('Error executing cron job 1');
    }
});
const cronjob_2 = (async (req, res) => {
    try {
        await cron.cron2();
        //   res.send('Cron job 2 executed successfully');
    } catch (error) {
        console.error('Error executing cron job 2', error);
        //   res.status(500).send('Error executing cron job 1');
    }
});


module.exports = { createUser, login, getuser, birthnote, update, RemoveRemainder, upcoming, today, logout, cronjob_1, cronjob_2 };