const mongoose = require("mongoose");

const MembershipSchema = mongoose.Schema({
    name: {
        type: String
    },
    slug: {
        type: String
    },
    description: {
        type: String
    },
    label: {
        type: String
    },
    period: {
        type: Number
    }
}, {
    timestamps: true
});

const Membership = mongoose.model('Membership', MembershipSchema);

module.exports = Membership;
