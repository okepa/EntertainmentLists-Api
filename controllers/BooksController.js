const BookList = require('../models/BookList');
const ObjectId = require('mongoose').Types.ObjectId;

class BooksController {
    static getBooksList(req, res){
        var usernameId = new ObjectId(req.headers['username-id']);
        BookList.findOne({"usernameId": usernameId}, (err, bookList) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    bookList: bookList
                });
            }
        });
    }
    static addToBookList(req, res){
        BookList.update({"usernameId":req.headers["username-id"]}, { $push: {"books": req.body}}, (err, book) => {
            if (err) {
                console.log(err.message);
                res.status(400).send(err.message);
            } else {
                res.status(201).send({message: "Added to book list"})
            }
        });
    }
}

module.exports = BooksController;