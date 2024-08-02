const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const userSchema = require('../models/user');
const {AUTH_JWT_SECRET} = require('../config/env');

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: AUTH_JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await userSchema.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));
