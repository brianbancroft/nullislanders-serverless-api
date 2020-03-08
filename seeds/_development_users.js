const { bcrypt } = require('../src/helpers')
const { internet } = require('faker')

const { email, userName } = internet

const generateUnverifiedUser = password => ({
  name: internet.userName(),
  email: internet.email(),
  password_digest: password,
  user_type_id: 1,
})

const generateVerifiedUser = password => ({
  name: internet.userName(),
  email: internet.email(),
  password_digest: password,
  user_type_id: 2,
})

exports.seed = async function(knex) {
  // SET PASSWORD TO ALL USERS TO 'password'
  const password = await bcrypt.encrypt('password')

  const baseUsers = [
    {
      name: userName(),
      email: email(),
      password_digest: password,
      user_type_id: 1,
    },
    {
      name: userName(),
      email: email(),
      password_digest: password,
      user_type_id: 1,
    },
    {
      name: 'admin',
      email: 'testuser-admin-ott@mailinator.com',
      user_type_id: 4,
      password_digest: password,
    },
    {
      name: 'moderator',
      email: 'testuser-moderator-ott@mailinator.com',
      user_type_id: 3,
      password_digest: password,
    },
  ]

  for (let i = 0; i < 50; i++) {
    baseUsers.push(generateUnverifiedUser(password))
  }

  for (let i = 0; i < 50; i++) {
    baseUsers.push(generateVerifiedUser(password))
  }

  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(baseUsers)
    })
}
