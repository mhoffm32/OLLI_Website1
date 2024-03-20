/******* REVIEW ROUTES *******/
const express = require('express');
const router = express.Router();
const Reviews = require('../models/reviews');

router.route('/getReviews') 
    .get(async (req, res) => {
        try {
            const reviews = await Reviews.find({}, {username: 1, date: 1, rating: 1, content: 1, _id: 0});
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/createReview')
    .post(async (req, res) => {
        console.log("Creating review");
        try {
            const {username, date, rating, content} = req.body;
            createReview(username, date, rating, content);
            res.json({ message: 'Review created' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/deleteReview')
    .post(async (req, res) => {
        console.log("Deleting review");
        try {
            const {username, date, rating, content} = req.body;
            await Reviews.deleteOne({username: username, date: date, rating: rating, content: content});
            res.json({ message: 'Review deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;

/******************************** HELPER FUNCTIONS **************************************/
// Helper function to create a new review
async function createReview(username, date, rating, content) {
    const newReview = new Reviews( {
        username: username,
        date: date,
        rating: rating,
        content: content
    });
    await newReview.save();
}