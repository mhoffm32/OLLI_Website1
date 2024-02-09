const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/User'); // adjust the path as needed
const UserVerificationEmails = require('../models/UserVerificationEmails'); // adjust the path as needed
const InputChecker = require('../helperClasses/inputChecker'); // adjust the path as needed
const UserInterface = require('../helperClasses/userInterface');

/*************************** NODEMAILER ******************************/
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

/*************************** SIGNUP ROUTES **************************/

router.route('/signup')
	.post(async (req, res) => {
		console.log("Signing Up")
		const { email, username, password } = req.body;
		const emailLower = email.toLowerCase().trim()
		if(await InputChecker.validateEmail(emailLower) && InputChecker.sanitizeInput(username) && InputChecker.sanitizeInput(password)){
			if (await !UserInterface.getUserByEmail(emailLower)){
				console
				createUser(username, password, emailLower, res)
				res.status(200).json({ message: 'Signup successful' });
			} else {
				res.status(409).json({ message: 'Email already exists' });
			}
		} else {
			res.status(400).json({ message: 'Signup failed' });
		}
	});

router.route('/user/verify/:userID/:uniqueString')
	.get(async (req, res) => {
		const uniqueString = req.params.uniqueString;
		const userID = req.params.userID.trim();

		let user = await UserVerificationEmails.findOne({userID: userID})
	
		if(user){
			const {expireAt} = user;
			const hashedUniqueString = user.uniqueString;
			if(Date.now() > expireAt){
				await UserVerificationEmails.deleteOne({userID})
				await User.deleteOne({_id: userID})
				res.json({
					status: 'Please Sign Up Again',
					message: 'Verification code has been expired. Please Sign Up Again'
				})
			} else {
				bcrypt.compare(uniqueString, hashedUniqueString)
					.then( async (result) => {
						if(result){
							let result = await User.updateOne({_id: new ObjectId(userID)}, {$set: {verified: true}})
							console.log(result)
							await UserVerificationEmails.deleteOne({userID})

							res.sendFile(path.join(path.dirname(path.dirname(__dirname)), './server/UserValidated.html'))

							/*res.json({
								status: 'success',
								message: 'Email has been verified'
							})*/
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

router.route('/user/resendVerification')
	.post(async (req, res) => {
		console.log("Resending Verification Email")
		const {email} = req.body;
		const emailLower = email.toLowerCase().trim()
		let user = await UserInterface.getUserByEmail(emailLower)
		if(user){
			const currentURL = "http://localhost:3002";

			const uniqueString = uuidv4() + user._id;

			const mailOptions = {
				from: process.env.AUTH_EMAIL,
				to: emailLower,
				subject: 'Please verify your email',
				html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${currentURL}/user/verify/${user._id}/${uniqueString}>Click here to verify</a>`
			};

			bcrypt.hash(uniqueString, 10)
				.then(async (hashedUniqueString) => {
					console.log("Hashing")
					const newVerification = UserVerificationEmails({
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
	});

module.exports = router;

/******************************* HELPER FUNCTIONS ****************************/
/******************* USER FUNCTIONS *********************/

async function createUser(username, password, email, res){
	//const database = client.db('se3316-lab4-superheroLists');
	//const collection = database.collection('Users');

	console.log("Create the User: " + username + " ; " + password + " ; " + email)

	let hashedPassword = await bcrypt.hash(password, 10);

	let newUser = new User({
		username: username,
    	email: email,
		password: hashedPassword,
		verified: false,
    	type: 'generalUser'
	});

	const result = await newUser.save();
	if(result){
		console.log("Email: " + newUser.email);
		if(!result.verified)
			sendVerificationEmail(newUser, res)
	}
}

async function sendVerificationEmail({_id, email}, res){
	const currentURL = "http://localhost:3002";

	const uniqueString = uuidv4() + _id;

	const mailOptions = {
		from: process.env.AUTH_EMAIL,
		to: email,
		subject: 'Please verify your email',
		html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${currentURL}/user/verify/${_id}/${uniqueString}>Click here to verify</a>`
	};

	bcrypt.hash(uniqueString, 10)
		.then(async (hashedUniqueString) => {

			console.log("Something: " + _id)

			let newVerification = new UserVerificationEmails({
				userID: _id.toString(),
				uniqueString: hashedUniqueString,
				createdAt: Date.now(),
				expireAt: Date.now() + 21600000 // 6 hours
			});

			console.log("Inserting Verification")

			try {
				const result = await newVerification.save();
			} catch (err) {
				console.error(err);
			}

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
}