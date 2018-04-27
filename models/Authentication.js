const mongoose = require('mongoose');

var AuthenticationSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    activated: Boolean,
    activationCode: String
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);