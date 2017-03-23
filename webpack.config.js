var webpack = require('webpack');
var path = require('path');
path.resolve.root = [ './src' ];

module.exports = {
    entry: [
        './src/index.js',
        './src/style.css'
    ],

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
