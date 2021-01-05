const mongoose = require('mongoose');

var BookListSchema = mongoose.Schema({
    usernameId: {type: mongoose.Schema.ObjectId, ref: 'Authentication'},
    bookId: {type: String, ref: 'Book'},
    bookTitle: String,
    bookAuthor: Array,
    bookPublisher: String,
    bookStatus: String,
    bookRating: Number
});

module.exports = mongoose.model('BookList', BookListSchema);