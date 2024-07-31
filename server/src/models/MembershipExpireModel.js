const mongoose = require('mongoose');

const MembershipExpireSchema = mongoose.Schema({
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
    period: {
        type: String
    },
    expireDate: {
        type: Date,
    }
});

const MembershipExpire = mongoose.model("MembershipExpire", MembershipExpireSchema);

module.exports = MembershipExpire;