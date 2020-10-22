exports.seed = async function(knex) {
  await knex("session").del()
  await knex("user").del()

  await knex("user").insert([{
    id: 1,
    username: "jo",
    password_hash: "jayoliver",
    session_id: 1
  },{
    id: 2,
    username: "co",
    password_hash: "chuckoliver",
    session_id: 2
  }])

  await knex("session").insert([{
    id: 1,
    seconds: 45
  },
  {
    id: 2,
    seconds: 15
  },
  {
    id: 3,
    seconds: 30
  }])
};
