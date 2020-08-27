const express = require('express')
const morgan = require('morgan')
const routes = require('./routes')
require('dotenv').config()

const app = express()
app.use(morgan('combined'))

app.post('/auth/login', routes.authorize.login)
app.get('/auth/logout', routes.authorize.logout)
app.route('/api/users')
  .get(routes.users.find)
  .post(routes.users.register)
  .put(routes.users.activate)
  .patch(routes.users.chPasswd)

app.listen(process.env.PORT, function(){
  console.log(`Express server is running on ${process.env.PORT}.`);
});