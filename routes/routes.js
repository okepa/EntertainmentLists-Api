const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const indexController = require("../controllers/indexController");
const authenticationController = require("../controllers/AuthenticationController");
const bookListController = require("../controllers/BookListController");
const booksController = require("../controllers/BooksController");

router.get("/", indexController.showIndex);

router.route("/register")
    .post(authenticationController.register)

router.route("/login")
    .post(authenticationController.login)

router.route("/book-list")
    .get(authentice, bookListController.getBooksList)
    .post(authentice, bookListController.addToBookList)

router.route("/books")
    .get(authentice, booksController.getBookDetails)

router.route("/ratings")
    .get(authentice, booksController.getBookRatings)

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