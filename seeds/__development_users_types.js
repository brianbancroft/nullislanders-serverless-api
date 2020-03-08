exports.seed = async function(knex) {
  // SET PASSWORD TO ALL USERS TO 'password'
  // Deletes ALL existing entries
  return knex('user_types')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('user_types').insert([
        {
          name: 'User',
          description: 'basic unverified user',
        },
        {
          name: 'Verified User',
          description: 'User with verified email address',
        },
        {
          name: 'Moderator',
          description: 'User with moderation permissions',
        },
        {
          name: 'Administrator',
          description: 'Top-Level permissions',
        },
      ])
    })
}
