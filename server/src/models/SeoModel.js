const mongoose = require("mongoose");

const SeoSchema = mongoose.Schema({
    subtopic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTopic'
    },
    slug: {
        type: String,
        required: true
    },
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
    viewport: {
        type: String
    },
    summary: {
        type: String
    },
    othername: {
        type: String
    },
    othercontent: {
        type: String
    }
});

const Seo = mongoose.model('Seo', SeoSchema);

module.exports = Seo;