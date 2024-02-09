const mongoose = require('../db');

const accountSetting = new mongoose.Schema({
    user_id: String,
    email_newsletter: Boolean
});

const AccountSetting = mongoose.model('accountSetting', accountSetting);

module.exports = AccountSetting;