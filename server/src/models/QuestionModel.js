const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema({
    year: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Year'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    modules: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Module',
    },
    topics: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Topic',
    },
    subtopics: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'SubTopic',
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    permission: {
        type: Number,
        default: 0
    },
    syllabusRef: {
        type: String,
    },
    markingCrit: {
        type: String,
    },
    sampleSolution: {
        type: String
    },
    totalMarks: {
        type: Number
    },
    tags: {
        type: mongoose.Schema.Types.Array
    }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;