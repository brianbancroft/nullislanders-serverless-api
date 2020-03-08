const { internet, lorem } = require('faker')
const { url } = internet
const { sentence } = lorem

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('articles')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('articles').insert([
        {
          url: url(),
          title: sentence(),
          user_id: 1,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 1,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 2,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 2,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 2,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 2,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 1,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 1,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 1,
        },
        {
          url: url(),
          title: sentence(),
          user_id: 1,
        },
      ])
    })
}
