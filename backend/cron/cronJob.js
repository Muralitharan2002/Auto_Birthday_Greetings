
const model = require('../model/user.model');
const daystogo = require('../utils/daystogo.utils');
const generateCoupon = require('../utils/generateCoupon');
const mail = require('../utils/mail');

// Schedule a task to run every day at midnight
const cron1 = async () => {
    try {
        const users = await model.list.find();

        for (const user of users) {
            if (user.birth_list && user.birth_list.length > 0) {
                for (const birthitem of user.birth_list) {
                    const date = new Date(birthitem.dob);
                    // console.log(typeof date)
                    const daytogo = daystogo(date);
                    birthitem.day2go = daytogo

                    if (daytogo > 0) {
                        birthitem.status = "pending";
                    }
                }
                await user.save();
            }
        }

        // console.log('Daystogo values updated successfully');
    } catch (error) {
        console.error('Error updating daystogo values:', error);
    }
};


const cron2 = async () => {
    try {
        const users = await model.list.find();

        for (const user of users) {
            const owner = await model.user.findOne({ _id: user.ownerId })
            if (user.birth_list && user.birth_list.length > 0) {
                for (const birthitem of user.birth_list) {
                    if (birthitem.dob.getDate() === new Date().getDate() && birthitem.dob.getMonth() === new Date().getMonth()) {

                        const found = await model.coupon.findOne({ PersonId: birthitem._id })

                        if (found && found.expireTime > new Date()) {
                            const mailStatus = mail(birthitem.email, birthitem.personName, birthitem._id, found.coupon, owner.Name, owner._id)

                            if (mailStatus) {
                                birthitem.status = "sent";
                            }
                        } else {
                            await model.coupon.deleteOne({ PersonId: birthitem._id });

                            const coupon = generateCoupon(10)

                            const manageCoupon = new model.coupon({
                                PersonId: birthitem._id,
                                coupon,
                                expireTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
                            })

                            const mailStatus = mail(birthitem.email, birthitem.personName, birthitem._id, coupon, owner.Name, owner._id)

                            if (mailStatus) {
                                birthitem.status = "sent";
                                await manageCoupon.save();
                            }
                        }

                    }
                }
                await user.save();
            }
        }

        // console.log('Daystogo values updated successfully');
    } catch (error) {
        console.error('Error updating daystogo values:', error);
    }
};

module.exports = { cron1, cron2 }