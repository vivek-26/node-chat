// Dependencies
const express = require('express');
const debug = require('debug')('node-chat');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');

const {
    isRealString
} = require('./utils/validation');

const {
    Users
} = require('./utils/users');

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

// User List
var users = new Users();

// Listen for a new connection, 'socket' param represents individual socket.
io.on('connection', (socket) => {
    debug('New user connected');

    // Listen for disconnect event
    socket.on('disconnect', () => {
        debug(`Disconnected from client`);
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',
                `${user.name} has left the room.`));
        }
    });

    /** IMPORTANT - .emit() rules
     * socket.emit() emits to a single connection
     * io.emit() emits to all connections
     * socket.broadcast() emits to all connections except itself
     */

    // Join Event Listener
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room name are required!');
        }

        socket.join(params.room);

        // Add the user
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // socket.leave(string)
        // Admin says hello
        socket.emit('newMessage', generateMessage('Admin',
            'Welcome to the chat app!'));

        // Broadcast the arrival of a new user to all other users
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',
            `${params.name} has joined!`));
        callback();
    });

    // Listen to create message event
    socket.on('createMessage', (message, callback) => {
        debug('Create Message - ', message);
        const user = users.getUser(socket.id);

        // Check if user exists
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        // io.emit() emits to all connections
        callback();
    });

    // Listen to create location message event
    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);

        // Check if user exists
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,
                coords.latitude, coords.longitude));
        }
    });
});

// Serve static files
app.use(express.static(publicPath));

// Listen on configured port
server.listen(PORT, () => {
    console.log(`Node Chat Application started on PORT - ${PORT}`);
    debug(`Node Chat Application started on PORT - ${PORT}`);
});