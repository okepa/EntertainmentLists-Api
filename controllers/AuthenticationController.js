const Authentication = require('../models/Authentication');
const EmailService = require('../services/emailService')
const BookList = require('../models/BookList')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');

class AuthenticationController {

    static register(req, res) {
        Authentication.findOne({ $or: [{username: req.body.username}, {email: req.body.email}] }, (err, findUser) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                if (findUser == null) {
                    const saltRounds = 10;
                    const plainTextPassword = req.body.password;
                    const uuid = uuidv1();
                    bcrypt.hash(plainTextPassword, saltRounds).then((hash) => {
                        // Store hash in your password DB.
                        Authentication.create({ username: req.body.username, password: hash, email: req.body.email, validated: false, activationCode: uuid }, (err, createUser) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                //Send Confirmation Email
                                EmailService.sendRegistrationConfirmationEmail(req.body.username, req.body.email, uuid).then((response) => {
                                    res.status(200).send({ message: "Email sent" });
                                }).catch((err) => {
                                    res.status(400).send(err.message);
                                });
                            }
                        });
                    });
                } else {
                    if(findUser.username == req.body.username){
                        res.status(409).send({ message: "This username already exists" });
                    } else if(findUser.email == req.body.email) {
                        res.status(409).send({ message: "This email has already been used to register" });
                    }
                }
            }
        })
    }

    static validateAccount(req, res) {
        Authentication.findOneAndUpdate({validationCode: req.query.validationcode}, {$set: {active: true}}, (err, user) => {
            if(err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({ message: "Successfully activated account" });
            }
        });
    }

    static forgottenPassword(req, res) {
        //Check if the username and email belong to one account and the email is validated
        Authentication.findOne({username: req.body.username, email: req.body.email, validated: true}, (err, user) => {
            if(err){
                res.status(400).send(err.message);
            } else {
                if(user != null){
                    const uuid = uuidv1();
                    bcrypt.hash(uuid).then((hash) => {
                        Authentication.updateOne({username: req.body.username, email: req.body.email}, {$set: {forgottenPasswordCode: hash}}, (err, updateUser) => {
                            if(err){
                                res.status(400).send(err.message);
                            } else {
                                EmailService.sendForgottenPasswordEmail(req.body.username, req.body.email, uuid).then(response => {
                                    res.status(200).send({ message: "Email sent" });
                                }).catch(err => {
                                    res.status(400).send(err.message);
                                });
                            }
                        });
                });
                } else {
                    res.status(401).send({ message: "The email account does not exist for this username or the email account has not been validated"});
                }
            }
        });  
    }

    static changePassword(res, res) {
        Authentication.findOneAndUpdate({username: req.body.username}, {$set: {password: res.body.password}}, (err, user) => {
            if(err){
                res.status(400).send(err.message);
            } else {
                res.status(200).send({ message: "Email updated" });
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