const mongoose = require('mongoose');

// var ObjectId = mongoose.Schema.ObjectId;
var BookSchema = mongoose.Schema({
    bookId: String,
    bookTitle: String,
    bookAuthor: Array,
    bookPublisher: String,
    bookRating: Number,
    bookRatingCount: Number,
    bookRatingTotal: Number
});

module.exports = mongoose.model('Book', BookSchema);