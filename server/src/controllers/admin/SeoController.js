const SeoModel = require("../../models/SeoModel");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await SeoModel.find({
        title: new RegExp(search, "i")
    }).count();

    let data = await SeoModel.find({
        title: new RegExp(search, "i")
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
        let seo = req.body;
        let oldSeo = await SeoModel.findOne({ slug: seo.slug });
        if (oldSeo !== null) {
            res.json({
                success: false,
                msg: 'SEO setting already exists for this page.'
            });
            return;
        }

        SeoModel.create(seo);

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
        let seo = await SeoModel.findById(id);
        res.json({
            success: true,
            data: seo
        })
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

const fetchByUrl = async (req, res) => {
    try {
        let { url } = req.body;
        console.log(url);
        let seo = await SeoModel.findOne({ slug: url });
        res.json({
            success: true,
            data: seo
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
        let seo = req.body;

        let oldSeo = await SeoModel.findOne({ slug: seo.slug });
        if (oldSeo != null && oldSeo._id != id) {
            res.json({
                success: false,
                msg: 'SEO setting already exists for this page.'
            });
            return;
        }

        let result = await SeoModel.findById(id);
        result = await result.update(seo);

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
        await SeoModel.findByIdAndDelete(id);
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
    fetchByUrl,
    update,
    remove
}