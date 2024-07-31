const nodemailer = require('nodemailer');

const transport = {
    service: 'gmail',
    // host: global.env.SMTP_HOST,
    // port: global.env.SMTP_PORT,
    // secure: true,
    auth: {
        user: global.env.SMTP_USER,
        pass: global.env.SMTP_PWD
    }
}

const transporter = nodemailer.createTransport(transport);

module.exports = transporter;

