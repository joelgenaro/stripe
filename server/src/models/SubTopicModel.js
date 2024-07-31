const mongoose = require("mongoose");

const SubTopicSchema = mongoose.Schema({
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
    content: {
        type: String,
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    meta: {
        title: {
            type: String
        },
        description: {
            type: String
        },
        keywords: {
            type: String
        },
        author: {
            type: String
        },
        summary: {
            type: String
        },
        summary: {
            type: String
        },
        viewport: {
            type: String
        },
        other: {
            type: String
        }
    },
    permission: {
        type: Number,
        default: 0
    }
});

const SubTopic = mongoose.model('SubTopic', SubTopicSchema);

module.exports = SubTopic;