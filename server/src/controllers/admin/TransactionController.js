const TransactionModel = require("../../models/TransactionModel");
const User = require("../../models/UserModel");
const moment = require("moment");

const fetch = async (req, res) => {
    let { search, length, page, sortKey, sortDir } = req.query;
    let sort = {};
    if (sortKey) {
        if (sortDir === "desc") sort[sortKey] = -1;
        else sort[sortKey] = 1;
    }
    let totalCount = await TransactionModel.find({
        transaction_id: new RegExp(search, "i")
    }).count();
    let users = await User.find({
        $or: [{
            firstName: new RegExp(search, "i")
        }, {
            lastName: new RegExp(search, "i")
        }]
    }).select({_id: 1});
    let userIds = users.map(user => user._id);

    let data = await TransactionModel.find({
        $or: [{
            transaction_id: new RegExp(search, "i")
        }, {
            user: { $in: userIds }
        }, {
            amount: search
        }, {
            currency: new RegExp(search, "i")
        }, {
            type: new RegExp(search, "i")
        }]
    }).populate({
        path: "user",
        options: {
            sort: sort
        }
    }).sort(sort).skip((page - 1) * length).limit(length);

    res.json({
        data,
        totalCount
    });
}
const getStatistics = async (req, res) => {
    let weeklyTransactions = await TransactionModel.aggregate([{
        $match: {
            createdAt: {
                $gte: moment().startOf("week").toDate(),
                $lte: moment().startOf("week").add(7, "d").toDate()
            }
        }
    }, {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                }
            },
            amount: { 
                $sum: "$amount" 
            }
        }
    }]);
    weeklyStatistics = [];
    for(let i = -6; i <= 0; i++) {
        let date = moment().add(i, "d").format("YYYY-MM-DD");
        let weeklyTransaction = weeklyTransactions.find(transaction => transaction._id === date);
        if (weeklyTransaction) {
            weeklyStatistics.push({ date: date, amount: weeklyTransaction.amount });
        } else {
            weeklyStatistics.push({ date: date, amount: 0 });
        }
    }
    
    let monthlyTransactions = await TransactionModel.aggregate([{
        $match: {
            createdAt: {
                $gte: moment().startOf("year").toDate(),
                $lte: moment().startOf("year").add(1, "y").toDate()
            }
        }
    }, {
        $group: {
            _id: {
                $month: "$createdAt"
            },
            amount: { 
                $sum: "$amount" 
            }
        }
    }]);
    monthlyStatistics = [];
    for (let i = 1; i <= 12; i++) {
        let monthlyTransaction = monthlyTransactions.find(transaction => transaction._id === i);
        if (monthlyTransaction) {
            monthlyStatistics.push({ month: i, amount: monthlyTransaction.amount });
        } else {
            monthlyStatistics.push({ month: i, amount: 0 });
        }
    }

    let annuallyTransactions = await TransactionModel.aggregate([{
        $match: {
            createdAt: {
                $gte: moment().startOf("year").toDate(),
                $lte: moment().startOf("year").add(10, "y").toDate()
            }
        }
    }, {
        $group: {
            _id: {
                $year: "$createdAt"
            },
            amount: { 
                $sum: "$amount" 
            }
        }
    }]);
    annuallyStatistics = [];
    for (let i = -9; i <= 0; i++) {
        let year = moment().add(i, "y").year();
        let annuallyTransaction = annuallyTransactions.find(transaction => transaction._id === year);
        if (annuallyTransaction) {
            annuallyStatistics.push({ year: year, amount: annuallyTransaction.amount });
        } else {
            annuallyStatistics.push({ year: year, amount: 0 });
        }
    }
    res.json({
        weeklyStatistics,
        monthlyStatistics,
        annuallyStatistics
    });
}



module.exports = {
    fetch,
    getStatistics,
}