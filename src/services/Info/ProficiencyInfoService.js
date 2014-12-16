/**
 * Created by careerBox on 2014-12-16.
 */


var ProficiencyInfoDB = require('../../db/Info/ProficiencyInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/working', saveService);
    server.get('/info/working', readService);
};

function checkArgForProficiencyInfoInfo(req, res) {
    if (!req.body.proficiencyInfo) {

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
    if (!checkArgForProficiencyInfoInfo(req, res)) {
        return;
    }

    var data = req.body.proficiencyInfo;
    data._member_id = req.session._id;

    ProficiencyInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    ProficiencyInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}