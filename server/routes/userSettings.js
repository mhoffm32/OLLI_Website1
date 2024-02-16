const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // adjust the path as needed
const passport = require('passport');
const InputChecker = require('../helperClasses/inputChecker'); // adjust the path as needed
const UserInterface = require('../helperClasses/userInterface');

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

router.route('/user/changePassword')
	.post(passport.authenticate('jwt', {session: false}), async (req, res) => {
		console.log("Changing Password: " + req.user.username)
		let user = await getUser(req.user.username)
		let {password} = req.body;
		if(user){
			let hashedPassword = await bcrypt.hash(password, 10);
			let result = await User.updateOne({username: req.user.username}, {$set: {password: hashedPassword}})
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

router.route('/user/changeName')
	.post(passport.authenticate('jwt', {session: false}), async (req, res) => {
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

router.route('/user/changePfp') 
	.post(passport.authenticate('jwt', {session: false}), async (req, res) => {
		console.log("Changing Profile Picture: " + req.user.email)
		let user = await UserInterface.getUserByEmail(req.user.email)
		let {pfp} = req.body;
		if(user){
			let result = await User.updateOne({email: req.user.email}, {$set: {pfp: pfp}})
			console.log(result)
			res.json({
				status: 'success',
				message: 'Profile picture has been changed'
			})
		} else {
			res.json({
				status: 'error',
				message: 'Email is invalid'
			})
		}
	})

module.exports = router;

/********************************************** HELPER FUNCTIONS *******************************************/