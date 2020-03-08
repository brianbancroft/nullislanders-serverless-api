const jwt = require('jsonwebtoken')
const User = require('../models/User')

// TODO: Use an enviornment variable
const secret = 'hamburgers'

/*
  A note on generated tokens:

  The source of truth of access levels is from user's record.
  This access level used in the token is for show in the UI.

*/
exports.generateToken = async ({ email, name, isAdmin }) => {
  // Prevent API tokens from expiring
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1000000

  return jwt.sign(
    {
      exp,
      data: { name, email, isAdmin },
    },
    secret,
  )
}

exports.getEmailFromToken = ({ token }) => {
  const {
    data: { email },
  } = jwt.verify(token, secret)

  return email
}

exports.checkToken = async ({ token }) => {
  if (!token) return null
  else {
    const { data } = jwt.verify(token, secret)
    const { email } = data

    const user = await User.findByEmail({
      email,
    }).catch(e => {
      console.error('Error in findByEmail call of jwtAuth, ', e) // User not found.
      return {
        error: 'Invalid token',
        user: null,
      }
    })

    return user
  }
}
