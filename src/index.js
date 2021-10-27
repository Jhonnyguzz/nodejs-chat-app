const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const Filter = require('bad-words')
const { addMessage, getPendingMessagesForUsername, findMessagesForMeFromSomeone, getAllMessages,
    generateMessage, generateLocationMessage, generatePrivateMessage, findMessagesForUsername } = require('./utils/messages')
const { addUser, removeUser, offline, getUser, getUsersInRoom, getUserByUsername } = require('./utils/users')

const app = express();
app.use(cors())

const server = http.createServer(app);
const io = require("socket.io")(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cors: { origin: '*', methods: ["GET", "POST"] },
});

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('/messages', (req, res) => {
    res.send(findMessagesForMeFromSomeone(req.query.me, req.query.someone));
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        //let historyMessages = findMessagesForUsername(getUser(socket.id).username);
        //historyMessages.forEach(msg => io.to(socket.id).emit('privateMessage', generatePrivateMessage(msg.from, msg.text)));

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('privateMessage', (message, callback) => {
        const user = getUser(socket.id);
        
        let text = message.text;
        let privateUser = getUserByUsername(message.to)

        if(privateUser !== undefined && privateUser.connected) {
            let userid = privateUser.id;
            io.to(userid).emit('privateMessage', generatePrivateMessage(user.username, text));
            //io.to(socket.id).emit('privateMessage', generatePrivateMessage(user.username, text));
            addMessage(message);
            callback();
        } else {
            console.log("El usuario no existe o esta desconectado");
            if(privateUser !== undefined && !privateUser.connected) {
                addMessage(message);
                callback();
            } else
                callback({error:"El usuario no existe"});
        }

    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = offline(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})