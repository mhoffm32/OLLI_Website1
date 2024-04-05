/******* EVENT REGISTRATION ROUTES *******/
const express = require('express');
const router = express.Router();
const eventRegistrations = require('../models/eventRegistrations');

router.route('/getRegistrations')
  .get(async (req, res) => {
	const bookings = await eventRegistrations.find({}, {event: 1, username: 1, pickup: 1, dropoff: 1, note: 1, _id: 0});
	res.json(bookings);
    
  });


router.route('/dropins')
	.post(async (req, res) => {
		const { username, dropOff, pickUp, note } = req.body;
		createRegistration("dropIn", username, dropOff, pickUp, note);
		console.log("Drop off: " + dropOff + " ; Pick up: " + pickUp);
		res.json({ message: 'Drop in successful' });
	});




module.exports = router;

/******************************** HELPER FUNCTIONS **************************************/
async function createRegistration(type, username, pickup, dropoff, note) {
	const newRegistration = new eventRegistrations({
		event: type,
		username: username,
		pickup: pickup,
		dropoff: dropoff,
		note: note
	});

	await newRegistration.save();
}