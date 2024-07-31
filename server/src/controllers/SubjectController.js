const YearModel = require("../models/YearModel");
const SubjectModel = require("../models/SubjectModel");
const QuestionModel = require("../models/QuestionModel");

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let subject = await SubjectModel.findById(id).populate("topics");
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
        let { year_slug, subject_slug } = req.query;
        let year = await YearModel.findOne({ slug: year_slug });
        let subject = await SubjectModel.findOne({
            year: year._id,
            slug: subject_slug,
        }).populate({
            path: "modules",
            options: {
                sort: {
                    no: 1
                }
            }
        }).sort('no');

        if (subject == null) {
            res.json({
                status: false,
                msg: "Subject does not exist for this slug."
            });
            return;
        }

        let questions = await QuestionModel.find({
            subject: subject._id
        });

        res.json({
            status: true,
            data: subject,
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