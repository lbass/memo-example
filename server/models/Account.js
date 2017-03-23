import bcrypt from 'bcryptjs';
import EsClient from '../elasticsearch/EsClient';

const INDEX = 'memo';
const TYPE_ACCOUNT = 'account';
/*
{
    username: String,
    password: String,
    created: { type: Date, default: Date.now }
    타입 맵핑하고 적의 하는 기능이 필요함
}
*/

class Account {
    static signup(param, func) {
        new Promise(function (resolve, reject) {
            EsClient.findOne(INDEX, TYPE_ACCOUNT, {username: param.username}, (error, result) => {
                if(error) {
                    return reject(error);
                }
                if(result) {
                    return reject(new Error("username exists"));
                }
                resolve();
            });
        }).then(function (result) {
            return new Promise(function (resolve, reject) {
                EsClient.getLastCount(INDEX, TYPE_ACCOUNT, (error, id) => {
                    if(error) {
                        return reject(error);
                    }
                    resolve(id);
                });
            });
        }).then(function (id) {
            const newId = id + 1;
            const password = bcrypt.hashSync(param.password, 8);
            const d = new Date();
            const signData = {
                username: param.username,
                password: password,
                created: d.toDateString()
            };
            return new Promise(function (resolve, reject) {
                EsClient.save(INDEX, TYPE_ACCOUNT, signData, (error) => {
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

    static signin(param, func) {
        new Promise(function (resolve, reject) {
            EsClient.findOne(INDEX, TYPE_ACCOUNT, {username: param.username}, (error, account) => {
                if(error) {
                    return reject(error);
                }
                if(!account) {
                    return reject(new Error("username is not exists"));
                }
                if(!bcrypt.compareSync(param.password, account.password)) {
                    return reject(new Error("password error"));
                }
                resolve(account);
            });
        }).then(function(account) {
            func.call(this, undefined, {
                _id: account._id,
                username: account.username
            });
        }).catch(function (error) {
            func.call(this, error.message);
        });
    }

    static validateHash (password) {
        return ;
    }
}

export default Account;
