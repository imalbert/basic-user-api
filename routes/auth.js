'use strict'

const accessTokens = require('../db/accessTokens')
const users = require('../db/users')

module.exports = {
  login: [
    function login(req, res) {
      const { email, password } = req.body
      users.findByEmail(email, (err, user) => {
        if (err || user.password !== password) {
          res.status(401).json(`Email or password is incorrect, please try again.`)
        } else {
          const token = accessTokens.create()
          accessTokens.insert(user.id, token, (err, access) => {
            console.log(`An access token ${access.token} has been created for the user ${access.userId}.`)
            res.redirect(`/api/users?token=${access.token}`)
          })
        }
      })
    },
  ],
  logout: [
    (req, res) => { res.send('logout') },
  ],
}