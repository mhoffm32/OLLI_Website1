const mongoose = require('../db'); 

const requestSchema = new mongoose.Schema({
    email: String,
    password: String,
    type: String
});

const Requests = mongoose.model('Request', requestSchema);

module.exports = Requests;
