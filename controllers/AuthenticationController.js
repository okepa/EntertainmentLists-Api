const Authentication = require('../models/Authentication');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthenticationController {

    static register(req, res) {
        const saltRounds = 10;
        const plainTextPassword = req.body.password;
        bcrypt.hash(plainTextPassword, saltRounds).then((hash) => {
            // Store hash in your password DB.
            Authentication.create({ username: req.body.username, password: hash, email: req.body.email }, (err, createUser) => {
                if (err) {
                    res.status(400).send(err.message);
                } else {
                    res.status(200).set({ headers: { 'Access-Control-Allow-Origin': '*' } }).send({ success: true });
                }
            });
        });
    }
    static login(req, res) {
        console.log("hello")
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
                                token: token
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
}

module.exports = AuthenticationController;