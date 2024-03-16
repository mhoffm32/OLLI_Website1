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
app.use(express.json())

app.set('view engine', 'ejs');

const router = express.Router();
const userSignup = require('./routes/userSignUp.js');
const userLogin = require('./routes/userLogin.js');
const userSettings = require('./routes/userSettings.js');
const eventRegistration = require('./routes/eventRegistration.js');
const eventRoutes = require('./routes/eventRoutes.js');
const review = require('./routes/reviews.js');

/************ PASSPORT *******************/
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET_KEY, // Replace with your own secret

}, async (jwtPayload, done) => {
	console.log("Authenticating")
	try {
		console.log("JWT Payload: " + jwtPayload.id + " ; " + jwtPayload.username)
		const user = await User.findOne({_id : new ObjectId(jwtPayload.id)})  //User.findById(jwtPayload.id);
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
const User = require('./models/User.js');
const Requests = require('./models/requests');
const Newsletters = require('./models/newsletters');
const AccountSetting = require('./models/accountSettings');
const ChatUser = require('./models/ChatUser');
const ChatThread = require('./models/ChatThread');
const ChatText = require('./models/ChatText');
const { ObjectId } = require('mongodb');
const path = require('path');
const Images = require('./models/images');

/************** NODEMAILER *****************/

const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');
const { create } = require('./models/eventRegistrations');

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


router.route('/signup')
	.post(async (req, res) => {
		console.log("Signing Up")
		const { email, username, password } = req.body;
		const emailLower = email.toLowerCase().trim()
		if(await validateEmail(emailLower) && sanitizeInput(username) && sanitizeInput(password)){
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
		if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)|| !sanitizeInput(password)){
			console.log('Invalid entries')
			return res.status(400).json({message: 'Invalid entries for email/password'});
		}
		try{
			const emailLower = email.toLowerCase().trim();
			let user1 = await User.find({email: emailLower});
			const user = user1[0]

			console.log(user)
		
			if(!user){
				console.log('User not founddddd')
				return res.status(404).json({message: 'User not found'});
			}else{
				console.log("user found")
			}

			console.log("password", password, "user.password", user)

			const validPass = await bcrypt.compare(password, user.password);
			console.log("pass done")
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

app.use(userSignup);
app.use(userLogin);
app.use(userSettings);
app.use(eventRegistration);
app.use(eventRoutes);
app.use(review);

const multer = require("multer");
const { sanitizeInput } = require('./helperClasses/inputChecker.js');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let uploadedpdf = null;




router.route('/admin/uploadNewsletter')
	.post(upload.single("file"), async (req, res) => {
		try {

			uploadedpdf = req.file;
			if (!req.file) {
			  return res.status(400).json({ error: "No file uploaded." });
			}

			uploadedpdf = req.file.buffer;
		
			const customName = req.body.customName;

			const pdfDocument = new Newsletters({
				letter_name: customName,
                pdf_name: req.file.originalname, // Use the original filename as the name
                data: uploadedpdf // Binary data of the PDF file
            });

            await pdfDocument.save();
		
			console.log("pdf uploaded successfully.");
			res.json({ message: "pdf file uploaded successfully." });
		  } catch (error) {
			console.error("Error:", error);
			return res.status(500).json({ error: "Internal Server Error" });
		  }
})


const imageUpload = multer({ 
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			const error = new Error('Please upload an image');
			error.status = 400;
			console.log("Error: Please upload an image");
			return cb(null, false);
		}
		cb(null, true);
	}
});

router.route('/admin/uploadImages')
  .post(imageUpload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({error: "No file uploaded."} );
		}
		if(!req.body.caption){
			return res.status(400).json({error: "No caption included."} );
		}
		if(typeof(req.body.caption)!== 'string'){
			return res.status(400).json({error: "Caption must be a string."} );
		}
		const uploadedImage = req.file.buffer;
		const image = new Images({
			image: uploadedImage,
			caption: req.body.caption
		});
		await image.save();
		console.log("Image uploaded successfully.");
		return res.status(200).json({success: "Image uploaded successfully."});
	} catch (error) {
		console.error("Error:", error.message);
		return res.status(500).send( "Internal Server Error" );
	}
});

router.route('/displayImages')
	.get(async (req, res) => {
		try {
			const images = await Images.find();
			const imageList = images.map(image => ({
				_id: image._id,
				image: Buffer.from(image.image, 'base64').toString('base64'),
				uploadDate: image.uploadDate,
				caption: image.caption
			}));
			res.json({images: imageList});
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).json({error: "Internal Server Error"});
		}
	});

