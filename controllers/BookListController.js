const BookList = require('../models/BookList');
const Book = require('../models/Book');
const ObjectId = require('mongoose').Types.ObjectId;

class BookListController {
    static getBooksList(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        var readingStatus = [];
        var readStatus = [];
        var planToReadStatus = [];
        var abandonedStatus = [];
        BookList.find({ "usernameId": usernameId, "bookStatus": "Reading" }, (err, bookList) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                readingStatus = bookList;
                BookList.find({ "usernameId": usernameId, "bookStatus": "Read" }, (err, bookList) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        readStatus = bookList;
                        BookList.find({ "usernameId": usernameId, "bookStatus": "Plan To Read" }, (err, bookList) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                planToReadStatus = bookList;
                                BookList.find({ "usernameId": usernameId, "bookStatus": "Abandoned" }, (err, bookList) => {
                                    if (err) {
                                        res.status(400).send(err.message);
                                    } else {
                                        abandonedStatus = bookList;
                                        res.status(200).send({
                                            readingStatus: readingStatus,
                                            readStatus: readStatus,
                                            planToReadStatus: planToReadStatus,
                                            abandonedStatus: abandonedStatus
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

    static addToBookList(req, res) {
        BookList.update({ "usernameId": req.headers["username-id"], "bookId": req.body.bookId }, req.body, { upsert: true }, (err, bookList) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                Book.find({ "bookId": req.body.bookId }, (err, find) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        //need to check if the user has submitted before
                        BookList.findByIdAndUpdate({"usernameId": req.headers["username-id"], "bookId": req.body.bookId}, (err, listFind) => {
                            if(err){
                                res.status(400).send(err.message);
                            } else {
                                if(listFind.length != 0){
                                        req.body.bookRatingTotal = find.bookRatingTotal - listFind.bookRating + req.body.bookRating;
                                        req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                } else {
                                    if (find.length != 0) {
                                        req.body.bookRatingCount = find.bookRatingCount + 1;
                                        req.body.bookRatingTotal = find.bookRatingTotal + req.body.bookRating;
                                        req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                    } else {
                                        req.body.bookRatingCount = 1;
                                        req.body.bookRatingTotal = req.body.bookRating;
                                        req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                    }
                                    Book.update({ bookId: req.body.bookId }, req.body, { upsert: true }, (err, book) => {
                                        if (err) {
                                            console.log(err.message)
                                            res.status(400).send(err.message);
                                        } else {
                                            res.status(201).send({ message: "Added to book list" })
                                        }
                                    });
                                }                         
                            }
                        })           
                    }
                });
            }
        });
    }
}

module.exports = BookListController;