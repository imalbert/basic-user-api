'use strict';

const {createId} = require('../utils')

const users = {}
// {
//   [id]: {
//     id,
//     email,
//     password,
//     first_name,
//     last_name,
//     account_status: ACCOUNT_STATUS.INACTIVE
//   }
// }

const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
}
module.exports.ACCOUNT_STATUS = ACCOUNT_STATUS

function findAll ({ authorized }, done) {
  const allUsers = Object.values(users).map(user => ({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  }))

  if (authorized) return done(null, allUsers)
  return done(null, allUsers.map(({ first_name }) => ({ first_name })))
}

function findById (id, done) {
  const user = users[id]

  if (user) return done(null, user)
  return done(new Error(`Unable to find user with the id ${id}`));
};

function findByEmail (email, done) {
  const user = Object.values(users).find(user => user.email === email)
  if (user) return done(null, user)
  return done(new Error(`Unable to find user with the email ${email}`));
};

function register ({ email, password, first_name = '', last_name = '' }, done) {
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

function changePassword(userId, newPassword, done) {
  users[userId] = {
    ...users[userId],
    password: newPassword,
  }

  done(null, users[userId])
}

function activateUser(userId, done) {
  users[userId] = {
    ...users[userId],
    account_status: ACCOUNT_STATUS.ACTIVE,
  }

  done(null, users[userId])
}

module.exports.findAll = findAll
module.exports.findById = findById
module.exports.findByEmail = findByEmail
module.exports.register = register
module.exports.findById = findById
module.exports.changePassword = changePassword
module.exports.activateUser = activateUser
