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
        error => {
            if (error) {
                return res.status(500).json({ error: error, code: 3 });
            }
            return res.status(200).json({ success: true });
        }
    );


});


router.post('/signin', (req, res) => {
    /* to be implemented */
    res.json({ success: true });
});

router.get('/getinfo', (req, res) => {
    res.json({ info: null });
});

router.post('/logout', (req, res) => {
    return res.json({ success: true });
});

export default router;
