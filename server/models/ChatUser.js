const mongoose = require('../db'); 

const chatUserSchema = new mongoose.Schema({
   user_id: String, 
   chats_enabled: Boolean,
   threads: Array
});

const ChatUser = mongoose.model('chatUser', chatUserSchema);

module.exports = ChatUser;