const Filter = require('bad-words');
const filter = new Filter();

class InputChecker {
    static sanitizeInput(input) {
        if(/^[\u00BF-\u1FFF\u2C00-\uD7FF\w-_]{0,20}$/.test(input)){
            console.log("Input is valid: " + input)
            return true;
        } else {
            return false;
        }
    }

    static validateEmail(mail){
        if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)){
            return true;
        } else {
            return false;
        }
    }

        // middleware function to check for bad words
    static checkForBadWords = (req, res, next) => {
        console.log('checking for bad words...');
        const content = req.body.content; // assuming 'content' holds the review text
        if (filter.isProfane(content)) {
            // respond with an error message if a bad word is detected
            return res.status(400).json({ message: 'Bad input detected' });
        } else {
            // proceed to the next middleware or the route handler if no bad words are found
            console.log('no bad words detected!')
            next();
        }
    };
}

module.exports = InputChecker;
