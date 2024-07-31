const MessageModel = require("../../models/MessageModel");

const getNewMessageNums = async (req, res) => {
    let newMsgNums = await MessageModel.find({
        isRead: false
    }).count();
    res.json(newMsgNums);
}

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {}
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }

    let totalCount = await MessageModel.find()
        .or([{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }, { message: new RegExp(search, "i") }])
        .count();

    let data = await MessageModel.find()
        .or([{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }, { message: new RegExp(search, "i") }])
        .sort(sort)
        .skip((page - 1) * length)
        .limit(length);

    res.json({
        data, totalCount
    });
}

const update = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let message = await MessageModel.findByIdAndUpdate(id, data);
        res.json({
            success: true,
            data: message
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
        let { id } = req.params;
        let messeage = await MessageModel.findByIdAndDelete(id);
        res.json({
            success: true,
            msg: "Successfully deleted."
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

module.exports = {
    getNewMessageNums,
    fetch,
    update,
    remove
}