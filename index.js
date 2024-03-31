const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const cors = require('cors');

app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('offer', (offer) => {
        console.log('received offer:', offer);
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('received answer:', answer);
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        console.log('received ICE candidate:', candidate);
        socket.broadcast.emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('join room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
        socket.emit('joined', `You joined room: ${roomId}`);
        socket.to(roomId).emit('user joined', 'A new user joined the room');
    });
});

server.listen(3232, () => {
    console.log('Server is running on port 3000');
});
