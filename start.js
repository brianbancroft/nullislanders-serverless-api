require('dotenv').config()
const express = require('express')
const server = express()
const sls = require('serverless-http')
const app = require('./src/app')
//Handle the GET endpoint on the root route /

server.use('/', app)
module.exports.server = sls(server)
