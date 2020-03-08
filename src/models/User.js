const client = require('../config/database')
const { convertArrayObjectKeysToCamelCase } = require('../helpers')

exports.findByEmail = async ({ email }) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = '${email}'
  `

  const { rows } = await client.query(query).catch(e => {
    console.log('Error in findByEmail query ', e)
    throw e
  })

  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.find = async ({ id }) => {
  const query = `
    SELECT *
    FROM users
    WHERE id = '${id}'
  `

  const { rows } = await client.query(query).catch(e => {
    console.log('Error in find query ', e)
    throw new Error(e)
  })

  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.create = async ({ email, password, name }) => {
  const query = `
    INSERT INTO
      users(email, name, password_digest)
      VALUES($1, $2, $3)
      RETURNING *;
  `
  const { rows } = await client
    .query(query, [email, name, password])
    .catch(e => {
      console.log('Error in create new user query ', e)
      throw e
    })
  return convertArrayObjectKeysToCamelCase(rows)[0]
}

exports.all = async () => {}
