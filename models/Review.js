const mongoose = require('mongoose');

// var ObjectId = mongoose.Schema.ObjectId;
var ReviewsSchema = mongoose.Schema({
    usernameId:  {type: mongoose.Schema.ObjectId, ref: 'Authentication'},
    bookId: {type: String, ref: 'Book'},
    reviewTitle: String,
    reviewContent: String,
    reviewRating: Number
});

module.exports = mongoose.model('Review', ReviewsSchema);