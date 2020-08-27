'use strict'

module.exports = {
  find: [
    (req, res) => {
      // TODO: has token? return all users
      // TODO: no token? all users, omit email and last_name
      
      res.json({ temp: 'returning all users' })
    }
  ],
  register: [
    (req, res) => { res.send('register') },
  ],
  activate: [
    (req, res) => { res.send('activate user') },
  ],
  chPasswd: [
    (req, res) => { res.send('change password') },
  ]
}
