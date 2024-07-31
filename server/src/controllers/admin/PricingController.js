const PricingModel = require("../../models/PricingModel");

const create = async (req, res) => {
    try {
        let pricing = req.body;
        let isExist = await PricingModel.find({ period: pricing.period, subject_nums: pricing.subject_nums }).count();
        if (isExist) {
            res.json({
                status: false,
                msg: "The membership is already defined."
            });
        } else {
            await PricingModel.create(pricing);
            res.json({
                status: true,
                msg: "Successfully created."
            });
        }
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const fetch = async (req, res) => {
    try {
        let { search, length, page, sortKey, sortDir } = req.query;
        let sort = {};
        if (sortKey) {
            if (sortDir === "desc") sort[sortKey] = -1;
            else sort[sortKey] = 1;
        }
        let totalCount = await PricingModel.find({
            $or: [{
                period: new RegExp(search, "i")
            }, {
                subject_nums: new RegExp(search, "i")
            }, {
                price: new RegExp(search, "i")
            }]
        }).count();
        let prices = await PricingModel.find({
            $or: [{
                period: new RegExp(search, "i")
            }, {
                subject_nums: new RegExp(search, "i")
            }, {
                price: new RegExp(search, "i")
            }]
        }).sort(sort).skip((page - 1) * length).limit(length);
        res.json({
            totalCount,
            data: prices
        });
    } catch (err) {
        res.json({
            status: false,
            msg: err.message
        });
    }
}

const fetchById = async (req, res) => {
    let { id } = req.params;
    let pricing = await PricingModel.findById(id);
    res.json(pricing);
}

const update = async (req, res) => {
    try {
        let { id } = req.params;
        let pricing = req.body;
        let result = await PricingModel.findByIdAndUpdate(id, pricing);
        res.json({
            status: true,
            msg: "Successfully updated.",
            data: result
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
        let result = await PricingModel.findByIdAndDelete(id);
        res.json({
            status: true,
            data: result,
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
    create,
    fetch,
    fetchById,
    update,
    remove
}