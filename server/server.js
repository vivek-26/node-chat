// Dependencies
const express = require('express');
const debug = require('debug')('node-chat');
const path = require('path');

// Public path - static files
const publicPath = path.join(__dirname, '../public');
debug(`Static Folder Path - ${publicPath}`);

// Port
const PORT = process.env.PORT || 3000;
debug(`PORT - ${PORT}`)

// Create express application
const app = express();

// Serve static files
app.use(express.static(publicPath));

// Listen on configured port
app.listen(PORT, () => {
    console.log(`Node Chat Application started on PORT - ${PORT}`);
    debug(`Node Chat Application started on PORT - ${PORT}`);
});