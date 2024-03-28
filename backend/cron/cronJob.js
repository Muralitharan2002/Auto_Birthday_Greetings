
const model = require('../model/user.model');
const daystogo = require('../utils/daystogo.utils');
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
                    birthitem.day2go = daystogo(date);
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
            if (user.birth_list && user.birth_list.length > 0) {
                for (const birthitem of user.birth_list) {
                    if (birthitem.dob.getDate() === new Date().getDate() && birthitem.dob.getMonth() === new Date().getMonth()) {
                        mail(birthitem.email, birthitem.personName);
                        birthitem.status = "sent";
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