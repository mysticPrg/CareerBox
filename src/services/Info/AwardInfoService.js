/**
 * Created by careerBox on 2014-12-16.
 */


var AwardInfoDB = require('../../db/Info/AwardInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/award', saveService);
    server.get('/info/award', readService);
};

function checkArgForAwardInfo(req, res) {
    if (!req.body.awardInfo) {

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
    if (!checkArgForAwardInfo(req, res)) {
        return;
    }

    var data = req.body.awardInfo;
    data._member_id = req.session._id;

    AwardInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    AwardInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}