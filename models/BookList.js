const mongoose = require('mongoose');

var BookListSchema = mongoose.Schema({
    usernameId: mongoose.Schema.ObjectId,
    bookId: String,
    bookTitle: String,
    bookAuthor: Array,
    bookPublisher: String,
    bookStatus: String,
    bookRating: Number
});

module.exports = mongoose.model('BookList', BookListSchema);