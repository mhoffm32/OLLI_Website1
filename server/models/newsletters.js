const mongoose = require('../db');

const newsletters = new mongoose.Schema({
    letter_name: String,
    pdf_name: String, // Name of the PDF file
    data: Buffer, // Binary data of the PDF file
    uploadDate: { type: Date, default: Date.now } // Date of upload
});

const Newsletters = mongoose.model('Pdf', newsletters);

module.exports = Newsletters;