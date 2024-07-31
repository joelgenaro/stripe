const YearModel = require("../../models/YearModel");
const ModuleModel = require("../../models/ModuleModel");
const TopicModel = require("../../models/TopicModel");
const SubTopicModel = require("../../models/SubTopicModel");
const QuestionModel = require("../../models/QuestionModel");
const { getMainUrl, slugify } = require("../../services/helper");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await QuestionModel.find({
        name: new RegExp(search, "i")
    }).count();

    let data = await QuestionModel.find({
        name: new RegExp(search, "i")
    }).populate({
        path: 'year',
        select: { name: 1, slug: 1 }
    }).populate({
        path: 'subject',
        select: { name: 1, slug: 1 }
    }).populate({
        path: "modules",
        select: { name: 1, slug: 1 }
    }).populate({
        path: "topics",
        select: { name: 1, slug: 1 }
    }).populate({
        path: "subtopics",
        select: { name: 1, slug: 1 }
    }).sort(sort).skip((page - 1) * length).limit(length);

    res.json({
        data,
        totalCount
    })
}

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let question = await QuestionModel.findById(id);

        let years = await YearModel.find().select({ _id: 1, name: 1 }).populate({
            path: "subjects",
            select: { _id: 1, name: 1 }
        });

        let modules = await ModuleModel.find().select({ _id: 1, name: 1, subject: 1 });
        for (let i in modules) {
            modules[i] = {
                _id: modules[i]._id,
                name: modules[i].name,
                subject: modules[i].subject,
                checked: false,
                shown: false,
            }
        }
        let topics = await TopicModel.find().select({ _id: 1, name: 1, module: 1 });
        for (let i in topics) {
            topics[i] = {
                _id: topics[i]._id,
                name: topics[i].name,
                module: topics[i].module,
                checked: false,
                shown: false,
            }
        }
        let subtopics = await SubTopicModel.find().select({ _id: 1, name: 1, topic: 1 });
        for (let i in subtopics) {
            subtopics[i] = {
                _id: subtopics[i]._id,
                name: subtopics[i].name,
                topic: subtopics[i].topic,
                checked: false,
                shown: false,
            }
        }

        res.json({
            success: true,
            years: years,
            modules: modules,
            topics: topics,
            subtopics: subtopics,
            question: question
        })
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const create = async (req, res) => {
    try {
        let question = req.body;
        await QuestionModel.create(question);
        res.json({
            success: true,
            msg: "Successfully created."
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const update = async (req, res) => {
    try {
        let { id } = req.params;
        let question = req.body;
        let result = await QuestionModel.findById(id);

        result = await result.update(question);

        res.json({
            success: true,
            data: result,
            msg: "Successfully updated."
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await QuestionModel.findByIdAndDelete(id);
        res.json({
            success: true,
            msg: "Successfully deleted."
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const fetchParents = async (req, res) => {
    let years = await YearModel.find().select({ _id: 1, name: 1 }).populate({
        path: "subjects",
        select: { _id: 1, name: 1 }
    });

    let modules = await ModuleModel.find().select({ _id: 1, name: 1, subject: 1 });
    for (let i in modules) {
        modules[i] = {
            _id: modules[i]._id,
            name: modules[i].name,
            subject: modules[i].subject,
            checked: false,
            shown: false,
        }
    }
    let topics = await TopicModel.find().select({ _id: 1, name: 1, module: 1 });
    for (let i in topics) {
        topics[i] = {
            _id: topics[i]._id,
            name: topics[i].name,
            module: topics[i].module,
            checked: false,
            shown: false,
        }
    }
    let subtopics = await SubTopicModel.find().select({ _id: 1, name: 1, topic: 1 });
    for (let i in subtopics) {
        subtopics[i] = {
            _id: subtopics[i]._id,
            name: subtopics[i].name,
            topic: subtopics[i].topic,
            checked: false,
            shown: false,
        }
    }

    return res.json({
        years: years,
        modules: modules,
        topics: topics,
        subtopics: subtopics
    });
}

const uploadImage = (req, res) => {
    res.json({
        location: getMainUrl(req) + `/uploads/questions/${req.file.filename}`,
    });
}

module.exports = {
    fetch,
    fetchById,
    create,
    update,
    uploadImage,
    remove,
    fetchParents
}