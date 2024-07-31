const uniqid = require("uniqid");
const TransactionModel = require("../models/TransactionModel");
const InvoiceModel = require("../models/InvoiceModel");
const UserModel = require("../models/UserModel");
const MembershipHistoryModel = require("../models/MembershipHistoryModel");
const PurchasedSubjectHistoryModel = require("../models/PurchasedSubjectHistoryModel");
const PurchasedSubjectInvoiceModel = require("../models/PurchasedSubjectInvoiceModel");
const moment = require("moment");
const paypal = require("paypal-rest-sdk");
const stripe = require("stripe")(global.env.STRIPE_SECRET_KEY);
const sgMail = require("@sendgrid/mail");

paypal.configure({
    mode: "sandbox",
    client_id: global.env.PAYPAL_CLIENT_ID,
    client_secret: global.env.PAYPAL_CLIENT_SECRET
});
sgMail.setApiKey(global.env.SENDGRID_API_KEY);

let global_subjects = '';

const purchase = async (req, res) => {
    try {
        let user = await UserModel.findById(req.user.userId);
        let { gateway } = req.params;
        let { membership } = req.body;
        global_subjects = '';
        for (let i = 0; i < membership.subjects.length; i++) {
            global_subjects += `<li>${membership.subjects[i].year_name} - ${membership.subjects[i].name}</li>`;
        }
        let membershipHistory = await MembershipHistoryModel.create({
            user: user._id,
            membership_id: membership.membership_id,
            name: membership.name,
            subjects: membership.subjects.map((subject, idx) => subject._id),
            period: membership.period,
            price: membership.price
        });

        if (gateway === "paypal") {
            paypal.payment.create({
                intent: "sale",
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url: `${global.env.HOSTNAME}/private-billing/paypal/return?history_id=${membershipHistory._id}`,
                    cancel_url: `${global.env.HOSTNAME}/private-billing/paypal/cancel`
                },
                transactions: [{
                    custom: user._id,
                    item_list: {
                        items: [{
                            name: membership.name,
                            sku: "item",
                            currency: "AUD",
                            price: (membership.price / 1.1).toFixed(2),
                            tax: ((membership.price / 1.1) * 0.1).toFixed(2),
                            quantity: 1,
                            description: membership.description
                        }]
                    },
                    amount: {
                        currency: "AUD",
                        total: membership.price,
                        details: {
                            subtotal: (membership.price / 1.1).toFixed(2),
                            tax: ((membership.price / 1.1) * 0.1).toFixed(2)
                        }
                    },
                    // LOGOIMG: "htttp://localhost:5000/public/logo.svg"
                }]
            }, function (err, payment) {
                if (err) throw err;
                else {
                    res.json({
                        success: true,
                        redirect_url: payment.links[1].href
                    });
                }
            });
        } else if (gateway === "stripe") {
            const taxRate = await stripe.taxRates.create({
                display_name: 'GST',
                description: 'Goods & Service Tax',
                jurisdiction: 'AU',
                percentage: 10,
                inclusive: false,
            });
            let payment = await stripe.checkout.sessions.create({
                mode: "payment",
                client_reference_id: user._id.toString(),
                payment_method_types: ['card'],
                // customer: customer.id,
                customer_email: user.email,
                line_items: [{
                    price_data: {
                        currency: 'AUD',
                        product_data: {
                            name: membership.name,
                            description: membership.description,
                            // description: membership.description + " - " + moment().add(membership.period, 'months').format("YYYY-MM-DD HH:mm:ss"),
                            images: ["https://answersheet.au/logo.svg"]
                        },
                        unit_amount: Number(Math.round(membership.price / 1.1 * 100)),
                    },
                    tax_rates: [taxRate.id],
                    quantity: 1
                }],
                // success_url: `${global.env.HOSTNAME}/private-membership`,
                // cancel_url: `${global.env.HOSTNAME}/private-membership`
                success_url: `${global.env.HOSTNAME}/private-billing/stripe/return?session_id={CHECKOUT_SESSION_ID}&history_id=${membershipHistory._id}`,
                cancel_url: `${global.env.HOSTNAME}/current-membership`
            });

            return res.json({
                success: true,
                redirect_url: payment.url
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}

const gatewayReturn = async (req, res) => {
    try {
        let { paymentId, payerId, historyId } = req.query;
        let { gateway } = req.params;

        if (gateway === "paypal") {
            paypal.payment.execute(paymentId, {
                payer_id: payerId
            }, async function (err, payment) {
                await TransactionModel.create({
                    user: payment.transactions[0].custom,
                    transaction_id: payment.transactions[0].related_resources[0].sale.id,
                    amount: payment.transactions[0].amount.total,
                    currency: payment.transactions[0].amount.currency,
                    note: "membership",
                    type: "paypal"
                });

                let user = await UserModel.findById(payment.transactions[0].custom);
                let lastInvoice = await InvoiceModel.findOne().sort({ invoice_id: -1 });
                let invoice = await InvoiceModel.create({
                    user: payment.transactions[0].custom,
                    invoice_id: lastInvoice ? lastInvoice.invoice_id + 1 : 11231,
                    item_name: payment.transactions[0].item_list.items[0].name,
                    item_description: payment.transactions[0].item_list.items[0].description,
                    amount: payment.transactions[0].amount.total,
                    gst: payment.transactions[0].item_list.items[0].tax,
                    currency: payment.transactions[0].item_list.items[0].currency,
                    paid_date: moment(payment.create_time).format("YYYY-MM-DD HH:mm:ss"),
                    isPaid: true,
                });

                let history = await MembershipHistoryModel.findById(historyId);
                let expiredDate = '';
                if (Number(history.period) == -1) {
                    expiredDate = moment().add(24, "M").format("YYYY-MM-DD HH:mm:ss");
                } else {
                    expiredDate = moment().add(history.period, "M").format("YYYY-MM-DD HH:mm:ss");
                }
                await history.update({
                    invoice: invoice._id,
                    isPaid: true,
                    expiredDate: expiredDate
                });

                // Add purchased subject history.
                let subjects = history.subjects;
                console.log(subjects);
                for (let i in subjects) {


                    // Create Purchased Subject Invoice
                    await PurchasedSubjectInvoiceModel.create({
                        user: invoice.user,
                        subject_id: subjects[i]._id,
                        invoice_id: invoice.invoice_id,
                        item_name: invoice.item_name,
                        item_description: invoice.item_description,
                        amount: invoice.amount,
                        gst: invoice.gst,
                        currency: invoice.currency,
                        paid_date: invoice.paid_date,
                        isPaid: invoice.isPaid,
                    });

                    // Create or Update Purchased Subject History
                    let subjectHis = await PurchasedSubjectHistoryModel.findOne({
                        user: payment.transactions[0].custom,
                        subject: subjects[i]._id
                    });
                    console.log(subjectHis);
                    if (subjectHis != null) {
                        if (history.period == -1) {
                            expiredDate = moment(subjectHis.expiredDate).add(24, "M").format("YYYY-MM-DD HH:mm:ss");
                            await subjectHis.updateOne({
                                invoice: invoice._id,
                                period: -1,
                                expiredDate: expiredDate
                            });
                        } else if (subjectHis.period == -1) {
                            expiredDate = moment(subjectHis.expiredDate).add(history.period, "M").format("YYYY-MM-DD HH:mm:ss");
                            await subjectHis.updateOne({
                                invoice: invoice._id,
                                period: -1,
                                expiredDate: expiredDate
                            });
                        } else {
                            expiredDate = moment(subjectHis.expiredDate).add(history.period, "M").format("YYYY-MM-DD HH:mm:ss");
                            await subjectHis.updateOne({
                                invoice: invoice._id,
                                period: history.period,
                                expiredDate: expiredDate
                            })
                        }
                    } else {
                        console.log(expiredDate);
                        await PurchasedSubjectHistoryModel.create({
                            user: payment.transactions[0].custom,
                            subject: subjects[i]._id,
                            invoice: invoice._id,
                            period: history.period,
                            expiredDate: expiredDate
                        });
                    }
                }

                let sendEmailParams = {
                    invoiceId: invoice._id,
                    subjectsNum: history.subjects.length,
                    user,
                }
                await sendEmail(sendEmailParams, res);

                return res.json({
                    success: true,
                    invoiceId: invoice._id,
                    membershipId: user.membership,
                    msg: "Successfully purchased."
                });
            })
        } else if (gateway === "stripe") {
            let payment = await stripe.checkout.sessions.retrieve(paymentId);
            let lineItems = await stripe.checkout.sessions.listLineItems(paymentId, { limit: 1 });
            let transaction = await stripe.paymentIntents.retrieve(payment.payment_intent);
            await TransactionModel.create({
                user: payment.client_reference_id,
                transaction_id: transaction.id,
                amount: transaction.amount / 100,
                currency: payment.currency.toUpperCase(),
                type: "stripe",
                note: "membership"
            });
            let user = await UserModel.findById(payment.client_reference_id);
            let lastInvoice = await InvoiceModel.findOne().sort({ invoice_id: -1 });
            let invoice = await InvoiceModel.create({
                user: payment.client_reference_id,
                invoice_id: lastInvoice ? lastInvoice.invoice_id + 1 : 11231,
                item_name: lineItems.data[0].description,
                item_description: lineItems.data[0].description,
                amount: lineItems.data[0].amount_total / 100,
                gst: lineItems.data[0].amount_tax / 100,
                currency: lineItems.data[0].currency,
                paid_date: moment.unix(payment.created).format("YYYY-MM-DD HH:mm:ss"),
                isPaid: true,
            });
            let history = await MembershipHistoryModel.findById(historyId);
            let expiredDate = '';
            if (Number(history.period) == -1) {
                expiredDate = moment().add(24, "M").format("YYYY-MM-DD HH:mm:ss");
            } else {
                expiredDate = moment().add(history.period, "M").format("YYYY-MM-DD HH:mm:ss");
            }
            await history.update({
                invoice: invoice._id,
                isPaid: true,
                expiredDate: expiredDate
            });

            // Add purchased subject history.
            let subjects = history.subjects;
            for (let i in subjects) {
                // Create Purchased Subject Invoice
                await PurchasedSubjectInvoiceModel.create({
                    user: invoice.user,
                    subject_id: subjects[i]._id,
                    invoice_id: invoice.invoice_id,
                    item_name: invoice.item_name,
                    item_description: invoice.item_description,
                    amount: invoice.amount,
                    gst: invoice.gst,
                    currency: invoice.currency,
                    paid_date: invoice.paid_date,
                    isPaid: invoice.isPaid,
                });

                // Create or Update Purchased Subject History
                let subjectHis = await PurchasedSubjectHistoryModel.findOne({
                    user: payment.client_reference_id,
                    subject: subjects[i]._id
                });
                if (subjectHis != null) {
                    if (history.period == -1) {
                        expiredDate = moment(subjectHis.expiredDate).add(24, "M").format("YYYY-MM-DD HH:mm:ss");
                        await subjectHis.updateOne({
                            invoice: invoice._id,
                            period: -1,
                            expiredDate: expiredDate
                        });
                    } else if (subjectHis.period == -1) {
                        expiredDate = moment(subjectHis.expiredDate).add(history.period, "M").format("YYYY-MM-DD HH:mm:ss");
                        await subjectHis.updateOne({
                            invoice: invoice._id,
                            period: -1,
                            expiredDate: expiredDate
                        });
                    } else {
                        expiredDate = moment(subjectHis.expiredDate).add(history.period, "M").format("YYYY-MM-DD HH:mm:ss");
                        await subjectHis.updateOne({
                            invoice: invoice._id,
                            period: history.period,
                            expiredDate: expiredDate
                        })
                    }
                } else {
                    await PurchasedSubjectHistoryModel.create({
                        user: payment.client_reference_id,
                        subject: subjects[i]._id,
                        invoice: invoice._id,
                        period: history.period,
                        expiredDate: expiredDate
                    });
                }
            }

            let sendEmailParams = {
                invoiceId: invoice._id,
                subjectsNum: history.subjects.length,
                user,
            }
            await sendEmail(sendEmailParams, res);
            return res.json({
                success: true,
                invoiceId: invoice._id,
                membershipId: user.membership,
                msg: "Successfully purchased. Please check your email for details."
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}

const sendEmail = async (sendEmailParams, res) => {
    try {
        let { user, invoiceId, subjectsNum } = sendEmailParams;
        let invoice = await InvoiceModel.findById(invoiceId);
        let paidDate = moment(invoice.paid_date).format('DD/MM/YYYY');
        await sgMail.send({
            to: user.email,
            from: {
                email: global.env.SENDGRID_INVOICE_SENDER,
                name: global.env.SENDGRID_NAME
            },
            subject: `AnswerSheet - invoice ${invoice.invoice_id}`,
            html: `
            <div style="background: #fafafa; font-family: sans-serif; max-width: 660px; margin: auto">
                <div style="padding: 10px; margin-bottom: 20px; background: #d6e4f1">
                    <img src="${global.env.HOSTNAME}/logo.png" />
                </div>
                <div style="padding: 10px 20px; border-top: 2px solid #ebebeb; border-bottom: 2px solid #ebebeb;">
                    <h2 style="color: #005492">AnswerSheet Premium</h2>
                    <div style="max-width: 1000px">
                        <div style="word-wrap:break-word;border:1px solid rgba(0,0,0,0.175);border-radius:0.375rem;margin-bottom:1rem">
                            <div style="padding:1.5rem;">
                                <h3 style="color:#005492;margin-top:0;">Tax Invoice</h3>
                                <div style="display:flex;overflow:auto">
                                    <div style="display:block;margin-right:auto;max-width:350px;float:left">
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">To: ${user.firstName} ${user.lastName}</h4>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">Invoice Number: INV-${invoice.invoice_id}</h4>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">Issued: ${paidDate}</h4>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">Status: PAID</h4>
                                        </div>
                                    <div style="display:block;margin-left:auto;max-width:500px;float:right">
                                        <h4 style="color:#005492;margin-top:0;margin-bottom:.5rem;">From: AnswerSheet Pty Ltd</h4>
                                        <h4 style="color:#005492;margin-top:0;margin-bottom:.5rem;">ACN: 665 324 541</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex;min-width:0;word-wrap:break-word;border:1px solid rgba(0,0,0,0.175);border-radius:0.375rem; margin-bottom: 1rem;">
                            <div style="width:100%;padding:1.5rem">
                                <h3 style="margin-top: 0;">Description</h3>
                                <p style="margin-top:0px;font-size:15px;margin-bottom:.5rem">${invoice.item_name} - ${subjectsNum} ${subjectsNum == 1 ? 'subject' : 'subjects'}</p>
                                <ul>
                                    ${global_subjects}
                                </ul>
                                <div style="border-radius:5px;background-color:#d6e4f1;display:block;overflow:auto;padding:0px 20px;">
                                    <div style="float:left;display:block;max-width:300px;width:100%">
                                        <h3 style="margin-bottom:1rem">Subtotal: $${Number(invoice.amount - invoice.gst).toFixed(2)}</h3>
                                        <h3>GST 10%: $${Number(invoice.gst).toFixed(2)}</h3>
                                    </div>
                                    <div style="float:right;text-align:right">
                                        <h3 style="margin-bottom: 0">Total inc.GST</h3>
                                        <h3>$${Number(invoice.amount).toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding: 10px 20px;">
                    <p>&copy; 2023 AnswerSheet Pty Ltd</p>
                    <p>Our <a href="./index.html">Privacy Policy</a> explains how we collect, use, disclose, hold and secure
                        personal information.</p>
                    <p>Please do not reply to this email.</p>
                </div>
            </div>
            `
        });
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}

const emailMe = async (req, res) => {
    try {
        let { membership } = req.body;
        let invoice = membership.invoice
        let subject = membership.subject;
        // let subjects_ = membership.subjects;
        // let detail = '';
        // for (let i = 0; i < subjects_.length; i++) {
        //     detail += `<li>${subjects_[i].year.name} - ${subjects_[i].name}</li>`
        // }
        let detail = '';
        detail += `<li>${subject.year.name} - ${subject.name}</li>`;
        await sgMail.send({
            to: req.user.email,
            from: {
                name: global.env.SENDGRID_NAME,
                email: global.env.SENDGRID_USER
            },
            subject: `AnswerSheet - invoice ${invoice.invoice_id}`,
            html: `
            <div style="background: #fafafa; font-family: sans-serif; max-width: 660px; margin: auto">
                <div style="padding: 10px; margin-bottom: 20px; background: #d6e4f1">
                    <img src="${global.env.HOSTNAME}/logo.png" />
                </div>
                <div style="padding: 10px 20px; border-top: 2px solid #ebebeb; border-bottom: 2px solid #ebebeb;">
                    <h2 style="color: #005492">AnswerSheet Premium</h2>
                    <div style="max-width: 1000px">
                        <div style="word-wrap:break-word;border:1px solid rgba(0,0,0,0.175);border-radius:0.375rem;margin-bottom:1rem">
                            <div style="padding:1.5rem;">
                                <h3 style="color:#005492;margin-top:0;">Tax Invoice</h3>
                                <div style="display:flex;overflow:auto">
                                    <div style="display:block;margin-right:auto;max-width:350px;float:left">
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">To: Michael Alonso</h4>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">Invoice Number: INV-${invoice.invoice_id}</h4>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">Issued: ${moment(membership.expiredDate).format(
                'DD/MM/YYYY'
            )}</h4>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">Status: ${membership.isPaid ? "PAID" : "NOT PAID"}</h4>
                                        </div>
                                    <div style="display:block;margin-left:auto;max-width:500px;float:right">
                                        <h4 style="color:#333333;margin-top:0;margin-bottom:.5rem;">From: ${invoice.company}</h4>
                                        <h4 style="color:#333333;margin-top:0;margin-bottom:.5rem;">ACN: ${invoice.phone}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex;min-width:0;word-wrap:break-word;border:1px solid rgba(0,0,0,0.175);border-radius:0.375rem; margin-bottom: 1rem;">
                            <div style="width:100%;padding:1.5rem">
                                <div style="display:flex;overflow:auto">
                                    <div style="display:block;margin-right:auto;max-width:350px;float:left">
                                        <h3 style="color:#333333;margin-top:0;">Description</h3>
                                        <h4 style="color:#333333;margin-top:0; margin-bottom: .5rem;">${invoice.item_description}</h4>
                                    </div>
                                    <div style="display:block;margin-left:auto;max-width:500px;float:right">
                                        <h4 style="color:#333333;margin-top:0;margin-bottom:.5rem;">Amount</h4>
                                        <h4 style="color:#333333;margin-top:0;margin-bottom:.5rem;">$${Number(invoice.amount - invoice.gst).toFixed(2)}</h4>
                                    </div>
                                </div>
                                <div style="border-radius:5px;background-color:#d6e4f1;display:block;overflow:auto;padding:0px 20px;">
                                    <div style="float:left;display:block;max-width:300px;width:100%">
                                        <div style="overflow:auto">
                                            <h3 style="float:left; margin-bottom: 0">Subtotal: </h3>
                                            <h3 style="float:right; margin-bottom: 0">$${Number(invoice.amount - invoice.gst).toFixed(2)}</h3>
                                        </div>
                                        <div style="overflow:auto">
                                            <h3 style="float:left">GST 10%: </h3>
                                            <h3 style="float:right">$${Number(invoice.gst).toFixed(2)}</h3>
                                        </div>
                                    </div>
                                    <div style="float:right;text-align:right">
                                        <h3 style="margin-bottom: 0">Total inc. GST</h3>
                                        <h3>$${Number(invoice.amount).toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding: 10px 20px; color #333333 !important">
                    <p>&copy; 2023 AnswerSheet Pty Ltd</p>
                    <p>Our <a href="./index.html">Privacy Policy</a> explains how we collect, use, disclose, hold and secure
                        personal information.</p>
                    <p>Please do not reply to this email.</p>
                </div>
            </div>
            `
        });
        res.json({
            success: true,
            msg: 'Successfully emailed invoice to you.'
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

module.exports = {
    purchase,
    gatewayReturn,
    // invoice,
    emailMe,
}