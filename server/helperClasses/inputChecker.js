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
}

module.exports = InputChecker;
