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
    (req, res, next) => {
      console.info(`User registration...`)
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
    (req, res, next) => {
      console.log(`sending an activation email...`)
      const activationToken = db.activationTokens.create()
      db.activationTokens.insert(req.registration.id, activationToken, (err, activation) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
          // TODO: send an actual activation email link
          console.log(`activation email sent for user ${activation.userId}; token: ${activation.token}`)
        }
      })
      next()
    },
    (req, res) => {
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
