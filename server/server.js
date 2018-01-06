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

    /** IMPORTANT - .emit() rules
     * socket.emit() emits to a single connection
     * io.emit() emits to all connections
     * socket.broadcast() emits to all connections except itself
     */

    // Admin says hello
    socket.emit('newMessage', generateMessage('Admin',
        'Welcome to the chat app!'));

    // Broadcast the arrival of a new user to all other users
    socket.broadcast.emit('newMessage', generateMessage('Admin',
        'New User Joined!'));

    // Listen to create message event
    socket.on('createMessage', (message, callback) => {
        debug('Create Message - ', message);
        // io.emit() emits to all connections
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    // Listen to create location message event
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin',
            coords.latitude, coords.longitude));
    });
});

// If in 'production' mode, don't run webpack hot middleware.
if (process.env.NODE_ENV !== 'production') {
    (function () {
        // Step 1: Create & configure a webpack compiler
        const webpack = require('webpack');
        const webpackConfig = require('../webpack.config');
        const compiler = webpack(webpackConfig);

        // Step 2: Attach the dev middleware to the compiler & server
        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: webpackConfig.output.publicPath
        }));

        // Step 3: Attach the hot middleware to the compiler & server
        app.use(require('webpack-hot-middleware')(compiler, {
            // log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000
        }));
    })();
}

// Serve static files
app.use(express.static(publicPath));

// Listen on configured port
server.listen(PORT, () => {
    console.log(`Node Chat Application started on PORT - ${PORT}`);
    debug(`Node Chat Application started on PORT - ${PORT}`);
});