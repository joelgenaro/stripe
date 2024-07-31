const mongoose = require("mongoose");

const PricingSchema = mongoose.Schema({
    period: {
        type: String
    },
    subject_nums: {
        type: String
    },
    price: {
        type: String
    }
}, {
    timestamps: true
});

const Pricing = mongoose.model('Pricing', PricingSchema);

module.exports = Pricing;