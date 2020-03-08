/*
  Modules are inpure functions which often have side-effects.

  In ideal conditions, most of the business logic that doesn't exist in the
  models or the helpers should live here.

*/

exports.auth = require('./auth')
exports.jwtAuth = require('./jwtAuth')
exports.mailer = require('./mailer')
