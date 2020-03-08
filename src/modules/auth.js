const User = require('../models/User')
const { bcrypt } = require('../helpers')
const jwtAuth = require('./jwtAuth')
const mailer = require('./mailer')

const validate = async ({ email, password }) => {
  let user = await User.findByEmail({ email })

  if (user) {
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      return { user }
    } else {
      return { error: { password: 'Incorrect password' } }
    }
  } else {
    return { error: { email: 'No user found' } }
  }
}

const generateToken = async ({ email, name, accessLevel, type }) =>
  await jwtAuth.generateToken({ email, name, accessLevel, type })

exports.generateToken = generateToken

exports.authenticateUser = async ({ email, password }) => {
  const { user, error } = await validate({ email, password })

  // Creates a JWT Token used for UI
  const token =
    error && Object.keys(error).length > 0
      ? null
      : await generateToken({ ...user, type: 'UI' })

  return { user, error, token }
}

exports.createUser = async ({ email, name, password }) => {
  const encryptedPassword = await bcrypt.encrypt(password)

  // TODO: Search for existing email. Return error if false

  // TODO: Search for password integrity. Return error if false

  const apiToken = await generateToken({ email, name, type: 'API' }).catch(
    e => {
      console.log('Error in generateToken method of createUser', e)
    },
  )

  const { user, error } = await User.create({
    name,
    email,
    password: encryptedPassword,
    apiToken,
  }).catch(e => {
    console.log('Error in User.create method of createUser', e)
  })

  const token = error
    ? null
    : await generateToken(user).catch(e => {
        console.log('Error in generateToken method of createUser', e)
      })

  return { user, error, token }
}

const excludedEndpoints = ['/graphql', '/api/v1/authenticate']

// Verifies whether unvalidated users are over their expiry interval of 3 days
const userOverExpiryInterval = user =>
  !user.emailValidated &&
  (Date.now() - user.createdAt) / (24 * 60 * 60 * 1000) > 3

/*
  ValidateCurrentUser is middleware used in app.js that validates users
  who present an API key in the header.

*/
exports.validateCurrentUser = async (req, res, next) => {
  if (excludedEndpoints.indexOf(req.url) === -1 && req.user == null) {
    let { token, api_key: apiKey } = req.headers
    if (apiKey) token = apiKey

    if (token) {
      const user = await jwtAuth
        .checkToken({ token, isApiToken: true })
        .catch(e => {
          if (e.name === 'TokenExpiredError') {
            // DO NOTHING
          } else {
            console.log('Error => Unhandled error in jwtAuth module -> ', e)
          }
        })
      if (userOverExpiryInterval(user)) {
        mailer.sendReminderEmail({
          token: user.validationToken,
          emailAddress: user.email,
        })
        res.status(401)
        res.send('Validate your email to continue using this service')
        return
      }
      req.user = user // eslint-disable-line
    }
  }

  next()
}
