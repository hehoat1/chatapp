import fs from 'fs'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { createServer } from 'node:http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'node:path'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

let newUUID = ''
let name = ''
let roomArray = []
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '\*',
    }
})

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:2006']
}

app.use(cors(corsOptions))
app.use(express.json())
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
    socket.leave(socket.id)
    const room = newUUID.substr(0, 5)
    const last = roomArray.at(-1)
    if (room !== '' && room !== last) {
        roomArray.push(room)
    }
    socket.join(room)
    console.log(roomArray)
    //console.log('Joined room: ', room)
    socket.on('message', (msg) => {
        name = msg.user
        socket.join(socket.id)
        socket.broadcast.emit('message', msg)
        console.log('sent to: ', room)
        socket.leave(socket.id)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

app.get('/fetchUUID', (req, res) => {
    newUUID = uuidv4()
    res.json({uuid: newUUID})
})

app.get('/fetchUser', (req, res) => {
    if (name === '') {
        return null
    } else {
    res.json({name: name}) 
    }
})

app.get('/findRoom', (req, res) => {
    console.log('finding...')
})

app.get('/uhh', (req, res) => {
    const contents = fs.readFileSync(path.join(__dirname, 'public', 'words.txt'), { encoding: 'utf8'})
    const words = contents.split("\n")
    const word = (words[Math.floor(Math.random()*words.length)])
    res.json({word})
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.listen(2006, () => {
    console.log('Server running!')
})
