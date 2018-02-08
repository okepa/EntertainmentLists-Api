const mongoose = require('mongoose');

// var ObjectId = mongoose.Schema.ObjectId;
var BookListSchema = mongoose.Schema({
    usernameId: mongoose.Schema.ObjectId,
    books: [
        {
            bookId: String,
            bookTitle: String,
            bookAuthor: Array,
            bookPublisher: String,
            bookStatus: String,
            bookRating: Number
     }
    ]
});

module.exports = mongoose.model('BookList', BookListSchema);