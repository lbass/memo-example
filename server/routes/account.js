import express from 'express';
import Account from '../models/Account';
import EsClient from '../elasticsearch/EsClient';

import ErrorMessageHandler from '../modules/ErrorMessageHandler.js';

const router = express.Router();

router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    if(!usernameRegex.test(req.body.username)) {
        return ErrorMessageHandler.handleError({ message: 'account.001' }, res);
    }

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return ErrorMessageHandler.handleError({ message: 'account.002' }, res);
    }

    // CHECK USER EXISTANCE
    Account.signup({ username: req.body.username, password: req.body.password },
        (error) => {
            return ErrorMessageHandler.handleError(error, res, { success: true });
        }
    );

});

router.post('/signin', (req, res) => {
    if(typeof req.body.password !== "string") {
        return ErrorMessageHandler.handleError({ message: 'account.005' }, res);
    }

    Account.signin({ username: req.body.username, password: req.body.password },
        (error, account) => {
            if(account) {
                let session = req.session;
                session.loginInfo = {
                    _id: account._id,
                    username: account.username
                };
                return ErrorMessageHandler.handleError(undefined, res);
            } else {
                return ErrorMessageHandler.handleError(error, res);
            }
        }
    );

});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return ErrorMessageHandler.handleError({ message: 'account.006' }, res);
    }
    return ErrorMessageHandler.handleError(undefined, res, { info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
    req.session.destroy(
        (error) => {
            return ErrorMessageHandler.handleError(error, res, { sucess: true });
        }
    );
});

export default router;
