const mongoose = require('../db'); 

const chatTextSchema = new mongoose.Schema({
   thread_id: String, 
   sender_id: String,
   time: { type: Date, default: Date.now },
   text: String,
});

const ChatTexts = mongoose.model('chatTexts', chatTextSchema);

module.exports = ChatTexts;
