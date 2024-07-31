const YearModel = require("../models/YearModel");
const SubjectModel = require("../models/SubjectModel");
const ModuleModel = require("../models/ModuleModel");
const TopicModel = require("../models/TopicModel");
const QuestionModel = require("../models/QuestionModel");

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let topic = await TopicModel.findById(id).populate("subTopics");
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
        let { year_slug, subject_slug, module_slug, topic_slug } = req.query;
        let year = await YearModel.findOne({ slug: year_slug }).select("_id");
        let subject = await SubjectModel.findOne({ year: year._id, slug: subject_slug }).select("_id");
        let module = await ModuleModel.findOne({ subject: subject._id, slug: module_slug }).select("_id");
        let topic = await TopicModel.findOne({ module: module._id, slug: topic_slug }).populate({
            path: "subTopics",
            options: {
                sort: {
                    no: 1
                }
            }
        }).sort('no');

        let questions = await QuestionModel.find({
            topics: { $in: [topic._id] }
        });

        res.json({
            success: true,
            data: topic,
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