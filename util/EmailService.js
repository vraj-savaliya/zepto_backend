const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const SendEmail = async ({ to, subject, html }) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: html
        })

        return response
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = SendEmail