const express = require('express');
const http = require('http')
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.Server(app);
const websocket = socketio(server, {
    cors: true
  });

const clients = {};
const users = {};
let messages = [];

const sendMessage = () => {
    websocket.emit('client:event', messages);
}

websocket.on('connection', function (socket) {
    clients[socket.id] = socket;

    console.log('client connect...', socket.id);

    socket.on('server:event', async (data) => {
        console.log('message %s', data);
        messages.push(data)
        sendMessage(data);
    })

    socket.on('disconnect', async () => {
        console.log('client disconnect...', socket.id)
    })

    socket.on('error', (err) => {
        console.log('received error from client:', socket.id)
        console.log(err)
    })
})

websocket.on('connect', async (socket) => {
    console.log(`User connect with the following id: ${socket.id}`);
    users[socket.id] = socket;
    sendMessage();
});

const port = process.env.PORT_SOCKET || 9999;
server.listen(port, function (err) {
    if (err) throw err
    console.log('Listening on port %d', port);
});