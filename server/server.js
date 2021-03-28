/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

const port = process.env.PORT || 3000
const server = express()
const { readFile, writeFile, unlink } = require('fs').promises

const setHeaders = (req, res, next) => {
  res.set('x-skillcrucial-user', 'dda3ec26-90b3-4233-87cb-6a23f0e1faab')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  return next()
}

const saveFile = async (users) => {
  await writeFile(`${__dirname}/test.json`, JSON.stringify(users), { encoding: 'utf8' })
}

const deleteFile = () => {
  unlink(`${__dirname}/test.json`)
}

const fileRead = async () => {
  return readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await saveFile(users)
      return users
    })
}

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())
server.use(setHeaders)

server.get('/api/v1/users/', async (req, res) => {
  const users = await fileRead()
  res.json(users)
})

server.post('/api/v1/users/', async (req, res) => {
  const users = await fileRead()
  const newUserData = req.body
  newUserData.id = users.length + 1
  const newUsersArray = [...users, newUserData]
  saveFile(newUsersArray)
  res.json({ status: 'success', id: newUserData.id })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const users = await fileRead()
  const userData = req.body
  const { userId } = req.params
  const newUsersArray = users.map((item) => {
    return item.id === +userId ? Object.assign(item, userData) : item
  })
  saveFile(newUsersArray)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const users = await fileRead()
  const { userId } = req.params
  const newUsersArray = users.filter((item) => {
    return item.id !== +userId
  })
  saveFile(newUsersArray)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/', (req, res) => {
  deleteFile()
  res.json('file deleted')
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

server.listen(port)

console.log(`Serving at http://localhost:${port}`)
