/**
 * Created by careerBox on 2014-12-16.
 */


var UnivSchoolInfoDB = require('../../db/Info/UnivSchoolInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/univSchool', saveService);
    server.get('/info/univSchool', readListService);
};

function checkArgForUnivSchoolInfo(req, res) {
    if (!req.body.univSchoolInfo) {

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
    if (!checkArgForUnivSchoolInfo(req, res)) {
        return;
    }

    var data = req.body.univSchoolInfo;
    data._member_id = req.session._id;

    UnivSchoolInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readListService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    UnivSchoolInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}