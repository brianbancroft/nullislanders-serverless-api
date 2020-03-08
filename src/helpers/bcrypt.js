/*
  Bcrypt is a tool that encrypts strings. At this time, it is one of the
  more robust means of encyrpting user passwords and is a standard.

*/

const bcrypt = require('bcrypt')

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

exports.encrypt = async phrase => await bcrypt.hashSync(phrase, salt)

exports.compare = async (plainPhrase, encryptedPhrase) =>
  await bcrypt.compare(plainPhrase, encryptedPhrase).catch(e => {
    console.log('Error in the compare method of bcrypt', e)
  })
