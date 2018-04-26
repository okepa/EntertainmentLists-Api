const mongoose = require('mongoose');

var AuthenticationSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    active: Boolean
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);