'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 3000;
var devPort = 4000;

var documents = require('../routes/documents');
var elastic = require('../elasticsearch/elasticsearch');

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());

app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));

//elastic router
app.use('/documents', documents);

elastic.indexExists().then(function (exists) {
    if (exists) {
        return elastic.deleteIndex();
    }
}).then(function () {
    return elastic.initIndex().then(elastic.initMapping).then(function () {
        var promises = ['Thing Explainer', 'The Internet Is a Playground', 'The Pragmatic Programmer', 'The Hitchhikers Guide to the Galaxy', 'Trial of the Clone'].map(function (bookTitle) {
            return elastic.addDocument({
                title: bookTitle,
                content: bookTitle + " content",
                metadata: {
                    titleLength: bookTitle.length
                }
            });
        });
        return Promise.all(promises);
    });
});

app.listen(port, function () {
    console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    var config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(config);
    var devServer = new _webpackDevServer2.default(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('webpack-dev-server is listening on port', devPort);
    });
}