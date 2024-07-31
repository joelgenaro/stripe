const mongoose = require("mongoose");

const ModuleSchema = mongoose.Schema({
    no: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }]
}, {
    timestamps: true
});

const Module = mongoose.model("Module", ModuleSchema);

module.exports = Module;