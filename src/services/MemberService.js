/**
 * Created by mysticPrg on 2014-10-09.
 */

var requirejs = require('../require.config');

var Member = requirejs('classes/Member');

var async = require('async');

var Result = require('./result');
var memberDao = require('./../dao/memberDao');
var _server = null;

module.exports.set = function (server) {
    server.post('/member/join', joinService);
    server.post('/member/login', loginService);
    server.get('/member/logout', logoutService);

    _server = server;
};

function join(newMember, callback) {

    var isExist = false;

    try {
        async.waterfall([
            function (cb) { // Open Collection
                _server.dbhelper.connectAndOpen('member', cb);
            },
            function (collection, cb) { // Exist Check
                collection.findOne({email: newMember.email}, function (err, existObj) {
                    cb(err, existObj, collection);
                });
            },
            function (existObj, collection, cb) { // Insert
                if (existObj) {
                    isExist = true;
                    cb(null);
                } else {
                    isExist = false;
                    collection.insert(newMember, cb);
                }
            }
        ], function (err) {
            callback(err, isExist);
        });
    } catch (err) {
        console.log(err.message);
    }
}

function findMember(member, callback) {

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('member', callback);
            },
            function (collection, callback) { // find email

                if (member.isFacebook) {
                    collection.findOne({
                        email: member.email,
                        isFacebook: true
                    }, callback);
                } else {
                    collection.findOne({
                        email: member.email,
                        password: member.password
                    }, callback);
                }
            }
        ], function (err, existMember) {
            _server.dbhelper.close();
            callback(err, existMember);
        });
    } catch (err) {
        console.log(err.message);
    }
}

function login(member, session, callback) {

    try {
        async.waterfall([
            function (cb) {
                findMember(member, cb);
            },
            function (existMember) { // Exist Check

                if (existMember) {
                    session.email = existMember.email;
                    session._id = existMember._id;
                    callback(true);
                } else {
                    if (member.isFacebook) {
                        join(member, function () {
                            login(member, session, callback);
                        });
                    } else {
                        // login failed
                        callback(false);
                    }
                }

            }
        ]);
    } catch (err) {
        console.log(err.message);
    }
}

function joinService(req, res) {

    var result = new Result(null);
    var newMember = req.body.member;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!newMember.email) {
        res.end(new Result(null).setCode('001').toString());
        return;
    }

    newMember = new Member(newMember);

    join(newMember, function (err, isExist) {
        if (err) {
            console.log(err.message);
            return;
        }

        if (isExist) {
            result.setCode('102');
        }

        res.end(result.toString());
    });
}

function loginService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var member = req.body.member;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!member.email) {
        res.end(new Result(null).setCode('001').toString());
        return;
    }

    member = new Member(member);

    login(member, session, function(loginIsSuccessed) {
        if ( loginIsSuccessed ) {
            result.setCode('000');
        } else {
            result.setCode('101');
        }
        res.end(result.toString());
    });


}

function logoutService(req, res) {
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
