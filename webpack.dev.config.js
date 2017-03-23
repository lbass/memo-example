var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        './src/index.js',
        'webpack-dev-server/client?http://0.0.0.0:4000',
        'webpack/hot/only-dev-server',
        './src/style.css'
    ],

    output: {
        path: '/',
        filename: 'bundle.js'
    },

    devServer: {
        hot: true,
        filename: 'bundle.js',
        publicPath: '/',
        historyApiFallback: true,
        contentBase: './public',
        proxy: {
            "**": "http://localhost:3000"
        },
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    module: {

        loaders: [
            {
                loader: 'react-hot-loader',
                exclude: /node_modules/
            },
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
    },

    resolve: {
        //2.x   버전으로 변경 되면서 기존의 resolve : root 설정이 변경되었다.
        modules: [path.resolve(__dirname, "./src"), "node_modules"]
    }
};
