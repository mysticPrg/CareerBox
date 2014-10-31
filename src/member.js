/**
 * Created by mysticPrg on 2014-10-09.
 */

var async = require('async');

var Result = require('./result');
var memberDao = require('./dao/memberDao');
var _server = null;

module.exports.set = function (server) {
    server.post('/member/join', join);
    server.post('/member/login', login);
    server.get('/member/logout', logout);

    server.get('/member/list', list);
    server.get('/member/reset', reset);
    _server = server;
};

function join(req, res) {
    var newMember = new memberDao({
        email: req.body.email,
        password: req.body.password
    });

    if (!newMember.email || !newMember.password) {
        res.writeHead(200, {
           'Content-Type': 'application/json'
        });
        res.end(new Result(null).setCode('001').toString());
        return;
    }

    try {
        //noinspection JSUnusedGlobalSymbols
        async.waterfall([
            function openDB(callback) {
                _server.dbhelper.connect(callback);
            },
            function openCollection(db, callback) {
                db.collection('member', function (err, collection) {
                    callback(err, collection, newMember.email);
                });
            },
            isExist,
            function insert(collection, exist, callback) {
                var result = new Result(null);

                if (exist) {
                    result.setCode('102');
                    callback(null, result);
                } else {
                    collection.insert(newMember, null, function (err) {
                        callback(err, result);
                    });
                }
            }
        ], function sendResult(err, result) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }

}

function isExist(collection, email, callback) {

    var cursor = collection.find({email: email});
    var exist = true;

    cursor.count(false, function (err, count) {
        exist = count !== 0;

        callback(null, collection, exist);
    });
}

function login(req, res) {
    var session = req.session;

    try {
        async.waterfall([
            function openDB(callback) {
                _server.dbhelper.connect(callback);
            },
            function openCollection(db, callback) {
                db.collection('member', function (err, collection) {
                    callback(err, collection);
                });
            },
            function findOne(collection, callback) {
                collection.findOne({
                    email: req.body.email,
                    password: req.body.password
                }, callback);
            },
            function doLogin(member, callback) {
                var result = new Result(null);

                if (member) {
                    session.email = member.email;
                    session._id = member._id;
                    result.setCode('000');
                } else {
                    if (session.email) {
                        delete session.email;
                    }
                    if (session._id) {
                        delete session._id;
                    }

                    result.setCode('101');
                }

                callback(null, result);
            }
        ], function sendResult(err, result) {
            if (err) {
                console.log(err.message);
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function logout(req, res) {
    var session = req.session;

    if (session.email) {
        delete session.email;
    }
    if (session._id) {
        delete session._id;
    }

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    var result = new Result(null);
    res.end(result.toString());
}

function list(req, res) {
    try {
        async.waterfall([
            function openDB(callback) {
                _server.dbhelper.connect(callback);
            },
            function openCollection(db, callback) {
                db.collection('member', callback);
            },
            function find(collection, callback) {
                collection.find().toArray(callback);
            },
            function showResult(data, callback) {

                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var result = new Result(data);
                res.end(result.toString());

                callback(null, null);
            }
        ], function result(err) {
            if (err) {
                console.log(err.message);
            }

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function reset(req, res) {
    try {
        async.waterfall([
            function openDB(callback) {
                _server.dbhelper.connect(callback);
            },
            function openCollection(db, callback) {
                db.collection('member', callback);
            },
            function reset(collection, callback) {
                collection.remove(null, {safe: true}, callback);
            }
        ], function result(err) {
            if (err) {
                console.log(err.message);
            }

            res.end();
        });
    } catch (err) {
        console.log(err.message);
    }
}