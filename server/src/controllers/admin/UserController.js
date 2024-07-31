const UserModel = require("../../models/UserModel");
const MembershipModel = require("../../models/MembershipModel");
const MembershipHistoryModel = require("../../models/MembershipHistoryModel");
const InvoiceModel = require("../../models/InvoiceModel");
const EmailVerify = require("../../models/EmailVerifyModel");
const PurchasedSubjectHistoryModel = require("../../models/PurchasedSubjectHistoryModel");
const PurchasedSubjectInvoiceModel = require("../../models/PurchasedSubjectInvoiceModel")
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const sgMail = require("@sendgrid/mail");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }
    let totalCount = await UserModel.find({ role: 0 })
        .or([
            { firstName: new RegExp(search, "i") },
            { lastName: new RegExp(search, "i") },
            { email: new RegExp(search, "i") }
        ])
        .count();
    let data = await UserModel.find({ role: 0 })
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
    let user = await UserModel.findById(id);
    let invoices = await InvoiceModel.find({ user: id });
    // let memberships = await MembershipHistoryModel.find({
    //     user: id,
    //     isPaid: true
    // }).populate([{
    //     path: 'subjects',
    //     populate: {
    //         path: 'year'
    //     }
    // }, {
    //     path: "invoice"
    // }]);

    let memberships = await PurchasedSubjectHistoryModel.find({
        user: id
    }).populate([{
        path: 'subject',
        populate: {
            path: 'year',
            populate: {
                path: 'subjects'
            }
        }
    }, {
        path: 'invoice'
    }]);

    let subjectInvoices = await PurchasedSubjectInvoiceModel.find({
        user: id,
    });

    res.json({
        user,
        invoices,
        memberships,
        subjectInvoices
    });
}

const fetchByMe = async (req, res) => {
    let { userId: id } = req.user;
    let user = await UserModel.findById(id);
    res.json(user);
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

const remove = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await UserModel.findById(id);
        await EmailVerify.findOneAndDelete({ email: user.email });
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
const changePassword = async (req, res) => {
    try {
        let { id } = req.params;
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(req.body.password, salt);
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

const updateProfile = async (req, res) => {
    try {
        let { userId: id } = req.user;
        let user = req.body;
        let originUser = await UserModel.findById(id);
        if (user.email !== originUser.email) {
            await EmailVerify.findOneAndDelete({ email: originUser.email });
            await UserModel.findByIdAndUpdate(id, { ...user, status: false });
            let buffer = await crypto.randomBytes(30);
            let token = buffer.toString('hex');
            await EmailVerify.create({
                email: user.email,
                token: token
            });
            await sgMail.send({
                to: user.email,
                from: {
                    email: global.env.SENDGRID_USER,
                    name: global.env.SENDGRID_NAME
                },
                subject: "AnswerSheet - your account is almost updated.",
                html: `
                    <div style="background: #fafafa; font-family: sans-serif; max-width: 660px; margin: auto">
                        <div style="padding: 10px; margin-bottom: 20px; background: #d6e4f1">
                            <img src="${global.env.HOSTNAME}/logo.png"/>
                        </div>
                        <div style="padding: 10px 20px; border-top: 2px solid #ebebeb; border-bottom: 2px solid #ebebeb;">
                            <h2 style="color: #005492;">Your account is almost updated.</h2>
                            <p>Hi, ${user.firstName}</p>
                            <p>Click below to update your profile.</p>
                            <div style="text-align: center; max-width: 400px; padding: 20px;">
                                <a href="${global.env.HOSTNAME}/verify-email/${token}" style="text-decoration: none; padding: 10px 30px; background: #005492; display: inline-block; color: #fafafa">Validate Email</a>
                            </div>
                            <p>This link expires in 72 hours.</p>
                            <p>If you have any questions or didn't make this change, please contact us at support@answersheet.au</p>
                            <p>Sincerely,</p>
                            <p style="font-weight: 700;">The AnswerSheet team</p>
                        </div>
                        <div style="padding: 10px 20px; font-size: 12px;">
                            <p style="margin-top: 5px; margin-bottom: 5px;">&copy; 2023 AnswerSheet Pty Ltd - all rights reserved.</p>
                            <p style="margin-top: 5px; margin-bottom: 5px;">Our <a href="${global.env.HOSTNAME}/privacy-policy">Privacy Policy</a> explains how we collect, use, disclose, hold and secure personal information.</p>
                            <p style="margin-top: 5px; margin-bottom: 5px;">Please do not reply to this email.</p>
                        </div>
                    </div>
                `
            });
            user = await UserModel.findById(id);
            res.json({
                status: true,
                user: user,
                msg: "Successfully updated. Please check email for validation link."
            });
        } else {
            await UserModel.findByIdAndUpdate(id, user);
            user = await UserModel.findById(id);
            res.json({
                status: true,
                user: user,
                msg: "Successfully updated."
            });
        }

    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const updatePassword = async (req, res) => {
    try {
        let { userId: id } = req.user;
        let { currentPassword, newPassword } = req.body;
        let user = await UserModel.findById(id);
        if (bcrypt.compareSync(currentPassword, user.password)) {
            let salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(newPassword, salt);
            user.password = password;
            await user.save();
            res.json({
                status: true,
                msg: "Successfully changed."
            });
        } else {
            res.json({
                status: false,
                msg: "The current password is incorrect."
            });
        }
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}


module.exports = {
    fetch,
    fetchById,
    fetchByMe,
    update,
    changePassword,
    remove,
    updateProfile,
    updatePassword
}