const mongoose = require('../db'); 

const reviewSchema = new mongoose.Schema({
    username: String,
    date: String,
    rating: Number,
    content: String,
});

const Reviews = mongoose.model('Review', reviewSchema);

module.exports = Reviews;
