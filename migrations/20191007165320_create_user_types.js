
exports.up = function(knex) {
  return knex.schema.createTable('user_types', function (t) {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
    t.string('description').notNull();

    t.dateTime('created_at').notNull().defaultTo('now()');
    t.dateTime('updated_at').nullable().defaultTo('now()');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_types');
};
