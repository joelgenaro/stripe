const UserModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const { findById } = require("../../models/UserModel");
sgMail.setApiKey(global.env.SENDGRID_API_KEY);

function generateRandom(maxLimit = 15) {
    let rand = Math.random() * maxLimit;
    rand = Math.floor(rand);
    return rand;
}

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }
    let totalCount = await UserModel.find({ role: [1, 2] })
        .or([
            { firstName: new RegExp(search, "i") },
            { lastName: new RegExp(search, "i") },
            { email: new RegExp(search, "i") }
        ])
        .count();
    let data = await UserModel.find({ role: [1, 2] })
        .or([
            { firstName: new RegExp(search, "i") },
            { lastName: new RegExp(search, "i") },
            { email: new RegExp(search, "i") }
        ])
        .sort(sort)
        .skip((page - 1) * length)
        .limit(length);

    res.json({
        data,
        totalCount
    });
}
const fetchById = async (req, res) => {
    let { id } = req.params;
    let staff = await UserModel.findById(id);
    res.json(staff);
}
const create = async (req, res) => {
    try {
        let data = req.body.staff;
        let salt = bcrypt.genSaltSync(10);
        let password = data.password;
        data.password = bcrypt.hashSync(data.password, salt);
        let user = await UserModel.findOne({ email: data.email });
        if (user) {
            res.json({
                status: false,
                msg: "The email already exists."
            });
        } else {
            let isSendInstructions = data.isSendInstructions;
            delete data.isSendInstructions;
            data.avatarColor = generateRandom();
            user = await UserModel.create(data);
            if (isSendInstructions) {
                await sgMail.send({
                    to: user.email,
                    from: {
                        email: global.env.SENDGRID_USER,
                        name: global.env.SENDGRID_NAME
                    },
                    subject: "AnswerSheet - accessing your staff account",
                    html: `
                    <div style="background: #fafafa; font-family: sans-serif; max-width: 660px; margin: auto">
                        <div style="padding: 10px; margin-bottom: 20px; background: #d6e4f1">
                            <img src="${global.env.HOSTNAME}/logo.png"/>
                        </div>
                        <div style="padding: 10px 20px; border-top: 2px solid #ebebeb; border-bottom: 2px solid #ebebeb;">
                            <h2 style="color: #005492;">Accessing your staff account.</h2>
                            <p>Hi ${user.firstName}</p>
                            <p style="margin-top: 0px; margin-bottom: .5rem">You can access your staff account with the following credentials. For security, please change your password as soon as possible.</p>
                            <ul>
                                <li>Login page: <a href="https://${req.hostname}/login" target="_blank">https://${req.hostname}/login</a></li>
                                <li>Email: ${user.email}</li>
                                <li>Password: ${password}</li>
                            </ul>
                            <p>If you have any questions, please contact us at support@answersheet.au</p>
                            <p>Sincerely,</p>
                            <p style="font-weight: 700;">The AnswerSheet team</p>
                        </div>
                        <div style="padding: 10px 20px; font-size: 12px;">
                            <p style="margin-top: 5px; margin-bottom: 5px;">&copy; 2023 AnswerSheet - all rights reserved.</p>
                            <p style="margin-top: 5px; margin-bottom: 5px;">Our <a href="${global.env.HOSTNAME}/privacy-policy">Privacy Policy</a> explains how we collect, use, disclose, hold and secure personal information.</p>
                            <p style="margin-top: 5px; margin-bottom: 5px;">Please do not reply to this email.</p>
                        </div>
                    </div>
                `
                });
            }
            res.json({
                status: true,
                msg: "Successfully created."
            });
        }
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const update = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let result = await UserModel.findByIdAndUpdate(id, data);
        res.json({
            status: true,
            msg: "Successfully updated.",
            data: result
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const changePassword = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(data.password, salt);
        await UserModel.findByIdAndUpdate(id, {
            password: password
        });
        res.json({
            status: true,
            msg: "Successfully updated."
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const loginMng = async (req, res) => {
    try {
        let { id } = req.params;
        let staff = await UserModel.findById(id);
        if (staff.status) {
            await UserModel.findByIdAndUpdate(id, { status: false });
        } else {
            await UserModel.findByIdAndUpdate(id, { status: true });
        }
        res.json({
            status: true,
            msg: 'Successfully updated.'
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const remove = async (req, res) => {
    try {
        let { id } = req.params;
        let result = await UserModel.findByIdAndDelete(id);
        res.json({
            status: true,
            msg: "Successfully deleted.",
            data: result
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

module.exports = {
    create,
    fetch,
    fetchById,
    update,
    loginMng,
    changePassword,
    remove
}