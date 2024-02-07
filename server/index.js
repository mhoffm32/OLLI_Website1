/********************************** INITIALIZATION *****************************/
require('dotenv').config();
const bcrypt = require('bcrypt');
const axios = require('axios');
/************ EXPRESS *******************/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

const router = express.Router();

/************ PASSPORT *******************/
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode")
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET_KEY // Replace with your own secret
}, async (jwtPayload, done) => {
	console.log("Authenticating")
	try {
		console.log("JWT Payload: " + jwtPayload.id + " ; " + jwtPayload.username)
		const user = await userCollection.findOne({_id : new ObjectId(jwtPayload.id)})  //User.findById(jwtPayload.id);
		return done(null, user);
	} catch (err) {
		return done(err, false);
	}
}));

app.use(passport.initialize());

// Initialize passport
app.use(passport.initialize());

/************ MONGODB **********************/
const UserVerificationEmails = require('./models/UserVerificationEmails');
const User = require('./models/user');
const Requests = require('./models/requests');
const { ObjectId } = require('mongodb');
const path = require('path');

/************** NODEMAILER *****************/

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

/********************************** ROUTES *************************************/
/************* USER ROUTES ***************/

router.route('/send-ivey-message')
	.post(async(req,res) => {
		console.log('Sending message to Ivey')
		const {name, email, password, service, message, subject, phoneNumber} =  req.body;
		const transport = nodemailer.createTransport({
			service: service,
			auth: {
				user: email,
				pass: password
			}
		})
		try {
			await transport.sendMail({
			  from: email,
			  to: 'olivinglearn@gmail.com',
			  subject: subject,
			  text: "Hello I'm " + name +'.\n\t' + message + '\nMy phone number is ' + phoneNumber
			});
			res.status(200).send('Email sent successfully');
		  } catch (error) {
			console.error('Error sending email:', error);
			res.status(500).send('Error sending email');
		  }

	});


router.route('/signup')
	.post(async (req, res) => {
		console.log("Signing Up")
		const { email, username, password } = req.body;
		const emailLower = email.toLowerCase().trim()
		if(await validateEmail(emailLower) && inputSanitization(username) && inputSanitization(password)){
			createUser(username, password, emailLower, res)
			res.status(200).json({ message: 'Signup successful' });
		} else {
			res.status(400).json({ message: 'Signup failed' });
		}
	});

router.route('/request')
	.post(async (req, res) =>{
		console.log("Requesting verification")
		const { email, password, type} = req.body;

		console.log("recieving: ", req.body)

		if(!email || !password || !type){
			console.log('all fields required')
			return res.status(400).json({message: 'Username, password, and type are required'});
		}
		if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)|| !inputSanitization(password)){
			console.log('Invalid entries')
			return res.status(400).json({message: 'Invalid entries for email/password'});
		}
		try{
			const emailLower = email.toLowerCase.trim()
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

router.route('/login')
	.post(async (req, res) => {
		const { email, password } = req.body;
		const emailLower = email.toLowerCase().trim()

		if(inputSanitization(password) && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailLower)){
			console.log("Valid entries")
			const payload = await validatePassword(emailLower, password);

			if(!payload){
				res.status(400).json({ message: 'Please try another password or log in using google.'})
			} else if (payload == "disabled"){
				res.status(409).json({ message: 'This account has been disabled' });
			} else if(!payload.verified){
				res.status(410).json({ message: 'Email has not been verified' });
			} else if(payload){
				const token = jwt.sign(payload, process.env.SECRET_KEY); // Replace with your own secret
				res.status(200).json({ message: 'Login successful', token });
			} else {
				res.status(404).json({ message: `Account under ${email} does not exist` });
			}
		}
	});


router.route('/google-auth')
	.post(async (req, res) => {

		const { code } = req.body;
		const decoded_info = jwtDecode.jwtDecode(code);
		const email = decoded_info.email.toLowerCase().trim();
		

		const user = await getUserByEmail(email)

		if(!user){
			const username = email.split("@")[0].replace(/\s/g, '') + (Math.floor(Math.random() * (10)) + 1) + (Math.floor(Math.random() * (10)) + 1);
	
			const pass = generatePass(12);
			createGUser(username, pass, email, res)

		}else{
			const payload = { id: user._id, username: user.username, verified: user.verified, admin: user.admin }
			console.log(payload)
			if(payload == "disabled"){
				res.status(409).json({ message: 'This account has been disabled' });
			} else if(!payload.verified){
				res.status(410).json({ message: 'Email has not been verified' });
			} else if(payload){
				const token = jwt.sign(payload, process.env.SECRET_KEY); // Replace with your own secret
				res.status(200).json({ message: 'Login successful', token });
			} else {
				res.status(400).json({ message: 'Login failed' });
			}

		}

	});


	async function createGUser(username, password, email, res){
		//const database = client.db('se3316-lab4-superheroLists');
		//const collection = database.collection('Users')

		console.log("Create the User: " + username + " ; " + password + " ; " + email)
	
		let hashedPassword = await bcrypt.hash(password, 10);
	
		let newUser = new User({
			username: username,
			email: email,
			password: hashedPassword,
			verified: true,
			type: 'generalUser'
		});
	
		await newUser.save();

	}

