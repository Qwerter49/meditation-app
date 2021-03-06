const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())


const knex = require("knex")
const config = require("./knexfile").development
const database = knex(config)

const { Model } = require("objection")
Model.knex(database)


const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { response, json, request } = require('express')


app.use(bodyParser.json())


class Session extends Model {
    static get tableName(){
        return 'sessions'
    }
}
//     static relationMappings = {
//         users: {
//             relation: Model.ManyToManyRelation,
//             modelClass: User,
//             join: {
//                 from: "sessions.id",
//                 through: {
//                     from: 'users_sessions.sessionId',
//                     to: 'users_sessions.userId'
//                 },
//                 to: 'users.id'
//             }
//         }
//     }
// }

class User extends Model {
    static get tableName(){
        return "users"
    }
    static relationMappings = {
        sessions: {
            relation: Model.ManyToManyRelation,
            modelClass: Session,
            join: {
                from: 'users.id',
                through: {
                    from: 'users-sessions.user_id',
                    to: 'users-sessions.session_id'
                },
                to: 'sessions.id'
            }
        }
    };
}

class Users_sessions extends Model {
    static get tableName(){
        return 'users-sessions'
    }

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'users-sessions.user_id',
                to: 'user.id'
            }
        }
    }
    static relationMappings = {
        session: {
            relation: Model.BelongsToOneRelation,
            modelClass: Session,
            join: {
                from: 'users-sessions.session_id',
                to: 'session.id'
            }
        }
    }
}

app.get("/users", (request, response) => {
    User.query().withGraphFetched('sessions')
        .then(users => {
            response.json({ users })
        }).catch(error => {
            console.error(error.message)
        })
})

app.get("/users-sessions", (request, response) => {
    Users_sessions.query()
        .then(usersSessions => {
            response.json({ usersSessions })
        }).catch(error => {
            console.error(error.message)
        })
})

app.get("/sessions", (request, response) => {
    Session.query()
        .then(sessions => {
            response.json({ sessions })
        }).catch(error => {
            console.error(error.message)
        })
})

//route to create a new user
app.post('/users', (request, response) => {
    const { user } = request.body
    bcrypt.hash(user.password, 12)
        .then(hashedPassword => {
            return User.query()
            .insert({
                id: user.id,
                username: user.username,
                password_hash: hashedPassword
        }).returning("*")
        }).then(users => {
            const user = users[0]
            response.json({ user })
        }).catch(error => {
            response.json({ error: error.message })
        })
})


//route to login as an existing user
app.post("/login", (request, response) => {
    const { user } = request.body
    
    User.query()
        .select()
        .where({ username: user.username })
        .first()
        .then(retrievedUser => {
            if (!retrievedUser) throw new Error("Invalid user")

            return Promise.all([
                bcrypt.compare(user.password, retrievedUser.password_hash),
                Promise.resolve(retrievedUser),
            ])
        }).then(results => {
            const arePasswordsTheSame = results[0]
            const user = results[1]

            if(!arePasswordsTheSame) throw new Error("Invalid password")

            const payload = { username: user.username }
            const secret = "QUIET!"

            jwt.sign(payload, secret, (error, token) => {
                if(error) throw new Error("Signing didn't work")

                response.json({ token })
            })

        }).catch(error => {
            response.json(error.message)
        })
})

//useless route currently. Auth protected
app.get("/lucky-charms", authenticate, (request, response) => {
    response.json({ message: `${request.user.username} found me Lucky Charms!` })
})

function authenticate(request, response, next){
    const authHeader = request.get("Authorization")
    const token = authHeader.split(" ")[1]

    const secret ="QUIET!"
    jwt.verify(token, secret, (error, payload) => {
        if(error) response.json({ error: error.message })

        User.query()
            .select()
            .where({ username: payload.username })
            .first()
            .then(user => {
                request.user = user
                next()
            }).catch(error => {
                response.json({ error: error.message })
            })
    })
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})