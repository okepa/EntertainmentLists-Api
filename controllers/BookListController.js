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
        //Update book list
        BookList.update({ "usernameId": req.headers["username-id"], "bookId": req.body.bookId }, req.body, { upsert: true }, (err, bookList) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                //Find if the book has been added before
                Book.findOne({ "bookId": req.body.bookId }, (err, find) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        if (find.length > 0) {
                            //check if the user has added it bofore
                            BookList.findOne({ "usernameId": req.headers["username-id"], "bookId": req.body.bookId }, (err, listFind) => {
                                if (err) {
                                    res.status(400).send(err.message);
                                } else {
                                    if (listFind.length > 0) {
                                        //User is updating their rating
                                        // console.log(find)
                                        // console.log("")
                                        // console.log(req.body)
                                        // console.log("")
                                        // console.log(listFind)
                                        // console.log("")
                                        req.body.bookRatingCount = find.bookRatingCount;
                                        console.log(find.bookRatingCount);
                                        req.body.bookRatingTotal = find.bookRatingTotal - listFind.bookRating + req.body.bookRating;
                                        console.log(find.bookRatingTotal);
                                        req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                        console.log(find.bookRating);
                                        //console.log(req.body)
                                    } else {
                                        //User is rating for first time
                                        req.body.bookRatingCount = find.bookRatingCount;
                                        req.body.bookRatingTotal = find.bookRatingTotal + req.body.bookRating;
                                        req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                                    }
                                    //console.log(req.body)
                                    Book.update({ bookId: req.body.bookId }, req.body, { upsert: true }, (err, book) => {
                                        if (err) {
                                            res.status(400).send(err.message);
                                        } else {
                                            res.status(201).send({ message: "Added to book list" })
                                        }
                                    });
                                }
                            });
                        } else {
                            //Never been added before
                            req.body.bookRatingCount = 1;
                            req.body.bookRatingTotal = req.body.bookRating;
                            req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
                            //Update book
                            Book.update({ bookId: req.body.bookId }, req.body, { upsert: true }, (err, book) => {
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



    // static addToBookList(req, res) {
    //     //Update book list
    //     BookList.update({ "usernameId": req.headers["username-id"], "bookId": req.body.bookId }, req.body, { upsert: true }, (err, bookList) => {
    //         if (err) {
    //             console.log("hello")
    //             res.status(400).send(err.message);
    //         } else {
    //             //Look in book to see if the book exists
    //             Book.find({ "bookId": req.body.bookId }, (err, find) => {
    //                 if (err) {
    //                     console.log("hello1")
    //                     res.status(400).send(err.message);
    //                 } else {
    //                     //need to check if the user has submitted before
    //                     BookList.find({ "usernameId": req.headers["username-id"], "bookId": req.body.bookId }, (err, listFind) => {
    //                         if (err) {
    //                             console.log("hello2")
    //                             res.status(400).send(err.message);
    //                         } else {
    //                             //If the user has added the book to their booklist update the rating
    //                             if (listFind.length != 0) {
    //                                 console.log(find)
    //                                 req.body.bookRatingCount = find.bookRatingCount;
    //                                 req.body.bookRatingTotal = find.bookRatingTotal - listFind.bookRating + req.body.bookRating;
    //                                 req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
    //                             } else {
    //                                 //If the user hasnt added the book to their booklist create a new rating
    //                                 if (find.length != 0) {
    //                                     console.log("if")
    //                                     req.body.bookRatingCount = find.bookRatingCount + 1;
    //                                     req.body.bookRatingTotal = find.bookRatingTotal + req.body.bookRating;
    //                                     req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
    //                                 } else {
    //                                     console.log("else")
    //                                     req.body.bookRatingCount = 1;
    //                                     req.body.bookRatingTotal = req.body.bookRating;
    //                                     req.body.bookRating = req.body.bookRatingTotal / req.body.bookRatingCount;
    //                                 }
    //                             }
    //                             console.log(req.body);
    //                             Book.update({ bookId: req.body.bookId }, req.body, { upsert: true }, (err, book) => {
    //                                 if (err) {
    //                                     console.log("hello3")
    //                                     res.status(400).send(err.message);
    //                                 } else {
    //                                     res.status(201).send({ message: "Added to book list" })
    //                                 }
    //                             });
    //                         }
    //                     })
    //                 }
    //             });
    //         }
    //     });
    // }
}

module.exports = BookListController;