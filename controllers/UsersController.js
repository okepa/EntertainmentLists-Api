const Authentication = require('../models/Authentication');
const BookList = require('../models/BookList');
const ObjectId = require('mongoose').Types.ObjectId;

class UsersController {
    static getAllUsers(req, res) {
        var _id;
        if (req.headers["username-id"] == "null") _id = new ObjectId(null);
        else _id = new ObjectId(req.headers['username-id']);
        Authentication.find({ _id: { $ne: { _id } } }).select('_id username').exec((err, users) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    users: users
                });
            }
        })
    }

    static searchUsers(req, res) {
        var _id;
        if (req.headers["username-id"] == "null") _id = new ObjectId(null);
        else _id = new ObjectId(req.headers['username-id']);
        Authentication.find({ username: { $regex:  req.body.username }, _id: { $ne: { _id } } }).select('_id username').exec((err, users) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    users: users
                });
            }
        })
    }

    static getProfile(req, res) {
        var usernameId = req.headers["username-id"];
        Authentication.findOne({ _id: usernameId }).select('_id username').exec((err, user) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                BookList.count({ "usernameId": usernameId, "bookStatus": "Reading" }, (err, readingCount) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        BookList.count({ "usernameId": usernameId, "bookStatus": "Read" }, (err, readCount) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                BookList.count({ "usernameId": usernameId, "bookStatus": "Plan To Read" }, (err, planToReadCount) => {
                                    if (err) {
                                        res.status(400).send(err.message);
                                    } else {
                                        BookList.count({ "usernameId": usernameId, "bookStatus": "Abandoned" }, (err, abandonedCount) => {
                                            if (err) {
                                                res.status(400).send(err.message);
                                            } else {
                                                res.status(200).send({
                                                    user: user,
                                                    readingCount: readingCount,
                                                    readCount: readCount,
                                                    planToReadCount: planToReadCount,
                                                    abandonedCount: abandonedCount
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    }

    static getUserProfile(req, res){
        var usernameId = req.query.username;
        Authentication.findOne({ _id: usernameId }).select('_id username').exec((err, user) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                BookList.count({ "usernameId": usernameId, "bookStatus": "Reading" }, (err, readingCount) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        BookList.count({ "usernameId": usernameId, "bookStatus": "Read" }, (err, readCount) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                BookList.count({ "usernameId": usernameId, "bookStatus": "Plan To Read" }, (err, planToReadCount) => {
                                    if (err) {
                                        res.status(400).send(err.message);
                                    } else {
                                        BookList.count({ "usernameId": usernameId, "bookStatus": "Abandoned" }, (err, abandonedCount) => {
                                            if (err) {
                                                res.status(400).send(err.message);
                                            } else {
                                                res.status(200).send({
                                                    user: user,
                                                    readingCount: readingCount,
                                                    readCount: readCount,
                                                    planToReadCount: planToReadCount,
                                                    abandonedCount: abandonedCount
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    }
}

module.exports = UsersController;