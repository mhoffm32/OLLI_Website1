const { Timestamp } = require('mongodb');
const mongoose = require('../db'); 

const eventRegSchema = new mongoose.Schema({
    event: String,
    userEmail: String,
    pickup: Date,
    dropoff: Date,
});

const eventRegistrations = mongoose.model('eventRegistrations', eventRegSchema);

module.exports = eventRegistrations;
