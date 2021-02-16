const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001
const whitelist = ['http://localhost:3000']

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

const message = {
  id: 1,
  content: 'Hello',
  createdAt: '25.02.20',
  author: 1,
}

const room = {
  id: 1,
  name: 'room1',
  messages: [message],
  subscribedUsers: [],
}

app.get('/messages', (req, res) => {
  return res.json(room)
})

app.listen(port, () =>
  console.log(`Chat app server listening on port ${port}`),
);

