const express = require('express');
const router = express.Router();

const Event = require('../models/events');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'yourSecretKey' // replace with your secret key
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.id}, function(err, user) {
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

function isAdmin(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }
      if (user.type !== 'admin') { return res.status(403).send({ message: 'Requires admin role!' }); }
  
      req.user = user;
      next();
    })(req, res, next);
  }



router.route('/events/createEvent')
    .post(isAdmin, async (req, res) => {
        console.log("Creating event");
        let { title, description, date, location } = req.body;
        console.log("Date: " + date)
       
        const newEvent = new Event({
            title : title,
            description : description,
            date : date,
            location : location
        });

        await newEvent.save();
        console.log("Event created");
        res.status(200).json({ message: 'Event created' });
    });

module.exports = router;