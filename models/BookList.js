const mongoose = require('mongoose');

var AuthenticationSchema = mongoose.Schema({
    username: String,
    books: [{id: String }]
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);