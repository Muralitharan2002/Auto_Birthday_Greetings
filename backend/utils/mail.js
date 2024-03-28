const nodemailer = require("nodemailer");

const mail = async (email, Name) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        port: process.env.PORT,
        secure: process.env.SECURE,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    const htmlContent = `
        <h1>Good Morning 🌞 ${Name}</h1>
        <h3>🎉 Greetings from, Murali! 🎉 waiting for you 💕</h3>
    `;

    const mailOptions = {
        from: 'muralitharans2002@gmail.com',
        to: email,
        subject: 'Birthday wishes',
        html: htmlContent
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = mail;