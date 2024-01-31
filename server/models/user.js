const mongoose = require('../db'); 

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verified: Boolean,
    type: String //eg. client, parent/guardian, staff, owner
});

const requestSchema = new mongoose.Schema({
    email: String,
    password: String,
    type: String
});

const User = mongoose.model('User', userSchema);
const Requests = mongoose.model('Request', requestSchema);

module.exports = User;
module.exports = Requests;
