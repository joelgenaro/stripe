const YearModel = require("../../models/YearModel");
const SubjectModel = require("../../models/SubjectModel");
const ModuleModel = require("../../models/ModuleModel");
const TopicModel = require("../../models/TopicModel");
const SubTopicModel = require("../../models/SubTopicModel");
const SeoModel = require("../../models/SeoModel");
const PurchasedSubjectHistoryModel = require("../../models/PurchasedSubjectHistoryModel");
const { slugify } = require("../../services/helper");
const { findOne } = require("../../models/SubjectModel");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await SubjectModel.find({
        name: new RegExp(search, "i")
    }).count();
    let data = await SubjectModel.find({
        name: new RegExp(search, "i")
    }).populate({
        path: "year",
        options: {
            sort: sort
        }
    }).sort(sort).skip((page - 1) * length).limit(length);

    res.json({
        data,
        totalCount
    });
}

const create = async (req, res) => {
    try {
        let subject = req.body;

        // Check old order is exist
        let oldSubject = await SubjectModel.findOne({
            no: subject.no,
            year: subject.year
        });
        console.log(oldSubject);
        if (oldSubject != null) {
            res.json({
                status: false,
                msg: "Subject already exists for this order."
            });
            return;
        }

        subject.slug = slugify(subject.name);
        let result = await SubjectModel.create(subject);

        // Create New Metadata
        let subjectOne = await SubjectModel.findById(result._id).populate({
            path: "year",
            select: { _id: 1, name: 1, slug: 1 }
        });
        let seo = {
            subtopic: subjectOne._id,
            slug: subjectOne.year.slug + "/" + subjectOne.slug,
            title: subjectOne.year.name + "/" + subjectOne.name,
            author: "AnswerSheet Pty Ltd",
            keywords: `${subjectOne.name}, HSC notes, HSC study guide, syllabus summaries, dot point notes`,
            description: `${subjectOne.name}`,
            summary: "HSC study guide",
            viewport: "width=device-Width, initial",
            other: ""
        };
        SeoModel.create(seo);

        // Update Year
        const year = await YearModel.findById(subject.year);
        year.subjects.push(result);
        await year.save();
        res.json({
            status: true,
            data: result,
            msg: "Successfully created."
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let subject = await SubjectModel.findById(id).populate({
            path: "year",
            select: { _id: 1, no: 1 }
        });
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

const update = async (req, res) => {
    try {
        let { id } = req.params;
        let subject = req.body;

        // Check order is already exist.
        let oldSubject = await SubjectModel.findOne({
            no: subject.no,
            year: subject.year
        });
        if (oldSubject != null && oldSubject._id != id) {
            res.json({
                status: false,
                msg: "Subject already exists for this order."
            });
            return;
        }

        let result = await SubjectModel.findById(id);
        let oldSubjectSlug = slugify(result.name);
        let year = await YearModel.findById(result.year);
        year.subjects.pull(id);
        await year.save();
        subject.slug = slugify(subject.name);
        result = await result.update(subject);
        year = await YearModel.findById(subject.year);
        year.subjects.push(id);
        await year.save();

        // Update seo slug.
        let newSubjectSlug = slugify(subject.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;

        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 1 && subSlugs[1] == oldSubjectSlug) {
                let newSlug = newSubjectSlug;
                let subSlugLen = subSlugs.length;

                newSlug = subSlugs[0] + "/" + newSlug;
                for (k = 2; k < subSlugLen; k++)
                    newSlug = newSlug + "/" + subSlugs[k];

                seo.slug = newSlug;
                await SeoModel.findByIdAndUpdate(seo._id, seo);
            }
        }

        res.json({
            status: true,
            data: result,
            msg: "Successfully updated."
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const remove = async (req, res) => {
    try {
        let { id } = req.params;
        let modules = await ModuleModel.find({ subject: id }).select({ _id: true });
        let moduleIds = modules.map(module => module._id);
        let topics = await TopicModel.find({ modules: { $in: moduleIds } }).select({ _id: true });
        let topicIds = topics.map(topic => topic._id);

        // Check if any dependent children (module).
        let subjectObj = await SubjectModel.findById(id).populate({
            path: 'modules'
        });
        if (subjectObj.modules.length > 0) {
            return res.json({
                status: false,
                msg: "Unable to delete - please remove all dependent modules and try again."
            });
        }

        // Check if any dependent children (seo).
        let subjectSlug = slugify(subjectObj.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;
        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 1 && subSlugs[1] == subjectSlug) {
                return res.json({
                    status: false,
                    msg: "Unable to delete - please remove all dependent seos and try again."
                });
            }
        }

        // Check if any dependent children (subject).
        let purHistories = await PurchasedSubjectHistoryModel.find({
            subject: subjectObj._id
        });
        console.log(purHistories);
        if (purHistories.length > 0) {
            return res.json({
                status: false,
                msg: "Unable to delete - please remove all dependent memberships and try again."
            });
        }

        let subject = await SubjectModel.findByIdAndDelete(id);
        let year = await YearModel.findById(subject.year);
        year.subjects.pull(id);
        await year.save();

        await ModuleModel.deleteMany({ subject: id });
        await TopicModel.deleteMany({ module: { $in: moduleIds } });
        await SubTopicModel.deleteMany({ topic: { $in: topicIds } });

        res.json({
            status: true,
            data: subject,
            msg: "Successfully deleted."
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}
module.exports = {
    fetch,
    create,
    fetchById,
    update,
    remove
}