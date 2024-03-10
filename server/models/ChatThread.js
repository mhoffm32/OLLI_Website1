const mongoose = require('../db'); 

const chatThreadSchema = new mongoose.Schema({
    participant_ids: Array, 
    date: { type: Date, default: Date.now },
    unread: mongoose.Schema.Types.Mixed,
});

const ChatThreads = mongoose.model('chatThreads', chatThreadSchema);

module.exports = ChatThreads;