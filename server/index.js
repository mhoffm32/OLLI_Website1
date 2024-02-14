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
const userSignup = require('./routes/userSignUp.js');
const userLogin = require('./routes/userLogin.js');
const userSettings = require('./routes/userSettings.js');

/************ PASSPORT *******************/
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
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
const User = require('./models/User.js');
const Requests = require('./models/requests');
const Newsletters = require('./models/newsletters');
const AccountSetting = require('./models/accountSettings');
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
app.use(userSignup);
app.use(userLogin);
app.use(userSettings);



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



const multer = require("multer");
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




/****************************** FINISH INITIALIZATION **************************/

app.get("/api", (req, res) => {
  console.log("in index.js");
  res.json("hey");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

