/**
 * Created by mysticPrg on 2014-10-09.
 */

var MemberDB = require('../db/MemberDB');
var ServiceUtil = require('../util/ServiceUtil');

var Result = require('./result');

module.exports.set = function (server) {
    server.post('/member/join', joinService);
    server.post('/member/login', loginService);
    server.get('/member/logout', logoutService);
};

function checkArgForMemberOnBody(req, res) {
    if (!req.body.member) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function joinService(req, res) {
    var session = req.session;
    var member = req.body.member;

    session._id = '';
    session.email = '';

    ServiceUtil.setResHeader(res);
    if (!checkArgForMemberOnBody(req, res)) {
        return;
    }

    MemberDB.isExistEmail(member.email, member.isFacebook, function (err, findMember) {
        if (findMember) {
            ServiceUtil.sendResult(err, res, null, '102');
            return;
        }

        MemberDB.create(member, function (err, created) {
            session._id = created._id;
            session.email = created.email;

            ServiceUtil.sendResult(err, res, null);
        });
    });
}

function loginService(req, res) {
    var session = req.session;
    var member = req.body.member;

    session._id = '';
    session.email = '';

    ServiceUtil.setResHeader(res);
    if (!checkArgForMemberOnBody(req, res)) {
        return;
    }

    MemberDB.isExistEmail(member.email, member.isFacebook, function (err, findMember) {
        if (findMember) {
            session._id = findMember._id.toHexString();
            session.email = findMember.email;

            ServiceUtil.sendResult(err, res, null);
        } else if (member.isFacebook) {
            MemberDB.create(member, function (err, created) {
                session._id = created[0]._id.toHexString();
                session.email = created[0].email;

                ServiceUtil.sendResult(err, res, null);
            });
        } else {
            ServiceUtil.sendResult(err, res, null, '101');
        }

    });
}

function logoutService(req, res) {
    var session = req.session;

    ServiceUtil.setResHeader(res);
    if (session._id) {
        delete session._id;
    }
    if (session.email) {
        delete session.email;
    }

    ServiceUtil.sendResult(null, res, null);
}