'use strict'

const createToken = require('../utils').createToken

const activationTokens = {}
// { 'account_activation_token_001': 'user_id_001' }

module.exports.findByActivationToken = (token, done) => {
  const userId = activationTokens[token]

  if (userId) return done(null, userId)
  return done(new Error(`Unable to find user for the activation token ${token}`));
}

module.exports.create = createToken
module.exports.insert = (userId, token, done) => {
  activationTokens[token] = userId

  return done(null, { userId, token })
}
