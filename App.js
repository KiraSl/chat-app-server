const express = require('express')
const cors = require('cors')
const nodeFetch = require('node-fetch')
const app = express()
const port = 3001
const whitelist = ['http://localhost:3000']
let users
const messages = []

const corsOptions = {
  origin: (origin, callback) => {
    console.log('origin: ', origin)
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('blockedByCors'))
    }
  }
}

app.use(cors(corsOptions))

// tell express to use json
// https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
app.use(express.json())

nodeFetch('https://randomuser.me/api/?results=2').then(res => res.json()).then(({ results }) => {
  users = results.map(user => ({
    id: user.login.uuid,
    name: user.name.first,
    avatar: user.picture.thumbnail,
  }
  ))
  console.log('users', users)
})

const room = {
  id: 1,
  name: 'room1',
  messages,
  subscribedUsers: [],
}

app.get('/messages', (req, res) => {
  setTimeout(() => {
    return res.json(room)
  }, 4000)
})

app.get('/user/:id', (req, res) => {
  return res.json(users[+req.params.id])
})

app.post('/messages', (req, res) => {
  if (!req.body.comment) {
    res.status(400)
    res.send('Comment missing')
  } else {
    const message = { content: req.body.comment, createdAt: new Date(), author: req.body.author }
    messages.push(message)

    return res.json(message)
  }
})

app.listen(port, () =>
  console.log(`Chat app server listening on port ${port}`),
);
