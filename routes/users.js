'use strict'

const db = require('../db')
const contains = (a, b) => a.indexOf(b) >= 0

module.exports = {
  find: [
    (req, res) => {
      // TODO: has token? return all users
      // TODO: no token? all users, omit email and last_name

      res.json({ temp: `returning all users` })
    }
  ],
  register: [
    function registerUser (req, res, next) {
      console.info(`User registration started`)
      db.users.register({ ...req.body }, (err, registration) => {
        if (err) {
          if (contains(err.message, `email`) || contains(err.message, `password`)) {
            console.error(err.message)
            res.status(400).json({ error: err.message })
          }
        } else {
          req.registration = registration.user
          next()
        }
      })
    },
    function createActivationToken (req, res, next) {
      console.log(`Creating activation token...`)
      const activationToken = db.activationTokens.create()
      db.activationTokens.insert(req.registration.id, activationToken, (err, activation) => {
        if (err) {
          res.status(500).json({ error: err.message })
        } else {
          req.activation = activation
          next()
        }
      })
    },
    function sendActivationEmail (req, res, next) {
      console.log(`Sending activation email...`)
      // TODO: send an actual activation email link
      console.log(`activation email sent for user ${req.activation.userId}; token: ${req.activation.token}`)
      next()
    },
    function completeRegistration (req, res) {
      console.log(`User registration completed`)
      res.json(req.registration)
    }
  ],
  activate: [
    (req, res) => { res.send(`activate user`) },
  ],
  chPasswd: [
    (req, res) => { res.send(`change password`) },
  ]
}
