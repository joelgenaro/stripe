const InvoiceModel = require("../models/InvoiceModel");
const moment = require("moment");

const fetch = async (req, res) => {
    try {
        let { search, length, page, sortKey, sortDir } = req.query;
        let sort = {};
        if (sortKey) {
            if (sortDir === "desc") sort[sortKey] = -1;
            else sort[sortKey] = 1;
        }
        let totalCount = await InvoiceModel.find({
            $and: [{
                user: req.user.userId
            }, {
                $or: [{
                    invoice_id: isNaN(Number(search)) ? "" : Number(search)
                }, {
                    amount: isNaN(Number(search)) ? "" : Number(search)
                }, {
                    item_name: new RegExp(search, "i")
                }, {
                    paid_date: {
                        $gte: moment(search).isValid() ? moment(search).toDate() : ""
                    }
                }]
            }]
        }).count();
        let data = await InvoiceModel.find({
            $and: [{
                user: req.user.userId
            }, {
                $or: [{
                    invoice_id: isNaN(Number(search)) ? "" : Number(search)
                }, {
                    amount: isNaN(Number(search)) ? "" : Number(search)
                }, {
                    item_name: new RegExp(search, "i")
                }, {
                    paid_date: {
                        $gte: moment(search).isValid() ? moment(search).toDate() : ""
                    }
                }]
            }]
        }).sort(sort).skip((page - 1) * length).limit(length);
        res.json({
            data,
            totalCount
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
        let invoice = await InvoiceModel.findById(id);
        res.json({
            success: true,
            invoice
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const fetchByNew = async (req, res) => {
    let { id } = req.params;
    let invoices = await InvoiceModel.find({
        user: id,
        status: false
    });
    res.json(invoices);
}

const create = async (req, res) => {
    try {
        const { isPaid, paidDate, total, invoiceDescription, status } = req.body;
        let paid = isPaid === 'paid' ? true : false
        let userId = req.params.id;
        let gst = (total / 11).toFixed(2);
        let lastInvoice = await InvoiceModel.findOne().sort({ invoice_id: -1 });
        let invoice = await InvoiceModel.create({
            user: userId,
            invoice_id: lastInvoice ? lastInvoice.invoice_id + 1 : 11231,
            // item_name: itemName,
            item_description: invoiceDescription,
            amount: total,
            gst: gst,
            status: status,
            isPaid: paid,
            // currency: AUD,
            paid_date: paidDate,
        });
        res.json({
            success: true,
            data: invoice,
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
        let { itemName, isPaid, paidDate, total, invoiceDescription, invoiceId } = req.body;
        let gst = (total / 11).toFixed(2);
        await InvoiceModel.findOneAndUpdate({ _id: invoiceId }, {
            item_name: itemName,
            item_description: invoiceDescription,
            amount: total,
            gst: gst,
            // currency: AUD,
            paid_date: paidDate,
        });
        let invoice = await InvoiceModel.findById(invoiceId);
        res.json({
            success: true,
            data: invoice,
            msg: 'Updated successfully.'
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const deleteInvoice = async (req, res) => {
    try {
        let { invoiceId } = req.params;
        let result = await InvoiceModel.findByIdAndDelete(invoiceId);
        res.json({
            success: true,
            msg: 'Removed successfully.'
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        })
    }
}

const getLastInvoiceNumber = async (req, res) => {
    try {
        let lastInvoice = await InvoiceModel.findOne().sort({ invoice_id: -1 });
        res.json({
            success: true,
            data: lastInvoice ? lastInvoice.invoice_id + 1 : 11231
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
    fetchByNew,
    create,
    update,
    deleteInvoice,
    getLastInvoiceNumber
}