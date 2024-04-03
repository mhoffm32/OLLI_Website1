const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // adjust the path as needed
const passport = require('passport');
const jwt = require('jsonwebtoken');
const InputChecker = require('../helperClasses/inputChecker'); // adjust the path as needed
const PasswordChangeRequest = require('../models/passwordChangeRequest');
const UserInterface = require('../helperClasses/userInterface');
const { ObjectId } = require('mongodb');
const Filter = require('bad-words');
const filter = new Filter();

const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASS
	}
});

transporter.verify((error, success) => {
	if(error){
		console.log(error);
	} else {
		console.log("Server is ready to take messages");
	}
});

const verifyToken = (req, res, next) => {
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) return res.status(403).send({ message: 'No token provided.' });

	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) return res.status(401).send({ message: 'Failed to authenticate token.' });
		req.userId = decoded.id;
		next();
	});
};

const checkForBadWords = (req, res, next) => {
    console.log('checking for bad words...');
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    if (filter.isProfane(firstname) || filter.isProfane(lastname)) {
        return res.status(400).json({ message: 'Poor language detected! Please do not use profanity.' });
    } else {
        console.log('no bad words detected!')
        next();
    }
};

router.route('/request')
	.post(async (req, res) =>{
		console.log("Requesting verification")
		const { email, password, type} = req.body;

		console.log("recieving: ", req.body)

		if(!email || !password || !type){
			console.log('all fields required')
			return res.status(400).json({message: 'Username, password, and type are required'});
		}
		if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)|| !InputChecker.sanitizeInput(password)){
			console.log('Invalid entries')
			return res.status(400).json({message: 'Invalid entries for email/password'});
		}
		try{
			const emailLower = email.toLowerCase().trim()
			const user = await User.findOne({emailLower});
			if(!user){
				console.log('User not found')
				return res.status(404).json({message: 'User not found'});
			}

			const validPass = await bcrypt.compare(password, user.password);
			if(!validPass){
				console.log("invalid password")
				return res.status(400).json({message: 'Invalid password'});
			}
			
			const hashed = await bcrypt.hash(password, 10);	

			const request = {
				email: email,
				password: hashed,
				type: type
			}

			Requests.create(request).then((request) => {
				console.log('Request created:', request);
			}).catch((error) => {
				console.error('Error creating request:', error);
			});			

			return res.status(200).json({message: "Verification request submitted"});

		} catch (error){
			console.log("Error in verification process:", error);
			return res.status(500).json({message: 'Internal server error'});
		}
	
	});

router.route('/user/changePassword')
	.post(async (req, res) => {
		console.log("Changing Password: " + req.body.email)
		let user = await UserInterface.getUserByEmail(req.body.email)
		if(user){
			const currentURL = process.env.SERVER_ADDRESS;

			const uniqueString = uuidv4() + user._id;

			const mailOptions = {
				from: process.env.AUTH_EMAIL,
				to: req.body.email.toLowerCase(),
				subject: 'Password Change Request',
				html: `Hello,<br> Please Click on the link to change your password.<br><a href=${currentURL}/user/changePassword/${user._id}/${uniqueString}>Click here to change Password</a>`
			};

			bcrypt.hash(uniqueString, 10)
				.then(async (hashedUniqueString) => {
					console.log("Hashing")
					const newVerification = PasswordChangeRequest({
						userID: user._id.toString(),
						uniqueString: hashedUniqueString,
						createdAt: Date.now(),
						expireAt: Date.now() + 21600000 // 6 hours
					});

					console.log("Verification Created")

					await newVerification.save();

					console.log("Sending Email")

					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							console.log("Error in Sending Email " + error);
							res.json({
								status: 'failed',
								message: 'Error occurred while sending email'
							})
						} else {
							console.log('Email sent: ' + info.response);
							res.json({
								status: 'PENDING',
								message: 'Verification email sent'
							})
						}
					});
				})
				.catch(() => {
					console.log("Error in Hashing")
					res.json({
						status: 'failed',
						message: 'Error occurred while hashing the password'
					})
				});
		} else {
			res.json({
				status: 'error',
				message: 'Email is invalid'
			})
		}
	})

