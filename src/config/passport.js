const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const config = require('./index');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      const user = await User.findById(payload._id);
      if (user) return done(null, user);
      return done(null, false);
    })
  )
}