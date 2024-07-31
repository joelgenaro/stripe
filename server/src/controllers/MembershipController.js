const MembershipHistory = require("../models/MembershipHistoryModel");
const SubjectModel = require("../models/SubjectModel");
const MembershipModel = require("../models/MembershipModel");
const PricingModel = require("../models/PricingModel");
const InvoiceModel = require("../models/InvoiceModel");
const PurchasedSubjectHistoryModel = require("../models/PurchasedSubjectHistoryModel");
const PurchasedSubjectInvoiceModel = require("../models/PurchasedSubjectInvoiceModel")
const mongoose = require('mongoose');
const { purchase } = require("./BillingController");

const fetch = async (req, res) => {
    try {
        let memberships = await MembershipModel.find();
        let data = [], i = 0;
        for (membership of memberships) {
            let items = await PricingModel.find({ period: membership.period });
            data[i] = {
                _id: membership._id,
                name: membership.name,
                slug: membership.slug,
                label: membership.label,
                description: membership.description,
                period: membership.period,
                items: items
            }
            i++;
        }
        res.json({
            success: true,
            memberships: data
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let membership = await MembershipModel.findOne({ slug: id });
        res.json({
            success: true,
            membership: membership
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const getPrice = async (req, res) => {
    let { period, subject_nums } = req.query;
    let pricing = await PricingModel.findOne({ period: period, subject_nums: subject_nums });
    res.json(pricing);
}

const getPurchasedMemberships = async (req, res) => {
    let memberships = await MembershipHistory.find({
        user: req.user.userId,
        isPaid: true,
        // $or: [{
        //     expiredDate: {
        //         $gte: new Date().toISOString()
        //     }
        // }, {
        //     period: -1
        // }]
    }).populate([{
        path: 'subjects',
        populate: {
            path: 'year'
        }
    }, {
        path: "invoice"
    }]);

    let subjectHistories = await PurchasedSubjectHistoryModel.find({
        user: req.user.userId
    }).populate([{
        path: 'subject',
        populate: {
            path: 'year'
        }
    }, {
        path: 'invoice'
    }]);

    res.json(subjectHistories);
}

const getInvoices = async (req, res) => {
    // let invoices = await InvoiceModel.find({
    //     user: req.user.userId,
    // });
    let invoices = await PurchasedSubjectInvoiceModel.find({
        user: req.user.userId,
    });
    res.json(invoices);
}

const checkPurchasedMembership = async (req, res) => {
    let { user, subject } = req.query;
    let membership = await MembershipHistory.find({
        user: user,
        subjects: { $in: [subject._id] },
        isPaid: true,
        expiredDate: {
            $gte: new Date().toISOString()
        }
    }).populate("invoice");

    if (membership.length == 0) {
        res.json({
            result: false,
        });
    } else {
        res.json({
            result: true
        });
    }
}

const checkPurchasedMembershipBySlug = async (req, res) => {
    let { user, yearSlug, subjectSlug } = req.query;

    let subject = await SubjectModel.findOne({
        slug: subjectSlug
    });

    if (subject != null) {
        let membership = await MembershipHistory.find({
            user: user,
            subjects: { $in: [subject._id] },
            isPaid: true,
            expiredDate: {
                $gte: new Date().toISOString()
            }
        }).populate("invoice");


        if (membership.length == 0) {
            res.json({
                result: false,
            });
        } else {
            res.json({
                result: true
            });
        }
        return;
    }
    res.json({
        result: false,
    });
}

const create = async (req, res) => {
    try {
        let invoice = null;
        // let subjects = req.body.selectedSubjects;
        let subjectId = req.body.selectedSubject;
        let invoiceId = req.body.selectedInvoice;
        let expiredDate = req.body.membershipUntilDate;

        expiredDate = expiredDate + ' 23:59:59.000';
        if (invoiceId != -1) {
            invoice = await InvoiceModel.findByIdAndUpdate(invoiceId, { status: true });
        }

        let histories = await PurchasedSubjectHistoryModel.find({
            user: req.params.id,
            subject: subjectId
        });
        if (histories.length > 0) {
            res.json({
                success: false,
                msg: "Membership for this subject already exist."
            });

            return;
        }

        await PurchasedSubjectHistoryModel.create({
            user: req.params.id,
            subject: subjectId,
            invoice: invoiceId == -1 ? null : invoice._id,
            expiredDate: expiredDate
        });

        // Create Purchased Subject Invoice

        if (invoiceId != -1) {
            await PurchasedSubjectInvoiceModel.create({
                user: invoice.user,
                subject_id: subjectId,
                invoice_id: invoiceId == -1 ? null : invoice.invoice_id,
                item_name: invoice.item_name,
                item_description: invoice.item_description,
                amount: invoice.amount,
                gst: invoice.gst,
                currency: invoice.currency,
                paid_date: invoice.paid_date,
                isPaid: invoice.isPaid,
            });
        }
        // await PurchasedSubjectInvoiceModel.create({
        //     user: req.params.id,
        //     subject_id: subjectId,
        //     invoice: invoiceId == -1 ? null : invoice._id,
        // })
        // await MembershipHistory.create({
        //     user: req.params.id,
        //     invoice: invoiceId == -1 ? null : invoice._id,
        //     subjects: subjects.map((subject, idx) => subject._id),
        //     expiredDate: expiredDate,
        //     price: invoiceId == -1 ? 0 : invoice.amount,
        //     isPaid: true
        // });
        // let memberships = await MembershipHistory.find({
        //     user: req.params.id,
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
            user: req.params.id
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
        res.json({
            success: true,
            data: memberships,
            msg: 'Created successfully.'
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const update = async (req, res) => {
    try {
        let invoice = null;
        let membershipHistoryId = req.body.editMembershipId;
        let subjects = req.body.selectedSubjects;
        let selectedInvoice = req.body.selectedInvoice;
        let currentInvoice = req.body.currentInvoice;
        let expiredDate = req.body.membershipUntilDate;
        expiredDate = expiredDate + ' 23:59:59.000';
        // if (currentInvoice != -1) {
        //     await InvoiceModel.findByIdAndUpdate(currentInvoice, { status: false });
        // }
        // if (selectedInvoice != -1) {
        //     invoice = await InvoiceModel.findByIdAndUpdate(selectedInvoice, { status: true });
        // }
        // await MembershipHistory.findByIdAndUpdate(membershipHistoryId, {
        //     invoice: invoice,
        //     subjects: subjects.map((subject, idx) => subject._id),
        //     expiredDate: expiredDate,
        // });
        // let memberships = await MembershipHistory.find({ 
        //     user: req.params.id,
        //     isPaid: true
        // }).populate([{
        //     path: 'subjects',
        //     populate: {
        //         path: 'year'
        //     }
        // }, {
        //     path: "invoice"
        // }]);

        await PurchasedSubjectHistoryModel.findByIdAndUpdate(membershipHistoryId, {
            expiredDate: expiredDate
        });
        let memberships = await PurchasedSubjectHistoryModel.find({
            user: req.params.id
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

        res.json({
            success: true,
            data: memberships,
            msg: 'Updated successfully.'
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const deleteMembershipHistory = async (req, res) => {
    try {
        let deletedInvoice = '';
        let { membershipId, id } = req.params;
        // let membershipToDelete = await MembershipHistory.findById(membershipId);
        let membershipToDelete = await PurchasedSubjectHistoryModel.findById(membershipId);

        if (membershipToDelete.invoice != null) {
            let invoiceId = membershipToDelete.invoice.toString();
            let invoiceIdObject = membershipToDelete.invoice;
            deletedInvoice = await InvoiceModel.findById(invoiceIdObject);
            await InvoiceModel.findByIdAndUpdate(invoiceId, { status: false });
        }
        // await MembershipHistory.findByIdAndDelete(membershipId);
        await PurchasedSubjectHistoryModel.findByIdAndDelete(membershipId);
        await PurchasedSubjectInvoiceModel.find({
            user : membershipToDelete.user,
            subject_id: membershipToDelete.subject
        }).deleteMany();

        let memberships = await PurchasedSubjectHistoryModel.find({
            user: req.params.id
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
        // let memberships = await MembershipHistory.find({
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
        res.json({
            success: true,
            memberships,
            deletedInvoice: deletedInvoice,
            msg: 'Deleted successfully.'
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        })
    }
}

module.exports = {
    fetch,
    fetchById,
    getPrice,
    getPurchasedMemberships,
    checkPurchasedMembership,
    checkPurchasedMembershipBySlug,
    getInvoices,
    create,
    update,
    deleteMembershipHistory
}