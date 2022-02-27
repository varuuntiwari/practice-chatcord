// Importing dependencies
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrUser, userLeave, getUsers } = require('./utils/users');

// Creating objects for running server with dependencies
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'static')));
var botName = 'ChatBot';

// When connection is detected
io.on('connection', (socket) => {

    // When room is joined
    socket.on('joinRoom', ({ username, room }) => {
        // Create user object and join room
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
 
        // Update users list on sidebar
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsers(user.room)
        });

        socket.emit('message', formatMessage(botName, `Welcome to ChatCord`));
        // Broadcast to room when a user connects
        socket.broadcast.to(user.room).emit('notification', `${user.username} joined the chat`);
    });

    // When user texts, emit message to all connections
    socket.on('chatMsg', (msg) => {
        const user = getCurrUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // On disconnecting, emit message across connections
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('notification', `${user.username} left the chat`);
            // Update users list on sidebar
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUsers(user.room)
            });
        }
    });
});

// Running server on PORT
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));