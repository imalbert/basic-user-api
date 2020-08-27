'use strict'

const db = require('../db')
const contains = (a, b) => a.indexOf(b) >= 0

module.exports = {
  find: [
    function findAllUsers(req, res) {
      if (req.query.token) {
        db.users.findAll({ authorized: true }, (err, allUsers) => {
          if (err) res.status(500).json({ error: err.message })
          res.json({ users: allUsers })
        })
      } else {
        db.users.findAll({ authorized: false }, (err, allUsers) => {
          if (err) res.status(500).json({ error: err.message })
          res.json({ users: allUsers })
        })
      }
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
          console.log('Activation token created ', activation.token)
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
    function verifyActivationToken(req, res, next) {
      const token = req.query.accountActivationToken
      if (token) {
        db.activationTokens.findByActivationToken(token, (err, userId) => {
          if (err) {
            res.status(500).json({ error: err.message })
          } else {
            req.userId = userId
            next()
          }
        })
      }
    },
    function activateUser(req, res) {
      const token = req.query.accountActivationToken
      db.users.activateUser(req.userId, (err, user) => {
        console.log(`Account has been activated for user ${user.id}`, user)
        res.status(204).send(`Account has been activated for user ${user.id}`)
      })
    }
  ],
  chPasswd: [
    function verifyAccessToken (req, res, next) {
      const accessToken = req.headers.authorization.split(' ')[1]
      db.accessTokens.findOne(accessToken, (err, userId) => {
        if (err || !userId) {
          res.status(500).json({ error: err.message })
        } else {
          req.userId = userId
          next()
        }
      })
    },
    function verifyPasswords (req, res, next) {
      db.users.findById(req.userId, (err, user) => {
        if (err) {
          res.status(400).json({ error: err.message })
        } else if (user.password !== req.body.oldpw) {
          res.status(400).json({ error: `Incorrect password` })
        } else {
          next()
        }
      })
    },
    function changePassword (req, res) {
      const { newpw, again } = req.body

      if (newpw !== again) {
        res.status(400).json({ error: `Passwords don't match` })
      }

      db.users.changePassword(req.userId, newpw, (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message })
        } else {
          res.status(204).send(`Password has been changed for user ${user.id}`)
        }
      })
    },
  ]
}
