const mongoose = require("mongoose");

const PurchasedSubjectHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    },
    period: {
        type: String
    },
    expiredDate: {
        type: Date
    }
}, {
    timestamps: true
});

const PurchasedSubjectHistory = mongoose.model('PurchasedSubjectHistory', PurchasedSubjectHistorySchema);

module.exports = PurchasedSubjectHistory;