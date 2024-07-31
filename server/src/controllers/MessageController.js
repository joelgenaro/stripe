const MessageModel = require("../models/MessageModel");
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
sgMail.setApiKey(global.env.SENDGRID_API_KEY);

const create = async (req, res) => {
    try {
        let data = req.body;
        let message = await MessageModel.create(data);
        await sgMail.send({
            to: global.env.SUPPORT_RECEIVER,
            from: {
                email: global.env.SENDGRID_USER,
                name: global.env.SENDGRID_NAME
            },
            subject: "AnswerSheet - contact us enquiry",
            replyTo: message.email,
            html: `
            <div style="background: #fafafa; font-family: sans-serif; max-width: 660px; margin: auto">
                <div style="padding: 10px; margin-bottom: 20px; background: #d6e4f1">
                    <img src="${global.env.HOSTNAME}/logo.png"/>
                </div>
                <div style="padding: 10px 20px; border-top: 2px solid #ebebeb; border-bottom: 2px solid #ebebeb;">
                    <h2 style="color: #005492; text-transform: capitalize;">${data.enquiryNature} Enquiry</h2>
                    <p>Enquiry from ${data.name} received on ${moment(message.createdAt).format('DD/MM/YYYY')}</p>
                    <p>Reply email address: ${message.email}</p>
                    <p>${message.message}</p>
                </div>
                <div style="padding: 10px 20px; font-size: 12px;">
                    <p style="margin-top: 5px; margin-bottom: 5px;">&copy; 2023 AnswerSheet Pty Ltd</p>
                    <p style="margin-top: 5px; margin-bottom: 5px;">Our <a href="${global.env.HOSTNAME}/privacy-policy">Privacy Policy</a> explains how we collect, use, disclose, hold and secure personal information.</p>
                    <p style="margin-top: 5px; margin-bottom: 5px;">Please do not reply to this email.</p>
                </div>
            </div>
            `
        });
        res.json({
            success: true,
            data: {
                message,
                msg: "Successfully sent."
            }
        })
    } catch (err) {
        res.json({
            success: false,
            data: {
                msg: err.message
            }
        });
    }
}

module.exports = {
    create
}