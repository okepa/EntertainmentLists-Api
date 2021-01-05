const Authentication = require('../models/Authentication');
const BookList = require('../models/BookList')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthenticationController {

    static register(req, res) {
        Authentication.findOne({ $or: [{username: req.body.username}, {email: req.body.email}] }, (err, findUser) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                if (findUser == null) {
                    const saltRounds = 10;
                    const plainTextPassword = req.body.password;
                    bcrypt.hash(plainTextPassword, saltRounds).then((hash) => {
                        // Store hash in your password DB.
                        Authentication.create({ username: req.body.username, password: hash, email: req.body.email }, (err, createUser) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                res.status(200).send({ message: "Successfully registered" });
                            }
                        });
                    });
                } else {
                    if(findUser.username = req.body.username){
                        res.status(409).send({ message: "This username already exists" });
                    } else if(findUser.email = req.body.email) {
                        res.status(409).send({ message: "This email has already been used to register" });
                    }
                }
            }
        })
    }

    static login(req, res) {
        // find the user
        Authentication.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Authentication failed. User not found.' });
                } else if (user) {
                    bcrypt.compare(req.body.password, user.password).then((response) => {
                        // check if password matches
                        if (response) {
                            // if user is found and password is right
                            // create a token with only our given payload
                            // we don't want to pass in the entire user since that has the password
                            const payload = {
                            };
                            var token = jwt.sign(payload, process.env.JWT, {
                                expiresIn: '24h' // expires in 24 hours
                            });
                            // return the information including token as JSON
                            res.json({
                                success: true,
                                token: token,
                                usernameId: user._id
                            });
                        } else {
                            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                        }
                    }).catch(err => {
                        res.status(400).send(err.message);
                    });
                }
            }
        });
    }

    static getProfile(req, res) {
        var usernameId = req.headers["username-id"];
        Authentication.findOne({ _id: usernameId }, (err, user) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({ user: user });
            }
        });
    }

    static updateProfile(req, res) {
        var usernameId = req.headers["username-id"];
        Authentication.updateOne({ _id: usernameId }, { "email": req.body.email }, (err, user) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({ message: "Profile has been updated" });
            }
        });
    }
}

module.exports = AuthenticationController;