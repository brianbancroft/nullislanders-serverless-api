
exports.up = function (knex) {
  return knex.schema.createTable('comment_votes', function (t) {
    t.increments('id').unsigned().primary()

    t.integer('user_id').notNull()
    t.integer('comment_id').notNull()

    t.foreign('user_id').references('id').inTable('users')
    t.foreign('comment_id').references('id').inTable('comments')

    t.integer('value').notNull().defaultTo(1)
    t.dateTime('created_at').notNull().defaultTo('now()')
    t.dateTime('updated_at').nullable().defaultTo('now()')
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('comment_votes')
};
