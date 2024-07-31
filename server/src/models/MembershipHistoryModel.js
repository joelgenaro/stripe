const mongoose = require("mongoose");

const MembershipHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    },
    subjects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Subject',
        required: true
    },
    membership_id: {
        type: String,
    },
    period: {
        type: String
    },
    price: {
        type: String
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    expiredDate: {
        type: Date
    }
}, {
    timestamps: true
});

const MembershipHistory = mongoose.model('MembershipHistory', MembershipHistorySchema);

module.exports = MembershipHistory;