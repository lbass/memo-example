import express from 'express';
import Memo from '../models/Memo';

import ErrorMessageHandler from '../modules/ErrorMessageHandler.js';

const router = express.Router();

// WRITE MEMO
router.post('/', (req, res) => {
    if(typeof req.session.loginInfo === 'undefined') {
        return ErrorMessageHandler.handleError({ message: 'memo.001' }, res);
    }

    if(!(typeof req.body.contents === 'string' && req.body.contents !== "")) {
        return ErrorMessageHandler.handleError({ message: 'memo.002' }, res);
    }

    let memo = {
        writer: req.session.loginInfo.username,
        contents: req.body.contents
    };

    Memo.save(memo,
        (error) => {
            return ErrorMessageHandler.handleError(error, res, { success: true });
        }
    );

});

// MODIFY MEMO
router.put('/:id', (req, res) => {
    if(typeof req.session.loginInfo === 'undefined') {
        return ErrorMessageHandler.handleError({ message: 'memo.001' }, res);
    }

    if(!(typeof req.body.contents === 'string' && req.body.contents !== "")) {
        return ErrorMessageHandler.handleError({ message: 'memo.002' }, res);
    }

    let param = {
            contents: req.body.contents,
            writer: req.session.loginInfo.username,
            id: req.params.id
    };

    Memo.update(param,
        (error) => {
            return ErrorMessageHandler.handleError(error, res, { success: true });
        }
    );
});

// DELETE MEMO
router.delete('/:id', (req, res) => {
    if(typeof req.session.loginInfo === 'undefined') {
        return ErrorMessageHandler.handleError({ message: '401' }, res);
    }

    let param = {
            writer: req.session.loginInfo.username,
            id: req.params.id
    };

    Memo.delete(param,
        (error) => {
            return ErrorMessageHandler.handleError(error, res, { success: true });
        }
    );
});

router.delete('/', (req, res) => {
    console.info('DELETE ALL');
    Memo.deleteAll({},
        (error) => {
            return ErrorMessageHandler.handleError(error, res, { success: true });
        }
    );
});

// GET MEMO LIST
router.get('/', (req, res) => {
    Memo.get(
        (error, memos) => {
            return ErrorMessageHandler.handleError(error, res, memos);
        }
    );
});

export default router;
