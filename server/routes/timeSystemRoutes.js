const express = require('express');

const router = express.Router();

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

const User = require('../models/User');
const TimeSystem = require('../models/timeBlocks');

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
  
  function isEmployee(req, res, next) {
      passport.authenticate('jwt', { session: false }, function(err, user, info) {
        console.log(user);
        if (err) { return next(err); }
        if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }
        if (user.type !== 'employee') { return res.status(403).send({ message: 'Requires admin role!' }); }
    
        req.user = user;
        next();
      })(req, res, next);
    }

    function isAdmin(req, res, next) {
      passport.authenticate('jwt', { session: false }, function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }
        if (user.type !== 'admin') { return res.status(403).send({ message: 'Requires admin role!' }); }
    
        req.user = user;
        next();
      })(req, res, next);
    }

// Route for employee clocking in
router.route('/clock-in')
    .post(isEmployee, (req, res) => {
    console.log("Creating time block")
    let timeBlock = new TimeSystem({
        startTime: Date.now(),
        description: req.body.description,
        userId: req.user._id,
        approved: false
    });

    timeBlock.save();

    res.send('Employee clocked in successfully');
});

// Route for employee clocking out
router.route('/clock-out')
  .post(isEmployee, async (req, res) => {
    try {
      const timeBlock = await TimeSystem.findOneAndUpdate(
        { userId: req.user._id, endTime: null },
        { endTime: Date.now() },
        { new: true }
      );

      if (!timeBlock) {
        return res.status(404).send('No active time block found for this user');
      }

      res.send('Employee clocked out successfully');
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

router.route('/timeblocks/unapproved')
  .get(isAdmin, async (req, res) => {
    console.log("Getting unapproved time blocks")
    try {
      const timeBlocks = await TimeSystem.find({ isApproved: false });
      res.json(timeBlocks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Route for retrieving all time blocks for a user
router.route('/timeblocks/user/:userId')
  .get(isEmployee, async (req, res) => {
    console.log("Getting time blocks for user")
    try {
      const timeBlocks = await TimeSystem.find({ userId: req.params.userId });
      res.json(timeBlocks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;