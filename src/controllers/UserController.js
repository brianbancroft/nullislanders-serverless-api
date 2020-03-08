const {
  AuthenticationError,
  // ForbiddenError,
  UserInputError,
  ApolloError,
} = require('apollo-server-express')

const { User } = require('../models')
const { bcrypt } = require('../helpers')
const { jwtAuth } = require('../modules')

exports.register = async (root, { name, email, password }, ctx) => {
  password = await bcrypt.encrypt(password)
  const match = await User.findByEmail({ email }).catch(e => {
    console.error('Error in finding by email ', e)
    throw new ApolloError(e)
  })

  if (match) throw new UserInputError('Email address already in use')

  const response = await User.create({ email, name, password })
  const { isAdmin } = response

  const token = jwtAuth.generateToken({ email, name, isAdmin })

  if (token)
    ctx.res.cookie('Authorization', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })

  return {
    ...response,
    karma: 0,
  }
}

exports.authenticate = async (root, { email, password }, ctx, _info) => {
  const match = await User.findByEmail({ email }).catch(e => {
    console.error('Error in finding by email ', e)
    throw new AuthenticationError('Incorrect email or password')
  })

  if (!match) throw new AuthenticationError('Incorrect email or password')

  const passwordValid = await bcrypt.compare(password, match.passwordDigest)

  if (!passwordValid)
    throw new AuthenticationError('Incorrect email or password')

  const token = await jwtAuth.generateToken({
    email,
    name: match.name,
    isAdmin: match.isAdmin,
  })

  if (token)
    ctx.res.cookie('Authorization', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })
  return {
    ...match,
  }
}

exports.find = async (root, { id }) => await User.find({ id })
// exports.all = async (root, args, ctx, info) => {}
