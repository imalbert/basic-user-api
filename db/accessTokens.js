'use strict'

const createToken = require('../utils').createToken

const accessTokens = {}
// { 'access_token_001': 'user_id_001' }

module.exports.findOne = (token, done) => {
  const userId = accessTokens[token]

  if (userId) return done(null, userId)
  return done(new Error(`Unable to find user for the token ${token}`));
}

module.exports.create = createToken
module.exports.insert = (userId, token, done) => {
  accessTokens[token] = userId

  return done(null, { userId, token })
}
