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
        var usernameId = req.headers["username-id"];
        req.body.usernameId = usernameId;
        //Check if the user has added it before
        BookList.findOne({ "usernameId": usernameId, "bookId": req.body.bookId }, (err, listFind) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                //Update book list
                BookList.update({ "usernameId": usernameId, "bookId": req.body.bookId }, {$set: {usernameId: req.body.usernameId, bookId: req.body.bookId, bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, bookPublisher: req.body.bookPublisher, bookStatus: req.body.bookStatus, bookRating: req.body.bookRating}}, { upsert: true }, (err, bookList) => {
                    if (err) {
                        console.log(err.message)
                        res.status(400).send(err.message);
                    } else {
                        //Find if the book has been added before
                        Book.findOne({ "bookId": req.body.bookId }, (err, find) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                if (find != null) {
                                    if (listFind != null) {
                                        //User is updating their rating
                                        if (req.body.bookRating == null || req.body.bookRating == "") {
                                            req.body.bookRatingCount = find.bookRatingCount - 1;
                                            req.body.bookRatingTotal = find.bookRatingTotal - listFind.bookRating;
                                            if(req.body.bookRatingTotal == 0) req.body.bookRating = 0;
                                            else req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                        } else {
                                            if(listFind.bookRating == null) req.body.bookRatingCount = find.bookRatingCount + 1;
                                            else req.body.bookRatingCount = find.bookRatingCount;
                                            req.body.bookRatingTotal = find.bookRatingTotal - listFind.bookRating + req.body.bookRating;
                                            req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                        }
                                    } else {
                                        //User is rating for first time
                                        if (req.body.bookRating == null || req.body.bookRating == "") {
                                            req.body.bookRatingCount = find.bookRatingCount;
                                            req.body.bookRatingTotal = find.bookRatingTotal;
                                            req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                        } else {
                                            req.body.bookRatingCount = find.bookRatingCount + 1;
                                            req.body.bookRatingTotal = find.bookRatingTotal + req.body.bookRating;
                                            req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                        }
                                    }
                                    Book.update({ bookId: req.body.bookId }, {$set: {usernameId: req.body.usernameId, bookId: req.body.bookId, bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, bookPublisher: req.body.bookPublisher, bookRating: req.body.bookRating, bookRatingTotal: req.body.bookRatingTotal, bookRatingCount: req.body.bookRatingCount}}, { upsert: true }, (err, book) => {
                                        if (err) {
                                            res.status(400).send(err.message);
                                        } else {
                                            res.status(201).send({ message: "Added to book list" })
                                        }
                                    });
                                } else {
                                    //Never been added before
                                    if (req.body.bookRating == null || req.body.bookRating == "") {
                                        req.body.bookRatingCount = 0;
                                        req.body.bookRatingTotal = 0;
                                        req.body.bookRating = 0;
                                    } else {
                                        req.body.bookRatingCount = 1;
                                        req.body.bookRatingTotal = req.body.bookRating;
                                        req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                    }
                                    //Update book
                                    Book.update({ bookId: req.body.bookId }, {$set: {usernameId: req.body.usernameId, bookId: req.body.bookId, bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, bookPublisher: req.body.bookPublisher, bookRating: req.body.bookRating, bookRatingTotal: req.body.bookRatingTotal, bookRatingCount: req.body.bookRatingCount}}, { upsert: true }, (err, book) => {
                                        if (err) {
                                            res.status(400).send(err.message);
                                        } else {
                                            res.status(201).send({ message: "Added to book list" })
                                        }
                                    });
                                }

                            }
                        });
                    }
                });
            }
        });
    }

    static deleteFromBookList(req, res) {
        var usernameId = req.headers["username-id"];
        BookList.findOne({ "usernameId": usernameId, "bookId": req.query.b }, (err, find) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                BookList.deleteOne({ "usernameId": usernameId, "bookId": req.query.b }, (err, bookList) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        //Need to update book rating
                        Book.findOne({ "bookId": req.query.b }, (err, findBook) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                findBook.bookRatingCount = findBook.bookRatingCount - 1;
                                findBook.bookRatingTotal = findBook.bookRatingTotal - find.bookRating;
                                if (findBook.bookRatingTotal == 0) findBook.bookRating = 0
                                else findBook.bookRating = findBook.bookRatingTotal / findBook.bookRatingCount;
                                Book.updateOne({ "bookId": req.query.b }, { "bookRatingTotal": findBook.bookRatingTotal, "bookRatingCount": findBook.bookRatingCount, "bookRating": findBook.bookRating }, (err, book) => {
                                    if (err) {
                                        res.status(400).send(err.message);
                                    } else {
                                        res.status(200).send({ message: "Deleted from book list" })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    static getUserBookList(req, res){
        var readingStatus = [];
        var readStatus = [];
        var planToReadStatus = [];
        var abandonedStatus = [];
        BookList.find({ "usernameId": req.query.username, "bookStatus": "Reading" }, (err, bookList) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                readingStatus = bookList;
                BookList.find({ "usernameId": req.query.username, "bookStatus": "Read" }, (err, bookList) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        readStatus = bookList;
                        BookList.find({ "usernameId": req.query.username, "bookStatus": "Plan To Read" }, (err, bookList) => {
                            if (err) {
                                res.status(400).send(err.message);
                            } else {
                                planToReadStatus = bookList;
                                BookList.find({ "usernameId": req.query.username, "bookStatus": "Abandoned" }, (err, bookList) => {
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
}

module.exports = BookListController;