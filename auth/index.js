const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const db = require('../db');

passport.use(new Strategy((token, cb) => {
  db.accessTokens.findOne(token, (err, userId) => {
    if (err) return cb(err)
    if (!userId) return cb(null, false)
    return cb(null, userId)
  })
}))
