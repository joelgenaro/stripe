const mongoose = require('mongoose');

const EmailVerifySchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const EmailVerify = mongoose.model('EmailVerify', EmailVerifySchema);

module.exports = EmailVerify;