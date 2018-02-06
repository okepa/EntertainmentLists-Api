const mongoose = require('mongoose');

var AuthenticationSchema = mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);