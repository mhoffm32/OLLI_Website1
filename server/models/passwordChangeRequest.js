const mongoose = require('../db'); 

const passwordChangeRequest = new mongoose.Schema({
    userID: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
});

const PasswordChangeRequest = mongoose.model('PasswordChangeRequests', passwordChangeRequest);

module.exports = PasswordChangeRequest;