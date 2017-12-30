// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

// Register debug task
gulp.task('debug', () => {
    nodemon({
        'script': 'server/server.js',
        'ext': 'js html css',
        'env': {
            'DEBUG': 'node-chat'
        }
    });
});