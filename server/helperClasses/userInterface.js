const User = require('../models/User'); // adjust the path as needed

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'yourSecretKey' // replace with your secret key
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

class UserInterface {
    isAdmin(req, res, next) {
        passport.authenticate('jwt', { session: false }, function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }
          if (user.role !== 'admin') { return res.status(403).send({ message: 'Requires admin role!' }); }
      
          req.user = user;
          next();
        })(req, res, next);
    }

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
