const Authentication = require('../models/Authentication');
const ObjectId = require('mongoose').Types.ObjectId;

class UsersController {
    static getAllUsers(req, res){
        var _id;
        if(req.headers["username-id"] == "null") _id = new ObjectId(null);
        else _id = new ObjectId(req.headers['username-id']);
        Authentication.find({_id: {$ne: {_id}}}).select('_id username').exec((err, users) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({ 
                    users: users
                });
            }
        })
    }

    static getUser(req, res){
        Authentication.find({}, (err, user) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({ 
                    user: user
                });
            }
        })
    }
}

module.exports = UsersController;