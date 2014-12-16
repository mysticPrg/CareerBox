/**
 * Created by careerBox on 2014-12-16.
 */


var ScholarshipInfoDB = require('../../db/Info/ScholarshipInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/scholarship', saveService);
    server.get('/info/scholarship', readService);
};

function checkArgForScholarshipInfo(req, res) {
    if (!req.body.scholarshipInfo) {

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
    if (!checkArgForScholarshipInfo(req, res)) {
        return;
    }

    var data = req.body.scholarshipInfo;
    data._member_id = req.session._id;

    ScholarshipInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    ScholarshipInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}