exports.up = async function(knex) {
    await knex.schema.createTable("session", table => {
        table.integer("id")
        table.integer("seconds")
    })

    await knex.schema.table("user", table => {
        table.integer("session_id").references("id").inTable("session")
    })
};

exports.down = async function(knex) {
    await knex.schema.table("user", table => {
        table.dropColumn("session_id")
    })

    await knex.schema.dropTableIfExists("session")
};
