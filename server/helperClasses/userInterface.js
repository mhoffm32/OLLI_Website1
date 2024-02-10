const User = require('../models/User'); // adjust the path as needed

class UserInterface {
    static async getUserByEmail(mail){
        try {
            console.log("Getting User: " + mail)
            const email = mail.toLowerCase().trim()
            const userObj = await User.findOne({ email: email });
            console.log("userobj",userObj)
            if (userObj) {
                return userObj;
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = UserInterface;
