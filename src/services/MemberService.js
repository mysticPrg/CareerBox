/**
 * Created by mysticPrg on 2014-10-09.
 */

var MemberDB = require('../db/MemberDB');

var Result = require('./result');

module.exports.set = function (server) {
    server.post('/member/join', joinService);
    server.post('/member/login', loginService);
    server.get('/member/logout', logoutService);
};


function checkErr(err) {
    if (err) {
        console.log(err.message);
        return false;
    }

    return true;
}

function setResHeader(res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
}

function checkSession(req, res) {
    if (!req.session._id) {

        var result = new Result(null);
        result.setCode('002');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForMember(req, res) {
    if (!req.body.member) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function sendResult(err, res, data, returnCode) {
    if (!checkErr(err)) {
        return;
    }

    var result = new Result(data);
    if (returnCode) {
        result.setCode(returnCode);
    }
    res.end(result.toString());
}


function joinService(req, res) {
    var session = req.session;
    var member = req.body.member;

    session._id = '';
    session.email = '';

    setResHeader(res);
    if (!checkArgForMember(req, res)) {
        return;
    }

    MemberDB.isExistEmail(member.email, member.isFacebook, function (err, findMember) {
        if (findMember) {
            sendResult(err, res, null, '102');
            return;
        }

        MemberDB.create(member, function (err, created) {
            session._id = created._id;
            session.email = created.email;

            sendResult(err, res, null);
        });
    });
}

function loginService(req, res) {
    var session = req.session;
    var member = req.body.member;

    session._id = '';
    session.email = '';

    setResHeader(res);
    if (!checkArgForMember(req, res)) {
        return;
    }

    MemberDB.isExistEmail(member.email, member.isFacebook, function (err, findMember) {
        if (findMember) {
            session._id = findMember._id.toHexString();
            session.email = findMember.email;

            sendResult(err, res, null);
        } else if (member.isFacebook) {
            MemberDB.create(member, function (err, created) {
                session._id = created[0]._id.toHexString();
                session.email = created[0].email;

                sendResult(err, res, null);
            });
        } else {
            sendResult(err, res, null, '101');
        }

    });
}

function logoutService(req, res) {
    var session = req.session;

    setResHeader(res);
    if (session._id) {
        delete session._id;
    }
    if (session.email) {
        delete session.email;
    }

    sendResult(null, res, null);
}