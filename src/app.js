// app.js
const express = require('express')
const app = express()
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./graphql')
const jwtAuth = require('./modules/jwtAuth')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const client = require('./config/database')

//Handle the GET endpoint on the root route /

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(cookieParser())

const corsMiddleware = cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
})

app.use(corsMiddleware)
app.use(async (req, res, next) => {
  if (process.env.LOCAL !== 'true') {
    await client.connect()
  }
  next()
})

app.get('/', async (req, res) => {
  res.status(200).send('Server is up and running')
})

app.get('/database', async (req, res) => {
  await client.connect()
  const response = await client.query('SELECT now();').catch(e => {
    res.status(500).send('Internal server error ', e)
    return
  })
  client.end()
  res.status(200).send(response.rows)
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: false,
  introspection: true,
  context: async ({ req }) => {
    const token = req.cookies.Authorization || ''

    if (!token || Object.keys(token).length === 0) {
      return { ...req, user: {} }
    }
    const user = await jwtAuth.checkToken({ token }).catch(e => {
      if (e.message !== 'jwt expired') {
        console.log('JWT Authentication error => ', e)
      }
      return { ...req, user: {} }
    })
    return { ...req, user }
  },
  playground: {
    settings: {
      'editor.theme': 'light',
      'request.credentials': 'include',
    },
  },
})

server.applyMiddleware({ app })

module.exports = app
