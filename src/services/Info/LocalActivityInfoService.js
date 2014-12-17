/**
 * Created by careerBox on 2014-12-16.
 */


var LocalActivityInfoDB = require('../../db/Info/LocalActivityInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/localActivity', saveService);
    server.get('/info/localActivity', readService);
};

function checkArgForLocalActivityInfo(req, res) {
    if (!req.body.localActivityInfo) {

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
    if (!checkArgForLocalActivityInfo(req, res)) {
        return;
    }

    var data = req.body.localActivityInfo;
    data._member_id = req.session._id;

    LocalActivityInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    LocalActivityInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}