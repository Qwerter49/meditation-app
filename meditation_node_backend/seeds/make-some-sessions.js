exports.seed = async function(knex) {
  await knex("users-sessions").del()
  await knex("sessions").del()
  await knex("users").del()

  const jay = await knex("users").insert({
    id: 1,
    username: "jay",
    password_hash: "jayoliver",
  }).returning("id").then(ids => ids[0])

  const chuck = await knex("users").insert({
    id: 2,
    username: "chuck",
    password_hash: "jayoliver",
  }).returning("id").then(ids => ids[0])


  const session1 = await knex("sessions").insert({
    id: 1,
    seconds: 45
  }).returning("id").then(ids => ids[0])

  const session2 = await knex("sessions").insert({
    id: 2,
    seconds: 15
  }).returning("id").then(ids => ids[0])

  const session3 = await knex("sessions").insert({
    id: 3,
    seconds: 30
  }).returning("id").then(ids => ids[0])


await knex("users-sessions").insert([
  {
    user_id: jay,
    session_id: session1
  },
  {
    user_id: jay,
    session_id: session2
  },
  {
    user_id: chuck,
    session_id: session3
  }
])
return true
};
