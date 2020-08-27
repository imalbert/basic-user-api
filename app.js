const express = require('express')
const passport = require('passport')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const routes = require('./routes')

require('dotenv').config()
require('./authorize')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser())

app.post('/auth/login', routes.authenticate.login)
app.get('/auth/logout', routes.authenticate.logout)
app.route('/api/users')
  .get(routes.users.find)
  .post(routes.users.register)
  .put(routes.users.activate)
  .patch([
    passport.authenticate('bearer', { session: false }),
    ...routes.users.chPasswd
  ])

app.listen(process.env.PORT, function(){
  console.log(`Express server is running on ${process.env.PORT}.`);
});
