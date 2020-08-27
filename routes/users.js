'use strict'

const db = require('../db/users')
const contains = (a, b) => a.indexOf(b) >= 0

module.exports = {
  find: [
    (req, res) => {
      // TODO: has token? return all users
      // TODO: no token? all users, omit email and last_name
      
      res.json({ temp: 'returning all users' })
    }
  ],
  register: [
    (req, res) => {
      db.register({ ...req.body }, (err, registration) => {
        if (err) {
          if (contains(err.message, 'email') || contains(err.message, 'password')) {
            console.error(err.message)
            res.status(400).json({ error: err.message })
          }
        } else {
          // TODO: send an activation email

          res.json(registration.user)
        }
      })
    },
  ],
  activate: [
    (req, res) => { res.send('activate user') },
  ],
  chPasswd: [
    (req, res) => { res.send('change password') },
  ]
}
