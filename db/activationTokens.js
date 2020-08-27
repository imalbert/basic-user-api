'use strict'

const createToken = require('../utils').createToken

const activationTokens = {}
// { 'user_id_001': 'account_activation_token_001' }

module.exports.findByUserId = (userId, done) => {
  const token = activationTokens[userId]

  if (token) return done(null, token)
  return done(new Error(`Unable to find token for the user ${userId}`));
}

module.exports.create = createToken
module.exports.insert = (userId, token, done) => {
  activationTokens[userId] = token

  return done(null, { userId, token })
}
