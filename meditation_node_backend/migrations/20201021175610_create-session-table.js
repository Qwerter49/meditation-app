exports.up = async function(knex) {
    await knex.schema.createTable("sessions", table => {
        table.increments()
        table.integer("seconds")
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("sessions")
}
