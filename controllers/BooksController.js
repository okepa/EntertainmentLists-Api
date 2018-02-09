const BookList = require('../models/BookList');
const Book = require('../models/Book');
const ObjectId = require('mongoose').Types.ObjectId;

class BooksController {
    static getBookDetails(req, res){
        var usernameId = new ObjectId(req.headers['username-id']);
        BookList.findOne({ "usernameId": usernameId, "bookId": req.query.b}, (err, bookData) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    bookData: bookData
                });
            }
        });
    }

    static getBookRatings(req, res){
        Book.find((err, rating) => {
            if(err){
                res.status(400).send(err.message);           
            } else {
                res.status(200).send({
                    bookData: rating
                });
            }
        })
    }
}

module.exports = BooksController;