const mongoose = require('../db'); 

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verified: Boolean,
    type: String, //eg. client, parent/guardian, staff, owner
    firstname: String,
    lastname: String,
    pfp: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