router.route('/user/changeName')
	.post(passport.authenticate('jwt', {session: false}), checkForBadWords, async (req, res) => {
		console.log("Changing Name for: " + req.user.email)
		let user = await UserInterface.getUserByEmail(req.user.email)
		let {firstname, lastname} = req.body;
		if(user){
			let result = await User.updateOne({email: req.user.email}, {$set: {firstname: firstname, lastname: lastname}})
			console.log(result)
			res.json({
				status: 'success',
				message: 'Name has been changed to ' + firstname + " " + lastname
			})
		} else {
			res.json({
				status: 'error',
				message: 'Email is invalid'
			})
		}
	})

	router.route('/user/updatePfp')
		.post(verifyToken, async (req, res) => {
			const { pfp } = req.body;
			if (!pfp) return res.status(400).send('Profile picture URL is required.');
		
			try {
				let result = await User.updateOne({_id: new ObjectId(req.userId)}, {$set: {pfp: pfp}})
				console.log(result)
				res.json({
					status: 'success',
					message: 'PFP has been changed to ' + pfp
				})			
				} catch (error) {
				console.error(error);
				res.status(500).send('Internal server error.');
			}
	});

router.route('/user/changePassword/:userID/:uniqueString')
.get(async (req, res) => {
	const uniqueString = req.params.uniqueString;
	const userID = req.params.userID.trim();

	let user = await PasswordChangeRequest.findOne({userID: userID})

	if(user){
		const {expireAt} = user;
		const hashedUniqueString = user.uniqueString;
		if(Date.now() > expireAt){
			await PasswordChangeRequest.deleteOne({userID})
			res.json({
				status: 'Please Sign Up Again',
				message: 'Verification code has been expired. Please Sign Up Again'
			})
		} else {
			bcrypt.compare(uniqueString, hashedUniqueString)
				.then( async (result) => {
					if(result){
						console.log(result)

						res.render('ChangePassword', { userID: userID, uniqueString: uniqueString });
					} else {
						res.json({
							status: 'error',
							message: 'Verification code is invalid'
						})
					}
				})
				.catch((error) => {
					console.log("Error in compare" + error);
					res.json({
						status: 'error',
						message: 'Something went wrong while comparing the unique string'
					})
				})
		}
	}
})

router.route('/user/changePassword/:userID/:uniqueString/setPassword')
	.post(async (req, res) => {
		const uniqueString = req.params.uniqueString;
		const userID = req.params.userID.trim();
		const password = req.body.password;
		console.log("Changing Password: " + password)

		let user = await PasswordChangeRequest.findOne({userID: userID})

		if(user){
			const {expireAt} = user;
			const hashedUniqueString = user.uniqueString;
			if(Date.now() > expireAt){
				await PasswordChangeRequest.deleteOne({userID})
				res.json({
					status: 'Please Sign Up Again',
					message: 'Verification code has been expired. Please Sign Up Again'
				})
			} else {
				bcrypt.compare(uniqueString, hashedUniqueString)
					.then( async (result) => {
						if(result){
							console.log(result)

							let hashedPassword = await bcrypt.hash(password, 10);
							let oresult = await User.updateOne({_id: new ObjectId(userID)}, {$set: {password: hashedPassword}})
							console.log("success");
							await PasswordChangeRequest.deleteOne({userID});
						} else {
							res.json({
								status: 'error',
								message: 'Verification code is invalid'
							})
						}
					})
					.catch((error) => {
						console.log("Error in compare" + error);
						res.json({
							status: 'error',
							message: 'Something went wrong while comparing the unique string'
						})
					})
			}
		}	
	});

router.route('/user/details')
	.get(verifyToken, async (req, res) => {
		console.log("Getting User Details: " + req.userId)
	try {
		const user = await User.findById(req.userId).select('-password'); // Exclude the password from the result
		if (!user) return res.status(404).send({ message: 'User not found.' });
		res.send(user);
	} catch (error) {
		res.status(500).send({ message: 'There was a problem finding the user.' });
	}
});

module.exports = router;

/********************************************** HELPER FUNCTIONS *******************************************/

async function changePassword(email, password){
	console.log("Changing Password: " + email)
	let user = await User.getUserByEmail(email)
	if(user){
		let hashedPassword = await bcrypt.hash(password, 10);
		let result = await userCollection.updateOne({username: email}, {$set: {password: hashedPassword}})
		console.log(result)
		return {
			status: 'success',
			message: 'Password has been changed'
		}
	} else {
		return {
			status: 'error',
			message: 'Email is invalid'
		}
	}
}

