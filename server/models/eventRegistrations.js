const { Timestamp } = require('mongodb');
const mongoose = require('../db'); 

const eventRegSchema = new mongoose.Schema({
    event: String,
    username: String,
    pickup: Date,
    dropoff: Date,
    note: String,
});

const eventRegistrations = mongoose.model('eventRegistrations', eventRegSchema);

module.exports = eventRegistrations;
