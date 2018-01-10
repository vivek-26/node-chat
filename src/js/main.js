import '../css/main.css';
import io from 'socket.io-client';
import Rx from 'rxjs';

// Initiate a request (Socket.io) - Open a new websocket and keep that open.
var socket = io();

// Listen for connect event
socket.on('connect', () => {
    console.log('Connected to Server!');

    let params = {};
    window.location.search.replace(
        new RegExp('([^?=&]+)(=([^&#]*))?', 'g'),
        function ($0, $1, $2, $3) {
            params[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
    );
    console.log('Query Params: ', params);

    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

// Listen for disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from Server!');
});

// Listen for new message event
socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    console.log('New Message Received - ', message);
    const ol = document.querySelector('#messages');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        'text': message.text,
        'from': message.from,
        'createdAt': formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html;
    ol.appendChild(div.firstElementChild);
    scrollToBottom();
});

// Listen for new location message
socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const ol = document.querySelector('#messages');
    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        'url': message.url,
        'from': message.from,
        'createdAt': formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html;
    ol.appendChild(div.firstElementChild);
    scrollToBottom();
});

// Handle form submit
const formSubmit$ = Rx.Observable.fromEvent(document.querySelector('#message-form'), 'submit');
formSubmit$.subscribe({
    next: (event) => {
        event.preventDefault();
        socket.emit('createMessage', {
            'from': 'User',
            'text': document.querySelector('#message').value
        }, () => {
            document.querySelector('#message').value = '';
        });
    },
    error: (err) => console.log('Oops an error occurred. Details - ', err),
    complete: () => console.log('Completed!')
});

// Handle Send Location Button Click Event
const locationButton$ = Rx.Observable.fromEvent(document.querySelector('.send-location'), 'click');
locationButton$.subscribe({
    next: (event) => {
        // Check if Geolocation is available
        if (!navigator.geolocation) {
            return alert('Geolocation Not Supported by Browser!');
        }

        // Disable the button && change text
        document.querySelector('.send-location').setAttribute('disabled', 'disabled');
        document.querySelector('.send-location').textContent = 'Sending Location ...';

        navigator.geolocation.getCurrentPosition((position) => {
            // Enable the button & change text
            document.querySelector('.send-location').removeAttribute('disabled');
            document.querySelector('.send-location').textContent = 'Send Location';
            socket.emit('createLocationMessage', {
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude
            });
        }, () => {
            document.querySelector('.send-location').removeAttribute('disabled');
            document.querySelector('.send-location').textContent = 'Send Location';
            alert('Unable to fetch location!')
        });
    },
    error: (err) => console.log('Oops an error occurred. Details - ', err),
    complete: () => console.log('Completed!')
});

// Handle Autoscrolling
function scrollToBottom() {
    // Selectors
    const messages = document.querySelector('#messages');
    const newMessage = document.querySelector('#messages li:last-child');
    const prevNewMessage = document.querySelector('#messages li:nth-last-child(2)');

    // Heights
    const clientHeight = messages.clientHeight || 0;
    const scrollTop = messages.scrollTop;
    const scrollHeight = messages.scrollHeight;
    const newMessageHeight = newMessage.clientHeight || 0;
    var prevNewMessageHeight = 0;
    if (prevNewMessage) {
        prevNewMessageHeight = prevNewMessage.clientHeight;
    }

    // Logic
    if (clientHeight + scrollTop + newMessageHeight + prevNewMessageHeight >= scrollHeight) {
        messages.scrollTop = scrollHeight;
    }
};