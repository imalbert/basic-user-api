'use strict'

module.exports = {
  login: [
    (req, res) => { res.send('login') },
  ],
  logout: [
    (req, res) => { res.send('logout') },
  ],
}