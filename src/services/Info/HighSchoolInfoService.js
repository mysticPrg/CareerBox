/**
 * Created by careerBox on 2014-12-16.
 */


var HighSchoolInfoDB = require('../../db/Info/HighSchoolInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/highSchool', saveService);
    server.get('/info/highSchool', readListService);
    server.get('/info/highSchool/check/:_id', checkService);
};

function checkArgForHighSchoolInfo(req, res) {
    if (!req.body.highSchoolInfo) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnParams(req, res) {
    if (!req.params._id) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function saveService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForHighSchoolInfo(req, res)) {
        return;
    }

    var data = req.body.highSchoolInfo;
    data._member_id = req.session._id;

    HighSchoolInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });

}

function readListService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    HighSchoolInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}

function checkService(req, res) {
    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    var _member_id = req.session._id;
    var _item_id = req.params._id;
    HighSchoolInfoDB.useCheck(_member_id, _item_id, function (err, checkResult) {
        ServiceUtil.sendResult(err, res, checkResult);
    });
}