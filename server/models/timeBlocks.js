const mongoose = require('mongoose');

const timeBlockSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    description: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
});

const TimeBlock = mongoose.model('TimeBlock', timeBlockSchema);

module.exports = TimeBlock;