const ModuleModel = require("../../models/ModuleModel");
const SeoModel = require("../../models/SeoModel");
const TopicModel = require("../../models/TopicModel");
const SubTopicModel = require("../../models/SubTopicModel");
const { slugify } = require("../../services/helper");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await TopicModel.find({
        name: new RegExp(search, "i")
    }).count();

    let data = await TopicModel.find({
        name: new RegExp(search, "i")
    })
        .populate({
            path: "module",
            select: { _id: 1, name: 1 },
            populate: {
                path: "subject",
                select: { _id: 1, name: 1 },
                options: {
                    sort: sort
                },
                populate: {
                    path: "year",
                    select: { _id: 1, name: 1 },
                    options: {
                        sort: sort
                    }
                }
            },
            options: {
                sort: sort
            }
        })
        .sort(sort)
        .skip((page - 1) * length)
        .limit(length);
    res.json({
        data,
        totalCount
    });
}

const create = async (req, res) => {
    try {
        let topic = req.body;

        // Check old order is already exist.
        let oldTopic = await TopicModel.findOne({
            no: topic.no,
            module: topic.module
        });
        if (oldTopic != null) {
            res.json({
                status: false,
                msg: "Topic already exists for this order."
            });
            return;
        }

        topic.slug = slugify(topic.name);
        let result = await TopicModel.create(topic);

        // Create New Metadata
        let topicOne = await TopicModel.findById(result._id).populate({
            path: "module",
            select: { _id: 1, name: 1, slug: 1 },
            populate: {
                path: "subject",
                select: { _id: 1, name: 1, slug: 1 },
                populate: {
                    path: "year",
                    select: { _id: 1, name: 1, slug: 1 }
                }
            }
        });
        let seo = {
            subtopic: topicOne._id,
            slug: topicOne.module.subject.year.slug + "/" + topicOne.module.subject.slug + "/" + topicOne.module.slug + "/" + topicOne.slug,
            title: topicOne.module.subject.year.name + "/" + topicOne.module.subject.name + "/" + topicOne.module.name + "/" + topicOne.name,
            author: "AnswerSheet Pty Ltd",
            keywords: `${topicOne.module.subject.name}, ${topicOne.module.name}, ${topicOne.name}, HSC notes, HSC study guide, syllabus summaries, dot point notes`,
            description: `${topicOne.module.subject.name} ${topicOne.module.name} ${topicOne.name}`,
            summary: "HSC study guide",
            viewport: "width=device-Width, initial",
            other: ""
        };
        SeoModel.create(seo);

        // Update Module
        const module = await ModuleModel.findById(result.module);
        module.topics.push(result);
        await module.save();

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
        let topic = await TopicModel.findById(id).populate({
            path: "module",
            select: { _id: 1, name: 1 },
            populate: {
                path: "subject",
                select: { _id: 1, name: 1 },
                populate: {
                    path: "year",
                    select: { _id: 1, name: 1 }
                }
            }
        });
        res.json({
            status: true,
            data: topic
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
        let topic = req.body;

        // Check order is already exist.
        let oldOrder = await TopicModel.findOne({
            no: topic.no,
            module: topic.module
        });
        if (oldOrder != null && oldOrder._id != id) {
            res.json({
                status: false,
                msg: "Topic already exists for this order."
            });
            return;
        }

        let result = await TopicModel.findById(id);
        let oldTopicSlug = slugify(result.name);

        let module = await ModuleModel.findById(result.module);
        module.topics.pull(id);
        await module.save();

        topic.slug = slugify(topic.name);
        result = await result.update(topic);

        module = await ModuleModel.findById(topic.module);
        module.topics.push(id);
        await module.save();

        // Update seo slug.
        let newTopicSlug = slugify(topic.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;

        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 3 && subSlugs[3] == oldTopicSlug) {
                let newSlug = newTopicSlug;
                let subSlugLen = subSlugs.length;

                newSlug = subSlugs[0] + "/" + subSlugs[1] + "/" + subSlugs[2] + "/" + newSlug;
                for (k = 4; k < subSlugLen; k++)
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

        // Check if any dependent children (subTopic)
        let topicObj = await TopicModel.findById(id).populate({
            path: 'subTopics'
        });
        if (topicObj.subTopics.length > 0) {
            return res.json({
                status: false,
                msg: "Unable to delete - please remove all dependent subtopics and try again."
            });
        }

        // Check if any dependent children (seo).
        let topicSlug = slugify(topicObj.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;
        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 3 && subSlugs[3] == topicSlug) {
                return res.json({
                    status: false,
                    msg: "Unable to delete - please remove all dependent seos and try again."
                });
            }
        }

        let topic = await TopicModel.findByIdAndDelete(id);
        let module = await ModuleModel.findById(topic.module);
        module.topics.pull(id);
        await module.save();

        await SubTopicModel.deleteMany({ topic: id })
        res.json({
            status: true,
            data: topic,
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