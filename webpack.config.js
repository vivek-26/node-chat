const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
    filename: 'main.css'
});

const path = require('path');

// Webpack Config
module.exports = {
    entry: {
        'join-page': './src/js/index.js',
        'chat': './src/js/main.js'
    },
    output: {
        // Output path is absolute.
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
        // Public Path in Output tells webpack about the path seen from HTML file (Relative path)
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            /**
             * use allows us to add multiple loaders.
             * Loaders are applied on per file basis.
             * Loaders are applied in reverse order.
             */
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }]
        }, {
            test: /\.css$/,
            use: extractPlugin.extract({
                use: ['css-loader']
            })
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(jpg|png)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    // file-loader uses hash for newly created files.
                    // name property overrides it.
                    name: '[name].[ext]',
                    outputPath: 'img/'
                    // publicPath: 'img/'
                }
            }]
        }]
    },
    plugins: [
        /**
         * Plugins are applied to bundle(s).
         * 
         * HTML Webpack Plugin creates a new index.html file with dummy text by default.
         * To override this, specify HTML template file it should use.
         */
        new CleanWebpackPlugin(['public']),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['join-page']
        }),
        new HtmlWebpackPlugin({
            filename: 'chat.html',
            template: 'src/chat.html',
            chunks: ['chat']
        }),
        extractPlugin
    ]
};