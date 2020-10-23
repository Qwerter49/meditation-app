exports.up = async function(knex) {
    await knex.schema.createTable("users-sessions", table => {
        table.increments("id")
        table.integer("user_id").references("id").inTable("users")
        table.integer("session_id").references("id").inTable("sessions")
    })
};

exports.down =  async function(knex) {
    return knex.schema.dropTableIfExists("users-sessions")
};
