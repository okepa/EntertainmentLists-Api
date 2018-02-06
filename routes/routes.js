const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const indexController = require("../controllers/indexController");
const authenticationController = require("../controllers/AuthenticationController");

router.get("/", indexController.showIndex);

router.route("/register")
    .post(authenticationController.register)

router.route("/login")
    .post(authenticationController.login)

function authentice(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, process.env.JWT, function (err, decoded) {
            if (err) {
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

module.exports = router;