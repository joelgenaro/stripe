const YearModel = require("../models/YearModel");
const SubjectModel = require("../models/SubjectModel");
const TopicModel = require("../models/TopicModel");
const SubTopicModel = require("../models/SubTopicModel");
const QuestionModel = require("../models/QuestionModel");

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let topic = await SubTopicModel.findById(id);
        res.json({
            success: true,
            data: topic
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const fetchBySlug = async (req, res) => {
    try {
        let { year_slug, subject_slug, module_slug, topic_slug, subtopic_slug } = req.query;
        let year = await YearModel.findOne({ slug: year_slug }).select("_id");
        let subject = await SubjectModel.findOne({ year: year._id, slug: subject_slug }).select("_id");
        let topic = await TopicModel.findOne({ subject: subject._id, slug: topic_slug }).select("_id");
        let subtopic = await SubTopicModel.findOne({ topic: topic._id, slug: subtopic_slug }).sort('no');
        let subtopics = await SubTopicModel.find({ topic: topic._id }).sort("no");
        let cnt = subtopics.length;
        let prevIdx = 0;
        let nextIdx = 0;
        let idx = 0;
        for (let i = 0; i < cnt; i++) {
            if (subtopics[i]._id.equals(subtopic._id)) {
                idx = i;
                break;
            }
        }

        if (idx == 0) {
            if (subtopics.length == 1) {
                prevIdx = 0;
                nextIdx = 0;
            } else {
                prevIdx = subtopics.length - 1;
                nextIdx = 1;
            }
        } else if (idx == subtopics.length - 1) {
            prevIdx = idx - 1;
            nextIdx = 0;
        } else {
            prevIdx = idx - 1;
            nextIdx = idx + 1;
        }

        let nextSubtopic = subtopics[nextIdx];
        let prevSubtopic = subtopics[prevIdx];

        let questions = await QuestionModel.find({
            subtopics: { $in: [subtopic._id] }
        });

        res.json({
            success: true,
            data: subtopic,
            nextSubtopic: nextSubtopic,
            prevSubtopic: prevSubtopic,
            subject: subject,
            questions: questions
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

module.exports = {
    fetchById,
    fetchBySlug
}