function generatePass(length) {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
	let password = '';
	
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		password += charset.charAt(randomIndex);
	}
	return password;
}
	



router.route('/user/getUsers')
  .get(async (req, res) => {
    const users = await User.find();
    res.json(users);
  })


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

							res.sendFile(path.join(__dirname, './UserValidated.html'))

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

router.route('/user/changePassword')
	.post(passport.authenticate('jwt', {session: false}), async (req, res) => {
		console.log("Changing Password: " + req.user.username)
		let user = await getUser(req.user.username)
		let {password} = req.body;
		if(user){
			let hashedPassword = await bcrypt.hash(password, 10);
			let result = await userCollection.updateOne({username: req.user.username}, {$set: {password: hashedPassword}})
			console.log(result)
			res.json({
				status: 'success',
				message: 'Password has been changed'
			})
		} else {
			res.json({
				status: 'error',
				message: 'Email is invalid'
			})
		}
	})



router.route('/user/resendVerification')
	.post(async (req, res) => {
		console.log("Resending Verification Email")
		const {email} = req.body;
		const emailLower = email.toLowerCase().trim()
		let user = await getUserByEmail(emailLower)
		if(user){
			const currentURL = "http://localhost:3002";

			const uniqueString = uuidv4() + user._id;

			const mailOptions = {
				from: process.env.AUTH_EMAIL,
				to: emailLower,
				subject: 'Please verify your email',
				html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${currentURL}/api/user/verify/${user._id}/${uniqueString}>Click here to verify</a>`
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
	})

/****************************** FINISH INITIALIZATION **************************/

app.get("/api", (req, res) => {
  console.log("in index.js");
  res.json("hey");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/******************************* HELPER FUNCTIONS ****************************/
/******************* USER FUNCTIONS *********************/
async function getUser(user){
	//const database = client.db('se3316-lab4-superheroLists');
	//const collection = database.collection('Users');

	try {
		const userObj = await userCollection.findOne({ username: user });
		console.log(userObj)
		if (userObj) {
			return userObj;
		} else {
			return null;
		}
	} catch (err) {
		console.error(err);
	}
}

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


async function getUserByEmail(mail){
	//const database = client.db('se3316-lab4-superheroLists');
	//const collection = database.collection('Users');

	try {
		console.log("Getting User: " + mail)
		const email = mail.toLowerCase().trim()
		const userObj = await User.findOne({ email: email });
		console.log("userobj",userObj)
		if (userObj) {
			return userObj;
		} else {
			return null;
		}
	} catch (err) {
		console.error(err);
	}
}

async function validatePassword(email, password){
	console.log("Validating Password: " + email + " ; " + password)
	
	const mail = email.toLowerCase().trim()

	let user = await getUserByEmail(mail)	
	
	if(user){
		if(user.disabled == true){
			return "disabled"
		}
		let hashedPassword = user.password;
		let result = await bcrypt.compare(password, hashedPassword);
		if(result){
			return { id: user._id, username: user.username, verified: user.verified, admin: user.admin };
		} else {
			return null;
		}
	}else{
		return null;
	}
}

async function sendVerificationEmail({_id, email}, res){
	const currentURL = "http://localhost:3002";

	const uniqueString = uuidv4() + _id;

	const mailOptions = {
		from: process.env.AUTH_EMAIL,
		to: email,
		subject: 'Please verify your email',
		html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${currentURL}/api/user/verify/${_id}/${uniqueString}>Click here to verify</a>`
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

function inputSanitization(input){
	if(/^[\u00BF-\u1FFF\u2C00-\uD7FF\w-_]{0,20}$/.test(input)){
		console.log("Input is valid: " + input)
		return true;
	} else {
		return false;
	}
}

async function validateEmail(email){
	allAccounts = await User.find();
	const mail = email.toLowerCase().trim()
	for(let i=0; i<allAccounts.length; i++){
		if(allAccounts[i].email == mail){
			console.log("Email already exists")
			return false;
		}
	}

	if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)){
		return true;
	} else {
		return false;
	}
}