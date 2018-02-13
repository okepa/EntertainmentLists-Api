const mongoose = require('mongoose');

// var ObjectId = mongoose.Schema.ObjectId;
var ReviewsSchema = mongoose.Schema({
    usernameId:  mongoose.Schema.ObjectId,
    bookId: String,
    reviewTitle: String,
    reviewContent: String,
    reviewRating: Number
});

module.exports = mongoose.model('Review', ReviewsSchema);