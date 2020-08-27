const express = require('express')
const morgan = require('morgan')

require('dotenv').config()
const app = express()

app.use(morgan('combined'))

app.listen(process.env.PORT, function(){
  console.log(`Express server is running on ${process.env.PORT}.`);
});