router.route('/admin/deleteAllImages')
	.delete(async (req, res) => {
		try {
			await Images.deleteMany();
			res.json({message: "All images deleted"});
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).json({error: "Internal Server Error"});
		}
	});



router.route('/user/viewNewsletters')
    .get(async (req, res) => {
        try {
			
            const newsletters = await Newsletters.find({},{data: 0}).sort({ uploadDate: -1 }); // Retrieve all newsletters from the database
			const pdfs = newsletters.map(newsletter => ({
				_id: newsletter._id,
                letter_name: newsletter.letter_name,
                pdf_name: newsletter.pdf_name, // Convert the binary data to base64 string
				date: newsletter.uploadDate,
				
            }));
			console.log(pdfs)
            res.json({ newsletters: pdfs }); // Send the array of PDFs in the response
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});

router.route('/user/newsletterData/:id')
    .get(async (req, res) => {
        try {
			const id = req.params.id;

            const newsletter = await Newsletters.findById(id).sort({ uploadDate: -1 }); // Retrieve all newsletters from the database
			const pdf = newsletter.map(newsletter => ({
				_id: newsletter._id,
				data: Buffer.from(newsletter.data, 'base64').toString('base64')
            }));
			
			console.log(pdf)
            res.json({ letter: pdf }); // Send the array of PDFs in the response
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});

router.route('/user/downloadNewsletter/:letter_id')
    .get(async (req, res) => {
        try {

            const letter_id = req.params.letter_id;
            console.log("letterid",letter_id)
            const newsletter = await Newsletters.findById(letter_id); // Retrieve the newsletter from the database
            console.log("newsletter",newsletter)
			if (!newsletter) {
                return res.status(404).json({ error: "Newsletter not found" });
			}

			console.log(newsletter.data)

            res.json({letter: Buffer.from(newsletter.data).toString('base64')});
		
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });


router.route('/user/deleteNewsletter')
    .post(async (req, res) => {
		
		try {
			const { id } = req.body;
            await Newsletters.findByIdAndDelete(id);
            
            res.json({ message: "Successfully deleted newsletter" });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});

router.route('/user/settings/:id')
    .get(async (req, res) => {
		try {
			const user_id = req.params.id;
			const settings = await AccountSetting.find({ user_id: user_id });
            res.json({ settings: settings[0] });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});


router.route('/user/updateSettings')
    .post(async (req, res) => {
		try {
			const { settings } = req.body;
			console.log(settings)

			const result = await AccountSetting.findOneAndUpdate({ user_id: settings.user_id }, 
				settings, { new: true } );

            //const user_prefs = await AccountSetting.findById(user_id);
            
            res.json({ message: "Successfully updated settings " });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});


app.post('/user/send-ivey-message', async(req,res) => {
		try{
		console.log('Sending message to Ivey')
		const {name, email, message, subject, phoneNumber} =  req.body;
		const transport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'cheerhomepage282@gmail.com',
				pass: 'ccurbpkzzbdzxlkq'
			}
		})
			await transport.sendMail({
			  from: "cheerhomepage282@gmail.com",
			  to: 'olivinglearning@gmail.com',
			  subject: subject,
			  text: "Hello I'm " + name +'.\n\t' + message + '\nMy phone number is ' + phoneNumber + ' and my email for responding back to me is ' + email
			});
			res.status(200).send('Email sent successfully');
		  } catch (error) {
			console.error('Error sending email:', error);
			res.status(500).send('Error sending email');
		  }

	});


/****************************** CHAT STUFF **************************/

router.route('/chat/getChatInfo/:id')
    .get(async (req, res) => {
		try {


			const user_id = req.params.id;
			const result = await ChatUser.find({ user_id: user_id });
			const chatUser = result[0];
			const threads = [];


			//await ChatUser.updateMany({$set: {threads: []}});


			for(let thread_id of chatUser.threads){

				let thread = await ChatThread.find({ _id: thread_id}).lean();
				thread = thread[0];
				let p = {};

				for(let u_id of thread.participant_ids){
					let user = await User.find({ _id: u_id}).lean();
					p[u_id] = {
						username: user[0].username,
						pfp: user[0].pfp
					}
				}

				thread.participants = p;
				delete thread.participant_ids;
				
				/*
				const texts = await ChatText.find({
					thread_id: thread_id,
					viewers: { $nin: [user_id] }
				}).lean()

				const recentText = await ChatText.aggregate([
					{ $match: { thread_id: thread_id } },
					{ $sort: { date: -1 } }, 
					{ $limit: 1 } 
				]).date; */

				//thread.date = recentText;
				//thread.unread = texts.length;

				let this_unread = thread.unread[user_id]
				thread.unread = this_unread;
				threads.push(thread);
			}

			threads.sort((a,b)=> a.date - b.date)

			const info = {
				chats_enabled: chatUser.chats_enabled,
				threads: threads
			}

			res.json({ chat_info: info });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});


router.route('/chat/getThread/:thread_id/:user_id')
    .get(async (req, res) => {
		try {

			const user_id = req.params.user_id;
			const thread_id = req.params.thread_id;
			const result = await ChatThread.find({ _id: thread_id}).lean();
			const thread = result[0];

			//setting as read by user

			console.log("usnejdn", user_id)

			let t = await ChatThread.find({_id: thread_id}).lean();
			t = t[0];
			console.log("t",t)
			let unread = t.unread;
			unread[user_id] = 0;
			console.log("unread", unread)


			await ChatThread.findOneAndUpdate({_id: thread_id}, 
			{ $set: { date: new Date(), unread: unread}});

			let texts = await ChatText.find({
				thread_id: thread_id
			}).lean();

			thread.texts = texts;
			res.json({ thread_info : thread});

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});


router.route('/chat/getUsernames/:user_id')
    .get(async (req, res) => {
		try {

			const user_id = req.params.user_id;
			console.log("user id", user_id)

			let users = await User.find(
				{ _id: { $ne: user_id } },
				{ id: 1, username: 1 }
			).lean();
		
			res.json(users);

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});


router.route('/chat/send-message')
    .post(async (req, res) => {
		try {

			const {thread_id, message, sender_id} =  req.body;

			let newText = new ChatText({
				thread_id: thread_id, 
				sender_id: sender_id,
				text: message,
			});

			let thread = await ChatThread.find({_id: thread_id}).lean();
			thread = thread[0];
			let unread = thread.unread;

			for(let id in unread){
				if (id != sender_id){
					unread[id] +=1
				}
			}

			await ChatThread.findOneAndUpdate({_id: thread_id}, 
			{ $set: { date: new Date(), unread: unread}});

			await newText.save();

			res.json("Message sent successfully");

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});


router.route('/chat/create-thread')
    .post(async (req, res) => {
		try {

			const {message, sender_id, participants } =  req.body;

			let unread1 = {}

			for(let id of participants){
				unread1[id] = 1;
			}
			unread1[sender_id] = 0;

			let newThread = new ChatThread({
				participant_ids: participants,
				unread: unread1
			});

			let t = await newThread.save();
			let t_id = t.id;

			let newText = new ChatText({
				thread_id: t_id, 
				sender_id: sender_id,
				text: message,
			});

		
			let txt = await newText.save();

			let ps = {};

			for(let p_id of participants){
				await ChatUser.findOneAndUpdate(
					{user_id: p_id},
					{$push: {
						threads: t_id
					}}
				)
				let usrs = await User.find(
					{_id: p_id},
					{username: 1, pfp: 1}
				).lean();

				let usr = usrs[0];
				delete usr._id;
				ps[p_id] = usr;
			}

			let new_thread = {
				participants: ps,
				unread: 0,
				date:t.date,
				_id: t_id
			}

			res.json(new_thread);

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});

/****************************** FINISH CHAT STUFF **************************/



app.post('/user/approveUser', async(req, res) =>{
	try{
		const {username, approveStatus, denyStatus} = req.body;
		console.log('you pressed approve or deny')
		const user1 = await User.findOne({username: username});
		if(approveStatus)
		{
			user1.verified=true;
			console.log(user1)
		
		}else if(denyStatus){
			user1.verified=false;
			console.log(user1)
		}
		await user1.save();
		console.log(user1)
		res.status(200).json({ message: `User verification status updated` });
	}
	catch (error) {
		console.error('Error Approving Account:', error);
		res.status(500).send('Cannot approve account');
	  }
})

app.get('/user/unverifiedUsers', async(req, res) =>{
	try{
		const unverifiedUsers = await User.find({verified: false});
		console.log(unverifiedUsers)
		res.json(unverifiedUsers);
	}catch (error) {
        console.error('Error fetching unverified users:', error);
        throw error;
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
