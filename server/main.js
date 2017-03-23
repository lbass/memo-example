import express from 'express';
import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';

import EsClient from './elasticsearch/EsClient';

//index.js 설정으로 전체를 불러올 수 있다.
import api from './routes';


const app = express();
app.use(session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true
}));

const port = 3000;
const devPort = 4000;

EsClient.esAliveCheck();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));
//router 설정
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});


/*
elastic.indexExists().then(
    function (exists) {
        if(exists) {
            return elastic.deleteIndex();
        }
    }
).then(
    function () {
        return elastic.initIndex().then(elastic.initMapping).then(
            function () {
                var promises = [
                    'Thing Explainer',
                    'The Internet Is a Playground',
                    'The Pragmatic Programmer',
                    'The Hitchhikers Guide to the Galaxy',
                    'Trial of the Clone'
                ].map(function (bookTitle) {
                    return elastic.addDocument({
                        title: bookTitle,
                        content: bookTitle + " content",
                        metadata: {
                            titleLength: bookTitle.length
                        }
                    });
                });
                return Promise.all(promises);
            }
        );
    }
);
*/

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
