const mongoose = require('mongoose');

var AuthenticationSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    validated: Boolean,
    validationCode: String,
    forgottenPasswordCode: String
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);