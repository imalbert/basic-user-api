'use strict';

const {createId} = require('../utils')

const users = {}
const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
}
module.exports = ACCOUNT_STATUS

module.exports.findById = (id, done) => {
  const user = users[id]

  if (user) return done(null, user)
  return done(new Error(`Unable to find user with the id ${id}`));
};

module.exports.findByEmail = (email, done) => {
  const user = Object.values(users).find(user => user.email === email)

  if (user) return done(null, user)
  return done(new Error(`Unable to find user with the email ${email}`));
};

module.exports.register = ({ email, password, first_name = '', last_name = '' }, done) => {
  if (!email) {
    done(new Error(`'email' is required for user registration`))
  } else if (!password) {
    done(new Error(`'password' is required for user registration`))
  } else {
    // generate new id
    const id = createId()
    const newUser = {
      id,
      email,
      password,
      first_name,
      last_name,
      account_status: ACCOUNT_STATUS.INACTIVE
    }

    // save to db
    users[id] = newUser
    console.log(`User registered: ${id}`)

    done(null, {
      user: { id, email, first_name, last_name, account_status: newUser.account_status },
    })
  }
}
