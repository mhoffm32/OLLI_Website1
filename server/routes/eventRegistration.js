/******* EVENT REGISTRATION ROUTES *******/
const express = require('express');
const router = express.Router();
const eventRegistrations = require('../models/eventRegistrations');

router.route('/getRegistrations')
  .get(async (req, res) => {
	const bookings = await eventRegistrations.find({}, {event: 1, pickup: 1, dropoff: 1, _id: 0});
	res.json(bookings);
    
  });


router.route('/dropins')
	.post(async (req, res) => {
		const { dropOff, pickUp } = req.body;
		createRegistration("dropIn", "testemail", dropOff, pickUp);
		console.log("Drop off: " + dropOff + " ; Pick up: " + pickUp);
		res.json({ message: 'Drop in successful' });
	});




module.exports = router;

/******************************** HELPER FUNCTIONS **************************************/
async function createRegistration(type, email, pickup, dropoff) {
	const newRegistration = new eventRegistrations({
		event: type,
		userEmail: email,
		pickup: pickup,
		dropoff: dropoff
	});

	await newRegistration.save();
}