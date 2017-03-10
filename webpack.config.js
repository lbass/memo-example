var webpack = require('webpack');

module.exports = {
    entry: [
        './src/index.js'
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
            }
        ]
    },

}
