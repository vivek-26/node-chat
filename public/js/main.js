// Initiate a request (Socket.io) - Open a new websocket and keep that open.
var socket = io();

// Listen for connect event
socket.on('connect', () => {
    console.log('Connected to Server!');
});

// Listen for disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from Server!');
});

// Emit new message event
socket.emit('createMessage', {
    'from': 'vivek@example.com',
    'text': 'Hey, buddy check on bitcoins!'
});

// Listen for new message event
socket.on('newMessage', (message) => {
    console.log('New Message Received - ', message);
});