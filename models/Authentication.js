const mongoose = require('mongoose');

var AuthenticationSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    validated: Boolean,
    activationCode: String
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);