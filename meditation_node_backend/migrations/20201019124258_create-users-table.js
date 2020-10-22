exports.up = function(knex) {
  return knex.schema.createTable("user", table => {
      table.integer("id")
      table.string("username")
      table.string("password_hash")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user")
};
