const { pipe } = require('ramda')
const bcrypt = require('./bcrypt')
const capitalizeLetterAdjacentUnderscores = require('./capitalize-letter-adjacent-underscores')
const stripNumberAdjacentUnderscores = require('./strip-number-adjacent-underscores')
const map = require('./map')
const convertObjectKeys = require('./convert-object-keys')
const sanitizeResponse = require('./sanitize-response')

const underscoreToCamelCase = pipe(
  capitalizeLetterAdjacentUnderscores,
  stripNumberAdjacentUnderscores,
)
const camelizeUnderscoreKeys = convertObjectKeys(underscoreToCamelCase)
const convertArrayObjectKeysToCamelCase = map(camelizeUnderscoreKeys)

module.exports = {
  bcrypt,
  camelizeUnderscoreKeys,
  capitalizeLetterAdjacentUnderscores,
  convertArrayObjectKeysToCamelCase,
  convertObjectKeys,
  stripNumberAdjacentUnderscores,
  sanitizeResponse,
  underscoreToCamelCase,
}
