import EsClient from '../elasticsearch/EsClient';
import moment from 'moment';

const TYPE_MEMO = 'memo';
const INDEX = 'memo';

/*
{
    writer: String,
    contents: String,
    starred: [String],
    date: {
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
    },
    is_edited: { type: Boolean, default: false }
    타입 맵핑하고 적의 하는 기능이 필요함
}
*/

class Memo {
    static save(param, func) {
        new Promise(function (resolve, reject) {
            EsClient.getLastCount(INDEX, TYPE_MEMO, (error, id) => {
                if(error) {
                    return reject(error);
                }
                resolve(id);
            });
        }).then(function(id) {
            const newId = id + 1;
            return new Promise(function (resolve, reject) {
                let memo = {
                    writer: param.writer,
                    contents: param.contents,
                    is_edited: false,
                    starred: [],
                    date: {
                        created: new Date(),
                        edited : ''
                    }
                };
                EsClient.save(INDEX, TYPE_MEMO, newId, memo, (error) => {
                    if(error) {
                        return reject(error);
                    }
                    resolve();
                });
            });
        }).then(function() {
            func.call(this, undefined);
        }).catch(function (error) {
            func.call(this, error.message);
        });
    }

    static get(func) {
        new Promise(function (resolve, reject) {
            let query = {
                size: 10,
                query: {
                    match_all: {}
                },
                "sort": [{"date.created": {"order": "desc"}}]
            };

            EsClient.getList(INDEX, TYPE_MEMO, query, (error, list) => {
                if(error) {
                    return reject(error);
                }
                resolve(list);
            });
        }).then(function(memos) {
            func.call(this, undefined, memos);
        }).catch(function (error) {
            func.call(this, error.message);
        });
    }

    static getLessThan(id, func) {
        new Promise(function (resolve, reject) {
            let query = {
                size: 10,
                query: {
                    range : {
                        _uid: {
                            lt : TYPE_MEMO + "#" + id
                        }
                    }
                },
                "sort": [{"date.created": {"order": "desc"}}]
            };

            EsClient.getList(INDEX, TYPE_MEMO, query, (error, list) => {
                if(error) {
                    return reject(error);
                }
                resolve(list);
            });
        }).then(function(memos) {
            func.call(this, undefined, memos);
        }).catch(function (error) {
            func.call(this, error.message);
        });
    }

    static getGreaterThan(id, func) {
        new Promise(function (resolve, reject) {
            let query = {
                size: 10,
                query: {
                    range : {
                        _uid: {
                            gt : TYPE_MEMO + "#" + id
                        }
                    }
                },
                "sort": [{"date.created": {"order": "desc"}}]
            };

            EsClient.getList(INDEX, TYPE_MEMO, query, (error, list) => {
                if(error) {
                    return reject(error);
                }
                resolve(list);
            });
        }).then(function(memos) {
            func.call(this, undefined, memos);
        }).catch(function (error) {
            func.call(this, error.message);
        });
    }

    static delete(param, func) {
        new Promise(function (resolve, reject) {
            EsClient.get(INDEX, TYPE_MEMO, param.id, (error, memo) => {
                if(error) return reject(error);

                if(!memo) {
                    return reject(new Error('memo.003'));
                }

                if(memo.writer != param.writer) {
                    return reject(new Error('memo.004'));
                }

                resolve();
            });
        }).then(function() {
            return new Promise(function (resolve, reject) {
                EsClient.delete(INDEX, TYPE_MEMO, param.id, (error) => {
                    if(error) return reject(error);
                    resolve();
                });
            });
        }).then(function() {
            func.call(this, undefined);
        }).catch(function (error) {
            func.call(this, error);
        });
    }

    static deleteAll(param, func) {
        new Promise(function (resolve, reject) {
            EsClient.getList(INDEX, TYPE_MEMO, (error, list) => {
                if(error) {
                    return reject(error);
                }
                resolve(list);
            });
        }).then(function(list) {
            return new Promise(function (resolve, reject) {
                let bulkList = [];
                list.forEach(
                    (value) => {
                        bulkList.push({
                            delete: { _index: INDEX, _type: TYPE_MEMO, _id: value.id}
                        });
                    }
                );
                EsClient.bulk(bulkList, (error) => {
                    if(error) return reject(error);
                    resolve();
                });
            });
        }).then(function() {
            func.call(this, undefined);
        }).catch(function (error) {
            func.call(this, error);
        });
    }

    static update(param, func) {
        new Promise(function (resolve, reject) {
            EsClient.get(INDEX, TYPE_MEMO, param.id, (error, memo) => {
                if(error) return reject(error);

                if(!memo) {
                    return reject(new Error('memo.003'));
                }

                if(memo.writer != param.writer) {
                    return reject(new Error('memo.004'));
                }
                resolve();
            });
        }).then(function() {
            let memo = {
                contents: param.contents,
                is_edited: true,
                date: {
                    edited: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            };

            return new Promise(function (resolve, reject) {
                EsClient.update(INDEX, TYPE_MEMO, param.id, memo, (error) => {
                    if(error) return reject(error);
                    resolve();
                });
            });
        }).then(function() {
            func.call(this, undefined);
        }).catch(function (error) {
            func.call(this, error);
        });
    }
}

export default Memo;
