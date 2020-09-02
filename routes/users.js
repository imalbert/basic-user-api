'use strict'

const db = require('../db')
const emailUtility = require('../utils/sendEmail')
const contains = (a, b) => a.indexOf(b) >= 0

module.exports = {
  find: [
    function verifyAccessToken (req, res, next) {
      const accessToken = req.headers.authorization
        && req.headers.authorization.split(' ')[1]

      if (!accessToken) {
        req.validToken = false
        next()
      }

      db.accessTokens.findOne(accessToken, (err, userId) => {
        req.validToken = !!userId
        next()
      })
    },
    function findAllUsers(req, res) {
      let hasAuthorization = { authorized: req.validToken }
      console.log(hasAuthorization)
      db.users.findAll(hasAuthorization, (err, allUsers) => {
        if (err) res.status(500).json({ error: err.message })
        res.json({ users: allUsers })
      })
    }
  ],
  register: [
    function registerUser (req, res, next) {
      console.info(`User registration started`)
      db.users.register({ ...req.body }, (err, registration) => {
        if (err) {
          if (contains(err.message, `email`) || contains(err.message, `password`)) {
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
      const activationLink = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/users/activate/?accountActivationToken=${req.activation.token}`
      const emailOptions = {
        to: req.registration.email,
        subject: `Email verification for account activation (basic-user-api)`,
        text: `This is your activation token: ${req.activation.token}.
You may click the link below to activate your account
${activationLink}.
        `,
      }

      emailUtility.sendEmail(emailOptions, (err, result) => {
        if (err) {
          console.log(`A problem occurred while sending activation email: ${err}`)
        } else {
          console.log(`Activation email sent for user ${req.activation.userId}; token: ${req.activation.token}`)
          console.log(result)
        }
      })

      next()
    },
    function completeRegistration (req, res) {
      console.log(`User registration completed`)
      res.json(req.registration)
    }
  ],
  activate: [
    function getToken(req, res, next) {
      req.token = req.query.accountActivationToken // from query
        || (req.headers.authorization && req.headers.authorization.split(' ')[1]) // from header
        || null
      next()
    },
    function verifyActivationToken(req, res, next) {
      if (req.token) {
        db.activationTokens.findByActivationToken(req.token, (err, userId) => {
          if (err) {
            res.status(400).json({ error: err.message })
          } else {
            req.userId = userId
            next()
          }
        })
      } else {
        res.status(400).json({ error: `Invalid token` })
      }
    },
    function activateUser(req, res) {
      const token = req.query.accountActivationToken
      db.users.activateUser(req.userId, (err, { password, ...user }) => {
        console.log(`Account has been activated for user ${user.id}`, user)
        res.status(200).send({ user })
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
      } else {
        db.users.changePassword(req.userId, newpw, (err, user) => {
          if (err) {
            res.status(500).json({ error: err.message })
          } else {
            res.status(204).send(`Password has been changed for user ${user.id}`)
          }
        })
      }
    },
  ]
}
