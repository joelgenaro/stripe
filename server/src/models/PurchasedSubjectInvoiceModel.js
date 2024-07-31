const mongoose = require("mongoose");

const PurchasedSubjectInvoiceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    invoice_id: {
        type: Number
    },
    item_name: {
        type: String,
        required: false
    },
    item_description: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "AUD"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paid_date: {
        type: Date,
        required: true
    },
    company: {
        type: String,
        default: "AnswerSheet Pty Ltd"
    },
    phone: {
        type: String,
        default: "665 324 541"
    },
    address: {
        type: String,
        default: "41 Larissa Court, Iraak, Victoria, Australia"
    },
    email: {
        type: String,
        match: /.+\@.+\..+/,
        default: "hongomg@gmail.com"
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Invoice = mongoose.model('PurchasedSubjectInvoice', PurchasedSubjectInvoiceSchema);

module.exports = Invoice;