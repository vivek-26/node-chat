import '../css/main.css';
import io from 'socket.io-client';
import Rx from 'rxjs';

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

// Listen for new message event
socket.on('newMessage', (message) => {
    console.log('New Message Received - ', message);
    const ol = document.querySelector('#messages');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${message.from}: ${message.text}`));
    ol.appendChild(li);
});

// Handle form submit
const formSubmit$ = Rx.Observable.fromEvent(document.querySelector('#message-form'), 'submit');
formSubmit$.subscribe({
    next: (event) => {
        event.preventDefault();
        socket.emit('createMessage', {
            'from': 'User',
            'text': document.querySelector('#message').value
        }, () => {});
    },
    error: (err) => console.log('Oops an error occurred. Details - ', err),
    complete: () => console.log('Completed!')
});