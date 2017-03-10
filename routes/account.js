import express from 'express';
import Account from '../models/Account';
import EsClient from '../elasticsearch/EsClient';

const router = express.Router();

router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE

    Account.signup({ username: req.body.username, password: req.body.password },
        (error) => {
            if (error) {
                throw error;
                //return res.status(500).json({ error: error, code: 3 });
            }
            return res.status(200).json({ success: true });
        }
    );

});


router.post('/signin', (req, res) => {
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    Account.signin({ username: req.body.username, password: req.body.password },
        (error, account) => {
            if (error) {
                throw error;
                //return res.status(500).json({ error: error, code: 3 });
            }
            let session = req.session;
            session.loginInfo = {
                _id: account._id,
                username: account.username
            };
            return res.status(200).json({ success: true });
        }
    );

});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }
    return res.status(200).json({ info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(error) throw error; });
    return res.status(200).json({ sucess: true });
});

export default router;
