import express from 'express';
import Memo from '../models/Memo';

import ErrorMessageHandler from '../modules/ErrorMessageHandler.js';

const router = express.Router();

// WRITE MEMO
router.put('/', (req, res) => {
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
router.post('/:id', (req, res) => {
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

router.get('/:listType/:seq', (req, res) => {
    let listType = req.params.listType;
    let seq = req.params.seq;
    // CHECK LIST TYPE VALIDITY
    if(listType !== 'old' && listType !== 'new') {
        return res.status(400).json({
            error: "INVALID LISTTYPE",
            code: 1
        });
    }

    if(listType === 'new') {
        Memo.getGreaterThan( seq,
            (error, memos) => {
                return ErrorMessageHandler.handleError(error, res, memos);
            }
        );
    } else {
        Memo.getLessThan( seq,
            (error, memos) => {
                return ErrorMessageHandler.handleError(error, res, memos);
            }
        );
    }


    /*
    let objId = new mongoose.Types.ObjectId(req.params.id);

    if(listType === 'new') {
        // GET NEWER MEMO
        Memo.find({ _id: { $gt: objId }})
        .sort({_id: -1})
        .limit(6)
        .exec((err, memos) => {
            if(err) throw err;
            return res.json(memos);
        });
    } else {
        // GET OLDER MEMO
        Memo.find({ _id: { $lt: objId }})
        .sort({_id: -1})
        .limit(6)
        .exec((err, memos) => {
            if(err) throw err;
            return res.json(memos);
        });
    }
    */
});

export default router;
