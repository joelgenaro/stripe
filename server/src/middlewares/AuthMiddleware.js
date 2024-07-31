const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const normalMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "a1A!s2S@d3D#f4F$", (err, user) => {
            if (!err) req.user = user;
        });
    }
    next();
}

const userMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "a1A!s2S@d3D#f4F$", (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "a1A!s2S@d3D#f4F$", async (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            user = await UserModel.findById(user.userId);
            if (user.role < 2) return res.sendStatus(406);
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
const staffMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, "a1A!s2S@d3D#f4F$", async (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            user = await UserModel.findById(user.userId);
            if (user.role < 1) return res.sendStatus(406);
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    normalMiddleware,
    userMiddleware,
    staffMiddleware,
    adminMiddleware
}