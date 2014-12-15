/**
 * Created by careerBox on 2014-12-15.
 */

var PersonalInfoDB = require('../../db/Info/PersonalInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/personal', saveService);
    server.get('/info/personal', readService);
};

function checkArgForPersonalInfo(req, res) {
    if (!req.body.personalInfo) {

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
    if (!checkArgForPersonalInfo(req, res)) {
        return;
    }

    var data = req.body.personalInfo;
    data._member_id = req.session._id;

    PersonalInfoDB.save(data, function (err) {
        ServiceUtil.sendResult(err, res, null);
    });

}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    PersonalInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}