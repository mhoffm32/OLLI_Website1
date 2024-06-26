const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  attendees: {
    type: [{email: String, signature: String}],
    default: []
  },
  waiver: {
    type: [{header: String, content: String}],
    default: []
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
