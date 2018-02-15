const BookList = require('../models/BookList');
const Book = require('../models/Book');
const Review = require('../models/Review')
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
    //Get book reviews for one book
    static getBookReviews(req, res) {
        Review.find({"bookId": req.query.b}, (err, reviews) => {
            if(err){
                res.status(400).send(err.message);           
            } else {
                res.status(200).send({
                    reviews: reviews
                });
            }
        })
    }
    //get user book review for one book
    static getUserBookReview(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        Review.findOne({"usernameId": usernameId, "bookId": req.query.b}, (err, review) => {
            if(err){
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
        req.body.usernameId = usernameId;
        Review.update({"usernameId": usernameId, "bookId": req.body.bookId}, req.body, {upsert: true}, (err, review) => {
            if(err){
                res.status(400).send(err.message);           
            } else {
                res.status(201).send({
                    message: "Review has been submitted"
                });
            }
        })
    }
    //Get all users book reviews
    static getAllUserReviews(req, res){
        var usernameId = new ObjectId(req.headers['username-id']);
        Review.find({"usernameId": usernameId}, (err, reviews) => {
            if(err){
                res.status(400).send(err.message);           
            } else {
                res.status(201).send({
                    reviews: reviews
                });
            }
        })
    }
    //Delete user review
    static deleteUserReview(req, res) {
        var usernameId = new ObjectId(req.headers['username-id']);
        Review.deleteOne({"usernameId": usernameId, "bookId": req.query.b }, (err, reviews) => {
            if(err){
                res.status(400).send(err.message);           
            } else {
                res.status(200).send({
                    message: "Review has been delete"
                });
            }
        })
    }
}

module.exports = BooksController;