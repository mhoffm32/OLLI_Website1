const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // adjust the path as needed
const InputChecker = require('../helperClasses/inputChecker'); // adjust the path as needed
const jwt = require('jsonwebtoken');
const UserInterface = require('../helperClasses/userInterface');

router.route('/login')
	.post(async (req, res) => {
		const { email, password } = req.body;
		const emailLower = email.toLowerCase().trim()

		if(InputChecker.sanitizeInput(password) && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailLower)){
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
		

		const user = await UserInterface.getUserByEmail(email)

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

module.exports = router;

/******************************** HELPER FUNCTIONS **************************************/

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

    async function validatePassword(email, password){
        console.log("Validating Password: " + email + " ; " + password)
        
        const mail = email.toLowerCase().trim()
    
        let user = await UserInterface.getUserByEmail(mail)	
        
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

