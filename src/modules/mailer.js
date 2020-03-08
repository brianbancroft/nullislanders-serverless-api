const nodemailer = require('nodemailer')

const sendMail = ({ emailAddress, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAILER_SERVICE,
    auth: {
      user: process.env.EMAILER_USERNAME,
      pass: process.env.EMAILER_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAILER_USERNAME,
    to: emailAddress,
    subject,
    text,
  }
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Error in Email Service (modules/mailer.js) -> ', error)
      throw error
    } else {
      return info
    }
  })
}

exports.sampleEmail = ({ emailAddress }) =>
  sendMail({
    emailAddress,
    subject: 'Sample email',
    text: 'This is sample text',
  })
