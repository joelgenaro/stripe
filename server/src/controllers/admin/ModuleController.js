const SubjectModel = require("../../models/SubjectModel");
const SeoModel = require("../../models/SeoModel");
const ModuleModel = require("../../models/ModuleModel");
const TopicModel = require("../../models/TopicModel");
const SubTopicModel = require("../../models/SubTopicModel");

const { slugify } = require("../../services/helper");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {}
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await ModuleModel.find({
        name: new RegExp(search, "i")
    }).count();

    let data = await ModuleModel.find({
        name: RegExp(search, "i")
    }).populate({
        path: "subject",
        select: { _id: 1, name: 1 },
        populate: {
            path: "year",
            select: { _id: 1, name: 1 },
            options: {
                sort: sort
            }
        },
        options: {
            sort: sort
        }
    }).sort(sort)
        .skip((page - 1) * length)
        .limit(length);

    res.json({
        data,
        totalCount
    });
}

const create = async (req, res) => {
    try {
        let module = req.body;

        // Check order is already exist.
        var oldModule = await ModuleModel.findOne({
            no: module.no,
            subject: module.subject
        });
        if (oldModule != null) {
            res.json({
                status: false,
                msg: "Module already exists for this order."
            });
            return;
        }

        module.slug = slugify(module.name);
        let result = await ModuleModel.create(module);

        // Create New Metadata
        let moduleOne = await ModuleModel.findById(result._id).populate({
            path: "subject",
            select: { _id: 1, name: 1, slug: 1 },
            populate: {
                path: "year",
                select: { _id: 1, name: 1, slug: 1 }
            }
        });
        let seo = {
            subtopic: moduleOne._id,
            slug: moduleOne.subject.year.slug + "/" + moduleOne.subject.slug + "/" + moduleOne.slug,
            title: moduleOne.subject.year.name + "/" + moduleOne.subject.name + "/" + moduleOne.name,
            author: "AnswerSheet Pty Ltd",
            keywords: `${moduleOne.subject.name}, ${moduleOne.name}, HSC notes, HSC study guide, syllabus summaries, dot point notes`,
            description: `${moduleOne.subject.name} ${moduleOne.name}`,
            summary: "HSC study guide",
            viewport: "width=device-Width, initial",
            other: ""
        };
        SeoModel.create(seo);

        // Update Subject
        const subject = await SubjectModel.findById(result.subject);
        subject.modules.push(result);
        await subject.save();

        res.json({
            status: true,
            msg: "Successfully created.",
            data: result
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
        let module = await ModuleModel.findById(id).populate({
            path: "subject",
            select: { _id: 1, name: 1 },
            populate: {
                path: "year",
                select: { _id: 1, name: 1 }
            }
        });
        res.json({
            status: true,
            data: module
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
        let module = req.body;

        // Check order is already exist.
        let oldModule = await ModuleModel.findOne({
            no: module.no,
            subject: module.subject
        });
        if (oldModule != null && oldModule._id != id) {
            res.json({
                status: false,
                msg: "Module already exists for this order."
            });
            return;
        }

        let result = await ModuleModel.findById(id);
        let oldModuleSlug = slugify(result.name);

        let subject = await SubjectModel.findById(result.subject);
        subject.modules.pull(id);
        await subject.save();

        module.slug = slugify(module.name);
        result = await result.update(module);

        subject = await SubjectModel.findById(module.subject);
        subject.modules.push(id);
        await subject.save();

        // Update seo slug.
        let newModuleSlug = slugify(module.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;

        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 2 && subSlugs[2] == oldModuleSlug) {
                let newSlug = newModuleSlug;
                let subSlugLen = subSlugs.length;

                newSlug = subSlugs[0] + "/" + subSlugs[1] + "/" + newSlug;
                for (k = 3; k < subSlugLen; k++)
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
        let topics = await TopicModel.find({ module: id });
        let topicIds = topics.map(topic => topic._id);

        // Check if any dependent children (topics)
        let moduleObj = await ModuleModel.findById(id).populate({
            path: 'topics'
        });
        if (moduleObj.topics.length > 0) {
            return res.json({
                status: false,
                msg: "Unable to delete - please remove all dependent topics and try again."
            });
        }

        // Check if any dependent children (seo).
        let moduleSlug = slugify(moduleObj.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;
        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 2 && subSlugs[2] == moduleSlug) {
                return res.json({
                    status: false,
                    msg: "Unable to delete - please remove all dependent seos and try again."
                });
            }
        }

        let module = await ModuleModel.findByIdAndDelete(id);
        let subject = await SubjectModel.findById(module.subject);
        subject.modules.pull(id);
        await subject.save();
        await TopicModel.deleteMany({ module: id });
        await SubTopicModel.deleteMany({ topic: { $in: topicIds } });
        res.json({
            status: true,
            data: module,
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