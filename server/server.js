// Dependencies
const express = require('express');
const debug = require('debug')('node-chat');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

// Public path - static files
const publicPath = path.join(__dirname, '../public');
debug(`Static Folder Path - ${publicPath}`);

// Port
const PORT = process.env.PORT || 3000;
debug(`PORT - ${PORT}`)

// Create express application
const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Create WebSocket Server
const io = socketIO(server);

// Listen for a new connection, 'socket' param represents individual socket.
io.on('connection', (socket) => {
    debug('New user connected');

    // Listen for disconnect event
    socket.on('disconnect', () => {
        debug(`Disconnected from client`);
    });

    // Emit new message event
    socket.emit('newMessage', {
        'from': 'vivek@example.com',
        'text': 'Hey, buy bitcoins buddy!',
        'createdAt': '15:42'
    });

    // Listen to create message event
    socket.on('createMessage', (message) => {
        console.log('Create Message - ', message);
    });
});

// Serve static files
app.use(express.static(publicPath));

// Listen on configured port
server.listen(PORT, () => {
    console.log(`Node Chat Application started on PORT - ${PORT}`);
    debug(`Node Chat Application started on PORT - ${PORT}`);
});