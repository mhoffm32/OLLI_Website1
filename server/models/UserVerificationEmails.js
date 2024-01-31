const mongoose = require('../db'); 

const userSchema = new mongoose.Schema({
    userID: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
});

const User = mongoose.model('UserVerificationEmails', userSchema);

module.exports = User;