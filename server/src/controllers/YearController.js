const YearModel = require("../models/YearModel");

const fetch = async (req, res) => {
    try {
        let years = await YearModel.find().populate({
            path: "subjects",
            options: {
                sort: {
                    no: 1
                }
            }
        }).sort('no');
        res.json({
            success: true,
            data: years
        });
    } catch (err) {
        res.json({
            success: false,
            msg: err.message
        });
    }
}

module.exports = {
    fetch
}