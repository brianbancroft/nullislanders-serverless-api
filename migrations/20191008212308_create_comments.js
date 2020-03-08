
exports.up = function (knex) {
  return knex.schema.createTable('comments', function (t) {
    t.increments('id').unsigned().primary()
    t.string('text').notNull()
    t.integer('article_id')
    t.integer('comment_id')

    t.integer('user_id').notNull()
    t.foreign('user_id').references('id').inTable('users')

    t.dateTime('created_at').notNull().defaultTo('now()')
    t.dateTime('updated_at').nullable().defaultTo('now()')
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('comments')
};
