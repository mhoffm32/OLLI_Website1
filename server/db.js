const mongoose = require('mongoose');
require('dotenv').config();

// go into your .env file and add a MONGODB_URI variable with your own mongodb uri
// you can find this on the atlas website when you click connect on your cluster
// you may also be able to use a local uri (??) idk how to do this though
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
