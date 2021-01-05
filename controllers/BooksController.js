const BookList = require('../models/BookList');
const Book = require('../models/Book');
const Review = require('../models/Review')
const ObjectId = require('mongoose').Types.ObjectId;

class BooksController {
    static getBookDetails(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        BookList.findOne({ "usernameId": usernameId, "bookId": req.query.b }, (err, bookData) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    bookData: bookData
                });
            }
        });
    }

    static getBookRatings(req, res) {
        Book.find((err, rating) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    bookData: rating
                });
            }
        })
    }
    //Get book reviews for one book
    static getBookReviews(req, res) {
        var page = (req.query.p - 1) * 5;
        Review.find({ "bookId": req.query.b }).skip(page).limit(5).populate('usernameId', 'username').exec((err, reviews) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                Review.count({ "bookId": req.query.b }, (err, reviewsTotal) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        res.status(201).send({
                            reviews: reviews,
                            reviewsTotal: reviewsTotal
                        });
                    }
                });
            }
        })
    }
    //get user book review for one book
    static getUserBookReview(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        Review.findOne({ "usernameId": usernameId, "bookId": req.query.b }, (err, review) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    review: review
                });
            }
        })
    }
    //Create book review
    static postBookReviews(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        Book.findOne({ bookId: req.body.bookId }, (err, book) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                if (book == null) {
                    //Book doesn't exist
                    req.body.bookRating = 0;
                    req.body.bookRatingCount = 0;
                    req.body.bookRatingTotal = 0
                    Book.update({ bookId: req.body.bookId }, { $set: { usernameId: req.body.usernameId, bookId: req.body.bookId, bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, bookPublisher: req.body.bookPublisher, bookRating: req.body.bookRating, bookRatingTotal: req.body.bookRatingTotal, bookRatingCount: req.body.bookRatingCount } }, { upsert: true }, (err, book) => {
                        if (err) {
                            res.status(400).send(err.message);
                        } else {
                            Review.update({ "usernameId": usernameId, "bookId": req.body.bookId }, { $set: { usernameId: usernameId, bookId: req.body.bookId, reviewTitle: req.body.reviewTitle, reviewContent: req.body.reviewContent, reviewRating: req.body.reviewRating } }, { upsert: true }, (err, review) => {
                                if (err) {
                                    res.status(400).send(err.message);
                                } else {
                                    res.status(201).send({
                                        message: "Review has been submitted"
                                    });
                                }
                            });
                        }
                    });
                } else {
                    Review.update({ "usernameId": usernameId, "bookId": req.body.bookId }, { $set: { usernameId: usernameId, bookId: req.body.bookId, reviewTitle: req.body.reviewTitle, reviewContent: req.body.reviewContent, reviewRating: req.body.reviewRating } }, { upsert: true }, (err, review) => {
                        if (err) {
                            res.status(400).send(err.message);
                        } else {
                            res.status(201).send({
                                message: "Review has been submitted"
                            });
                        }
                    });
                }
            }
        });
    }
    //Get all users book reviews
    static getAllUserReviews(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        var page = (req.query.p - 1) * 5;
        var bookIdArray = [];
        Review.find({ "usernameId": usernameId }).skip(page).limit(5).exec((err, reviews) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                Review.count({ "usernameId": usernameId }, (err, reviewsTotal) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        for (var i = 0; i < reviews.length; i++) {
                            bookIdArray.push(reviews[i].bookId);
                        }
                        //Get book title from bookId
                        Book.find({ "bookId": { $in: bookIdArray } }, (err, bookName) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                for (var i = 0; i < bookName.length; i++) {
                                    for (var j = 0; j < reviews.length; j++) {
                                        if (bookName[i].bookId == reviews[j].bookId) {
                                            var temp = reviews[j].toObject();
                                            temp.bookTitle = bookName[i].bookTitle;
                                            reviews[j] = temp;
                                        }
                                    }
                                }
                                res.status(201).send({
                                    reviews: reviews,
                                    reviewsTotal: reviewsTotal,
                                    bookName: bookName
                                });
                            }
                        })


                    }
                });
            }
        });
    }
    //Delete user review
    static deleteUserReview(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        Review.deleteOne({ "usernameId": usernameId, "bookId": req.query.b }, (err, reviews) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    message: "Review has been deleted"
                });
            }
        })
    }
    //Get all other user reviews
    static getOtherUserReviews(req, res) {
        var usernameId = req.query.usernameId;
        var page = (req.query.p - 1) * 5;
        var bookIdArray = [];
        Review.find({ "usernameId": usernameId }).skip(page).limit(5).exec((err, reviews) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                Review.count({ "usernameId": usernameId }, (err, reviewsTotal) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        for (var i = 0; i < reviews.length; i++) {
                            bookIdArray.push(reviews[i].bookId);
                        }
                        //Get book title from bookId
                        Book.find({ "bookId": { $in: bookIdArray } }, (err, bookName) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                for (var i = 0; i < bookName.length; i++) {
                                    for (var j = 0; j < reviews.length; j++) {
                                        if (bookName[i].bookId == reviews[j].bookId) {
                                            var temp = reviews[j].toObject();
                                            temp.bookTitle = bookName[i].bookTitle;
                                            reviews[j] = temp;
                                        }
                                    }
                                }
                                res.status(201).send({
                                    reviews: reviews,
                                    reviewsTotal: reviewsTotal,
                                    bookName: bookName
                                });
                            }
                        })


                    }
                });
            }
        });
    }
}

module.exports = BooksController;