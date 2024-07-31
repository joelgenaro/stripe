const TopicModel = require("../../models/TopicModel");
const SubTopicModel = require("../../models/SubTopicModel");
const SeoModel = require("../../models/SeoModel");
const { slugify } = require("../../services/helper");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await SubTopicModel.find({
        name: new RegExp(search, "i")
    }).count();

    let data = await SubTopicModel.find({
        name: new RegExp(search, "i")
    }).populate({
        path: "topic",
        select: { _id: 1, name: 1, slug: 1 },
        populate: {
            path: "module",
            select: { _id: 1, name: 1, slug: 1 },
            populate: {
                path: "subject",
                select: { _id: 1, name: 1, slug: 1 },
                populate: {
                    path: "year",
                    select: { _id: 1, name: 1, slug: 1 },
                    sort: sort
                },
                options: {
                    sort: sort
                }
            },
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
    })
}

const create = async (req, res) => {
    try {
        let subTopic = req.body;

        // Check order is already exist.
        const oldSubTopic = await SubTopicModel.findOne({
            no: subTopic.no,
            topic: subTopic.topic
        });
        if (oldSubTopic != null) {
            res.json({
                status: false,
                msg: "Order number already exists."
            });
            return;
        }

        subTopic.slug = slugify(subTopic.name);
        let topic = await TopicModel.findById(subTopic.topic).populate({
            path: "module",
            select: { name: true },
            populate: {
                path: "subject",
                select: { name: true },
                populate: {
                    path: "year",
                    select: { name: true }
                }
            }
        });
        subTopic.meta = {
            title: `${topic.module.subject.name}/${topic.module.name}/${topic.name}/${subTopic.name}`,
            author: "AnswerSheet Pty Ltd",
            keywords: `${topic.module.subject.name}, ${topic.module.name}, ${topic.name}, ${subTopic.name}, HSC notes, HSC study guide, syllabus summaries, dot point notes`,
            description: `${topic.module.subject.name} ${topic.module.name} ${topic.name} ${subTopic.name}`,
            summary: "HSC study guide",
            viewport: "width=device-Width, initial",
            other: ""
        }
        let result = await SubTopicModel.create(subTopic);

        // Create New Meta
        let subTopicOne = await SubTopicModel.findById(result._id).populate({
            path: "topic",
            select: { _id: 1, name: 1, slug: 1 },
            populate: {
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
            }
        });
        let seo = {
            subtopic: subTopicOne._id,
            slug: subTopicOne.topic.module.subject.year.slug + "/" + subTopicOne.topic.module.subject.slug + "/" + subTopicOne.topic.module.slug + "/" + subTopicOne.topic.slug + "/" + subTopicOne.slug,
            title: subTopicOne.topic.module.subject.year.name + "/" + subTopicOne.topic.module.subject.name + "/" + subTopicOne.topic.module.name + "/" + subTopicOne.topic.name + "/" + subTopicOne.name,
            author: "AnswerSheet Pty Ltd",
            keywords: `${subTopicOne.topic.module.subject.name}, ${subTopicOne.topic.module.name}, ${subTopicOne.topic.name}, ${subTopicOne.name}, HSC notes, HSC study guide, syllabus summaries, dot point notes`,
            description: `${subTopicOne.topic.module.subject.name} ${subTopicOne.topic.module.name} ${subTopicOne.topic.name} ${subTopicOne.name}`,
            summary: "HSC study guide",
            viewport: "width=device-Width, initial",
            other: ""
        };
        SeoModel.create(seo);

        // Update Topic
        topic = await TopicModel.findById(subTopic.topic);
        topic.subTopics.push(result);
        await topic.save();

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

const fetchById = async (req, res) => {
    try {
        let { id } = req.params;
        let subTopic = await SubTopicModel.findById(id).populate({
            path: "topic",
            select: { _id: 1, name: 1 },
            populate: {
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
            }
        });
        res.json({
            success: true,
            data: subTopic
        })
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
        let subTopic = req.body;

        // Check order is already exist.
        let oldSubTopic = await SubTopicModel.findOne({
            no: subTopic.no,
            topic: subTopic.topic
        });
        if (oldSubTopic != null && oldSubTopic._id != id) {
            res.json({
                status: false,
                msg: "Order number already exists."
            });
            return;
        }

        let result = await SubTopicModel.findById(id);
        let oldSubTopicSlug = slugify(result.name);

        let topic = await TopicModel.findById(result.topic);
        topic.subTopics.pull(id);
        await topic.save();

        subTopic.slug = slugify(subTopic.name);
        result = await result.update(subTopic);

        topic = await TopicModel.findById(subTopic.topic);
        topic.subTopics.push(id);
        await topic.save();

        // Update seo slug.
        let newSubTopicSlug = slugify(subTopic.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;

        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 4 && subSlugs[4] == oldSubTopicSlug) {
                let newSlug = newSubTopicSlug;
                let subSlugLen = subSlugs.length;

                newSlug = subSlugs[0] + "/" + subSlugs[1] + "/" + subSlugs[2] + "/" + subSlugs[3] + "/" + newSlug;
                seo.slug = newSlug;
                await SeoModel.findByIdAndUpdate(seo._id, seo);
            }
        }

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

        // Check if any dependent children (seo).
        let subTopicObj = await SubTopicModel.findById(id);
        let subTopicSlug = slugify(subTopicObj.name);
        let seos = await SeoModel.find();
        let seoCnt = seos.length;
        for (let i = 0; i < seoCnt; i++) {
            let seo = seos[i];
            let subSlugs = seo.slug.split("/");
            if (subSlugs.length > 4 && subSlugs[4] == subTopicSlug) {
                return res.json({
                    status: false,
                    msg: "Unable to delete - please remove all dependent seos and try again."
                });
            }
        }

        const subTopic = await SubTopicModel.findByIdAndDelete(id);
        const topic = await TopicModel.findById(subTopic.topic);
        topic.subTopics.pull(id);
        await topic.save();
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

module.exports = {
    fetch,
    create,
    fetchById,
    update,
    remove
}