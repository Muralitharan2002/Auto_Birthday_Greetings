const nodemailer = require("nodemailer");

const mail = async (birthPersonEmail, birthPersonName, birthPersonId, birthPersonCoupon, ownerName, ownerId) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        port: process.env.PORT,
        secure: process.env.SECURE,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    const greetingLink = `https://auto-birthday-greets.vercel.app/greetings/${birthPersonName}/${birthPersonId}/${ownerId}`

    const htmlContent = `
    <h1>Good Morning, ${birthPersonName}! 🌞</h1>
    <h3>🎉 Greetings from ${ownerName}! 🎉</h3>
    <p>Wishing you a day filled with joy, laughter, and special moments!</p>
    <p>Click the button below to unlock your birthday surprise:</p>
    <a href="${greetingLink}" style="display: inline-block; background-color: #ff6f61; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Unlock Your Surprise</a>
    <p>Don't forget to use your special coupon code to make it even more memorable:</p>
    <p>coupon code : <strong>${birthPersonCoupon}</strong></p>
    <p>Coupon Expire in 4 days!</p>
    <p>See you there!</p>
    <p>Best wishes,<br>${ownerName}</p> 
    `;

    const mailOptions = {
        from: process.env.USER,
        to: birthPersonEmail,
        subject: 'Birthday wishes',
        html: htmlContent
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            return false;
        } else {
            console.log('Email sent:', info.response);
            return true
        }
    });
}

module.exports = mail;