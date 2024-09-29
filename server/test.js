import fs from 'fs'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { createServer } from 'node:http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'node:path'
import { Server } from 'socket.io'
import * as process from 'process';


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

const users = {}

app.use(cors(corsOptions))
app.use(express.json())
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
    socket.emit("me", socket.id)
    
    socket.on('message', (msg) => {
        console.log('message received: ', msg.room)
            socket.broadcast.emit('message', msg)
            console.log('message sent: ', msg.room)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
        console.log('User disconnected')
    })

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', {signal: data.signalData, from: data.from, name: data.name})
    })
    
    socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', { signal: data.signal });
    })

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
