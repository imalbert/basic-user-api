'use strict'

const createToken = require('../utils').createToken

const accessTokens = {}
// { 'user_id_001': 'access_token_001' }

module.exports.findByUserId = (userId, done) => {
  const token = accessTokens[userId]

  if (token) return done(null, token)
  return done(new Error(`Unable to find access token for the user ${userId}`));
}

module.exports.create = createToken
module.exports.insert = (userId, token, done) => {
  accessTokens[userId] = token

  return done(null, { userId, token })
}
