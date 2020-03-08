const { internet, lorem } = require('faker')
const { url } = internet
const { sentence } = lorem

exports.seed = function(knex) {
  // Deletes ALL existing entries

  const content = []
  for (let i = 0; i < 200; i++) {
    content.push({
      url: url(),
      title: sentence(),
      // Alternate between user 1 or 2
      user_id: i % 2 === 0 ? 1 : 2,
    })
  }

  return knex('articles')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('articles').insert(content)
    })
}
