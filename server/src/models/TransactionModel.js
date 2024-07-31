const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: "AUD"
    },
    type: {
        type: String,
        enum: ['paypal', 'stripe', 'afterpay'],
        default: 'paypal'
    },
    note: {
        type: String
    }
},  {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;