const YearModel = require("../models/YearModel");
const SubjectModel = require("../models/SubjectModel");
const ModuleModel = require("../models/ModuleModel");
const QuestionModel = require("../models/QuestionModel");

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let subject = await ModuleModel.findById(id).populate("topics");
        res.json({
            status: true,
            data: subject
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const fetchBySlug = async (req, res) => {
    try {
        let { year_slug, subject_slug, module_slug } = req.query;
        let year = await YearModel.findOne({ slug: year_slug }).select({ _id: true });
        let subject = await SubjectModel.findOne({ year: year._id, slug: subject_slug }).select({ _id: true });
        let module = await ModuleModel.findOne({
            subject: subject._id,
            slug: module_slug
        }).populate({
            path: "topics",
            options: {
                sort: {
                    no: 1
                }
            }
        }).sort('no');

        let questions = await QuestionModel.find({
            modules: { $in: [module._id] }
        });

        res.json({
            status: true,
            data: module,
            questions: questions
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
} 

module.exports = {
    fetchById,
    fetchBySlug
}