
exports.up = function(knex) {
  return knex.schema.createTable('users', function (t) {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
    t.string('email').notNull();
    t.string('password_digest').notNull();

    t.integer('user_type_id').notNull()
    t.foreign("user_type_id").references('id').inTable('user_types');

    t.dateTime('created_at').notNull().defaultTo('now()');
    t.dateTime('updated_at').nullable().defaultTo('now()');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
