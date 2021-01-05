const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const indexController = require("../controllers/indexController");
const authenticationController = require("../controllers/AuthenticationController");
const bookListController = require("../controllers/BookListController");
const booksController = require("../controllers/BooksController");
const usersController = require("../controllers/UsersController")

router.get("/", indexController.showIndex);

router.route("/register")
    .post(authenticationController.register)

router.route("/login")
    .post(authenticationController.login)

router.route("/user-information")
    .get(authenticate, authenticationController.getProfile)
    .post(authenticate, authenticationController.updateProfile)

router.route("/profile")
    .get(authenticate, usersController.getProfile)

router.route("/user-profile")
    .get(usersController.getUserProfile)

router.route("/users")
    .get(usersController.getAllUsers)
    .post(usersController.searchUsers)

router.route("/book-list")
    .get(authenticate, bookListController.getBooksList)
    .post(authenticate, bookListController.addToBookList)
    .delete(authenticate, bookListController.deleteFromBookList)

router.route("/user-book-list")
    .get(bookListController.getUserBookList)

router.route("/books")
    .get(authenticate, booksController.getBookDetails)

router.route("/ratings")
    .get(booksController.getBookRatings)

router.route("/review")
    .get(authenticate, booksController.getUserBookReview)
    .post(authenticate, booksController.postBookReviews)

router.route("/reviews")
    .get(booksController.getBookReviews)

router.route("/user-reviews")
    .get(authenticate, booksController.getAllUserReviews)
    .delete(authenticate, booksController.deleteUserReview)

router.route("/other-user-reviews")
    .get(booksController.getOtherUserReviews)

function authenticate(req, res, next) {
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