const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  logger: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  }
})

module.exports.sendEmail = (emailOptions, done) => {
  console.log('emailOpts', emailOptions)
  transporter.sendMail(
    { from: process.env.NODEMAILER_USER, ...emailOptions, },
    (err, result) => {
      if (err) {
        done(new Error(err.message))
      } else {
        done(null, result)
      }
    },
  )
}
