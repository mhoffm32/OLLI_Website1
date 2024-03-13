const mongoose = require('../db');

const images = new mongoose.Schema({
    img_name: String,
    image: Buffer,
    uploadDate: { type: Date, default: Date.now }
});

const Images = mongoose.model('Images', images);

module.exports = Images;